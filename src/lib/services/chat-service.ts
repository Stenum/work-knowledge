import { LlmClient } from "@/lib/clients/llm";
import { sharedZepClient } from "@/lib/clients/zep";
import { BeliefRecord } from "@/lib/types/documents";

const llmClient = new LlmClient();

function markStale(beliefs: BeliefRecord[]) {
  return beliefs.map((belief) => ({
    ...belief,
    stale: belief.freshness < 0.5,
  }));
}

export async function sendChatMessage(prompt: string) {
  const message = await sharedZepClient.sendChatMessage(prompt);
  const retrieved = await sharedZepClient.queryBeliefs(prompt);
  const beliefs = markStale(retrieved);

  const corrections = beliefs
    .filter((belief) => belief.stale)
    .map((belief) =>
      sharedZepClient.correctBelief(
        belief.id,
        `${belief.content} (refreshed for prompt length ${prompt.length})`
      )
    );

  const corrected = await Promise.all(corrections);
  const llmSummary = await llmClient.review(`${prompt} ${beliefs.map((b) => b.content).join(" ")}`);

  return {
    message,
    llmSummary,
    beliefs: beliefs.map((belief) => ({
      ...belief,
      confidence: Math.max(belief.confidence, llmSummary.score / 100),
    })),
    refreshed: corrected,
  };
}
