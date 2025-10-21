import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "@/components/forms/sign-up-form";

export default function SignUpPage({ searchParams }: { searchParams: { token?: string } }) {
  return (
    <Card className="w-full border border-border/60 bg-background/95 shadow-xl shadow-primary/10">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight">Crea tu cuenta</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Organiza tu club, convoca a tus jugadores y centraliza la comunicación.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SignUpForm token={searchParams.token} />
        <div className="rounded-lg bg-gradient-to-r from-sky-500/10 via-primary/10 to-indigo-500/10 p-4 text-left text-xs text-muted-foreground">
          <p className="font-medium text-primary">¿Llegaste por invitación?</p>
          <p>Ingresa el correo asociado y usaremos tu token para sumarte al equipo en segundos.</p>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          ¿Ya tienes cuenta? {" "}
          <Link href="/sign-in" className="font-semibold text-primary">
            Inicia sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}