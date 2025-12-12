import { type ManualIngestRequest } from "@/lib/schemas/ingest";
import { type ValidateBeliefRequest } from "@/lib/schemas/validate";

type Source = "teams" | "email" | "calendar" | "manual";

type BeliefStatus = "pending" | "accepted" | "rejected";

export interface Belief {
  id: string;
  text: string;
  source: Source;
  sourceId: string;
  timestamp: string;
  ingestedAt: string;
  participants?: string[];
  subject?: string;
  url?: string;
  status: BeliefStatus;
}

const beliefs: Belief[] = [
  {
    id: "seed-1",
    text: "Weekly sync with the design team is scheduled for Fridays at 10am.",
    source: "calendar",
    sourceId: "cal-1",
    timestamp: new Date().toISOString(),
    ingestedAt: new Date().toISOString(),
    participants: ["ask@example.com", "design@example.com"],
    status: "pending",
  },
  {
    id: "seed-2",
    text: "Ask committed to sharing the Q4 hiring plan with leadership.",
    source: "teams",
    sourceId: "teams-1",
    timestamp: new Date().toISOString(),
    ingestedAt: new Date().toISOString(),
    participants: ["ask@example.com", "leadership@example.com"],
    status: "pending",
  },
];

function addBelief(belief: Belief) {
  beliefs.unshift(belief);
}

export async function ingestManualNote(request: ManualIngestRequest) {
  const now = new Date().toISOString();
  const belief: Belief = {
    id: crypto.randomUUID(),
    text: request.note,
    source: "manual",
    sourceId: crypto.randomUUID(),
    timestamp: now,
    ingestedAt: now,
    status: "pending",
  };
  addBelief(belief);
  return belief;
}

export async function queryMemory(topic?: string) {
  if (!topic) return beliefs;
  return beliefs.filter((belief) => belief.text.toLowerCase().includes(topic.toLowerCase()));
}

export async function fetchRecentContext() {
  return beliefs.slice(0, 3);
}

export async function validateBelief(request: ValidateBeliefRequest) {
  const belief = beliefs.find((entry) => entry.id === request.beliefId);
  if (!belief) return null;

  if (request.action === "accept") {
    belief.status = "accepted";
  }

  if (request.action === "reject") {
    belief.status = "rejected";
  }

  if (request.action === "correct" && request.correctedText) {
    belief.text = request.correctedText;
    belief.status = "accepted";
  }

  return belief;
}
