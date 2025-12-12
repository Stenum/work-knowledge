import { llmConfig } from '@/lib/config';
import { Belief } from '@/types/memory';

// REQ-E-001 tool-calling simulation
export async function respondWithContext(prompt: string, beliefs: Belief[]): Promise<string> {
  const summary = beliefs
    .map((b) => `- (${b.source || 'unknown'}) ${b.text} [${b.status || 'pending'}]`)
    .join('\n');
  if (!summary) {
    return `I could not find relevant memory for "${prompt}". What should I know?`;
  }
  return `Using model ${llmConfig.model}, here is what I know about ${prompt}:\n${summary}`;
}
