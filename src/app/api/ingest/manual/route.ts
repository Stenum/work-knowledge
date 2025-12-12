import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ingestManual } from '@/services/assistantOrchestrator';

const schema = z.object({
  content: z.string().min(1),
});

// REQ-C-020 manual note ingestion endpoint
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const doc = await ingestManual(parsed.data.content);
  return NextResponse.json(doc, { status: 201 });
}
