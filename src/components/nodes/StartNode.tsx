import { Handle, Position } from "@xyflow/react";
import { Settings } from "lucide-react";
import type { CustomNodeData } from "../../types/flow";

interface StartNodeProps {
  id: string;
  data: CustomNodeData;
  selected?: boolean;
}

export default function StartNode({ id, data, selected }: StartNodeProps) {
  return (
    <div
      className={`group bg-black px-3 py-1 rounded-sm gap-3 ${
        selected ? "bg-blue-500 " : ""
      }`}
    >
      <div className="relative z-10 flex flex-col items-center gap-1">
        <span className="text-xs font-bold text-white">{data.label}</span>
      </div>

      {/* Edit Icon - visible on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          data.onEdit?.({ id, data, position: { x: 0, y: 0 }, type: "start" });
        }}
        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-gray-100"
      >
        <Settings className="w-3 h-3 text-black" />
      </button>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-white !border-2 !border-gray-500"
      />
    </div>
  );
}
