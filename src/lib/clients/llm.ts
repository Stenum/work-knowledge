export interface ReviewResult {
  id: string;
  summary: string;
  score: number;
}

export class LlmClient {
  constructor(private readonly model = process.env.LLM_MODEL ?? "gpt-demo") {}

  async review(text: string): Promise<ReviewResult> {
    return {
      id: crypto.randomUUID(),
      summary: `Model ${this.model} review for input of length ${text.length}.`,
      score: Math.min(100, Math.max(0, Math.round(text.length / 10))),
    };
  }
}
