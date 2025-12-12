import { NextResponse } from "next/server";
import { validateBeliefSchema, validateBeliefResponseSchema } from "@/lib/schemas/validate";
import { validateBelief } from "@/lib/services/zep-client";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parseResult = validateBeliefSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
  }

  const correlationId = crypto.randomUUID();
  console.log(`[validate] correlation=${correlationId}`); // REQ-I-002

  const belief = await validateBelief(parseResult.data);
  const payload = validateBeliefResponseSchema.parse({ success: Boolean(belief), belief });

  return NextResponse.json(payload, { status: belief ? 200 : 404 });
}
