import { useEffect, useState } from "react";
import type { Node } from "@xyflow/react";
import type { CustomNodeData } from "../types/flow";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Trash2 } from "lucide-react";

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
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");

  // Sync dialog state when node changes
  useEffect(() => {
    if (node) {
      setLabel(node.data.label ?? "");
      setDescription(node.data.description ?? "");
    }
  }, [node]);

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
    <Dialog open={!!node} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Node Properties</DialogTitle>
        </DialogHeader>

        {/* FORM */}
        <div className="space-y-2">
          {/* Label */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Label</label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleSave}
              placeholder="Enter node label"
            />
          </div>

          {/* Description (only for custom nodes) */}
          {node.data.type === "custom" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSave}
                placeholder="Enter node description"
              />
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>

            <Button variant="default" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
