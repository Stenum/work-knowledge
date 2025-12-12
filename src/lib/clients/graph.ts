export interface GraphConnection {
  id: string;
  label: string;
  status: "active" | "pending" | "failed";
}

export type GraphEntityType = "teams" | "outlook" | "calendar";

export interface GraphItem {
  id: string;
  type: GraphEntityType;
  subject: string;
  content: string;
  tenantId: string;
  updatedAt: string;
  createdAt: string;
  sourceUrl: string;
  metadata: Record<string, string>;
}

export interface GraphWebhookNotification {
  subscriptionId: string;
  tenantId: string;
  resource: string;
  changeType: string;
  clientState?: string;
  resourceData?: Record<string, unknown>;
}

export class GraphClient {
  constructor(
    private readonly endpoint = process.env.GRAPH_API_URL ?? "https://graph.local",
    private readonly tenantId = process.env.GRAPH_TENANT_ID ?? "demo-tenant"
  ) {}

  async listConnections(): Promise<GraphConnection[]> {
    return [
      { id: "connection-1", label: "Demo workspace", status: "active" },
      { id: "connection-2", label: "CRM export", status: "pending" },
    ];
  }

  async fetchEntities(since?: string): Promise<GraphItem[]> {
    const anchor = since ?? new Date().toISOString();
    return [
      {
        id: "teams-1",
        type: "teams",
        subject: "Channel discussion",
        content: "Decision from the team thread.",
        tenantId: this.tenantId,
        createdAt: anchor,
        updatedAt: anchor,
        sourceUrl: `${this.endpoint}/teams/teams-1`,
        metadata: { channel: "general", importance: "normal" },
      },
      {
        id: "outlook-1",
        type: "outlook",
        subject: "Follow up email",
        content: "Email thread about next steps.",
        tenantId: this.tenantId,
        createdAt: anchor,
        updatedAt: anchor,
        sourceUrl: `${this.endpoint}/outlook/outlook-1`,
        metadata: { from: "owner@example.com", to: "team@example.com" },
      },
      {
        id: "calendar-1",
        type: "calendar",
        subject: "Planning meeting",
        content: "Discuss roadmap and blockers.",
        tenantId: this.tenantId,
        createdAt: anchor,
        updatedAt: anchor,
        sourceUrl: `${this.endpoint}/calendar/calendar-1`,
        metadata: { location: "Room 1", sensitivity: "normal" },
      },
    ];
  }

  async readDelta(changedAt: string) {
    return this.fetchEntities(changedAt);
  }

  async validateNotification(notification: GraphWebhookNotification) {
    if (notification.tenantId !== this.tenantId) {
      throw new Error(`Notification tenant ${notification.tenantId} does not match expected ${this.tenantId}`);
    }

    return true;
  }
}
