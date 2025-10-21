import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { DashboardProvider } from "@/components/dashboard/team-context";
import { DashboardTabs } from "./(components)/dashboard-tabs";
import { DashboardUserMenu } from "./(components)/dashboard-user-menu";
import { ThemeToggle } from "./(components)/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { team: true }
  });

  const header = (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">
            {membership ? membership.team.name : "Bienvenido a LineUp"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {membership ? "Gestiona todo tu club" : "Crea tu primer equipo para comenzar."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <DashboardUserMenu user={session.user} />
        </div>
      </div>
      {membership ? <DashboardTabs /> : null}
    </header>
  );

  const body = (
    <div className="min-h-screen bg-muted/10">
      {header}
      <main className="mx-auto w-full max-w-6xl px-6 py-6">{children}</main>
    </div>
  );

  if (!membership) {
    return (
      <ThemeProvider>
        <div className={cn("min-h-screen bg-background font-sans antialiased")}>{body}</div>
        <Toaster position="top-right" richColors closeButton />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <DashboardProvider
        team={{
          id: membership.team.id,
          name: membership.team.name,
          slug: membership.team.slug,
          crestUrl: membership.team.crestUrl
        }}
        membership={{
          id: membership.id,
          role: membership.role,
          teamId: membership.teamId,
          userId: membership.userId
        }}
      >
        <div className={cn("min-h-screen bg-background font-sans antialiased")}>{body}</div>
      </DashboardProvider>
      <Toaster position="top-right" richColors closeButton />
    </ThemeProvider>
  );
}
