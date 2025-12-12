export type DocumentSource = "teams" | "outlook" | "calendar" | "manual";

export interface DocumentEnvelope {
  id: string;
  source: DocumentSource;
  subject: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  url: string;
  metadata?: Record<string, string>;
}

export interface BeliefRecord {
  id: string;
  subject: string;
  content: string;
  confidence: number;
  freshness: number;
  stale: boolean;
  sourceUrl?: string;
  updatedAt: string;
}
