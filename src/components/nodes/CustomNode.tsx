import { Handle, Position } from "@xyflow/react";
import { Settings } from "lucide-react";
import type { CustomNodeData } from "../../types/flow";

interface CustomNodeProps {
  id: string;
  data: CustomNodeData;
  selected?: boolean;
}

export default function CustomNode({ id, data, selected }: CustomNodeProps) {
  return (
    <div
      className={`group bg-black px-3 py-1 rounded-sm gap-3 min-w-[100px] ${
        selected ? "bg-blue-500 " : ""
      }`}
    >
      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className="text-xs font-semibold text-white text-center">
          {data.label}
        </span>
        {data.description && (
          <span className="text-xs text-white/80 text-center">
            {data.description}
          </span>
        )}
      </div>

      {/* Edit Icon - visible on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          data.onEdit?.({ id, data, position: { x: 0, y: 0 }, type: "custom" });
        }}
        className="absolute -top-4 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-gray-100"
      >
        <Settings className="w-3 h-3 text-black" />
      </button>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-white !border-2 !border-gray-500 "
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-white !border-2 !border-gray-500"
      />
    </div>
  );
}
