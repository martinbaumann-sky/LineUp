import { AvailabilityStatus as AvailabilityStatusEnum, MatchStatus } from "@/types/enums";
import type { AvailabilityStatus } from "@/types/enums";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setAvailability } from "@/lib/actions/match";
import { formatDate } from "@/lib/utils";

export default async function DashboardHomePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: {
      team: true
    }
  });
  if (!membership) redirect("/dashboard/configuracion?onboarding=1");

  const nextMatch = await prisma.match.findFirst({
    where: { teamId: membership.teamId, status: MatchStatus.SCHEDULED },
    orderBy: { kickoffAt: "asc" },
    include: {
      availability: true
    }
  });

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  const upcomingMatches = await prisma.match.findMany({
    where: { teamId: membership.teamId },
    orderBy: { kickoffAt: "asc" },
    take: 3
  });

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximo partido</CardTitle>
            <CardDescription>Confirma tu disponibilidad para ayudar al cuerpo técnico.</CardDescription>
          </CardHeader>
          <CardContent>
            {nextMatch ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-lg font-semibold">vs {nextMatch.opponent}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(nextMatch.kickoffAt)} · {nextMatch.location}
                    </p>
                  </div>
                  <Badge variant="secondary">{nextMatch.competition ?? "Amistoso"}</Badge>
                </div>
                <form action={setAvailability.bind(null, nextMatch.id)} className="flex gap-2">
                  {Object.values(AvailabilityStatusEnum).map((status) => (
                    <Button key={status} name="status" value={status} type="submit" variant="outline">
                      {availabilityCopy[status]}
                    </Button>
                  ))}
                </form>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aún no hay partidos programados.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Próximos compromisos</CardTitle>
            <CardDescription>Planifica con anticipación los siguientes encuentros.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingMatches.length ? (
              upcomingMatches.map((match) => (
                <div key={match.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{match.opponent}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(match.kickoffAt)}</p>
                  </div>
                  <Badge>{match.status}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Sin partidos próximos.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>Últimas novedades de tu equipo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.length ? (
              notifications.map((notif) => (
                <div key={notif.id} className="rounded-md border border-border p-3">
                  <p className="text-sm font-medium">{notificationCopy[notif.type] ?? notif.type}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(notif.createdAt)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Sin notificaciones por ahora.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Indicadores rápidos</CardTitle>
            <CardDescription>Compromiso del plantel en la temporada.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span>Asistencias confirmadas</span>
                <span className="font-semibold">
                  {nextMatch?.availability.filter((a) => a.status === AvailabilityStatus.YES).length ?? 0}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Ausencias</span>
                <span className="font-semibold">
                  {nextMatch?.availability.filter((a) => a.status === AvailabilityStatus.NO).length ?? 0}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Indefinidos</span>
                <span className="font-semibold">
                  {nextMatch?.availability.filter((a) => a.status === AvailabilityStatus.MAYBE).length ?? 0}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const availabilityCopy: Record<AvailabilityStatus, string> = {
  YES: "Voy",
  NO: "No voy",
  MAYBE: "Tal vez"
};

const notificationCopy: Record<string, string> = {
  MATCH_CREATED: "Nuevo partido programado",
  LINEUP_PUBLISHED: "Alineación disponible"
};
