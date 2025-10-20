"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { matchSchema } from "@/lib/validators/match";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createMatch } from "@/lib/actions/match";
import { useTransition } from "react";
import { toast } from "sonner";

export function MatchForm({ teamId }: { teamId: string }) {
  const form = useForm<z.infer<typeof matchSchema>>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      opponent: "",
      location: "",
      competition: "",
      notes: "",
      kickoffAt: new Date().toISOString().slice(0, 16)
    }
  });
  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof matchSchema>) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value instanceof Date ? value.toISOString() : String(value));
    });
    startTransition(async () => {
      const result = await createMatch(teamId, formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Partido creado");
      form.reset();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="opponent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rival</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del rival" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Estadio o cancha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kickoffAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha y hora</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="competition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Competencia</FormLabel>
              <FormControl>
                <Input placeholder="Liga, copa..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalles logísticos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creando..." : "Crear partido"}
        </Button>
      </form>
    </Form>
  );
}