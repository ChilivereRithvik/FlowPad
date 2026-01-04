import { Handle, Position } from "@xyflow/react";
import { Settings } from "lucide-react";
import type { CustomNodeData } from "../../types/flow";

interface EndNodeProps {
  id: string;
  data: CustomNodeData;
  selected?: boolean;
}

export default function EndNode({ id, data, selected }: EndNodeProps) {
  return (
    <div
      className={`group relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-rose-600 shadow-lg transition-all duration-300 ${
        selected ? "ring-4 ring-blue-400 scale-110" : "hover:scale-105"
      }`}
    >
      <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center gap-1">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
          />
        </svg>
        <span className="text-xs font-bold text-white">{data.label}</span>
      </div>

      {/* Edit Icon - visible on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          data.onEdit?.({ id, data, position: { x: 0, y: 0 }, type: "end" });
        }}
        className="absolute -top-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Settings className="w-3 h-3 text-black dark:text-white" />
      </button>

      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-rose-500 !border-2 !border-white"
      />
    </div>
  );
}
