import { CheckCircle, Circle, CircleDashed } from "@phosphor-icons/react";

export default function StatsCards({ stats }) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="stats-cards">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="border border-border bg-card p-6 hover:-translate-y-1 hover:shadow-lg transition-all"
            data-testid={card.testId}
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs tracking-[0.2em] uppercase font-bold text-muted-foreground">
                {card.label}
              </p>
              <Icon size={24} weight="bold" className={card.color} />
            </div>
            <p className="text-4xl font-black font-sans" data-testid={`${card.testId}-value`}>{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}