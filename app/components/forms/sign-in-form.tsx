"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const registered = params?.get("registered");
  const callbackUrl = params?.get("callbackUrl") ?? "/dashboard/inicio";

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsLoading(true);
      setFormError(null);
      const result = await signIn("credentials", {
        ...values,
        redirect: false
      });
      if (result?.error) {
        setFormError(result.error);
        toast.error(result.error);
        return;
      }
      router.push(callbackUrl);
    } catch (error) {
      console.error(error);
      const message = "Ocurrió un error al iniciar sesión. Intenta nuevamente.";
      setFormError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {registered ? (
          <div className="rounded-md border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-300">
            Cuenta creada, inicia sesión.
          </div>
        ) : null}
        {formError ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {formError}
          </div>
        ) : null}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="tu@correo.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input placeholder="********" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Ingresando..." : "Iniciar sesión"}
        </Button>
      </form>
    </Form>
  );
}