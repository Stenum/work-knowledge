import Link from "next/link";
import { Button } from "@/components/ui/button";
import { listReviews } from "@/lib/services/review-service";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const reviews = await listReviews();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Reviews</h1>
        <p className="text-sm text-zinc-600">
          The review feature stitches together the LLM client and the graph webhook
          handler to show how content moves between services.
        </p>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-zinc-900">{review.subject}</p>
              <p className="text-xs text-zinc-500">Status: {review.status}</p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/api/review/${review.id}`} prefetch={false}>
                View stub data
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href="/api/review" prefetch={false} className="text-center">
            GET /api/review
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/api/review/demo" prefetch={false} className="text-center">
            GET /api/review/[id]
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/api/webhooks/graph" prefetch={false} className="text-center">
            POST /api/webhooks/graph
          </Link>
        </Button>
      </div>
    </div>
  );
}
