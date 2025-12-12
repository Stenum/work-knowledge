import { GraphClient } from "@/lib/clients/graph";
import { LlmClient } from "@/lib/clients/llm";
import { sharedZepClient } from "@/lib/clients/zep";
import { BeliefRecord } from "@/lib/types/documents";

const graphClient = new GraphClient();
const llmClient = new LlmClient();

export async function listReviews() {
  return [
    { id: "review-1", subject: "Knowledge base", status: "pending" },
    { id: "review-2", subject: "CRM notes", status: "complete" },
  ];
}

export async function getReview(id: string) {
  const review = (await listReviews()).find((item) => item.id === id);
  if (!review) {
    throw new Error(`Review ${id} not found`);
  }

  const beliefs = await sharedZepClient.queryBeliefs(review.subject);
  const llmResult = await llmClient.review(`${review.subject} ${beliefs.map((b) => b.content).join(" ")}`);

  return { review, llmResult, beliefs };
}

export async function createReview(subject: string) {
  const llmResult = await llmClient.review(subject);
  const beliefs = await sharedZepClient.queryBeliefs(subject);
  return { id: crypto.randomUUID(), subject, status: "pending", llmResult, beliefs };
}

export async function syncReviewGraph(payload: unknown) {
  return graphClient.validateNotification(payload as never);
}

export async function getBeliefsForSubject(subject: string): Promise<BeliefRecord[]> {
  return sharedZepClient.queryBeliefs(subject);
}

export async function acceptBelief(beliefId: string, reason?: string) {
  return sharedZepClient.verifyBelief(beliefId, true, reason);
}

export async function rejectBelief(beliefId: string, reason?: string) {
  return sharedZepClient.verifyBelief(beliefId, false, reason);
}

export async function editBelief(beliefId: string, correction: string) {
  return sharedZepClient.correctBelief(beliefId, correction);
}
