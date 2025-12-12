import { type ManualIngestRequest } from "@/lib/schemas/ingest";
import { type ValidateBeliefRequest } from "@/lib/schemas/validate";
import { memoryStore, type IngestedDocument } from "@/lib/services/memory-store";

const ZEP_BASE_URL = process.env.ZEP_API_URL;
const ZEP_API_KEY = process.env.ZEP_API_KEY;

async function callZep(endpoint: string, payload: unknown) {
  if (!ZEP_BASE_URL || !ZEP_API_KEY) {
    return null;
  }

  const response = await fetch(`${ZEP_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ZEP_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Zep API error: ${response.status}`);
  }

  return response.json();
}

export async function ingestManualNote(request: ManualIngestRequest) {
  const now = new Date().toISOString();
  const document: IngestedDocument = {
    id: crypto.randomUUID(),
    source: "manual",
    sourceId: crypto.randomUUID(),
    version: "1",
    timestamp: now,
    ingestedAt: now,
    content: request.note,
    status: "pending",
  };

  try {
    await callZep("/ingest", { documents: [document] }); // REQ-D-001
    memoryStore.upsert(document);
  } catch (error) {
    memoryStore.enqueue(document, crypto.randomUUID(), error instanceof Error ? error.message : undefined); // REQ-C-040
  }

  return document;
}

export async function ingestFromGraph(document: IngestedDocument, correlationId: string) {
  try {
    await callZep("/ingest", { documents: [document] });
    memoryStore.upsert(document);
  } catch (error) {
    memoryStore.enqueue(
      document,
      correlationId,
      error instanceof Error ? error.message : "Unknown error"
    );
  }

  return document;
}

export async function queryMemory(topic?: string, recentDays?: number) {
  if (ZEP_BASE_URL && ZEP_API_KEY) {
    try {
      const response = await callZep("/search", { topic, recentDays }); // REQ-D-002
      return (response?.results as IngestedDocument[]) ?? [];
    } catch {
      // Fall back to memory store
    }
  }
  return memoryStore.query(topic, recentDays);
}

export async function fetchRecentContext(limit = 5) {
  const stored = memoryStore.recent(limit);
  if (stored.length > 0) return stored;
  const queried = await queryMemory(undefined, 7);
  return queried.slice(0, limit);
}

export async function validateBelief(request: ValidateBeliefRequest) {
  const status =
    request.action === "accept"
      ? "accepted"
      : request.action === "reject"
        ? "rejected"
        : "corrected";

  const updated = memoryStore.updateStatus(request.beliefId, status, request.correctedText);

  if (updated && ZEP_BASE_URL && ZEP_API_KEY) {
    try {
      await callZep("/update", { id: updated.id, status, correctedText: request.correctedText }); // REQ-D-003
    } catch (error) {
      console.error("[zep] failed to push validation", error);
    }
  }

  return updated;
}
