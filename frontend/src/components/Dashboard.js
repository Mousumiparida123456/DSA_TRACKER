import { useState } from "react";
import { 
  Plus, 
  FunnelSimple, 
  Circle, 
  SortAscending,
  SortDescending,
  SquaresFour,
  List,
  CheckSquare,
  X
} from "@phosphor-icons/react";
import StatsCards from "./StatsCards";
import TopicCard from "./TopicCard";
import TopicTable from "./TopicTable";
import AddTopicDialog from "./AddTopicDialog";
import FilterBar from "./FilterBar";
import RevisionReminders from "./RevisionReminders";
import CategoryProgress from "./CategoryProgress";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard({
  topics,
  stats,
  reminders,
  loading,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  addTopic,
  updateTopic,
  deleteTopic,
  markReviewed,
  bulkUpdateStatus
}) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [selectedIds, setSelectedIds] = useState([]);

  const handleBulkAction = async (status) => {
    if (selectedIds.length === 0) return;
    await bulkUpdateStatus(selectedIds, status);
    setSelectedIds([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-state">
        <div className="text-lg font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="dashboard">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl tracking-tighter font-black font-sans" data-testid="dashboard-title">
                DSA TRACKER
              </h1>
              <p className="text-xs tracking-[0.2em] uppercase font-bold text-muted-foreground mt-1">
                DATA STRUCTURES & ALGORITHMS
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "default" : "outline"}
                className="rounded-none border-border hover:bg-foreground hover:text-background transition-colors"
                data-testid="toggle-filters-button"
              >
                <FunnelSimple size={20} weight="bold" className="mr-2" />
                FILTERS
              </Button>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="rounded-none bg-primary hover:bg-primary-foreground hover:text-primary border border-border transition-colors"
                data-testid="add-topic-button"
              >
                <Plus size={20} weight="bold" className="mr-2" />
                ADD TOPIC
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        {/* Filter Bar */}
        {showFilters && (
          <FilterBar filters={filters} setFilters={setFilters} />
        )}

        {/* Stats Cards */}
        {stats && <StatsCards stats={stats} />}

        {/* Revision Reminders */}
        {reminders && reminders.length > 0 && (
          <RevisionReminders 
            reminders={reminders} 
            markReviewed={markReviewed}
            updateTopic={updateTopic}
          />
        )}

        {/* Category Progress */}
        {stats && stats.category_progress && (
          <CategoryProgress 
            categoryProgress={stats.category_progress} 
            setFilters={setFilters}
          />
        )}

        {/* Topics Section Header */}
        <div>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl tracking-tight font-bold font-sans mb-1" data-testid="topics-section-title">
                ALL TOPICS
              </h2>
              <p className="text-xs tracking-[0.2em] uppercase font-bold text-muted-foreground">
                {topics.length} {topics.length === 1 ? 'TOPIC' : 'TOPICS'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex border border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className={`rounded-none px-3 ${viewMode === 'table' ? 'bg-foreground text-background' : 'hover:bg-foreground hover:text-background'}`}
                  data-testid="view-table-button"
                >
                  <List size={18} weight="bold" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-none px-3 ${viewMode === 'grid' ? 'bg-foreground text-background' : 'hover:bg-foreground hover:text-background'}`}
                  data-testid="view-grid-button"
                >
                  <SquaresFour size={18} weight="bold" />
                </Button>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-xs tracking-[0.2em] uppercase font-bold text-muted-foreground whitespace-nowrap hidden sm:inline">SORT BY</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="rounded-none border-border w-[140px]" data-testid="sort-by-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-border">
                    <SelectItem value="created_at" className="rounded-none" data-testid="sort-date-added">Date Added</SelectItem>
                    <SelectItem value="name" className="rounded-none" data-testid="sort-name">Name</SelectItem>
                    <SelectItem value="difficulty" className="rounded-none" data-testid="sort-difficulty">Difficulty</SelectItem>
                    <SelectItem value="category" className="rounded-none" data-testid="sort-category">Category</SelectItem>
                    <SelectItem value="status" className="rounded-none" data-testid="sort-status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="rounded-none border-border hover:bg-foreground hover:text-background transition-colors px-3"
                data-testid="sort-order-button"
              >
                {sortOrder === "asc" ? (
                  <SortAscending size={18} weight="bold" />
                ) : (
                  <SortDescending size={18} weight="bold" />
                )}
              </Button>
            </div>
          </div>

          {/* Bulk Action Bar */}
          {selectedIds.length > 0 && (
            <div className="border-2 border-[#002FA7] bg-[#002FA7]/5 p-4 mb-4 flex items-center justify-between flex-wrap gap-3" data-testid="bulk-action-bar">
              <div className="flex items-center gap-3">
                <CheckSquare size={20} weight="bold" className="text-[#002FA7]" />
                <span className="text-sm font-bold">
                  {selectedIds.length} {selectedIds.length === 1 ? 'TOPIC' : 'TOPICS'} SELECTED
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleBulkAction("completed")}
                  className="rounded-none bg-[#00C853] hover:bg-[#00A045] text-white"
                  data-testid="bulk-mark-completed"
                >
                  MARK COMPLETED
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkAction("in_progress")}
                  className="rounded-none bg-[#002FA7] hover:bg-[#001A66] text-white"
                  data-testid="bulk-mark-in-progress"
                >
                  MARK IN PROGRESS
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkAction("not_started")}
                  variant="outline"
                  className="rounded-none border-border hover:bg-foreground hover:text-background"
                  data-testid="bulk-mark-not-started"
                >
                  MARK NOT STARTED
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedIds([])}
                  className="rounded-none hover:bg-foreground hover:text-background px-2"
                  data-testid="clear-selection-button"
                >
                  <X size={18} weight="bold" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Topics View */}
        {topics.length === 0 ? (
          <div className="border border-border bg-card p-12 text-center" data-testid="empty-state">
            <Circle size={64} weight="thin" className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No topics found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or add a new topic</p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="rounded-none bg-primary hover:bg-foreground hover:text-background transition-colors"
              data-testid="empty-state-add-button"
            >
              <Plus size={20} weight="bold" className="mr-2" />
              ADD TOPIC
            </Button>
          </div>
        ) : viewMode === "table" ? (
          <TopicTable
            topics={topics}
            updateTopic={updateTopic}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="topics-grid">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                updateTopic={updateTopic}
                deleteTopic={deleteTopic}
              />
            ))}
          </div>
        )}
      </main>

      <AddTopicDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        addTopic={addTopic}
      />
    </div>
  );
}
