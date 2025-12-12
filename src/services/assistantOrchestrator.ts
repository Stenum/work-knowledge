import { respondWithContext } from './llmClient';
import { searchBeliefs, upsertBeliefsFromDocuments, ingestDocument } from './zepClient';
import { IngestedDocument } from '@/types/memory';
import { llmConfig } from '@/lib/config';

// REQ-E-010 message handling
export async function handleChat(message: string, recentDays?: number) {
  const beliefs = await searchBeliefs(message, recentDays ?? llmConfig.recentDaysDefault);
  const response = await respondWithContext(message, beliefs);
  return { response, beliefs };
}

// REQ-C-020 manual note ingestion
export async function ingestManual(content: string) {
  const doc: IngestedDocument = {
    source: 'manual',
    sourceId: `manual-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ingestedAt: new Date().toISOString(),
    content,
    subject: content.slice(0, 60),
  };
  await ingestDocument(doc);
  await upsertBeliefsFromDocuments([doc]);
  return doc;
}
