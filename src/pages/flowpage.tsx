/* eslint-disable @typescript-eslint/no-explicit-any */
import { Save, Trash } from "lucide-react";
import { useState, useCallback } from "react";
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
  // Background,
  // Controls,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { NodeType, CustomNodeData, FlowState } from "@/types/flow";
import StartNode from "@/components/nodes/StartNode";
import ProcessNode from "@/components/nodes/ProcessNode";
import DecisionNode from "@/components/nodes/DecisionNode";
import EndNode from "@/components/nodes/EndNode";
import CustomNode from "@/components/nodes/CustomNode";
import { Button } from "@/components/ui/button";
import BottomDock from "@/components/BottomDock";
import PropertiesPanel from "@/components/PropertiesPanel";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

function getInitialState(): FlowState {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Failed to load saved flow:", error);
    }
  }
  return { nodes: initialNodes, edges: initialEdges };
}

export function FlowBuilder() {
  const [nodes, setNodes] = useState<Node<CustomNodeData>[]>(
    () => getInitialState().nodes
  );
  const [edges, setEdges] = useState<Edge[]>(() => getInitialState().edges);
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(
    null
  );
  // track an edge click action (id + click position)
  const [edgeAction, setEdgeAction] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onContinue?: () => void;
    showCancel?: boolean;
  }>({
    open: false,
    title: "",
    description: "",
    showCancel: true,
  });
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes(
        (nds) => applyNodeChanges(changes, nds) as Node<CustomNodeData>[]
      ),
    []
  );

  const deleteEdge = useCallback((id: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
    setEdgeAction(null);
  }, []);

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => {
        const newEdges = applyEdgeChanges(changes, eds);
        // hide edge action UI when edges change (e.g. deletion via other means)
        setEdgeAction(null);
        return newEdges;
      }),
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

  const onEdgeClick = useCallback((event: any, edge: Edge) => {
    // prevent other handlers from reacting to this click
    event?.stopPropagation?.();
    const x = event.clientX ?? 0;
    const y = event.clientY ?? 0;
    setEdgeAction({ id: edge.id ?? `${edge.source}-${edge.target}`, x, y });
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setEdgeAction(null);
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
    setAlertDialog({
      open: true,
      title: "Clear Canvas",
      description:
        "Are you sure you want to clear the entire canvas? This action cannot be undone.",
      showCancel: true,
      onContinue: () => {
        setNodes([]);
        setEdges([]);
        setSelectedNode(null);
      },
    });
  }, []);

  const handleSave = useCallback(() => {
    const state: FlowState = { nodes, edges };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setAlertDialog({
      open: true,
      title: "Flow Saved",
      description: "Your flow has been saved successfully!",
      showCancel: false,
    });
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
        setAlertDialog({
          open: true,
          title: "Flow Loaded",
          description: "Your flow has been loaded successfully!",
          showCancel: false,
        });
      } catch (error) {
        setAlertDialog({
          open: true,
          title: "Load Failed",
          description:
            "Failed to load flow data. The saved data might be corrupted.",
          showCancel: false,
        });
        console.error(error);
      }
    } else {
      setAlertDialog({
        open: true,
        title: "No Saved Flow",
        description: "No saved flow was found in your local storage.",
        showCancel: false,
      });
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
        onEdgeClick={onEdgeClick}
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

      {/* Edge action (trash) button shown when an edge is clicked */}
      {edgeAction && (
        <div
          style={{
            position: "fixed",
            left: edgeAction.x,
            top: edgeAction.y,
            transform: "translate(-50%, -50%)",
            zIndex: 60,
          }}
        >
          <Button
            onClick={() => {
              deleteEdge(edgeAction.id);
              setEdgeAction(null);
            }}
            className="bg-red-400 hover:bg-red-500 hover:text-white border-none text-white"
            variant="outline"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          onClick={handleSave}
          className="border hover:bg-gray-100 dark:hover:bg-gray-800"
          variant="outline"
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          className="border hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-white hover:bg-red-500 dark:hover:text-gray-100"
        >
          <Trash className="w-4 h-4" />
          Clear
        </Button>
      </div>

      <BottomDock
        onAddNode={addNode}
        onZoomIn={() => zoomIn({ duration: 300 })}
        onZoomOut={() => zoomOut({ duration: 300 })}
        onFitView={() => fitView({ duration: 300, padding: 0.2 })}
        onClear={handleClear}
        onLoad={handleLoad}
        onSave={handleSave}
      />

      {selectedNode && (
        <PropertiesPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={updateNode}
          onDelete={deleteNode}
        />
      )}

      <AlertDialog
        open={alertDialog.open}
        onOpenChange={(open) => setAlertDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alertDialog.showCancel && (
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            )}
            <AlertDialogAction onClick={alertDialog.onContinue}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
