import { NextResponse } from "next/server";
import { chatRequestSchema, chatResponseSchema } from "@/lib/schemas/chat";
import { generateChatResponse } from "@/lib/services/llm-client";
import { fetchRecentContext } from "@/lib/services/zep-client";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parseResult = chatRequestSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 }); // REQ-H-010
  }

  const correlationId = crypto.randomUUID();
  console.log(`[chat] correlation=${correlationId}`); // REQ-I-002

  const { message, recentDays } = parseResult.data;
  const recentContext = await fetchRecentContext();
  const { reply, context } = await generateChatResponse(message, recentDays);

  const responsePayload = chatResponseSchema.parse({ reply, context: context ?? recentContext });
  return NextResponse.json(responsePayload);
}
