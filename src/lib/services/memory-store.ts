export type Source = "teams" | "email" | "calendar" | "manual";

export type BeliefStatus = "pending" | "accepted" | "rejected" | "corrected";

export interface IngestedDocument {
  id: string;
  source: Source;
  sourceId: string;
  version: string;
  timestamp: string;
  ingestedAt: string;
  participants?: string[];
  subject?: string;
  url?: string;
  content: string;
  status: BeliefStatus;
  topicHints?: string[];
}

interface IngestionQueueItem {
  correlationId: string;
  document: IngestedDocument;
  attempts: number;
  lastError?: string;
}

class MemoryStore {
  private beliefs: IngestedDocument[] = [];
  private queue: IngestionQueueItem[] = [];

  constructor() {
    const now = new Date().toISOString();
    this.beliefs.push(
      {
        id: "seed-1",
        source: "calendar",
        sourceId: "cal-1",
        version: "1",
        timestamp: now,
        ingestedAt: now,
        participants: ["ask@example.com", "design@example.com"],
        subject: "Weekly design sync",
        url: "https://contoso.com/calendar/event/cal-1",
        content: "Weekly sync with the design team is scheduled for Fridays at 10am.",
        status: "pending",
        topicHints: ["design", "sync", "schedule"],
      },
      {
        id: "seed-2",
        source: "teams",
        sourceId: "teams-1",
        version: "1",
        timestamp: now,
        ingestedAt: now,
        participants: ["ask@example.com", "leadership@example.com"],
        subject: "Hiring plan follow-up",
        url: "https://contoso.com/teams/chat/teams-1",
        content: "Ask committed to sharing the Q4 hiring plan with leadership.",
        status: "pending",
        topicHints: ["hiring", "leadership", "plan"],
      }
    );
  }

  upsert(document: IngestedDocument) {
    const existingIndex = this.beliefs.findIndex(
      (belief) =>
        belief.source === document.source &&
        belief.sourceId === document.sourceId &&
        belief.version === document.version
    );

    if (existingIndex >= 0) {
      this.beliefs[existingIndex] = { ...document };
    } else {
      this.beliefs.unshift({ ...document });
    }

    return document;
  }

  enqueue(document: IngestedDocument, correlationId: string, error?: string) {
    this.queue.push({ correlationId, document, attempts: 1, lastError: error });
  }

  retryQueued(maxAttempts = 3) {
    const remaining: IngestionQueueItem[] = [];
    for (const item of this.queue) {
      if (item.attempts >= maxAttempts) {
        remaining.push(item);
        continue;
      }
      try {
        this.upsert(item.document);
      } catch (error) {
        remaining.push({
          ...item,
          attempts: item.attempts + 1,
          lastError: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
    this.queue = remaining;
  }

  query(topic?: string, recentDays?: number) {
    const now = Date.now();
    const filtered = this.beliefs.filter((belief) => {
      if (recentDays) {
        const threshold = now - recentDays * 24 * 60 * 60 * 1000;
        if (new Date(belief.timestamp).getTime() < threshold) {
          return false;
        }
      }

      if (!topic) return true;
      const normalizedTopic = topic.toLowerCase();
      return (
        belief.content.toLowerCase().includes(normalizedTopic) ||
        belief.subject?.toLowerCase().includes(normalizedTopic) ||
        belief.topicHints?.some((hint) => hint.toLowerCase().includes(normalizedTopic))
      );
    });

    return filtered;
  }

  recent(limit = 5) {
    return this.beliefs.slice(0, limit);
  }

  updateStatus(id: string, status: BeliefStatus, correctedText?: string) {
    const belief = this.beliefs.find((item) => item.id === id);
    if (!belief) return null;

    belief.status = status;
    if (correctedText) {
      belief.content = correctedText;
    }
    if (status === "corrected" && !correctedText) {
      belief.status = "accepted";
    }
    return belief;
  }
}

export const memoryStore = new MemoryStore();
