import { Handle, Position } from "@xyflow/react";
import type { CustomNodeData } from "../../types/flow";

interface StartNodeProps {
  data: CustomNodeData;
  selected?: boolean;
}

export default function StartNode({ data, selected }: StartNodeProps) {
  console.log(selected);

  return (
    <div className="bg-black px-3 py-1 rounded-sm gap-3">
      <div className="relative z-10 flex flex-col items-center gap-1">
        <span className="text-xs font-bold text-white">{data.label}</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-white !border-2 !border-gray-500"
      />
    </div>
  );
}
