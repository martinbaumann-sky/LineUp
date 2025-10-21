import { MATCH_STATUS_VALUES, Role, ensureRole } from "@/types/enums";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchForm } from "@/components/forms/match-form";
import { updateMatchStatus, deleteMatch } from "@/lib/actions/match";
import { formatDate } from "@/lib/utils";

export default async function FixturePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { team: true }
  });
  if (!membership) redirect("/dashboard/configuracion?onboarding=1");

  const matches = await prisma.match.findMany({
    where: { teamId: membership.teamId },
    orderBy: { kickoffAt: "asc" },
    include: { availability: true }
  });

  const membershipRole = ensureRole(membership.role);
  const canManage = [Role.OWNER, Role.ADMIN, Role.COACH].includes(membershipRole);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        {matches.map((match) => (
          <Card key={match.id}>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">vs {match.opponent}</CardTitle>
                <CardDescription>
                  {formatDate(match.kickoffAt)} · {match.location}
                </CardDescription>
              </div>
              <Badge>{match.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {match.competition ? (
                <p><span className="font-medium">Competencia:</span> {match.competition}</p>
              ) : null}
              {match.notes ? (
                <p className="text-muted-foreground">{match.notes}</p>
              ) : null}
              <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                <div>
                  Confirmados: {match.availability.filter((a) => a.status === "YES").length}
                </div>
                <div>
                  Dudas: {match.availability.filter((a) => a.status === "MAYBE").length}
                </div>
                <div>
                  Bajas: {match.availability.filter((a) => a.status === "NO").length}
                </div>
              </div>
              {canManage ? (
                <div className="flex flex-wrap gap-2">
                  {MATCH_STATUS_VALUES.map((status) => (
                    <form key={status} action={updateMatchStatus.bind(null, match.id, status)}>
                      <Button type="submit" size="sm" variant={match.status === status ? "default" : "outline"}>
                        {status}
                      </Button>
                    </form>
                  ))}
                  <form action={deleteMatch.bind(null, match.id)}>
                    <Button type="submit" size="sm" variant="destructive">
                      Eliminar
                    </Button>
                  </form>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
        {matches.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Sin partidos cargados</CardTitle>
              <CardDescription>Agrega el próximo encuentro para organizar a todos.</CardDescription>
            </CardHeader>
          </Card>
        ) : null}
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Programar partido</CardTitle>
            <CardDescription>Define rival, sede y detalles logísticos.</CardDescription>
          </CardHeader>
          <CardContent>{canManage ? <MatchForm teamId={membership.teamId} /> : <p className="text-sm text-muted-foreground">Solo el staff puede crear partidos.</p>}</CardContent>
        </Card>
      </div>
    </div>
  );
}
