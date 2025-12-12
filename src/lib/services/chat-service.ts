import { LlmClient } from "@/lib/clients/llm";
import { ZepClient } from "@/lib/clients/zep";

const zepClient = new ZepClient();
const llmClient = new LlmClient();

export async function sendChatMessage(prompt: string) {
  const message = await zepClient.sendChatMessage(prompt);
  const llmSummary = await llmClient.review(prompt);

  return {
    message,
    llmSummary,
  };
}
