import { z } from "zod";

export const manualIngestRequestSchema = z.object({
  note: z.string().min(1),
});

export const manualIngestResponseSchema = z.object({
  id: z.string(),
  ingestedAt: z.string(),
});

export type ManualIngestRequest = z.infer<typeof manualIngestRequestSchema>;
export type ManualIngestResponse = z.infer<typeof manualIngestResponseSchema>;
