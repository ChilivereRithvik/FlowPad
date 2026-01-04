export type NodeType = "start" | "process" | "decision" | "end" | "custom";

export interface CustomNodeData {
  label: string;
  type: NodeType;
  color?: string;
  description?: string;
  [key: string]: any;
}

export interface FlowState {
  nodes: any[];
  edges: any[];
}
