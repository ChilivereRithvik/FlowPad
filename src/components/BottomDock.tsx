import {
  Box,
  Circle,
  Fullscreen,
  Hand,
  Minus,
  MousePointer2,
  MoveUpRight,
  Pencil,
  Play,
  Square,
  Triangle,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "./ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Separator } from "@radix-ui/react-separator";
import type { ToolMode, NodeType } from "@/types/flow";

interface BottomDockProps {
  onAddNode: (type: NodeType) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onClear: () => void;
  onSave: () => void;
  onLoad: () => void;
  tool: ToolMode;
  onSelectTool: (tool: ToolMode) => void;
}

export default function BottomDock({
  onAddNode,
  tool,
  onSelectTool,
  onZoomIn,
  onZoomOut,
  onFitView,
}: BottomDockProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="fixed bottom-0 left-0 right-0 z-80 pointer-events-none">
        <div className="max-w-6xl mx-auto pb-6 w-fit pointer-events-auto">
          <div className="glass-panel rounded-sm p-1 w-fit border shadow-xl">
            <div className="flex items-center justify-center flex-wrap gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={tool === "select" ? "secondary" : "ghost"}
                    onClick={() =>
                      onSelectTool(tool === "select" ? "none" : "select")
                    }
                  >
                    <MousePointer2 className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Select Tool (V)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={tool === "hand" ? "secondary" : "ghost"}
                    onClick={() =>
                      onSelectTool(tool === "hand" ? "none" : "hand")
                    }
                  >
                    <Hand className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Pan Tool (H)</TooltipContent>
              </Tooltip>

              <Separator
                className="mx-2 h-6 w-[1px] bg-gray-300 dark:bg-gray-600"
                orientation="vertical"
              />

              {/* Custom Node */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={() => onAddNode("custom")}>
                    <Box className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Custom Node</TooltipContent>
              </Tooltip>

              {/* Start Node */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={() => onAddNode("start")}>
                    <Play className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Start Node</TooltipContent>
              </Tooltip>

              {/* Zoom In */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={onZoomIn}>
                    <ZoomIn className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom In</TooltipContent>
              </Tooltip>

              {/* Zoom Out */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={onZoomOut}>
                    <ZoomOut className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom Out</TooltipContent>
              </Tooltip>

              {/* Fit View */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={onFitView}>
                    <Fullscreen className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Fit View</TooltipContent>
              </Tooltip>

              <Separator
                className="mx-2 h-6 w-[1px] bg-gray-300 dark:bg-gray-600"
                orientation="vertical"
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={tool === "rectangle" ? "secondary" : "ghost"}
                    onClick={() =>
                      onSelectTool(tool === "rectangle" ? "none" : "rectangle")
                    }
                  >
                    <Square className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Rectangle Tool (R)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={tool === "triangle" ? "secondary" : "ghost"}
                    onClick={() =>
                      onSelectTool(tool === "triangle" ? "none" : "triangle")
                    }
                  >
                    <Triangle className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Triangle Tool (T)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={tool === "circle" ? "secondary" : "ghost"}
                    onClick={() =>
                      onSelectTool(tool === "circle" ? "none" : "circle")
                    }
                  >
                    <Circle className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Circle Tool (C)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={tool === "arrow" ? "secondary" : "ghost"}
                    onClick={() =>
                      onSelectTool(tool === "arrow" ? "none" : "arrow")
                    }
                  >
                    <MoveUpRight className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Arrow Tool (A)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={tool === "line" ? "secondary" : "ghost"}
                    onClick={() =>
                      onSelectTool(tool === "line" ? "none" : "line")
                    }
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Line Tool (L)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={tool === "pencil" ? "secondary" : "ghost"}
                    onClick={() =>
                      onSelectTool(tool === "pencil" ? "none" : "pencil")
                    }
                  >
                    <Pencil className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Pencil Tool (P)</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
