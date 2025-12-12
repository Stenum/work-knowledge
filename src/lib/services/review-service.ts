import { GraphClient } from "@/lib/clients/graph";
import { LlmClient } from "@/lib/clients/llm";

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

  const llmResult = await llmClient.review(review.subject);

  return { review, llmResult };
}

export async function createReview(subject: string) {
  const llmResult = await llmClient.review(subject);
  return { id: crypto.randomUUID(), subject, status: "pending", llmResult };
}

export async function syncReviewGraph(payload: unknown) {
  return graphClient.receiveWebhook(payload);
}
