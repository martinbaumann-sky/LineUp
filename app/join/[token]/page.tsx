import Link from "next/link";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { acceptInvitation } from "@/lib/actions/invitation";

export default async function JoinTeamPage({ params }: { params: { token: string } }) {
  const invitation = await prisma.invitation.findUnique({
    where: { token: params.token },
    include: {
      team: true
    }
  });

  if (!invitation) {
    return (
      <Card className="mx-auto mt-10 w-full max-w-md">
        <CardHeader>
          <CardTitle>Invitación no válida</CardTitle>
          <CardDescription>Verifica que el enlace no haya caducado.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const session = await auth();
  const isExpired = invitation.expiresAt < new Date();

  return (
    <Card className="mx-auto mt-10 w-full max-w-md">
      <CardHeader>
        <CardTitle>Únete a {invitation.team.name}</CardTitle>
        <CardDescription>Rol sugerido: {invitation.roleDefault}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          Invitado por: {invitation.email}. El enlace expira el {invitation.expiresAt.toLocaleDateString("es-AR")}.
        </p>
        {isExpired ? (
          <p className="text-destructive">La invitación está vencida. Solicita un nuevo enlace.</p>
        ) : session?.user?.id ? (
          <form action={acceptInvitation.bind(null, invitation.token)}>
            <Button type="submit" className="w-full">
              Unirme al equipo
            </Button>
          </form>
        ) : (
          <div className="space-y-3">
            <p>Para unirte necesitas iniciar sesión o crear una cuenta.</p>
            <div className="grid gap-2">
              <Button asChild>
                <Link href={`/sign-in?callbackUrl=/join/${invitation.token}`}>Iniciar sesión</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href={`/sign-up?token=${invitation.token}`}>Crear cuenta</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}