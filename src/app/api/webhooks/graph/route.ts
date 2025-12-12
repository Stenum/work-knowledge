import { NextResponse } from "next/server";
import { GraphWebhookNotification } from "@/lib/clients/graph";
import { enqueueDeltaSync, enqueueIngestion } from "@/worker/ingestion-worker";

const expectedClientState = process.env.GRAPH_WEBHOOK_SECRET;
const expectedTenant = process.env.GRAPH_TENANT_ID;

function unauthorized(message: string) {
  console.warn(JSON.stringify({ event: "graph_webhook_rejected", message }));
  return NextResponse.json({ error: message }, { status: 401 });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const validationToken = url.searchParams.get("validationToken");
  if (validationToken) {
    console.info(JSON.stringify({ event: "graph_webhook_handshake" }));
    return new NextResponse(validationToken, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  let payload: { value?: GraphWebhookNotification[] } | undefined;
  try {
    payload = await request.json();
  } catch (error) {
    console.warn(
      JSON.stringify({ event: "graph_webhook_invalid_payload", message: (error as Error).message })
    );
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const notifications: GraphWebhookNotification[] = Array.isArray(payload?.value) ? payload.value : [];
  if (!notifications.length) {
    return NextResponse.json({ error: "No notifications provided" }, { status: 400 });
  }

  if (expectedClientState && notifications.some((n) => n.clientState !== expectedClientState)) {
    return unauthorized("Client state mismatch");
  }

  if (expectedTenant && notifications.some((n) => n.tenantId && n.tenantId !== expectedTenant)) {
    return unauthorized("Tenant mismatch");
  }

  const changedAt =
    (notifications[0]?.resourceData?.lastModifiedDateTime as string | undefined) ||
    new Date().toISOString();

  await enqueueIngestion({ notifications, changedAt });
  await enqueueDeltaSync(changedAt);

  console.info(
    JSON.stringify({
      event: "graph_webhook_enqueued",
      notifications: notifications.length,
      changedAt,
    })
  );

  return NextResponse.json({ received: true, enqueued: notifications.length }, { status: 202 });
}
