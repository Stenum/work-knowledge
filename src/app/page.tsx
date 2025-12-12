import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Chat",
    description: "Ask questions backed by Zep memory with validation hints.",
    href: "/chat",
  },
  {
    title: "Manual Note",
    description: "Capture quick notes and send them to Zep as manual sources.",
    href: "/notes",
  },
  {
    title: "Review & Validate",
    description: "Accept or reject beliefs gathered from graph sources.",
    href: "/review",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-indigo-600">Personal assistant</p>
          <h1 className="text-3xl font-bold text-slate-900">
            Work assistant with Zep memory and validation loop
          </h1>
          <p className="max-w-3xl text-slate-600">
            Interact with your assistant through chat, capture manual notes for ingestion, and review
            what the system believes. Each action flows through the Next.js backend for validation
            and storage.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{feature.description}</p>
                <Button asChild>
                  <Link href={feature.href}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What is included?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <p>
              The backend-for-frontend exposes chat, manual ingestion, review, and validation APIs
              secured by Zod validation. Stubbed Graph and Zep clients demonstrate ingestion flows
              and reliability hooks while keeping the MVP lightweight.
            </p>
            <p>
              Use the sections above to try the assistant, send a manual note, or validate a belief.
              Each action logs correlation IDs for observability.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
