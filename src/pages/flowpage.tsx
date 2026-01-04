/* eslint-disable @typescript-eslint/no-explicit-any */
import { Save, Trash } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type {
  NodeType,
  CustomNodeData,
  FlowState,
  Shape,
  ToolMode,
} from "@/types/flow";
import StartNode from "@/components/nodes/StartNode";
import ProcessNode from "@/components/nodes/ProcessNode";
import DecisionNode from "@/components/nodes/DecisionNode";
import EndNode from "@/components/nodes/EndNode";
import CustomNode from "@/components/nodes/CustomNode";
import { Button } from "@/components/ui/button";
import BottomDock from "@/components/BottomDock";
import PropertiesPanel from "@/components/PropertiesPanel";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import RoughCanvasLayer from "./RoughCanvasLayer";

const nodeTypes = {
  start: StartNode,
  process: ProcessNode,
  decision: DecisionNode,
  end: EndNode,
  custom: CustomNode,
};

const initialNodes: Node<CustomNodeData>[] = [];
const initialEdges: Edge[] = [];
const initialShapes: Shape[] = [];

const STORAGE_KEY = "flowpad-state";

function getInitialState(): FlowState {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Failed to load saved flow:", error);
    }
  }
  return { nodes: initialNodes, edges: initialEdges, shapes: initialShapes };
}

