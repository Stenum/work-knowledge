import { NextResponse } from "next/server";
import { validateBeliefSchema } from "@/lib/schemas/validate";
import { validateBelief } from "@/lib/services/zep-client";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateBeliefSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); // REQ-H-010
  }

  const belief = await validateBelief(parsed.data);
  return NextResponse.json({ success: Boolean(belief), belief });
}
