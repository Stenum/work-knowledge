import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().min(1),
  recentDays: z.number().int().positive().optional(),
});

const beliefShape = z.object({
  id: z.string(),
  content: z.string(),
  source: z.string(),
  sourceId: z.string(),
  timestamp: z.string(),
  ingestedAt: z.string(),
  status: z.string(),
});

export const chatResponseSchema = z.object({
  reply: z.string(),
  context: z.array(beliefShape).default([]),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;
