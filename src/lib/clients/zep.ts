import { BeliefRecord, DocumentEnvelope } from "@/lib/types/documents";

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: Date;
}

export class ZepClient {
  private readonly beliefStore: Map<string, BeliefRecord> = new Map();

  constructor(private readonly apiKey = process.env.ZEP_API_KEY ?? "demo-key") {}

  async sendChatMessage(prompt: string): Promise<ChatMessage> {
    return {
      id: crypto.randomUUID(),
      content: `Zep stub response to: ${prompt}`,
      createdAt: new Date(),
    };
  }

  async fetchNotes(): Promise<ChatMessage[]> {
    return [
      {
        id: "note-1",
        content: "Stubbed note pulled from the Zep client.",
        createdAt: new Date(),
      },
    ];
  }

  async upsertDocuments(documents: DocumentEnvelope[]) {
    let deduped = 0;

    documents.forEach((doc) => {
      const confidence = Math.min(1, 0.6 + doc.content.length / 1000);
      const freshness = Math.max(0, 1 - (Date.now() - Date.parse(doc.updatedAt)) / (1000 * 60 * 60 * 24 * 14));
      const belief: BeliefRecord = {
        id: doc.id,
        subject: doc.subject,
        content: doc.content,
        confidence,
        freshness,
        stale: freshness < 0.5,
        sourceUrl: doc.url,
        updatedAt: doc.updatedAt,
      };

      if (this.beliefStore.has(doc.id)) {
        deduped += 1;
      }

      this.beliefStore.set(doc.id, belief);
    });

    return { inserted: documents.length - deduped, deduped };
  }

  async queryBeliefs(prompt: string): Promise<BeliefRecord[]> {
    return Array.from(this.beliefStore.values()).filter((belief) =>
      belief.subject.toLowerCase().includes(prompt.toLowerCase()) ||
      belief.content.toLowerCase().includes(prompt.toLowerCase())
    );
  }

  async listBeliefs() {
    return Array.from(this.beliefStore.values());
  }

  async verifyBelief(beliefId: string, accepted: boolean, reason?: string) {
    const belief = this.beliefStore.get(beliefId);
    if (!belief) {
      throw new Error(`Belief ${beliefId} not found`);
    }

    this.beliefStore.set(beliefId, {
      ...belief,
      confidence: accepted ? Math.min(1, belief.confidence + 0.1) : Math.max(0, belief.confidence - 0.2),
      stale: !accepted,
    });

    return { verified: accepted, beliefId, reason };
  }

  async correctBelief(beliefId: string, correction: string) {
    const belief = this.beliefStore.get(beliefId);
    if (!belief) {
      throw new Error(`Belief ${beliefId} not found`);
    }

    const updated = {
      ...belief,
      content: correction,
      updatedAt: new Date().toISOString(),
      freshness: 1,
      stale: false,
    };

    this.beliefStore.set(beliefId, updated);
    return updated;
  }
}

export const sharedZepClient = new ZepClient();
