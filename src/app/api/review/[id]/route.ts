import { NextResponse } from "next/server";
import {
  acceptBelief,
  editBelief,
  getReview,
  rejectBelief,
} from "@/lib/services/review-service";

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const review = await getReview(params.id);
  return NextResponse.json(review);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { action, beliefId, correction, reason } = await request.json();
  if (!beliefId) {
    return NextResponse.json({ error: "beliefId is required" }, { status: 400 });
  }

  let result;
  switch (action) {
    case "accept":
      result = await acceptBelief(beliefId, reason);
      break;
    case "reject":
      result = await rejectBelief(beliefId, reason);
      break;
    case "edit":
      if (!correction) {
        return NextResponse.json({ error: "correction is required for edits" }, { status: 400 });
      }
      result = await editBelief(beliefId, correction);
      break;
    default:
      return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  return NextResponse.json({ reviewId: params.id, action, result });
}
