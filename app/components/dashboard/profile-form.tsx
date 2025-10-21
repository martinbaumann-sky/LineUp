"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { POSITION_VALUES } from "@/types/enums";
import { updateProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const initialState: { success?: boolean; error?: string } = {};

interface ProfileFormProps {
  membershipId: string;
  defaults: {
    name: string;
    email: string;
    avatarUrl: string;
    bio: string;
    number: string;
    position: string;
  };
}

export function ProfileForm({ membershipId, defaults }: ProfileFormProps) {
  const updateProfileWithId = updateProfile.bind(null, membershipId);
  const [state, formAction] = useFormState(updateProfileWithId, initialState);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.success) {
      toast.success("Perfil actualizado");
    }
  }, [state?.error, state?.success]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input id="name" name="name" defaultValue={defaults.name} required minLength={2} maxLength={80} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" value={defaults.email} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatarUrl">Foto de perfil (URL)</Label>
          <Input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            defaultValue={defaults.avatarUrl}
            placeholder="https://"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="number">Dorsal</Label>
          <Input
            id="number"
            name="number"
            type="number"
            inputMode="numeric"
            min={0}
            max={99}
            defaultValue={defaults.number}
            placeholder="--"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="position">Posición</Label>
        <select
          id="position"
          name="position"
          defaultValue={defaults.position}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Polivalente</option>
          {POSITION_VALUES.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Descripción</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={defaults.bio}
          placeholder="Comparte cómo juegas, tus logros o enlaces de interés."
          maxLength={280}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">Máximo 280 caracteres.</p>
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? "Guardando cambios..." : "Guardar perfil"}
    </Button>
  );
}
