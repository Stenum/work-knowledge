import { NextResponse } from 'next/server';
import { z } from 'zod';
import { handleChat } from '@/services/assistantOrchestrator';

const chatSchema = z.object({
  message: z.string().min(1),
  recentDays: z.number().optional(),
});

// REQ-E-010 forward chat to orchestrator
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { message, recentDays } = parsed.data;
  const result = await handleChat(message, recentDays);
  return NextResponse.json(result);
}
