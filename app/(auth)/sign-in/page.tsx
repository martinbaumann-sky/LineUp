import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "@/components/forms/sign-in-form";

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bienvenido de vuelta</CardTitle>
        <CardDescription>Ingresa con tus credenciales para continuar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SignInForm />
        <p className="text-sm text-muted-foreground">
          ¿No tienes cuenta? <Link href="/sign-up" className="font-semibold text-primary">Regístrate</Link>
        </p>
      </CardContent>
    </Card>
  );
}