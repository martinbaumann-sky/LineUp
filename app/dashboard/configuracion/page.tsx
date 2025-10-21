import { Role, ensureRole } from "@/types/enums";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createTeam, updateTeam, deleteTeam, leaveTeam } from "@/lib/actions/team";
import { InvitationGenerator } from "@/components/dashboard/invitation-generator";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { team: true }
  });

  if (!membership) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crear equipo</CardTitle>
          <CardDescription>Empieza nombrando a tu club y personaliza su escudo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createTeam} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="name">
                Nombre del equipo
              </label>
              <input
                id="name"
                name="name"
                required
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                placeholder="Club Atlético LineUp"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="crestUrl">
                Escudo (URL opcional)
              </label>
              <input
                id="crestUrl"
                name="crestUrl"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                placeholder="https://..."
              />
            </div>
            <Button type="submit" className="w-full">
              Crear equipo
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  const invitations = await prisma.invitation.findMany({
    where: { teamId: membership.teamId },
    orderBy: { createdAt: "desc" }
  });

  const role = ensureRole(membership.role);
  const canManage = [Role.OWNER, Role.ADMIN].includes(role);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Perfil del equipo</CardTitle>
          <CardDescription>Actualiza identidad visual y datos generales.</CardDescription>
        </CardHeader>
        <CardContent>
          {canManage ? (
            <form
              className="space-y-4"
              action={async (formData) => {
                "use server";
                await updateTeam(membership.teamId, {
                  name: formData.get("name") as string,
                  crestUrl: (formData.get("crestUrl") as string) || undefined
                });
              }}
            >
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="name">
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  defaultValue={membership.team.name}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="crestUrl">
                  Escudo (URL)
                </label>
                <input
                  id="crestUrl"
                  name="crestUrl"
                  defaultValue={membership.team.crestUrl ?? ""}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                />
              </div>
              <Button type="submit">Guardar cambios</Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">Solo los administradores pueden editar el perfil.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Invitaciones</CardTitle>
          <CardDescription>Comparte enlaces para sumar jugadores rápidamente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InvitationGenerator teamId={membership.teamId} canManage={canManage} />
          <div className="space-y-2 text-sm">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="rounded-md border border-border p-3">
                <p className="font-medium">{invitation.email}</p>
                <p className="text-xs text-muted-foreground">
                  Rol: {invitation.roleDefault} · Expira {invitation.expiresAt.toLocaleDateString("es-AR")}
                </p>
              </div>
            ))}
            {invitations.length === 0 ? (
              <p className="text-xs text-muted-foreground">Todavía no generaste invitaciones.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Acciones críticas</CardTitle>
          <CardDescription>Borra el equipo o abandona si ya no necesitas acceso.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          {role === Role.OWNER ? (
            <form action={deleteTeam.bind(null, membership.teamId)}>
              <Button variant="destructive">Eliminar equipo</Button>
            </form>
          ) : (
            <form action={leaveTeam.bind(null, membership.teamId)}>
              <Button variant="destructive">Salir del equipo</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
