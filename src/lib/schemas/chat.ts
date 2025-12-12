import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().min(1),
  recentDays: z.number().optional(),
});

export const chatResponseSchema = z.object({
  reply: z.string(),
  context: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        source: z.string(),
        timestamp: z.string(),
        ingestedAt: z.string(),
        status: z.string(),
      })
    )
    .default([]),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;
