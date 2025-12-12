import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchBeliefs } from '@/services/validationService';

const schema = z.object({ topic: z.string().min(1) });

// REQ-F-001 fetch beliefs for review
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const beliefs = await fetchBeliefs(parsed.data.topic);
  return NextResponse.json({ beliefs });
}
