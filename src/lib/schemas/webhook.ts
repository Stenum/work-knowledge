import { z } from "zod";

export const webhookEventSchema = z.object({
  value: z.array(
    z.object({
      subscriptionId: z.string(),
      changeType: z.string(),
      resource: z.string(),
      clientState: z.string().optional(),
      tenantId: z.string().optional(),
      userId: z.string().optional(),
    })
  ),
});

export type GraphNotification = z.infer<typeof webhookEventSchema>;
