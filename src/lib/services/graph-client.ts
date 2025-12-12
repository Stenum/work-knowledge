import { ingestFromGraph } from "@/lib/services/zep-client";
import { type Source } from "@/lib/services/memory-store";

export interface GraphWebhookEvent {
  subscriptionId: string;
  changeType: string;
  resource: string;
  clientState?: string;
  tenantId?: string;
  userId?: string;
}

interface GraphResourcePayload {
  subject?: string;
  bodyPreview?: string;
  webLink?: string;
  lastModifiedDateTime?: string;
  attendees?: { emailAddress?: { address?: string } }[];
}

async function fetchGraphResource(resource: string): Promise<GraphResourcePayload> {
  // In a production system, this would call Microsoft Graph using a cached token.
  // For this implementation, we simulate a fetched payload to unblock ingestion flows.
  return {
    subject: `Graph resource ${resource}`,
    bodyPreview: "Automated ingestion of a graph resource.",
    webLink: `https://graph.microsoft.com/v1.0/${resource}`,
    lastModifiedDateTime: new Date().toISOString(),
    attendees: [{ emailAddress: { address: "ask@example.com" } }],
  };
}

function inferSource(resource: string): Source {
  if (resource.includes("messages")) return "teams";
  if (resource.includes("events")) return "calendar";
  if (resource.includes("mail")) return "email";
  return "manual";
}

export async function enqueueGraphEvent(event: GraphWebhookEvent, correlationId: string) {
  const source = inferSource(event.resource);
  const payload = await fetchGraphResource(event.resource);
  const document = {
    id: crypto.randomUUID(),
    source,
    sourceId: event.resource,
    version: event.changeType,
    timestamp: payload.lastModifiedDateTime ?? new Date().toISOString(),
    ingestedAt: new Date().toISOString(),
    participants: payload.attendees?.map((attendee) => attendee.emailAddress?.address ?? "") ?? [],
    subject: payload.subject,
    url: payload.webLink,
    content: payload.bodyPreview ?? "", // REQ-C-030
    status: "pending" as const,
    topicHints: payload.subject ? payload.subject.split(" ") : undefined,
  };

  await ingestFromGraph(document, correlationId);
  return { received: true, document };
}
