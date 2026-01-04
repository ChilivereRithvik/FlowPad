import { Handle, Position } from "@xyflow/react";
import { Settings } from "lucide-react";
import type { CustomNodeData } from "../../types/flow";

interface ProcessNodeProps {
  id: string;
  data: CustomNodeData;
  selected?: boolean;
}

export default function ProcessNode({ id, data, selected }: ProcessNodeProps) {
  return (
    <div
      className={`group relative px-6 py-4 min-w-[160px] rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg transition-all duration-300 ${
        selected ? "ring-4 ring-blue-400 scale-105" : "hover:scale-102"
      }`}
    >
      <div className="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-sm font-semibold text-white text-center">
          {data.label}
        </span>
      </div>

      {/* Edit Icon - visible on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          data.onEdit?.({
            id,
            data,
            position: { x: 0, y: 0 },
            type: "process",
          });
        }}
        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-gray-100"
      >
        <Settings className="w-3 h-3 text-black" />
      </button>

      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white"
      />
    </div>
  );
}
