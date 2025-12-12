import { NextResponse } from "next/server";
import { getReview } from "@/lib/services/review-service";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const review = await getReview(params.id);
    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 404 }
    );
  }
}
