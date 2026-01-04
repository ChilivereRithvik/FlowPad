import { Handle, Position } from "@xyflow/react";
import type { CustomNodeData } from "../../types/flow";

interface CustomNodeProps {
  data: CustomNodeData;
  selected?: boolean;
}

export default function CustomNode({ data, selected }: CustomNodeProps) {
  console.log(data);
  console.log(selected);
  return (
    <div className="bg-black px-3 py-1 rounded-sm gap-3">
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
