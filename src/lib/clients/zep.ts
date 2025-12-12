export interface ChatMessage {
  id: string;
  content: string;
  createdAt: Date;
}

export class ZepClient {
  constructor(private readonly apiKey = process.env.ZEP_API_KEY ?? "demo-key") {}

  async sendChatMessage(prompt: string): Promise<ChatMessage> {
    return {
      id: crypto.randomUUID(),
      content: `Zep stub response to: ${prompt}`,
      createdAt: new Date(),
    };
  }

  async fetchNotes(): Promise<ChatMessage[]> {
    return [
      {
        id: "note-1",
        content: "Stubbed note pulled from the Zep client.",
        createdAt: new Date(),
      },
    ];
  }
}
