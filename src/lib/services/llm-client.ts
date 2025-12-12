import { fetchRecentContext } from "@/lib/services/zep-client";

export async function generateChatResponse(message: string) {
  const context = await fetchRecentContext();
  const summary = context.map((item) => `- ${item.text} (source: ${item.source})`).join("\n");
  return {
    reply:
      summary.length > 0
        ? `I checked recent memory and found:\n${summary}\nGiven that, here's my take: ${message}`
        : `I do not see related memory yet, but I will capture your question: ${message}`,
    context,
  };
}
