import { FeatureCard } from "@/components/feature-card";
import { GraphClient } from "@/lib/clients/graph";

export const dynamic = "force-dynamic";

export default async function ConnectionsPage() {
  const graphClient = new GraphClient();
  const connections = await graphClient.listConnections();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Connections</h1>
        <p className="text-sm text-zinc-600">
          External systems are represented as graph connections. The stub client
          proves the contract without requiring a live backend.
        </p>
      </div>

      <div className="space-y-3">
        {connections.map((connection) => (
          <FeatureCard
            key={connection.id}
            title={connection.label}
            description={`Status: ${connection.status}`}
            href="/api/webhooks/graph"
          />
        ))}
      </div>
    </div>
  );
}
