import { z } from "zod";

export const graphNotificationSchema = z.object({
  value: z.array(
    z.object({
      subscriptionId: z.string(),
      changeType: z.string(),
      resource: z.string(),
      clientState: z.string().optional(),
    })
  ),
});

export type GraphNotification = z.infer<typeof graphNotificationSchema>;
