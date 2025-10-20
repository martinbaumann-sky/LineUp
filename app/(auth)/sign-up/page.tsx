import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "@/components/forms/sign-up-form";

export default function SignUpPage({ searchParams }: { searchParams: { token?: string } }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Crea tu cuenta</CardTitle>
        <CardDescription>Organiza tu club y suma a tu plantel.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SignUpForm token={searchParams.token} />
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes cuenta? <Link href="/sign-in" className="font-semibold text-primary">Inicia sesión</Link>
        </p>
      </CardContent>
    </Card>
  );
}