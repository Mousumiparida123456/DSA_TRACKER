import { Link as LinkIcon, Circle, CircleDashed, CheckCircle } from "@phosphor-icons/react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function TopicTable({ topics, updateTopic, selectedIds, setSelectedIds }) {
  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === topics.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(topics.map(t => t.id));
    }
  };

  const handleStatusChange = async (topicId, newStatus) => {
    await updateTopic(topicId, { status: newStatus });
  };

  return (
    <div className="border border-border overflow-x-auto" data-testid="topics-table">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-foreground text-background">
            <th className="p-3 w-10">
              <Checkbox
                checked={topics.length > 0 && selectedIds.length === topics.length}
                onCheckedChange={toggleAll}
                className="border-background data-[state=checked]:bg-background data-[state=checked]:text-foreground"
                data-testid="select-all-checkbox"
              />
            </th>
            <th className="p-3 text-xs tracking-[0.2em] uppercase font-bold">PROBLEM</th>
            <th className="p-3 text-xs tracking-[0.2em] uppercase font-bold">PATTERN</th>
            <th className="p-3 text-xs tracking-[0.2em] uppercase font-bold">DIFFICULTY</th>
            <th className="p-3 text-xs tracking-[0.2em] uppercase font-bold w-[180px]">STATUS</th>
            <th className="p-3 text-xs tracking-[0.2em] uppercase font-bold w-10">LINK</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((topic, idx) => {
            const isSelected = selectedIds.includes(topic.id);
            const StatusIcon = statusConfig[topic.status].icon;
            return (
              <tr
                key={topic.id}
                className={`border-t border-border transition-colors ${
                  isSelected ? 'bg-[#002FA7]/5' : idx % 2 === 0 ? 'bg-white' : 'bg-card'
                } hover:bg-[#002FA7]/5`}
                data-testid="topic-table-row"
              >
                <td className="p-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelect(topic.id)}
                    data-testid="topic-checkbox"
                  />
                </td>
                <td className="p-3">
                  <span className="font-semibold text-sm" data-testid="topic-name">{topic.name}</span>
                </td>
                <td className="p-3">
                  <span className="text-xs tracking-[0.15em] uppercase font-bold px-2 py-1 bg-secondary border border-border inline-block" data-testid="topic-category">
                    {topic.category}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-xs tracking-[0.15em] uppercase font-bold px-2 py-1 inline-block ${difficultyColors[topic.difficulty]}`} data-testid="topic-difficulty">
                    {topic.difficulty}
                  </span>
                </td>
                <td className="p-3">
                  <Select value={topic.status} onValueChange={(val) => handleStatusChange(topic.id, val)}>
                    <SelectTrigger className="rounded-none border-border h-8 text-xs" data-testid="status-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-border">
                      {Object.entries(statusConfig).map(([value, config]) => {
                        const Icon = config.icon;
                        return (
                          <SelectItem key={value} value={value} className="rounded-none text-xs">
                            <div className="flex items-center gap-2">
                              <Icon size={14} weight="bold" className={config.color} />
                              {config.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3 text-center">
                  {topic.problem_link && (
                    <a
                      href={topic.problem_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-foreground transition-colors"
                      data-testid="topic-link"
                    >
                      <LinkIcon size={18} weight="bold" />
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
