import { MatchStatus, Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineupEditor } from "@/components/dashboard/lineup-editor";

export default async function LineupPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { team: true }
  });
  if (!membership) redirect("/dashboard/configuracion?onboarding=1");

  const match = await prisma.match.findFirst({
    where: { teamId: membership.teamId, status: MatchStatus.SCHEDULED },
    orderBy: { kickoffAt: "asc" },
    include: {
      lineup: {
        include: {
          slots: true
        }
      }
    }
  });

  const players = await prisma.membership.findMany({
    where: { teamId: membership.teamId },
    include: { user: true },
    orderBy: { number: "asc" }
  });

  if (!match) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sin partido próximo</CardTitle>
          <CardDescription>Programa un partido en el fixture para definir la alineación.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const canEdit = [Role.OWNER, Role.ADMIN, Role.COACH].includes(membership.role);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alineación vs {match.opponent}</CardTitle>
          <CardDescription>Arrastra jugadores a la cancha y define tu formación.</CardDescription>
        </CardHeader>
        <CardContent>
          <LineupEditor
            matchId={match.id}
            canEdit={canEdit}
            players={players.map((player) => ({
              membershipId: player.id,
              name: player.user.name,
              number: player.number,
              position: player.position ?? undefined
            }))}
            existing={match.lineup ? {
              formation: match.lineup.formation,
              notes: match.lineup.notes ?? undefined,
              slots: match.lineup.slots.map((slot) => ({
                membershipId: slot.membershipId,
                positionLabel: slot.positionLabel,
                x: slot.x,
                y: slot.y
              }))
            } : null}
          />
        </CardContent>
      </Card>
    </div>
  );
}