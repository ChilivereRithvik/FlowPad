import { Fullscreen, Plus, Trash, ZoomIn, ZoomOut } from "lucide-react";
import type { NodeType } from "../types/flow";
import { Button } from "./ui/button";

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
  onClear,
  onSave,
}: BottomDockProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="max-w-6xl mx-auto pb-6 w-fit">
        <div className="glass-panel rounded-2xl p-2 w-fit border">
          <div className="flex items-center justify-center  flex-wrap gap-1">
            {/* Node Types Section */}
            <div className="flex items-center gap-1">
              <Button
                onClick={() => onAddNode("custom")}
                variant={"ghost"}
                className="control-button"
                title="Add Custom Node"
              >
                custom
              </Button>
              <Button
                onClick={() => onAddNode("start")}
                variant={"ghost"}
                className="control-button"
                title="Add Start Node"
              >
                start
              </Button>
            </div>

            {/* Canvas Controls */}
            <div className="flex items-center gap-1">
              <Button
                onClick={onZoomIn}
                className="control-button"
                title="Zoom In"
              >
                <ZoomIn />
              </Button>

              <Button
                onClick={onZoomOut}
                className="control-button"
                title="Zoom Out"
              >
                <ZoomOut />
              </Button>

              <Button
                onClick={onFitView}
                className="control-button"
                title="Fit View"
              >
                <Fullscreen />
              </Button>

              <Button
                onClick={onClear}
                className="control-button bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                title="Clear Canvas"
              >
                <Trash />
              </Button>
            </div>

            {/* Save/Load Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={onSave}
                className="control-button bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400"
                title="Save Flow"
              >
                <span className="text-xs font-medium">Save</span>
              </Button>

              {/* <Button
                onClick={onLoad}
                className="control-button bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                title="Load Flow"
              >
                <span className="text-xs font-medium">Load</span>
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
