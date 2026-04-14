export default function CategoryProgress({ categoryProgress, setFilters }) {
  if (!categoryProgress || Object.keys(categoryProgress).length === 0) return null;

  const sorted = Object.entries(categoryProgress).sort((a, b) => {
    const pctA = a[1].total > 0 ? a[1].completed / a[1].total : 0;
    const pctB = b[1].total > 0 ? b[1].completed / b[1].total : 0;
    return pctB - pctA;
  });

  return (
    <div className="border border-border bg-card p-6" data-testid="category-progress">
      <h2 className="text-2xl sm:text-3xl tracking-tight font-bold font-sans mb-1">
        PATTERN PROGRESS
      </h2>
      <p className="text-xs tracking-[0.2em] uppercase font-bold text-muted-foreground mb-6">
        {sorted.length} PATTERNS
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        {sorted.map(([cat, data]) => {
          const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
          const inProgressPct = data.total > 0 ? Math.round((data.in_progress / data.total) * 100) : 0;

          return (
            <button
              key={cat}
              onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
              className="text-left group"
              data-testid={`category-progress-${cat}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold group-hover:text-[#002FA7] transition-colors">
                  {cat}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  <span className="text-[#00C853] font-bold">{data.completed}</span>
                  {data.in_progress > 0 && (
                    <span className="text-[#002FA7] font-bold"> + {data.in_progress}</span>
                  )}
                  <span> / {data.total}</span>
                </span>
              </div>
              <div className="w-full bg-[#E0E0E0] h-2.5 flex overflow-hidden">
                <div
                  className="h-2.5 transition-all duration-500"
                  style={{ width: `${pct}%`, background: '#00C853' }}
                />
                <div
                  className="h-2.5 transition-all duration-500"
                  style={{ width: `${inProgressPct}%`, background: '#002FA7' }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
