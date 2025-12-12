import { z } from "zod";

export const validateBeliefSchema = z.object({
  beliefId: z.string().min(1),
  action: z.enum(["accept", "reject", "correct"]),
  correctedText: z.string().trim().optional(),
});

export const validateBeliefResponseSchema = z.object({
  success: z.boolean(),
  belief: z
    .object({
      id: z.string(),
      content: z.string(),
      status: z.string(),
    })
    .nullable(),
});

export type ValidateBeliefRequest = z.infer<typeof validateBeliefSchema>;
export type ValidateBeliefResponse = z.infer<typeof validateBeliefResponseSchema>;
