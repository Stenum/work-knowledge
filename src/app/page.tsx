import { FeatureCard } from "@/components/feature-card";

const features = [
  {
    title: "Chat",
    description:
      "App Router server components talking to the Zep and LLM clients to echo stubbed conversations.",
    href: "/(features)/chat",
  },
  {
    title: "Reviews",
    description:
      "Review orchestration across the LLM summarizer and graph webhook handler.",
    href: "/(features)/review",
  },
  {
    title: "Connections",
    description:
      "Graph client placeholders that enumerate upstream systems feeding the worker pipelines.",
    href: "/(features)/connections",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white px-6 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Work Knowledge
          </p>
          <h1 className="text-4xl font-semibold text-zinc-900">
            Next.js + Tailwind + shadcn/ui starter
          </h1>
          <p className="max-w-3xl text-lg text-zinc-600">
            Feature modules, shared clients, and BullMQ workers are scaffolded with
            stub data so you can focus on wiring real integrations later.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </section>

        <section className="rounded-xl border border-dashed border-zinc-300 bg-white p-6">
          <h2 className="text-xl font-semibold text-zinc-900">APIs wired to services</h2>
          <p className="mt-2 text-sm text-zinc-600">
            The following endpoints are live with stubbed responses: /api/chat, /api/notes,
            /api/review, /api/review/[id], and /api/webhooks/graph. Use them to validate
            the architecture before adding real implementations.
          </p>
        </section>
      </div>
    </main>
  );
}
