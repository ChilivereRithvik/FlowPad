import { useEffect, useRef, useState } from "react";
import rough from "roughjs/bin/rough";
import { useViewport, useReactFlow } from "@xyflow/react";
import type { Shape, ToolMode } from "@/types/flow";

interface Props {
  mode: ToolMode;
  onFinish: () => void;
  shapes: Shape[];
  onAddShape: (shape: Shape) => void;
  selectedShapeId: string | null;
  onSelectShape: (id: string | null) => void;
  onUpdateShape: (id: string, updates: Partial<Shape>) => void;
  onDoubleClickShape: (id: string) => void;
}

const getSeed = (id: string | number) => {
  if (typeof id === "number") return id % 10000;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const isPointOnLine = (
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  threshold: number
) => {
  const lenSq = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (lenSq === 0)
    return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2) < threshold;
  let t = Math.max(
    0,
    Math.min(1, ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lenSq)
  );
  return (
    Math.sqrt(
      (px - (x1 + t * (x2 - x1))) ** 2 + (py - (y1 + t * (y2 - y1))) ** 2
    ) < threshold
  );
};

const isPointInHandle = (
  x: number,
  y: number,
  s: Shape,
  zoom: number
): string | null => {
  const size = 12 / zoom;
  const hSize = size / 2;
  const handles = [
    { type: "nw", x: s.x, y: s.y },
    { type: "n", x: s.x + s.width / 2, y: s.y },
    { type: "ne", x: s.x + s.width, y: s.y },
    { type: "w", x: s.x, y: s.y + s.height / 2 },
    { type: "e", x: s.x + s.width, y: s.y + s.height / 2 },
    { type: "sw", x: s.x, y: s.y + s.height },
    { type: "s", x: s.x + s.width / 2, y: s.y + s.height },
    { type: "se", x: s.x + s.width, y: s.y + s.height },
    { type: "move", x: s.x + 15, y: s.y + 15 }, // Move icon inside top-left
  ];

  for (const h of handles) {
    if (
      x >= h.x - hSize &&
      x <= h.x + hSize &&
      y >= h.y - hSize &&
      y <= h.y + hSize
    )
      return h.type;
  }
  return null;
};

const isPointInShape = (
  x: number,
  y: number,
  s: Shape,
  zoom: number
): boolean => {
  const threshold = 12 / zoom;
  if (s.type === "rectangle") {
    return (
      isPointOnLine(x, y, s.x, s.y, s.x + s.width, s.y, threshold) ||
      isPointOnLine(
        x,
        y,
        s.x + s.width,
        s.y,
        s.x + s.width,
        s.y + s.height,
        threshold
      ) ||
      isPointOnLine(
        x,
        y,
        s.x + s.width,
        s.y + s.height,
        s.x,
        s.y + s.height,
        threshold
      ) ||
      isPointOnLine(x, y, s.x, s.y + s.height, s.x, s.y, threshold)
    );
  }
  if (s.type === "circle") {
    const cx = s.x + s.width / 2,
      cy = s.y + s.height / 2,
      r = Math.min(s.width, s.height) / 2;
    const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    return Math.abs(d - r) <= threshold;
  }
  if (s.type === "triangle") {
    const p1 = { x: s.x + s.width / 2, y: s.y };
    const p2 = { x: s.x, y: s.y + s.height };
    const p3 = { x: s.x + s.width, y: s.y + s.height };
    return (
      isPointOnLine(x, y, p1.x, p1.y, p2.x, p2.y, threshold) ||
      isPointOnLine(x, y, p2.x, p2.y, p3.x, p3.y, threshold) ||
      isPointOnLine(x, y, p3.x, p3.y, p1.x, p1.y, threshold)
    );
  }
  if (s.type === "line" || s.type === "arrow") {
    const x1 = s.x,
      y1 = s.y,
      x2 = s.x + s.width,
      y2 = s.y + s.height;
    return isPointOnLine(x, y, x1, y1, x2, y2, threshold);
  }
  if (s.type === "pencil" && s.points)
    return s.points.some(
      (p) => Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2) < threshold * 2
    );
  return false;
};

