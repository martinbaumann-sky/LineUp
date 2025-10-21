import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "@/components/forms/sign-in-form";

export default function SignInPage() {
  return (
    <Card className="w-full border border-border/60 bg-background/95 shadow-xl shadow-primary/10">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight">Bienvenido de vuelta</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Ingresa con tus credenciales para retomar la gestión de tu club.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SignInForm />
        <div className="rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground">
          Consejo: guarda LineUp en tus favoritos para acceder rápido a convocatorias y chats de equipo.
        </div>
        <p className="text-sm text-muted-foreground text-center">
          ¿No tienes cuenta? {" "}
          <Link href="/sign-up" className="font-semibold text-primary">
            Regístrate
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}