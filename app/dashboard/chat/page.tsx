import { ChatRoomType } from "@/types/enums";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatPanel } from "@/components/chat/chat-panel";

export default async function ChatPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { team: true }
  });
  if (!membership) redirect("/dashboard/configuracion?onboarding=1");

  const rooms = await prisma.chatRoom.findMany({
    where: { teamId: membership.teamId },
    include: {
      match: true,
      messages: {
        take: 50,
        orderBy: { createdAt: "asc" },
        include: {
          user: true
        }
      }
    }
  });

  const teamRoom = rooms.find((room) => room.type === ChatRoomType.TEAM);
  const matchRooms = rooms.filter((room) => room.type === ChatRoomType.MATCH);

  if (!teamRoom) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No hay sala de equipo</CardTitle>
          <CardDescription>Se creará automáticamente cuando programes partidos.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Chat del equipo</CardTitle>
          <CardDescription>Coordina logística, comparte noticias y mantené al plantel informado.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChatPanel
            currentUserId={session.user.id}
            room={{
              id: teamRoom.id,
              label: teamRoom.match ? `Partido vs ${teamRoom.match.opponent}` : membership.team.name,
              messages: teamRoom.messages.map((message) => ({
                id: message.id,
                content: message.content,
                createdAt: message.createdAt.toISOString(),
                user: {
                  id: message.user.id,
                  name: message.user.name
                }
              }))
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Salas por partido</CardTitle>
          <CardDescription>Revisa conversaciones específicas de cada encuentro.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {matchRooms.map((room) => (
            <ChatPanel
              key={room.id}
              compact
              currentUserId={session.user.id}
              room={{
                id: room.id,
                label: room.match ? `vs ${room.match.opponent}` : "Partido",
                messages: room.messages.map((message) => ({
                  id: message.id,
                  content: message.content,
                  createdAt: message.createdAt.toISOString(),
                  user: {
                    id: message.user.id,
                    name: message.user.name
                  }
                }))
              }}
            />
          ))}
          {matchRooms.length === 0 ? (
            <p className="text-sm text-muted-foreground">Programá partidos para habilitar las salas específicas.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
