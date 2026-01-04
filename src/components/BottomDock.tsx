import { Box, Fullscreen, Play, Trash, ZoomIn, ZoomOut } from "lucide-react";
import type { NodeType } from "../types/flow";
import { Button } from "./ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface BottomDockProps {
  onAddNode: (type: NodeType) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onClear: () => void;
  onSave: () => void;
  onLoad: () => void;
}

export default function BottomDock({
  onAddNode,
  onZoomIn,
  onZoomOut,
  onFitView,
  onLoad,
}: BottomDockProps) {
  console.log(onLoad);
  return (
    <TooltipProvider delayDuration={200}>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto pb-6 w-fit">
          <div className="glass-panel rounded-sm p-1 w-fit border">
            <div className="flex items-center justify-center flex-wrap gap-1">
              {/* Custom Node */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={() => onAddNode("custom")}>
                    <Box />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Custom Node</TooltipContent>
              </Tooltip>

              {/* Start Node */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={() => onAddNode("start")}>
                    <Play />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Start Node</TooltipContent>
              </Tooltip>

              {/* Zoom In */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={onZoomIn}>
                    <ZoomIn />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom In</TooltipContent>
              </Tooltip>

              {/* Zoom Out */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={onZoomOut}>
                    <ZoomOut />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom Out</TooltipContent>
              </Tooltip>

              {/* Fit View */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={onFitView}>
                    <Fullscreen />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Fit View</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
