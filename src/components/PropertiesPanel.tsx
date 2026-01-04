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

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

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

  const handleConfirmDelete = () => {
    onDelete(node.id);
    setShowDeleteAlert(false);
    onClose();
  };

  return (
    <>
      {/* MAIN PROPERTIES DIALOG */}
      <Dialog open={!!node} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Node Properties</DialogTitle>
          </DialogHeader>

          {/* FORM */}
          <div className="space-y-3">
            {/* Label */}
            <div className="space-y-1">
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
              <div className="space-y-1">
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
              <Button
                variant="destructive"
                onClick={() => {
                  // setShowDeleteAlert(true);
                  onDelete(node.id);
                  onClose();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <Button onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION ALERT */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this node?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The node and all its connections
              will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
