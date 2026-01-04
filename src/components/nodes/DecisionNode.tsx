import { Handle, Position } from "@xyflow/react";
import type { CustomNodeData } from "../../types/flow";

interface DecisionNodeProps {
  data: CustomNodeData;
  selected?: boolean;
}

export default function DecisionNode({ data, selected }: DecisionNodeProps) {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <div
        className={`absolute inset-0 rotate-45 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg transition-all duration-300 ${
          selected ? "ring-4 ring-blue-400 scale-110" : "hover:scale-105"
        }`}
      >
        <div className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-sm" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-1">
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-xs font-bold text-white text-center px-2">
          {data.label}
        </span>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="yes"
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="no"
        className="!w-3 !h-3 !bg-red-500 !border-2 !border-white"
      />
    </div>
  );
}
