"use client";

import { useMemo, useState, useTransition } from "react";
import { saveLineup } from "@/lib/actions/lineup";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PlayerItem {
  membershipId: string;
  name: string;
  number: number | null;
  position?: string;
}

interface LineupSlotState {
  membershipId: string;
  positionLabel: string;
  x: number;
  y: number;
}

interface Props {
  matchId: string;
  canEdit: boolean;
  players: PlayerItem[];
  existing: {
    formation: string;
    notes?: string;
    slots: LineupSlotState[];
  } | null;
}

export function LineupEditor({ matchId, canEdit, players, existing }: Props) {
  const [formation, setFormation] = useState(existing?.formation ?? "4-3-3");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [slots, setSlots] = useState<LineupSlotState[]>(existing?.slots ?? []);
  const [isPending, startTransition] = useTransition();

  const availablePlayers = useMemo(() => {
    const placed = new Set(slots.map((slot) => slot.membershipId));
    return players.filter((player) => !placed.has(player.membershipId));
  }, [players, slots]);

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    if (!canEdit) return;
    event.preventDefault();
    const membershipId = event.dataTransfer.getData("membershipId");
    if (!membershipId) return;
    const player = players.find((item) => item.membershipId === membershipId);
    if (!player) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setSlots((prev) => {
      const filtered = prev.filter((slot) => slot.membershipId !== membershipId);
      return [
        ...filtered,
        {
          membershipId,
          positionLabel: player.position ?? "Jugador",
          x: Number(x.toFixed(3)),
          y: Number(y.toFixed(3))
        }
      ];
    });
  }

  async function handleSave() {
    startTransition(async () => {
      const result = await saveLineup(matchId, {
        formation,
        notes,
        slots
      });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Alineación guardada");
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div>
        <div
          className="relative aspect-[3/2] w-full rounded-xl border border-border bg-gradient-to-b from-emerald-600/60 to-emerald-800/80"
          onDragOver={(event) => canEdit && event.preventDefault()}
          onDrop={handleDrop}
        >
          <svg viewBox="0 0 120 80" className="h-full w-full text-emerald-200/70">
            <rect x="5" y="5" width="110" height="70" fill="none" strokeWidth="1" stroke="currentColor" rx="4" />
            <line x1="60" y1="5" x2="60" y2="75" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="60" cy="40" r="6" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <rect x="5" y="25" width="18" height="30" fill="none" stroke="currentColor" strokeWidth="0.8" rx="2" />
            <rect x="97" y="25" width="18" height="30" fill="none" stroke="currentColor" strokeWidth="0.8" rx="2" />
          </svg>
          {slots.map((slot) => {
            const player = players.find((item) => item.membershipId === slot.membershipId);
            if (!player) return null;
            return (
              <div
                key={slot.membershipId}
                className="absolute flex h-10 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-black/70 px-2 text-center text-xs text-white"
                style={{ left: `${slot.x * 100}%`, top: `${slot.y * 100}%` }}
              >
                <span className="font-semibold">{player.number ?? "#"}</span>
                <span className="truncate">{player.name}</span>
                {canEdit ? (
                  <button
                    type="button"
                    className="text-[10px] uppercase text-red-300"
                    onClick={() => setSlots((prev) => prev.filter((item) => item.membershipId !== slot.membershipId))}
                  >
                    Quitar
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Formación</label>
          <Input value={formation} onChange={(event) => setFormation(event.target.value)} disabled={!canEdit} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Notas</label>
          <Textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            disabled={!canEdit}
            placeholder="Indica ajustes tácticos o recordatorios."
          />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium">Jugadores disponibles</p>
          <div className="grid gap-2">
            {availablePlayers.map((player) => (
              <div
                key={player.membershipId}
                draggable={canEdit}
                onDragStart={(event) => {
                  event.dataTransfer.setData("membershipId", player.membershipId);
                  event.dataTransfer.effectAllowed = "move";
                }}
                className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{player.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {player.position ?? "Polivalente"}
                  </p>
                </div>
                <Badge variant="secondary">#{player.number ?? ""}</Badge>
              </div>
            ))}
            {availablePlayers.length === 0 ? (
              <p className="text-xs text-muted-foreground">Todos los jugadores están ubicados.</p>
            ) : null}
          </div>
        </div>
        {canEdit ? (
          <Button className="w-full" onClick={handleSave} disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar alineación"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}