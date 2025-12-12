import { NextResponse } from "next/server";
import { sendChatMessage } from "@/lib/services/chat-service";

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const result = await sendChatMessage(prompt ?? "");

  return NextResponse.json(result);
}
