import { z } from "zod";
import { ROLE_VALUES } from "@/types/enums";

export const teamSchema = z.object({
  name: z.string().min(3, "Nombre muy corto"),
  crestUrl: z.string().url().optional().or(z.literal(""))
});

export const invitationSchema = z.object({
  email: z.string().email(),
  role: z.enum(ROLE_VALUES as [typeof ROLE_VALUES[number], ...typeof ROLE_VALUES[number][]]),
  expiresAt: z.coerce.date()
});

export const boardRoleSchema = z.object({
  title: z.string().min(2),
  membershipId: z.string().cuid()
});
