import { z } from "zod";

export const reviewQuerySchema = z.object({
  topic: z.string().optional(),
});

export const beliefSchema = z.object({
  id: z.string(),
  text: z.string(),
  source: z.string(),
  timestamp: z.string(),
  ingestedAt: z.string(),
  status: z.string(),
});

export const reviewResponseSchema = z.object({
  beliefs: z.array(beliefSchema),
});

export type ReviewQuery = z.infer<typeof reviewQuerySchema>;
export type ReviewResponse = z.infer<typeof reviewResponseSchema>;
