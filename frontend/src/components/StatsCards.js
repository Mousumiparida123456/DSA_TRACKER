import { CheckCircle, Circle, CircleDashed, TrendUp } from "@phosphor-icons/react";
import { Progress } from "@/components/ui/progress";

export default function StatsCards({ stats }) {
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const cards = [
    {
      label: "TOTAL",
      value: stats.total,
      icon: Circle,
      color: "text-foreground",
      testId: "stat-total"
    },
    {
      label: "COMPLETED",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-[#00C853]",
      testId: "stat-completed"
    },
    {
      label: "IN PROGRESS",
      value: stats.in_progress,
      icon: CircleDashed,
      color: "text-[#002FA7]",
      testId: "stat-in-progress"
    },
    {
      label: "NOT STARTED",
      value: stats.not_started,
      icon: Circle,
      color: "text-muted-foreground",
      testId: "stat-not-started"
    }
  ];

  return (
    <div className="space-y-4" data-testid="stats-cards">
      {/* Overall Progress Bar */}
      <div className="border border-border bg-card p-6" data-testid="overall-progress">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <TrendUp size={24} weight="bold" className="text-[#002FA7]" />
            <span className="text-xs tracking-[0.2em] uppercase font-bold text-muted-foreground">
              OVERALL PROGRESS
            </span>
          </div>
          <span className="text-2xl font-black font-sans" data-testid="overall-progress-pct">
            {pct}%
          </span>
        </div>
        <div className="w-full bg-[#E0E0E0] h-3">
          <div
            className="h-3 transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background: pct === 100 ? '#00C853' : '#002FA7'
            }}
            data-testid="overall-progress-bar"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {stats.completed} of {stats.total} problems completed
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="border border-border bg-card p-5 hover:-translate-y-1 hover:shadow-lg transition-all"
              data-testid={card.testId}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs tracking-[0.2em] uppercase font-bold text-muted-foreground">
                  {card.label}
                </p>
                <Icon size={22} weight="bold" className={card.color} />
              </div>
              <p className="text-3xl font-black font-sans" data-testid={`${card.testId}-value`}>{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
