import { useState } from "react";
import type { Node } from "@xyflow/react";
import type { CustomNodeData } from "../types/flow";

interface PropertiesPanelProps {
  node: Node<CustomNodeData> | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<CustomNodeData>) => void;
  onDelete: (id: string) => void;
}

export default function PropertiesPanel({
  node,
  onClose,
  onUpdate,
  onDelete,
}: PropertiesPanelProps) {
  const [label, setLabel] = useState(node?.data.label || "");
  const [description, setDescription] = useState(node?.data.description || "");

  if (!node) return null;

  const handleSave = () => {
    onUpdate(node.id, { label, description });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this node?")) {
      onDelete(node.id);
      onClose();
    }
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 z-50 animate-slide-left">
      <div className="h-full glass-panel rounded-l-2xl shadow-2xl p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Node Properties
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Node Type Badge */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            {node.data.type.toUpperCase()}
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 space-y-4 overflow-y-auto">
          {/* Label Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleSave}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter node label"
            />
          </div>

          {/* Description Input (for custom nodes) */}
          {node.data.type === "custom" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSave}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows={4}
                placeholder="Enter node description"
              />
            </div>
          )}

          {/* Node Info */}
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Node ID:</span>
              <span className="font-mono text-gray-900 dark:text-white text-xs">
                {node.id}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Position:
              </span>
              <span className="font-mono text-gray-900 dark:text-white text-xs">
                ({Math.round(node.position.x)}, {Math.round(node.position.y)})
              </span>
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex gap-2">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-semibold mb-1">Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Drag nodes to reposition them</li>
                  <li>Connect nodes by dragging from handles</li>
                  <li>Double-click to edit labels</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <button
            onClick={handleDelete}
            className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Node
          </button>
        </div>
      </div>
    </div>
  );
}
