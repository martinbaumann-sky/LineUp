"use server";

import { redirect } from "next/navigation";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { registerSchema } from "@/lib/validators/auth";

export interface RegisterActionState {
  error: string | null;
}

export async function registerUser(
  _prevState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      return { error: "Datos inválidos" };
    }
    const { email, password, name, token } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "Ya existe una cuenta con ese email" };
    }

    const invitation = token
      ? await prisma.invitation.findUnique({
          where: { token },
          include: { team: true }
        })
      : null;
    if (token) {
      if (!invitation) {
        return { error: "Invitación inválida" };
      }
      if (invitation.expiresAt < new Date()) {
        return { error: "La invitación está vencida" };
      }
    }

    const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash, name } });

    if (invitation) {
      await prisma.membership.upsert({
        where: { userId_teamId: { userId: user.id, teamId: invitation.teamId } },
        create: {
          userId: user.id,
          teamId: invitation.teamId,
          role: invitation.roleDefault
        },
        update: { role: invitation.roleDefault }
      });
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: new Date() }
      });
    }
    redirect("/sign-in?registered=1");
  } catch (error) {
    console.error("registerUser", error);
    return { error: "No pudimos crear tu cuenta. Intenta nuevamente." };
  }
}

export async function signOutAction() {
  "use server";
  const session = await auth();
  if (!session) {
    return { error: "No autenticado" };
  }
  revalidatePath("/dashboard");
  redirect("/api/auth/signout");
}