export interface GraphWebhookEvent {
  subscriptionId: string;
  changeType: string;
  resource: string;
  clientState?: string;
}

export async function enqueueGraphEvent(event: GraphWebhookEvent) {
  console.log("[graph-webhook] received", event); // REQ-I-001
  return { received: true, event };
}
