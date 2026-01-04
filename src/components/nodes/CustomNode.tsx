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
    <div className="bg-black rounded-2xl p-4">
      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className="text-sm font-semibold text-white text-center">
          {data.label}
        </span>
        {data.description && (
          <span className="text-xs text-white/80 text-center">
            {data.description}
          </span>
        )}
      </div>
      <Handle
        type="target"
        position={Position.Right}
        className="!w-3 !h-3 !bg-white !border-2 !border-gray-500"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="!w-3 !h-3 !bg-white !border-2 !border-gray-500"
      />
    </div>
  );
}
