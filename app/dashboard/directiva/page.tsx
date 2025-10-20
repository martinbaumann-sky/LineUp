import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateMembershipRole } from "@/lib/actions/team";
import { upsertBoardRole, removeBoardRole } from "@/lib/actions/board";

export default async function BoardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { team: true }
  });
  if (!membership) redirect("/dashboard/configuracion?onboarding=1");

  const members = await prisma.membership.findMany({
    where: { teamId: membership.teamId },
    include: { user: true, boardRole: true },
    orderBy: { role: "asc" }
  });

  const canManage = [Role.OWNER, Role.ADMIN].includes(membership.role);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Roles del plantel</CardTitle>
          <CardDescription>Define quién integra la directiva y staff técnico.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="rounded-md border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{member.user.name}</p>
                  <p className="text-xs text-muted-foreground">{member.user.email}</p>
                </div>
                <span className="text-sm font-semibold">{member.role}</span>
              </div>
              {canManage ? (
                <form className="mt-2 flex flex-wrap items-center gap-2" action={async (formData) => {
                  "use server";
                  const role = formData.get("role") as Role;
                  await updateMembershipRole(member.teamId, member.id, role);
                }}>
                  <select
                    name="role"
                    defaultValue={member.role}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {Object.values(Role).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" size="sm">
                    Actualizar rol
                  </Button>
                </form>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Cargos específicos</CardTitle>
          <CardDescription>Asigna títulos personalizados para roles operativos del club.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {members
            .filter((member) => member.boardRole)
            .map((member) => (
              <div key={member.boardRole!.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                <div>
                  <p className="font-semibold">{member.boardRole!.title}</p>
                  <p className="text-xs text-muted-foreground">{member.user.name}</p>
                </div>
                {canManage ? (
                  <form action={removeBoardRole.bind(null, member.teamId, member.boardRole!.title)}>
                    <Button size="sm" variant="destructive" type="submit">
                      Quitar
                    </Button>
                  </form>
                ) : null}
              </div>
            ))}
          {canManage ? (
            <form
              className="space-y-3 rounded-md border border-dashed border-border p-4"
              action={async (formData) => {
                "use server";
                await upsertBoardRole(membership.teamId, formData);
              }}
            >
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="title">
                  Título
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  placeholder="Director técnico"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="membershipId">
                  Miembro
                </label>
                <select
                  id="membershipId"
                  name="membershipId"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.user.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full">
                Guardar cargo
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">Solo los administradores pueden modificar los cargos.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}