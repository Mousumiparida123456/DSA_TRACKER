import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = {
  easy: "#00C853",
  medium: "#FFD700",
  hard: "#FF0000",
  completed: "#00C853",
  in_progress: "#002FA7",
  not_started: "#E0E0E0"
};

export default function ProgressChart({ stats }) {
  const difficultyData = [
    { name: "Easy", value: stats.by_difficulty.easy, fill: COLORS.easy },
    { name: "Medium", value: stats.by_difficulty.medium, fill: COLORS.medium },
    { name: "Hard", value: stats.by_difficulty.hard, fill: COLORS.hard }
  ];

  const statusData = [
    { name: "Completed", value: stats.completed, fill: COLORS.completed },
    { name: "In Progress", value: stats.in_progress, fill: COLORS.in_progress },
    { name: "Not Started", value: stats.not_started, fill: COLORS.not_started }
  ];

  const categoryData = Object.entries(stats.by_category).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="border border-border bg-card p-6" data-testid="progress-chart">
      <h2 className="text-2xl sm:text-3xl tracking-tight font-bold font-sans mb-6">
        PROGRESS OVERVIEW
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Difficulty Distribution */}
        <div data-testid="difficulty-chart">
          <h3 className="text-xs tracking-[0.2em] uppercase font-bold mb-4 text-muted-foreground">
            BY DIFFICULTY
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div data-testid="status-chart">
          <h3 className="text-xs tracking-[0.2em] uppercase font-bold mb-4 text-muted-foreground">
            BY STATUS
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        {categoryData.length > 0 && (
          <div className="lg:col-span-2" data-testid="category-chart">
            <h3 className="text-xs tracking-[0.2em] uppercase font-bold mb-4 text-muted-foreground">
              BY CATEGORY
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={120}
                  style={{ fontSize: '10px', fontFamily: 'IBM Plex Mono' }}
                />
                <YAxis style={{ fontSize: '12px', fontFamily: 'IBM Plex Mono' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#002FA7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}