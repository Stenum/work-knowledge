import Link from "next/link";
import { Button } from "@/components/ui/button";
import { sendChatMessage } from "@/lib/services/chat-service";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const sample = await sendChatMessage("Hello, world!");

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Chat</h1>
        <p className="text-sm text-zinc-600">
          Conversations flow through the Zep client and are summarized by the LLM
          stub to prove the data path from the App Router to the shared services layer.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Sample response</p>
        <p className="mt-2 text-sm text-zinc-800">{sample.message.content}</p>
        <p className="text-xs text-zinc-500">Summary: {sample.llmSummary.summary}</p>
      </div>

      <div className="flex items-center gap-3">
        <Button asChild>
          <Link href="/api/chat" prefetch={false} className="w-full text-center">
            POST /api/chat
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/api/notes" prefetch={false} className="w-full text-center">
            GET /api/notes
          </Link>
        </Button>
      </div>
    </div>
  );
}