export default function RoughCanvasLayer({
  mode,
  shapes,
  onAddShape,
  selectedShapeId,
  onSelectShape,
  onUpdateShape,
  onDoubleClickShape,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const currentPoints = useRef<{ x: number; y: number }[]>([]);
  const dragOffset = useRef<{ x: number; y: number } | null>(null);
  const resizeType = useRef<string | null>(null);
  const isDragging = useRef<boolean>(false);
  const isResizing = useRef<boolean>(false);

  const { x: vX, y: vY, zoom } = useViewport();
  const { screenToFlowPosition } = useReactFlow();
  const [currentPreview, setCurrentPreview] = useState<any>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(zoom * dpr, 0, 0, zoom * dpr, vX * dpr, vY * dpr);

    const rc = rough.canvas(canvas);
    const getOptions = (selected: boolean, s?: Shape, seed = 1) => {
      const isPencil = s?.type === "pencil";
      const isDark = document.documentElement.classList.contains("dark");

      let stroke = s?.stroke;
      // Handle color swapping for default black/white
      if (isDark) {
        if (
          !stroke ||
          stroke === "#000000" ||
          stroke === "#1e293b" ||
          stroke === "#334155"
        ) {
          stroke = "#ffffff";
        } else if (stroke === "#ffffff") {
          stroke = "#000000";
        }
      } else {
        if (!stroke) {
          stroke = isPencil ? "#334155" : "#1e293b";
        }
      }

      return {
        stroke: selected ? "#6366f1" : stroke,
        strokeWidth:
          (selected ? 3.5 : s?.strokeWidth || (isPencil ? 2.2 : 2)) / zoom,
        roughness: s?.roughness ?? (isPencil ? 0.4 : 1.2),
        seed,
      };
    };

    shapes.forEach((s) => {
      const selected = s.id === selectedShapeId;
      const opts = getOptions(selected, s, getSeed(s.id));
      try {
        if (s.type === "rectangle")
          rc.rectangle(s.x, s.y, s.width, s.height, opts);
        else if (s.type === "triangle")
          rc.polygon(
            [
              [s.x + s.width / 2, s.y],
              [s.x, s.y + s.height],
              [s.x + s.width, s.y + s.height],
            ],
            opts
          );
        else if (s.type === "circle")
          rc.circle(
            s.x + s.width / 2,
            s.y + s.height / 2,
            Math.min(s.width, s.height),
            opts
          );
        else if (s.type === "line" || s.type === "arrow") {
          rc.line(s.x, s.y, s.x + s.width, s.y + s.height, opts);
          if (s.type === "arrow") {
            const angle = Math.atan2(s.height, s.width),
              hl = 15 / zoom;
            rc.line(
              s.x + s.width,
              s.y + s.height,
              s.x + s.width - hl * Math.cos(angle - Math.PI / 6),
              s.y + s.height - hl * Math.sin(angle - Math.PI / 6),
              opts
            );
            rc.line(
              s.x + s.width,
              s.y + s.height,
              s.x + s.width - hl * Math.cos(angle + Math.PI / 6),
              s.y + s.height - hl * Math.sin(angle + Math.PI / 6),
              opts
            );
          }
        } else if (s.type === "pencil" && s.points)
          rc.curve(
            s.points.map((p) => [p.x, p.y]),
            opts
          );

        // Draw selection handles if selected
        if (selected) {
          const hSize = 10 / zoom;
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#6366f1";
          ctx.lineWidth = 2 / zoom;

          const handles = [
            { x: s.x, y: s.y },
            { type: "n", x: s.x + s.width / 2, y: s.y },
            { x: s.x + s.width, y: s.y },
            { x: s.x, y: s.y + s.height / 2 },
            { x: s.x + s.width, y: s.y + s.height / 2 },
            { x: s.x, y: s.y + s.height },
            { x: s.x + s.width / 2, y: s.y + s.height },
            { x: s.x + s.width, y: s.y + s.height },
          ];

          handles.forEach((h) => {
            ctx.beginPath();
            ctx.arc(h.x, h.y, hSize / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          });

          // Draw Move icon in top-left
          const mx = s.x + 15;
          const my = s.y + 15;
          const mSize = 18 / zoom;
          ctx.beginPath();
          ctx.arc(mx, my, (mSize + 4) / 2, 0, Math.PI * 2);
          ctx.fillStyle = "#6366f1";
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5 / zoom;

          // Move icon symbol (cross arrows)
          ctx.beginPath();
          ctx.moveTo(mx - mSize / 4, my);
          ctx.lineTo(mx + mSize / 4, my);
          ctx.moveTo(mx, my - mSize / 4);
          ctx.lineTo(mx, my + mSize / 4);
          ctx.stroke();

          // Draw bounding box
          ctx.setLineDash([5 / zoom, 5 / zoom]);
          ctx.strokeStyle = "#6366f1";
          ctx.strokeRect(s.x, s.y, s.width, s.height);
          ctx.setLineDash([]);
        }
      } catch (e) {
        console.error(e);
      }
    });

    if (currentPreview) {
      const opts = {
        ...getOptions(false, { type: mode } as any, 42), // Stable seed for preview
        stroke: "#6366f1",
      };
      const { x, y, w, h, points } = currentPreview;
      if (mode === "rectangle") rc.rectangle(x, y, w, h, opts);
      else if (mode === "triangle")
        rc.polygon(
          [
            [x + w / 2, y],
            [x, y + h],
            [x + w, y + h],
          ],
          opts
        );
      else if (mode === "circle")
        rc.circle(x + w / 2, y + h / 2, Math.min(w, h), opts);
      else if (mode === "line" || mode === "arrow") {
        rc.line(x, y, x + w, y + h, opts);
        if (mode === "arrow") {
          const angle = Math.atan2(h, w),
            hl = 15 / zoom;
          rc.line(
            x + w,
            y + h,
            x + w - hl * Math.cos(angle - Math.PI / 6),
            y + h - hl * Math.sin(angle - Math.PI / 6),
            opts
          );
          rc.line(
            x + w,
            y + h,
            x + w - hl * Math.cos(angle + Math.PI / 6),
            y + h - hl * Math.sin(angle + Math.PI / 6),
            opts
          );
        }
      } else if (mode === "pencil" && points)
        rc.curve(
          points.map((p: any) => [p.x, p.y]),
          opts
        );
    }
  };

  useEffect(() => {
    draw();
  }, [shapes, currentPreview, vX, vY, zoom, selectedShapeId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      draw();
    };
    resize();
    window.addEventListener("resize", resize);

    const onPointerDown = (e: PointerEvent) => {
      // Ignore if clicking UI elements
      if ((e.target as HTMLElement).closest(".z-80, .z-90, button")) return;

      const flowPos = screenToFlowPosition({ x: e.clientX, y: e.clientY });

      if (mode === "select" || mode === "none") {
        // Check handles first if a shape is already selected
        if (selectedShapeId) {
          const selectedShape = shapes.find((s) => s.id === selectedShapeId);
          if (selectedShape) {
            const handle = isPointInHandle(
              flowPos.x,
              flowPos.y,
              selectedShape,
              zoom
            );
            if (handle) {
              e.stopPropagation();
              if (handle === "move") {
                dragOffset.current = {
                  x: flowPos.x - selectedShape.x,
                  y: flowPos.y - selectedShape.y,
                };
                isDragging.current = true;
                start.current = flowPos;
                return;
              }
              resizeType.current = handle;
              isResizing.current = true;
              start.current = flowPos;
              return;
            }
          }
        }

        const hit = [...shapes]
          .reverse()
          .find((s) => isPointInShape(flowPos.x, flowPos.y, s, zoom));

        if (hit) {
          // If we hit a shape, consume the event so it doesn't select nodes underneath
          e.stopPropagation();
          onSelectShape(hit.id);
          onDoubleClickShape(hit.id); // Trigger dock on single click selection

          // ONLY allow immediate dragging if the shape was ALREADY selected
          // This prevents "accidental" moves while just trying to select something
          if (hit.id === selectedShapeId) {
            dragOffset.current = { x: flowPos.x - hit.x, y: flowPos.y - hit.y };
            isDragging.current = true;
          }
          start.current = flowPos;
        } else {
          // If we click empty space, deselect the shape but let the event fall through
          // to React Flow (which will handle node selection/deselection)
          if (mode === "select") {
            onSelectShape(null);
            onDoubleClickShape(""); // Hacky way to reset editing state, better to pass a reset function
          }
        }
        return;
      }

      if (mode === "hand") return;

      // For drawing modes, we assume the canvas is being clicked (pointer-events will be auto)
      start.current = flowPos;
      currentPoints.current = [flowPos];
      if (mode === "pencil")
        setCurrentPreview({
          x: flowPos.x,
          y: flowPos.y,
          w: 0,
          h: 0,
          points: [flowPos],
        });
    };

    const onPointerMove = (e: PointerEvent) => {
      const flowPos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      if (isResizing.current && selectedShapeId) {
        const shape = shapes.find((s) => s.id === selectedShapeId);
        if (shape) {
          const updates: Partial<Shape> = {};
          if (resizeType.current?.includes("n")) {
            updates.y = flowPos.y;
            updates.height = shape.y + shape.height - flowPos.y;
          }
          if (resizeType.current?.includes("s")) {
            updates.height = flowPos.y - shape.y;
          }
          if (resizeType.current?.includes("w")) {
            updates.x = flowPos.x;
            updates.width = shape.x + shape.width - flowPos.x;
          }
          if (resizeType.current?.includes("e")) {
            updates.width = flowPos.x - shape.x;
          }

          if (
            shape.type === "pencil" &&
            shape.points &&
            updates.width !== undefined &&
            updates.height !== undefined
          ) {
            // For pencil, resizing is complex, let's keep it simple for now or skip
          }

          onUpdateShape(selectedShapeId, updates);
        }
        return;
      }

      if (isDragging.current && selectedShapeId && dragOffset.current) {
        const shape = shapes.find((s) => s.id === selectedShapeId);
        if (shape) {
          const newX = flowPos.x - dragOffset.current.x,
            newY = flowPos.y - dragOffset.current.y;
          if (shape.type === "pencil" && shape.points) {
            const dx = newX - shape.x,
              dy = newY - shape.y;
            onUpdateShape(selectedShapeId, {
              x: newX,
              y: newY,
              points: shape.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
            });
          } else onUpdateShape(selectedShapeId, { x: newX, y: newY });
        }
        return;
      }
      if (
        !start.current ||
        mode === "none" ||
        mode === "hand" ||
        mode === "select"
      )
        return;
      if (mode === "pencil") {
        const pts = currentPoints.current,
          last = pts[pts.length - 1];
        if (
          !last ||
          Math.abs(flowPos.x - last.x) > 2 / zoom ||
          Math.abs(flowPos.y - last.y) > 2 / zoom
        ) {
          currentPoints.current.push(flowPos);
          setCurrentPreview({
            ...currentPreview,
            points: [...currentPoints.current],
          });
        }
      } else {
        const { x: sx, y: sy } = start.current;
        if (mode === "line" || mode === "arrow")
          setCurrentPreview({
            x: sx,
            y: sy,
            w: flowPos.x - sx,
            h: flowPos.y - sy,
          });
        else
          setCurrentPreview({
            x: Math.min(sx, flowPos.x),
            y: Math.min(sy, flowPos.y),
            w: Math.abs(flowPos.x - sx),
            h: Math.abs(flowPos.y - sy),
          });
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isResizing.current) {
        isResizing.current = false;
        resizeType.current = null;
        start.current = null;
        return;
      }
      if (isDragging.current) {
        isDragging.current = false;
        start.current = null;
        return;
      }
      if (
        !start.current ||
        mode === "none" ||
        mode === "hand" ||
        mode === "select"
      ) {
        start.current = null;
        return;
      }
      const flowPos = screenToFlowPosition({ x: e.clientX, y: e.clientY }),
        { x: sx, y: sy } = start.current;
      const id = Date.now().toString();
      let newShape: Shape | null = null;
      if (mode === "pencil") {
        if (currentPoints.current.length > 1) {
          const xs = currentPoints.current.map((p) => p.x),
            ys = currentPoints.current.map((p) => p.y);
          newShape = {
            id,
            type: "pencil",
            x: Math.min(...xs),
            y: Math.min(...ys),
            width: Math.max(...xs) - Math.min(...xs),
            height: Math.max(...ys) - Math.min(...ys),
            points: [...currentPoints.current],
          };
        }
      } else {
        const nx = Math.min(sx, flowPos.x),
          ny = Math.min(sy, flowPos.y),
          nw = Math.abs(flowPos.x - sx),
          nh = Math.abs(flowPos.y - sy);
        if (mode === "line" || mode === "arrow")
          newShape = {
            id,
            type: mode,
            x: sx,
            y: sy,
            width: flowPos.x - sx,
            height: flowPos.y - sy,
          };
        else if (nw > 2 || nh > 2)
          newShape = {
            id,
            type: mode as any,
            x: nx,
            y: ny,
            width: nw,
            height: nh,
          };
      }
      if (newShape) onAddShape(newShape);
      start.current = null;
      setCurrentPreview(null);
      currentPoints.current = [];
    };

    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown, {
        capture: true,
      });
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [
    mode,
    onAddShape,
    screenToFlowPosition,
    zoom,
    shapes,
    selectedShapeId,
    onSelectShape,
    onUpdateShape,
    onDoubleClickShape,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-40"
      style={{
        pointerEvents:
          (mode !== "none" && mode !== "hand" && mode !== "select") ||
          !!selectedShapeId
            ? "auto"
            : "none",
        cursor:
          mode === "hand"
            ? "grab"
            : mode === "select"
            ? isResizing.current
              ? resizeType.current?.includes("n") ||
                resizeType.current?.includes("s")
                ? "ns-resize"
                : resizeType.current?.includes("e") ||
                  resizeType.current?.includes("w")
                ? "ew-resize"
                : "nwse-resize"
              : isDragging.current
              ? "move"
              : "default"
            : mode !== "none"
            ? "crosshair"
            : "default",
      }}
    />
  );
}
