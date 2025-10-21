"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/actions/guards";
import { profileSchema } from "@/lib/validators/profile";

export async function updateProfile(membershipId: string, formData: FormData) {
  const session = await requireAuth();
  const membership = await prisma.membership.findUnique({ where: { id: membershipId } });
  if (!membership || membership.userId !== session.user.id) {
    return { error: "No tienes permisos para editar este perfil" };
  }

  const payload = Object.fromEntries(formData.entries());
  const parsed = profileSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }

  const name = parsed.data.name.trim();
  const avatarUrl = parsed.data.avatarUrl?.trim() ?? "";
  const bio = parsed.data.bio?.trim() ?? "";
  const number = parsed.data.number ? Number(parsed.data.number) : null;
  const position = parsed.data.position && parsed.data.position !== "" ? parsed.data.position : null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      avatarUrl: avatarUrl || null,
      bio: bio || null
    }
  });

  await prisma.membership.update({
    where: { id: membershipId },
    data: {
      number,
      position
    }
  });

  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard/plantel");
  revalidatePath("/dashboard/inicio");
  return { success: true };
}
