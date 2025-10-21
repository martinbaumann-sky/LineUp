import { Position, POSITION_VALUES } from "@/types/enums";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PositionFilter } from "@/components/dashboard/position-filter";

export default async function SquadPage({ searchParams }: { searchParams: { position?: Position } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id }
  });
  if (!membership) redirect("/dashboard/configuracion?onboarding=1");

  const requestedPosition = searchParams.position && POSITION_VALUES.includes(searchParams.position) ? searchParams.position : undefined;

  const players = await prisma.membership.findMany({
    where: {
      teamId: membership.teamId,
      position: requestedPosition ?? undefined
    },
    include: {
      user: true
    },
    orderBy: { number: "asc" }
  });

  const stats = await prisma.availability.groupBy({
    by: ["userId"],
    where: { match: { teamId: membership.teamId } },
    _count: { id: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Plantel</h2>
          <p className="text-sm text-muted-foreground">Gestiona dorsales, posiciones y disponibilidad histórica.</p>
        </div>
        <PositionFilter value={requestedPosition} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => {
          const position = player.position as Position | null;
          return (
            <Card key={player.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{player.user.name}</span>
                  <Badge variant="secondary">#{player.number ?? "-"}</Badge>
                </CardTitle>
                <CardDescription>{player.user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Posición</span>
                  <span className="font-medium">{position ? positionCopy[position] : "N/D"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rol</span>
                  <span className="font-medium">{player.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Asistencias registradas</span>
                  <span className="font-medium">
                    {stats.find((item) => item.userId === player.userId)?._count.id ?? 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const positionCopy: Record<Position, string> = {
  GK: "Arquero",
  DF: "Defensor",
  MF: "Volante",
  FW: "Delantero"
};
