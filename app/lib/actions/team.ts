"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Role, ensureRole } from "@/types/enums";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireMembership, assertRole } from "@/lib/actions/guards";
import { slugify } from "@/lib/utils";
import { teamSchema, invitationSchema } from "@/lib/validators/team";

export async function createTeam(formData: FormData) {
  const session = await requireAuth();
  const data = Object.fromEntries(formData.entries());
  const parsed = teamSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }

  const slug = slugify(parsed.data.name);
  const exists = await prisma.team.findUnique({ where: { slug } });
  if (exists) {
    return { error: "Ya existe un equipo con nombre similar" };
  }

  const team = await prisma.team.create({
    data: {
      name: parsed.data.name,
      slug,
      crestUrl: parsed.data.crestUrl ?? null,
      createdById: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: Role.OWNER
        }
      },
      chatRooms: {
        create: {
          type: "TEAM"
        }
      }
    }
  });

  revalidatePath("/dashboard/inicio");
  redirect("/dashboard/inicio");
}

export async function updateTeam(teamId: string, payload: { name: string; crestUrl?: string | null }) {
  const { membership } = await requireMembership(teamId);
  const role = ensureRole(membership.role);
  assertRole(role, [Role.OWNER, Role.ADMIN]);

  await prisma.team.update({
    where: { id: teamId },
    data: {
      name: payload.name,
      crestUrl: payload.crestUrl ?? null,
      slug: slugify(payload.name)
    }
  });
  revalidatePath("/dashboard/configuracion");
}

export async function deleteTeam(teamId: string) {
  const { membership } = await requireMembership(teamId);
  const role = ensureRole(membership.role);
  assertRole(role, [Role.OWNER]);
  await prisma.team.delete({ where: { id: teamId } });
  redirect("/dashboard/configuracion?deleted=1");
}

export async function leaveTeam(teamId: string) {
  const { membership } = await requireMembership(teamId);
  const role = ensureRole(membership.role);
  if (role === Role.OWNER) {
    throw new Error("El propietario no puede salir sin transferir la propiedad");
  }
  await prisma.membership.delete({ where: { id: membership.id } });
  redirect("/dashboard/configuracion?left=1");
}

export async function generateInvitation(teamId: string, formData: FormData) {
  const { membership } = await requireMembership(teamId);
  const role = ensureRole(membership.role);
  assertRole(role, [Role.OWNER, Role.ADMIN, Role.COACH]);
  const payload = Object.fromEntries(formData.entries());
  const parsed = invitationSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }
  const token = randomBytes(16).toString("hex");
  const invitation = await prisma.invitation.create({
    data: {
      teamId,
      email: parsed.data.email,
      token,
      roleDefault: parsed.data.role,
      expiresAt: parsed.data.expiresAt,
      createdById: membership.userId
    }
  });
  revalidatePath("/dashboard/configuracion");
  return { token: invitation.token };
}

export async function updateMembershipRole(teamId: string, membershipId: string, role: Role) {
  const { membership } = await requireMembership(teamId);
  const currentRole = ensureRole(membership.role);
  assertRole(currentRole, [Role.OWNER, Role.ADMIN]);
  await prisma.membership.update({ where: { id: membershipId }, data: { role } });
  revalidatePath("/dashboard/directiva");
}
