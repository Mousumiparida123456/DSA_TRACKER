import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
const statuses = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" }
];

export default function FilterBar({ filters, setFilters }) {
  const handleClearFilters = () => {
    setFilters({ category: "", difficulty: "", status: "", search: "" });
  };

  const hasActiveFilters = filters.category || filters.difficulty || filters.status || filters.search;

  return (
    <div className="border border-border bg-card p-6" data-testid="filter-bar">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold font-sans">FILTERS</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="rounded-none hover:bg-foreground hover:text-background"
            data-testid="clear-filters-button"
          >
            <X size={16} weight="bold" className="mr-2" />
            CLEAR ALL
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <Label className="text-xs tracking-[0.2em] uppercase font-bold mb-2 block">
            SEARCH
          </Label>
          <div className="relative">
            <MagnifyingGlass size={18} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search topics..."
              className="rounded-none border-border pl-10"
              data-testid="search-input"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <Label className="text-xs tracking-[0.2em] uppercase font-bold mb-2 block">
            CATEGORY
          </Label>
          <Select value={filters.category || "all"} onValueChange={(val) => setFilters({ ...filters, category: val === "all" ? "" : val })}>
            <SelectTrigger className="rounded-none border-border" data-testid="category-filter-select">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border">
              <SelectItem value="all" className="rounded-none" data-testid="category-filter-all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="rounded-none" data-testid={`category-filter-${cat}`}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty */}
        <div>
          <Label className="text-xs tracking-[0.2em] uppercase font-bold mb-2 block">
            DIFFICULTY
          </Label>
          <Select value={filters.difficulty || "all"} onValueChange={(val) => setFilters({ ...filters, difficulty: val === "all" ? "" : val })}>
            <SelectTrigger className="rounded-none border-border" data-testid="difficulty-filter-select">
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border">
              <SelectItem value="all" className="rounded-none" data-testid="difficulty-filter-all">All Difficulties</SelectItem>
              {difficulties.map((diff) => (
                <SelectItem key={diff} value={diff} className="rounded-none capitalize" data-testid={`difficulty-filter-${diff}`}>
                  {diff}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <Label className="text-xs tracking-[0.2em] uppercase font-bold mb-2 block">
            STATUS
          </Label>
          <Select value={filters.status || "all"} onValueChange={(val) => setFilters({ ...filters, status: val === "all" ? "" : val })}>
            <SelectTrigger className="rounded-none border-border" data-testid="status-filter-select">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border">
              <SelectItem value="all" className="rounded-none" data-testid="status-filter-all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value} className="rounded-none" data-testid={`status-filter-${status.value}`}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}