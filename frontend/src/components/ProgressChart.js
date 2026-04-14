import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  easy: "#00C853",
  medium: "#FFD700",
  hard: "#FF0000",
  completed: "#00C853",
  in_progress: "#002FA7",
  not_started: "#E0E0E0"
};

const renderLabel = ({ name, percent }) => {
  if (percent === 0) return null;
  return `${name}: ${(percent * 100).toFixed(0)}%`;
};

export default function ProgressChart({ stats }) {
  const difficultyData = [
    { name: "Easy", value: stats.by_difficulty.easy, fill: COLORS.easy },
    { name: "Medium", value: stats.by_difficulty.medium, fill: COLORS.medium },
    { name: "Hard", value: stats.by_difficulty.hard, fill: COLORS.hard }
  ].filter(d => d.value > 0);

  const statusData = [
    { name: "Completed", value: stats.completed, fill: COLORS.completed },
    { name: "In Progress", value: stats.in_progress, fill: COLORS.in_progress },
    { name: "Not Started", value: stats.not_started, fill: COLORS.not_started }
  ].filter(d => d.value > 0);

  return (
    <div className="border border-border bg-card p-6" data-testid="progress-chart">
      <h2 className="text-2xl sm:text-3xl tracking-tight font-bold font-sans mb-6">
        DISTRIBUTION
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div data-testid="difficulty-chart">
          <h3 className="text-xs tracking-[0.2em] uppercase font-bold mb-4 text-muted-foreground">
            BY DIFFICULTY
          </h3>
          {difficultyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={75}
                  dataKey="value"
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              No data yet
            </div>
          )}
        </div>

        <div data-testid="status-chart">
          <h3 className="text-xs tracking-[0.2em] uppercase font-bold mb-4 text-muted-foreground">
            BY STATUS
          </h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={75}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              No data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
