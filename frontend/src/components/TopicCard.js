import { useState } from "react";
import { Trash, NotePencil, Link as LinkIcon, Circle, CircleDashed, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const difficultyColors = {
  easy: "bg-[#00C853] text-white",
  medium: "bg-[#FFD700] text-black",
  hard: "bg-[#FF0000] text-white"
};

const statusConfig = {
  not_started: { label: "Not Started", icon: Circle, color: "text-[#E0E0E0]" },
  in_progress: { label: "In Progress", icon: CircleDashed, color: "text-[#002FA7]" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-[#00C853]" }
};

export default function TopicCard({ topic, updateTopic, deleteTopic }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    notes: topic.notes || "",
    problem_link: topic.problem_link || ""
  });

  const handleStatusChange = async (newStatus) => {
    await updateTopic(topic.id, { status: newStatus });
  };

  const handleSaveEdit = async () => {
    await updateTopic(topic.id, editData);
    setShowEditDialog(false);
  };

  const StatusIcon = statusConfig[topic.status].icon;

  return (
    <>
      <div
        className="border border-border bg-card p-6 hover:-translate-y-1 hover:shadow-lg transition-all"
        data-testid="topic-card"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold font-sans mb-2" data-testid="topic-name">
              {topic.name}
            </h3>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs tracking-[0.2em] uppercase font-bold px-2 py-1 bg-secondary border border-border" data-testid="topic-category">
                {topic.category}
              </span>
              <span className={`text-xs tracking-[0.2em] uppercase font-bold px-2 py-1 ${difficultyColors[topic.difficulty]}`} data-testid="topic-difficulty">
                {topic.difficulty}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              className="rounded-none hover:bg-foreground hover:text-background p-2"
              data-testid="edit-topic-button"
            >
              <NotePencil size={18} weight="bold" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTopic(topic.id)}
              className="rounded-none hover:bg-destructive hover:text-destructive-foreground p-2"
              data-testid="delete-topic-button"
            >
              <Trash size={18} weight="bold" />
            </Button>
          </div>
        </div>

        {/* Status Selector */}
        <div className="mb-4">
          <Label className="text-xs tracking-[0.2em] uppercase font-bold mb-2 block">
            STATUS
          </Label>
          <Select value={topic.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="rounded-none border-border" data-testid="status-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border">
              {Object.entries(statusConfig).map(([value, config]) => {
                const Icon = config.icon;
                return (
                  <SelectItem key={value} value={value} className="rounded-none" data-testid={`status-option-${value}`}>
                    <div className="flex items-center gap-2">
                      <Icon size={16} weight="bold" className={config.color} />
                      {config.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Notes Preview */}
        {topic.notes && (
          <div className="mb-4">
            <Label className="text-xs tracking-[0.2em] uppercase font-bold mb-2 block">
              NOTES
            </Label>
            <p className="text-sm text-muted-foreground line-clamp-2" data-testid="topic-notes">
              {topic.notes}
            </p>
          </div>
        )}

        {/* Problem Link */}
        {topic.problem_link && (
          <a
            href={topic.problem_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-foreground transition-colors"
            data-testid="topic-link"
          >
            <LinkIcon size={16} weight="bold" />
            View Problem
          </a>
        )}

        {/* Review Info */}
        {topic.next_review && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Next review: {new Date(topic.next_review).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="rounded-none border-border" data-testid="edit-topic-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-sans">EDIT TOPIC</DialogTitle>
            <DialogDescription className="text-xs tracking-[0.2em] uppercase">
              {topic.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs tracking-[0.2em] uppercase font-bold mb-2 block">
                PROBLEM LINK
              </Label>
              <Input
                value={editData.problem_link}
                onChange={(e) => setEditData({ ...editData, problem_link: e.target.value })}
                placeholder="https://leetcode.com/problems/..."
                className="rounded-none border-border"
                data-testid="edit-problem-link-input"
              />
            </div>
            <div>
              <Label className="text-xs tracking-[0.2em] uppercase font-bold mb-2 block">
                NOTES
              </Label>
              <Textarea
                value={editData.notes}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                placeholder="Add your notes here..."
                rows={6}
                className="rounded-none border-border font-mono"
                data-testid="edit-notes-textarea"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="rounded-none border-border hover:bg-foreground hover:text-background"
                data-testid="cancel-edit-button"
              >
                CANCEL
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="rounded-none bg-primary hover:bg-foreground hover:text-background"
                data-testid="save-edit-button"
              >
                SAVE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}