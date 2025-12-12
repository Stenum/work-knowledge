export type SourceType = 'teams' | 'email' | 'calendar' | 'manual';

export interface IngestedDocument {
  source: SourceType;
  sourceId: string;
  timestamp: string;
  ingestedAt: string;
  participants?: string[];
  subject?: string;
  url?: string;
  content: string;
  version?: string;
  status?: 'pending' | 'accepted' | 'rejected';
}

export interface Belief {
  id: string;
  text: string;
  source?: SourceType;
  timestamp?: string;
  confidence: number;
  status?: 'pending' | 'accepted' | 'rejected';
  relatedDocumentId?: string;
}

export interface SubscriptionState {
  id: string;
  resource: string;
  expiresOn: string;
}
