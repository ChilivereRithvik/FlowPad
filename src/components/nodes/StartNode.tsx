import { Handle, Position } from "@xyflow/react";
import type { CustomNodeData } from "../../types/flow";

interface StartNodeProps {
  data: CustomNodeData;
  selected?: boolean;
}

export default function StartNode({ data, selected }: StartNodeProps) {
  return (
    <div className="bg-black rounded-2xl p-3">
      <div className="relative z-10 flex flex-col items-center gap-1">
        <span className="text-xs font-bold text-white">{data.label}</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-white !border !border-gray-500"
      />
    </div>
  );
}
