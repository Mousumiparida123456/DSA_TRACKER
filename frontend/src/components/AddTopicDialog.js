import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "Arrays", "Strings", "Linked Lists", "Stacks", "Queues",
  "Trees", "Graphs", "Dynamic Programming", "Recursion",
  "Backtracking", "Recursion & Backtracking", "Greedy", "Sorting", "Searching",
  "Binary Search", "Hashing", "Heaps", "Trie", "Bit Manipulation",
  "Two Pointers", "Sliding Window", "Intervals", "Matrix", "Design",
  "Math", "Other"
];

const difficulties = ["easy", "medium", "hard"];

export default function AddTopicDialog({ open, onOpenChange, addTopic }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Arrays",
    difficulty: "medium",
    notes: "",
    problem_link: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    await addTopic(formData);
    setFormData({
      name: "",
      category: "Arrays",
      difficulty: "medium",
      notes: "",
      problem_link: ""
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border-border max-w-2xl" data-testid="add-topic-dialog">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-sans">ADD NEW TOPIC</DialogTitle>
          <DialogDescription className="text-xs tracking-[0.2em] uppercase">
            Add a new DSA topic to track
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label className="text-xs tracking-[0.2em] uppercase font-bold mb-2 block">
              TOPIC NAME *
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Two Sum, Binary Search, etc."
              className="rounded-none border-border"
              required
              data-testid="topic-name-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs tracking-[0.2em] uppercase font-bold mb-2 block">
                CATEGORY *
              </Label>
              <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                <SelectTrigger className="rounded-none border-border" data-testid="category-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-border">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="rounded-none" data-testid={`category-option-${cat}`}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs tracking-[0.2em] uppercase font-bold mb-2 block">
                DIFFICULTY *
              </Label>
              <Select value={formData.difficulty} onValueChange={(val) => setFormData({ ...formData, difficulty: val })}>
                <SelectTrigger className="rounded-none border-border" data-testid="difficulty-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-border">
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff} className="rounded-none capitalize" data-testid={`difficulty-option-${diff}`}>
                      {diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs tracking-[0.2em] uppercase font-bold mb-2 block">
              PROBLEM LINK
            </Label>
            <Input
              value={formData.problem_link}
              onChange={(e) => setFormData({ ...formData, problem_link: e.target.value })}
              placeholder="https://leetcode.com/problems/..."
              className="rounded-none border-border"
              data-testid="problem-link-input"
            />
          </div>

          <div>
            <Label className="text-xs tracking-[0.2em] uppercase font-bold mb-2 block">
              NOTES
            </Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes, approaches, or important points..."
              rows={4}
              className="rounded-none border-border font-mono"
              data-testid="notes-textarea"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-none border-border hover:bg-foreground hover:text-background"
              data-testid="cancel-add-button"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              className="rounded-none bg-primary hover:bg-foreground hover:text-background"
              data-testid="submit-add-button"
            >
              ADD TOPIC
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}