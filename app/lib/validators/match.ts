import { z } from "zod";
import { AvailabilityStatus, MatchStatus } from "@prisma/client";

export const matchSchema = z.object({
  opponent: z.string().min(2),
  location: z.string().min(2),
  kickoffAt: z.coerce.date(),
  competition: z.string().optional(),
  notes: z.string().optional()
});

export const matchStatusSchema = z.nativeEnum(MatchStatus);

export const availabilitySchema = z.object({
  status: z.nativeEnum(AvailabilityStatus)
});