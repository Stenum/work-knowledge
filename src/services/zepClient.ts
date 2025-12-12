import { loadBeliefs, loadDocuments, saveBeliefs, saveDocuments } from '@/lib/storage';
import { Belief, IngestedDocument } from '@/types/memory';
import { v4 as uuid } from 'uuid';

// REQ-D-001, REQ-C-042 idempotent ingestion
export async function ingestDocument(doc: IngestedDocument) {
  const docs = loadDocuments();
  const existing = docs.find(
    (d) => d.source === doc.source && d.sourceId === doc.sourceId && d.version === doc.version,
  );
  if (!existing) {
    docs.push(doc);
    saveDocuments(docs);
  }
  return doc;
}

// REQ-D-002 query memory
export async function searchBeliefs(query: string, recentDays?: number): Promise<Belief[]> {
  const beliefs = loadBeliefs();
  const lower = query.toLowerCase();
  const threshold = recentDays ? Date.now() - recentDays * 24 * 60 * 60 * 1000 : undefined;
  return beliefs.filter((belief) => {
    const match = belief.text.toLowerCase().includes(lower);
    if (!threshold || !belief.timestamp) return match;
    return match && new Date(belief.timestamp).getTime() >= threshold;
  });
}

export async function upsertBeliefsFromDocuments(doc: IngestedDocument[]) {
  const beliefs = loadBeliefs();
  doc.forEach((d) => {
    const existing = beliefs.find((b) => b.relatedDocumentId === d.sourceId);
    if (!existing) {
      beliefs.push({
        id: uuid(),
        text: d.subject || d.content.slice(0, 140),
        source: d.source,
        timestamp: d.timestamp,
        confidence: 0.6,
        status: d.status || 'pending',
        relatedDocumentId: d.sourceId,
      });
    }
  });
  saveBeliefs(beliefs);
  return beliefs;
}

// REQ-F-010, REQ-F-011
export async function updateBeliefStatus(id: string, status: 'accepted' | 'rejected') {
  const beliefs = loadBeliefs();
  const index = beliefs.findIndex((b) => b.id === id);
  if (index >= 0) {
    beliefs[index].status = status;
    saveBeliefs(beliefs);
    return beliefs[index];
  }
  throw new Error('Belief not found');
}

export async function correctBelief(id: string, correctedText: string) {
  const beliefs = loadBeliefs();
  const index = beliefs.findIndex((b) => b.id === id);
  if (index >= 0) {
    beliefs[index].text = correctedText;
    beliefs[index].status = 'accepted';
    saveBeliefs(beliefs);
    return beliefs[index];
  }
  const newBelief: Belief = {
    id: uuid(),
    text: correctedText,
    confidence: 1,
    status: 'accepted',
  };
  beliefs.push(newBelief);
  saveBeliefs(beliefs);
  return newBelief;
}

export async function listBeliefsForTopic(topic: string) {
  return searchBeliefs(topic);
}
