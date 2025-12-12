import { fetchRecentContext, queryMemory } from "@/lib/services/zep-client";

interface GeneratedChatResponse {
  reply: string;
  context: Awaited<ReturnType<typeof fetchRecentContext>>;
}

function buildValidationPrompt(contextSummary: string, message: string) {
  return [
    "I searched your validated memory and found:",
    contextSummary,
    "Use this context to answer. If information is missing, ask for a targeted clarification instead of inventing details.",
    `User message: ${message}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function generateChatResponse(message: string, recentDays?: number): Promise<GeneratedChatResponse> {
  const context = await queryMemory(undefined, recentDays);
  const relevant = context.slice(0, 5);

  const contextSummary =
    relevant.length > 0
      ? relevant
          .map((item) => `- ${item.content} (source: ${item.source}, status: ${item.status})`)
          .join("\n")
      : "- No related items.";

  const prompt = buildValidationPrompt(contextSummary, message);

  const suggestedReply =
    relevant.length > 0
      ? `${prompt}\n\nBased on memory, here's the response: ${message}`
      : `I couldn't find related memory. Can you share more details so I can capture them accurately?`;

  return { reply: suggestedReply, context: relevant };
}
