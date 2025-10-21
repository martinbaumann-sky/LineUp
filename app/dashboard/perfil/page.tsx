import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: {
      team: true,
      user: true
    }
  });

  if (!membership) {
    redirect("/dashboard/configuracion?onboarding=1");
  }

  const avatar = membership.user.avatarUrl;
  const initials = membership.user.name.slice(0, 2).toUpperCase();

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Tu perfil</CardTitle>
          <CardDescription>Personaliza la información que verá tu plantel.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            membershipId={membership.id}
            defaults={{
              name: membership.user.name,
              email: membership.user.email,
              avatarUrl: avatar ?? "",
              bio: membership.user.bio ?? "",
              number: membership.number?.toString() ?? "",
              position: membership.position ?? ""
            }}
          />
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="mb-3 h-20 w-20">
              <AvatarImage src={avatar ?? undefined} alt={membership.user.name} />
              <AvatarFallback className="text-2xl font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-xl">{membership.user.name}</CardTitle>
              <CardDescription>{membership.user.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Equipo</span>
              <span className="font-semibold">{membership.team.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Rol</span>
              <Badge variant="secondary">{membership.role}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Integras el equipo desde</span>
              <span className="font-semibold">{formatDate(membership.joinedAt)}</span>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Bio</p>
              <p className="mt-1 text-sm text-foreground/80">
                {membership.user.bio ? membership.user.bio : "Completa tu descripción para que el equipo te conozca mejor."}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Consejos rápidos</CardTitle>
            <CardDescription>Refuerza la identidad de tu perfil.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Usa una foto clara y actualizada para que el staff te identifique rápidamente.</p>
            <p>• Mantén tu descripción breve e incluye tu posición preferida o logros destacados.</p>
            <p>• Actualiza tu dorsal y posición cuando cambien para mantener alineado al plantel.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
