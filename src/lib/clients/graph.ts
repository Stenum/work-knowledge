export interface GraphConnection {
  id: string;
  label: string;
  status: "active" | "pending" | "failed";
}

export class GraphClient {
  constructor(private readonly endpoint = process.env.GRAPH_API_URL ?? "https://graph.local") {}

  async listConnections(): Promise<GraphConnection[]> {
    return [
      { id: "connection-1", label: "Demo workspace", status: "active" },
      { id: "connection-2", label: "CRM export", status: "pending" },
    ];
  }

  async receiveWebhook(payload: unknown) {
    return {
      message: "Graph webhook captured",
      payload,
      forwardedTo: this.endpoint,
    };
  }
}