export function FlowBuilder() {
  const [nodes, setNodes] = useState<Node<CustomNodeData>[]>(
    () => getInitialState().nodes
  );
  const [edges, setEdges] = useState<Edge[]>(() => getInitialState().edges);
  const [shapes, setShapes] = useState<Shape[]>(
    () => getInitialState().shapes || []
  );
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(
    null
  );
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [tool, setTool] = useState<ToolMode>("none");
  const [edgeAction, setEdgeAction] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onContinue?: () => void;
    showCancel?: boolean;
  }>({
    open: false,
    title: "",
    description: "",
    showCancel: true,
  });
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  // History for undo/redo
  const [_history, setHistory] = useState<FlowState[]>([]);

  const saveToHistory = useCallback(() => {
    setHistory((prev) => {
      const newState = { nodes, edges, shapes };
      // Limit history to 50 steps
      const newHistory = [...prev, newState];
      if (newHistory.length > 50) return newHistory.slice(1);
      return newHistory;
    });
  }, [nodes, edges, shapes]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const lastState = prev[prev.length - 1];
      if (!lastState) return prev;

      setNodes(lastState.nodes);
      setEdges(lastState.edges);
      setShapes(lastState.shapes || []);
      return prev.slice(0, -1);
    });
  }, []);

  const updateShape = useCallback(
    (id: string, updates: Partial<Shape>) => {
      saveToHistory();
      setShapes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      );
    },
    [saveToHistory]
  );

  const deleteShape = useCallback(
    (id: string) => {
      saveToHistory();
      setShapes((prev) => prev.filter((s) => s.id !== id));
      setSelectedShapeId(null);
    },
    [saveToHistory]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }

      if ((e.key === "Delete" || e.key === "Backspace") && selectedShapeId) {
        if (
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA"
        ) {
          deleteShape(selectedShapeId);
        }
      }

      if (
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        switch (e.key.toLowerCase()) {
          case "v":
            setTool("select");
            break;
          case "h":
            setTool("hand");
            break;
          case "r":
            setTool("rectangle");
            break;
          case "t":
            setTool("triangle");
            break;
          case "c":
            setTool("circle");
            break;
          case "a":
            setTool("arrow");
            break;
          case "l":
            setTool("line");
            break;
          case "p":
            setTool("pencil");
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, selectedShapeId, deleteShape]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const isSignificant = changes.some(
        (c) => c.type === "position" || c.type === "remove" || c.type === "add"
      );
      if (isSignificant) saveToHistory();
      setNodes(
        (nds) => applyNodeChanges(changes, nds) as Node<CustomNodeData>[]
      );
    },
    [saveToHistory]
  );

  const deleteEdge = useCallback((id: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
    setEdgeAction(null);
  }, []);

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      saveToHistory();
      setEdges((eds) => {
        const newEdges = applyEdgeChanges(changes, eds);
        setEdgeAction(null);
        return newEdges;
      });
    },
    [saveToHistory]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      saveToHistory();
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    },
    [saveToHistory]
  );

  const onNodeClick = useCallback((_event: any, node: Node<CustomNodeData>) => {
    setSelectedNode(node);
    setSelectedShapeId(null);
  }, []);

  const onEdgeClick = useCallback((event: any, edge: Edge) => {
    event?.stopPropagation?.();
    const x = event.clientX ?? 0;
    const y = event.clientY ?? 0;
    setEdgeAction({ id: edge.id ?? `${edge.source}-${edge.target}`, x, y });
    setSelectedShapeId(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setEdgeAction(null);
    setSelectedShapeId(null);
  }, []);

  const addNode = useCallback(
    (type: NodeType) => {
      const id = `${type}-${Date.now()}`;
      const labels: Record<NodeType, string> = {
        start: "Start",
        process: "Process",
        decision: "Decision?",
        end: "End",
        custom: "Custom Node",
      };

      const newNode: Node<CustomNodeData> = {
        id,
        type,
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
        data: {
          label: labels[type],
          type,
        },
      };

      saveToHistory();
      setNodes((nds) => [...nds, newNode]);
    },
    [saveToHistory]
  );

  const updateNode = useCallback(
    (id: string, data: Partial<CustomNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...data } } : node
        )
      );
      setSelectedNode((current) =>
        current?.id === id
          ? { ...current, data: { ...current.data, ...data } }
          : current
      );
    },
    []
  );

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id)
    );
  }, []);

  const handleClear = useCallback(() => {
    setAlertDialog({
      open: true,
      title: "Clear Canvas",
      description:
        "Are you sure you want to clear the entire canvas? This action cannot be undone.",
      showCancel: true,
      onContinue: () => {
        setNodes([]);
        setEdges([]);
        setShapes([]);
        setSelectedNode(null);
        setSelectedShapeId(null);
      },
    });
  }, []);

  const handleSave = useCallback(() => {
    const state: FlowState = { nodes, edges, shapes };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setAlertDialog({
      open: true,
      title: "Flow Saved",
      description: "Your flow has been saved successfully!",
      showCancel: false,
    });
  }, [nodes, edges, shapes]);

  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const {
          nodes: savedNodes,
          edges: savedEdges,
          shapes: savedShapes = [],
        }: FlowState = JSON.parse(saved);
        setNodes(savedNodes);
        setEdges(savedEdges);
        setShapes(savedShapes);
        setSelectedNode(null);
        setSelectedShapeId(null);
        setAlertDialog({
          open: true,
          title: "Flow Loaded",
          description: "Your flow has been loaded successfully!",
          showCancel: false,
        });
      } catch (error) {
        setAlertDialog({
          open: true,
          title: "Load Failed",
          description:
            "Failed to load flow data. The saved data might be corrupted.",
          showCancel: false,
        });
        console.error(error);
      }
    } else {
      setAlertDialog({
        open: true,
        title: "No Saved Flow",
        description: "No saved flow was found in your local storage.",
        showCancel: false,
      });
    }
  }, []);

  return (
    <div className="w-screen h-screen relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        fitView
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      />

      {edgeAction && (
        <div
          style={{
            position: "fixed",
            left: edgeAction.x,
            top: edgeAction.y,
            transform: "translate(-50%, -50%)",
            zIndex: 90,
          }}
        >
          <Button
            onClick={() => {
              deleteEdge(edgeAction.id);
              setEdgeAction(null);
            }}
            className="bg-red-400 hover:bg-red-500 hover:text-white border-none text-white"
            variant="outline"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="fixed top-4 right-4 z-80 flex gap-2">
        <Button
          onClick={handleSave}
          className="border hover:bg-gray-100 dark:hover:bg-gray-800"
          variant="outline"
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          className="border hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-white hover:bg-red-500 dark:hover:text-gray-100"
        >
          <Trash className="w-4 h-4" />
          Clear
        </Button>
      </div>

      <RoughCanvasLayer
        mode={tool}
        onFinish={useCallback(() => setTool("none"), [])}
        shapes={shapes}
        onAddShape={useCallback(
          (shape: Shape) => {
            saveToHistory();
            setShapes((prev) => [...prev, shape]);
          },
          [saveToHistory]
        )}
        selectedShapeId={selectedShapeId}
        onSelectShape={setSelectedShapeId}
        onUpdateShape={updateShape}
        onDeleteShape={deleteShape}
      />

      <BottomDock
        onAddNode={addNode}
        tool={tool}
        onSelectTool={setTool}
        onZoomIn={() => zoomIn({ duration: 300 })}
        onZoomOut={() => zoomOut({ duration: 300 })}
        onFitView={() => fitView({ duration: 300, padding: 0.2 })}
        onClear={handleClear}
        onLoad={handleLoad}
        onSave={handleSave}
      />

      {selectedNode && (
        <PropertiesPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={updateNode}
          onDelete={deleteNode}
        />
      )}

      <AlertDialog
        open={alertDialog.open}
        onOpenChange={(open) => setAlertDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alertDialog.showCancel && (
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            )}
            <AlertDialogAction onClick={alertDialog.onContinue}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
