import { z } from "zod";
import { POSITION_VALUES } from "@/types/enums";

export const profileSchema = z.object({
  name: z.string().min(2, "Nombre demasiado corto").max(80, "Máximo 80 caracteres"),
  avatarUrl: z
    .string()
    .url("Ingresa una URL válida")
    .or(z.literal(""))
    .optional(),
  bio: z
    .string()
    .max(280, "Máximo 280 caracteres")
    .optional()
    .or(z.literal("")),
  number: z
    .string()
    .regex(/^(|\d{1,2})$/, "Usa uno o dos dígitos")
    .optional(),
  position: z
    .enum(POSITION_VALUES as [typeof POSITION_VALUES[number], ...typeof POSITION_VALUES[number][]])
    .optional()
    .or(z.literal(""))
});
