import { NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/schemas/chat";
import { generateChatResponse } from "@/lib/services/llm-client";
import { fetchRecentContext } from "@/lib/services/zep-client";

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = chatRequestSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 }); // REQ-H-010
  }

  const correlationId = crypto.randomUUID();
  console.log(`[chat] correlation=${correlationId}`); // REQ-I-002

  const context = await fetchRecentContext();
  const { reply } = await generateChatResponse(parseResult.data.message);

  return NextResponse.json({ reply, context });
}
