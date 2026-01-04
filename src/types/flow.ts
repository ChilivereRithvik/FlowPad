export type NodeType = "start" | "process" | "decision" | "end" | "custom";
export type ToolMode =
  | "none"
  | "rectangle"
  | "triangle"
  | "circle"
  | "arrow"
  | "line"
  | "pencil"
  | "hand"
  | "select";

export interface CustomNodeData {
  label: string;
  type: NodeType;
  color?: string;
  description?: string;
  [key: string]: any;
}

export interface Shape {
  id: string;
  type: Exclude<ToolMode, "none">;
  x: number;
  y: number;
  width: number;
  height: number;
  points?: { x: number; y: number }[]; // For pencil/freehand
}

export interface FlowState {
  nodes: any[];
  edges: any[];
  shapes?: Shape[];
}
