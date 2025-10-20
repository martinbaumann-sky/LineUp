"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateInvitation } from "@/lib/actions/team";
import { toast } from "sonner";

const roles = ["PLAYER", "COACH", "ADMIN"] as const;

export function InvitationGenerator({ teamId, canManage }: { teamId: string; canManage: boolean }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManage) return;
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await generateInvitation(teamId, formData);
    setIsLoading(false);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    setToken(result?.token ?? null);
    toast.success("Invitación generada");
    event.currentTarget.reset();
  }

  if (!canManage) {
    return <p className="text-sm text-muted-foreground">Solo el staff puede generar invitaciones.</p>;
  }

  const invitationUrl = token && typeof window !== "undefined" ? `${window.location.origin}/join/${token}` : null;

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="grid gap-2 sm:grid-cols-[2fr,1fr,1fr] sm:items-end">
        <div className="space-y-1">
          <label className="text-xs font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            required
            type="email"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium" htmlFor="role">
            Rol
          </label>
          <select id="role" name="role" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium" htmlFor="expiresAt">
            Expira
          </label>
          <input
            id="expiresAt"
            name="expiresAt"
            type="date"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            required
            defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}
          />
        </div>
        <Button type="submit" className="sm:col-span-3" disabled={isLoading}>
          {isLoading ? "Generando..." : "Generar enlace"}
        </Button>
      </form>
      {token ? (
        <div className="rounded-md border border-border bg-muted/40 p-3 text-xs">
          <p className="font-semibold">Invitación lista</p>
          <p className="mt-1 break-all">{invitationUrl}</p>
        </div>
      ) : null}
    </div>
  );
}