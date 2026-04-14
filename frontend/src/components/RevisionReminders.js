import { Bell, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function RevisionReminders({ reminders, markReviewed, updateTopic }) {
  const handleMarkReviewed = async (topicId) => {
    await markReviewed(topicId);
  };

  const handleReopen = async (topic) => {
    await updateTopic(topic.id, { status: "in_progress" });
  };

  return (
    <div className="border-2 border-[#FF0000] bg-[#FFF5F5] p-6" data-testid="revision-reminders">
      <div className="flex items-center gap-3 mb-4">
        <Bell size={24} weight="bold" className="text-[#FF0000]" />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#FF0000]">
            REVISION REMINDERS
          </h2>
          <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#CC0000]">
            {reminders.length} {reminders.length === 1 ? 'TOPIC' : 'TOPICS'} DUE FOR REVIEW
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="reminders-grid">
        {reminders.map((topic) => (
          <div
            key={topic.id}
            className="border border-[#FF0000] bg-white p-4"
            data-testid="reminder-card"
          >
            <h3 className="font-semibold mb-2" data-testid="reminder-topic-name">{topic.name}</h3>
            <div className="flex gap-2 mb-3">
              <span className="text-xs tracking-[0.2em] uppercase font-bold px-2 py-1 bg-secondary border border-border">
                {topic.category}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Due: {new Date(topic.next_review).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleMarkReviewed(topic.id)}
                size="sm"
                className="rounded-none bg-[#00C853] hover:bg-[#00A045] text-white flex-1"
                data-testid="mark-reviewed-button"
              >
                <CheckCircle size={16} weight="bold" className="mr-2" />
                REVIEWED
              </Button>
              <Button
                onClick={() => handleReopen(topic)}
                size="sm"
                variant="outline"
                className="rounded-none border-border hover:bg-foreground hover:text-background"
                data-testid="reopen-topic-button"
              >
                REOPEN
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}