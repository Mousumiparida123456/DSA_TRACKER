import { useState } from "react";
import { 
  ChartBar, 
  Plus, 
  FunnelSimple, 
  Bell, 
  CheckCircle, 
  Circle, 
  CircleDashed,
  SortAscending,
  SortDescending
} from "@phosphor-icons/react";
import StatsCards from "./StatsCards";
import TopicCard from "./TopicCard";
import AddTopicDialog from "./AddTopicDialog";
import FilterBar from "./FilterBar";
import RevisionReminders from "./RevisionReminders";
import ProgressChart from "./ProgressChart";
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
  markReviewed
}) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl tracking-tighter font-black font-sans" data-testid="dashboard-title">
                DSA TRACKER
              </h1>
              <p className="text-xs tracking-[0.2em] uppercase font-bold text-muted-foreground mt-2">
                DATA STRUCTURES & ALGORITHMS
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
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

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Filter Bar */}
        {showFilters && (
          <div className="mb-8">
            <FilterBar filters={filters} setFilters={setFilters} />
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="mb-8">
            <StatsCards stats={stats} />
          </div>
        )}

        {/* Revision Reminders */}
        {reminders && reminders.length > 0 && (
          <div className="mb-8">
            <RevisionReminders 
              reminders={reminders} 
              markReviewed={markReviewed}
              updateTopic={updateTopic}
            />
          </div>
        )}

        {/* Progress Chart */}
        {stats && (
          <div className="mb-8">
            <ProgressChart stats={stats} />
          </div>
        )}

        {/* Topics Grid */}
        <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl tracking-tight font-bold font-sans mb-1" data-testid="topics-section-title">
              ALL TOPICS
            </h2>
            <p className="text-xs tracking-[0.2em] uppercase font-bold text-muted-foreground">
              {topics.length} {topics.length === 1 ? 'TOPIC' : 'TOPICS'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-[0.2em] uppercase font-bold text-muted-foreground whitespace-nowrap">SORT BY</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="rounded-none border-border w-[160px]" data-testid="sort-by-select">
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
                <SortAscending size={20} weight="bold" />
              ) : (
                <SortDescending size={20} weight="bold" />
              )}
            </Button>
          </div>
        </div>

        {topics.length === 0 ? (
          <div className="border border-border bg-card p-12 text-center" data-testid="empty-state">
            <Circle size={64} weight="thin" className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No topics yet</h3>
            <p className="text-muted-foreground mb-6">Start by adding your first DSA topic</p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="rounded-none bg-primary hover:bg-foreground hover:text-background transition-colors"
              data-testid="empty-state-add-button"
            >
              <Plus size={20} weight="bold" className="mr-2" />
              ADD FIRST TOPIC
            </Button>
          </div>
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