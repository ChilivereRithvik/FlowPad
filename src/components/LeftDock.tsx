import { Trash2, Hash, X } from "lucide-react";
import type { Shape } from "@/types/flow";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface LeftDockProps {
  selectedShape: Shape | null;
  onUpdateShape: (id: string, updates: Partial<Shape>) => void;
  onDeleteShape: (id: string) => void;
  onClose: () => void;
}

const COLORS = [
  "#1e293b",
  "#6366f1",
  "#ef4444",
  "#22c55e",
  "#eab308",
  "#ec4899",
  "#8b5cf6",
];

export default function LeftDock({
  selectedShape,
  onUpdateShape,
  onDeleteShape,
  onClose,
}: LeftDockProps) {
  if (!selectedShape) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 animate-in fade-in slide-in-from-left-4 duration-300">
        <div className="glass-panel p-1 rounded-2xl shadow-sm flex flex-col gap-1 items-center w-16">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="flex flex-col gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onUpdateShape(selectedShape.id, { stroke: c })}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  selectedShape.stroke === c
                    ? "border-blue-500 scale-125 ring-2 ring-blue-500/20"
                    : "border-white/50"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Stroke Width */}
          <div className="flex flex-col items-center gap-2 group">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative h-24 w-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden cursor-pointer">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.5"
                    value={selectedShape.strokeWidth || 2}
                    onChange={(e) =>
                      onUpdateShape(selectedShape.id, {
                        strokeWidth: parseFloat(e.target.value),
                      })
                    }
                    className="absolute top-1/2 left-1/2 w-24 h-6 -rotate-90 -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className="absolute bottom-0 w-full bg-blue-500 transition-all"
                    style={{
                      height: `${
                        ((selectedShape.strokeWidth || 2) / 12) * 100
                      }%`,
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                Stroke: {selectedShape.strokeWidth || 2}px
              </TooltipContent>
            </Tooltip>
            <Hash className="w-4 h-4 text-gray-400" />
          </div>

          {/* Roughness */}
          <div className="flex flex-col items-center gap-2 group">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative h-24 w-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden cursor-pointer">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={selectedShape.roughness ?? 1.2}
                    onChange={(e) =>
                      onUpdateShape(selectedShape.id, {
                        roughness: parseFloat(e.target.value),
                      })
                    }
                    className="absolute top-1/2 left-1/2 w-24 h-6 -rotate-90 -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className="absolute bottom-0 w-full bg-amber-500 transition-all"
                    style={{
                      height: `${
                        ((selectedShape.roughness ?? 1.2) / 5) * 100
                      }%`,
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                Roughness: {selectedShape.roughness ?? 1.2}
              </TooltipContent>
            </Tooltip>
            <PencilIcon className="w-4 h-4 text-gray-400" />
          </div>

          <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />

          {/* Delete */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteShape(selectedShape.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Delete Shape</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
