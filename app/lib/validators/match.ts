import { z } from "zod";
import { AVAILABILITY_STATUS_VALUES, MATCH_STATUS_VALUES } from "@/types/enums";

export const matchSchema = z.object({
  opponent: z.string().min(2),
  location: z.string().min(2),
  kickoffAt: z.coerce.date(),
  competition: z.string().optional(),
  notes: z.string().optional()
});

export const matchStatusSchema = z.enum(MATCH_STATUS_VALUES as [typeof MATCH_STATUS_VALUES[number], ...typeof MATCH_STATUS_VALUES[number][]]);

export const availabilitySchema = z.object({
  status: z.enum(AVAILABILITY_STATUS_VALUES as [typeof AVAILABILITY_STATUS_VALUES[number], ...typeof AVAILABILITY_STATUS_VALUES[number][]])
});
