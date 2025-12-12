import { NextResponse } from 'next/server';
import { z } from 'zod';
import { acceptBelief, rejectBelief, applyCorrection } from '@/services/validationService';

const schema = z.object({
  id: z.string().min(1),
  action: z.enum(['accept', 'reject', 'correct']),
  text: z.string().optional(),
});

// REQ-F-010..012 validation actions
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { id, action, text } = parsed.data;
  let result;
  if (action === 'accept') result = await acceptBelief(id);
  if (action === 'reject') result = await rejectBelief(id);
  if (action === 'correct' && text) result = await applyCorrection(id, text);
  return NextResponse.json({ result });
}
