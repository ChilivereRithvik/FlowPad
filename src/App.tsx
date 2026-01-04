/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  MiniMap,
  Background,
  Controls,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import StartNode from "./components/nodes/StartNode";
import ProcessNode from "./components/nodes/ProcessNode";
import DecisionNode from "./components/nodes/DecisionNode";
import EndNode from "./components/nodes/EndNode";
import CustomNode from "./components/nodes/CustomNode";
import BottomDock from "./components/BottomDock";
import PropertiesPanel from "./components/PropertiesPanel";

import type { NodeType, CustomNodeData, FlowState } from "./types/flow";

const nodeTypes = {
  start: StartNode,
  process: ProcessNode,
  decision: DecisionNode,
  end: EndNode,
  custom: CustomNode,
};

const initialNodes: Node<CustomNodeData>[] = [];
const initialEdges: Edge[] = [];

const STORAGE_KEY = "flowpad-state";

function FlowBuilder() {
  const [nodes, setNodes] = useState<Node<CustomNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(
    null
  );
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  // Load saved flow on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { nodes: savedNodes, edges: savedEdges }: FlowState =
          JSON.parse(saved);
        setNodes(savedNodes);
        setEdges(savedEdges);
      } catch (error) {
        console.error("Failed to load saved flow:", error);
      }
    }
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes(
        (nds) => applyNodeChanges(changes, nds) as Node<CustomNodeData>[]
      ),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    []
  );

  const onNodeClick = useCallback((_event: any, node: Node<CustomNodeData>) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const addNode = useCallback((type: NodeType) => {
    const id = `${type}-${Date.now()}`;
    const labels: Record<NodeType, string> = {
      start: "Start",
      process: "Process",
      decision: "Decision?",
      end: "End",
      custom: "Custom Node",
    };

    const newNode: Node<CustomNodeData> = {
      id,
      type,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: {
        label: labels[type],
        type,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  }, []);

  const updateNode = useCallback(
    (id: string, data: Partial<CustomNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...data } } : node
        )
      );
      setSelectedNode((current) =>
        current?.id === id
          ? { ...current, data: { ...current.data, ...data } }
          : current
      );
    },
    []
  );

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id)
    );
  }, []);

  const handleClear = useCallback(() => {
    if (confirm("Are you sure you want to clear the entire canvas?")) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    }
  }, []);

  const handleSave = useCallback(() => {
    const state: FlowState = { nodes, edges };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    alert("Flow saved successfully!");
  }, [nodes, edges]);

  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { nodes: savedNodes, edges: savedEdges }: FlowState =
          JSON.parse(saved);
        setNodes(savedNodes);
        setEdges(savedEdges);
        setSelectedNode(null);
        alert("Flow loaded successfully!");
      } catch (error) {
        alert("Failed to load flow");
        console.error(error);
      }
    } else {
      alert("No saved flow found");
    }
  }, []);

  return (
    <div className="w-screen h-screen relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        fitView
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      >
        {/* <Background color="#94a3b8" gap={16} /> */}
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="!bg-white/80 dark:!bg-gray-800/80 !border-2 !border-gray-300 dark:!border-gray-600 !rounded-lg"
        />
        {/* <Controls className="!bg-white/80 dark:!bg-gray-800/80 !border-2 !border-gray-300 dark:!border-gray-600 !rounded-lg" /> */}
      </ReactFlow>

      <BottomDock
        onAddNode={addNode}
        onZoomIn={() => zoomIn({ duration: 300 })}
        onZoomOut={() => zoomOut({ duration: 300 })}
        onFitView={() => fitView({ duration: 300, padding: 0.2 })}
        onClear={handleClear}
        onSave={handleSave}
        onLoad={handleLoad}
      />

      {selectedNode && (
        <PropertiesPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={updateNode}
          onDelete={deleteNode}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        <FlowBuilder />
      </ReactFlowProvider>
    </div>
  );
}
