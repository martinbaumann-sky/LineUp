import { z } from "zod";

export const lineupSchema = z.object({
  formation: z.string().min(3),
  notes: z.string().optional(),
  slots: z
    .array(
      z.object({
        membershipId: z.string().cuid(),
        positionLabel: z.string().min(1),
        x: z.number().min(0).max(1),
        y: z.number().min(0).max(1)
      })
    )
    .max(30)
});