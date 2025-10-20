"use client";

import { Position } from "@prisma/client";

export function PositionFilter({ value }: { value?: Position }) {
  return (
    <form className="flex items-center gap-2">
      <label htmlFor="position" className="text-sm text-muted-foreground">
        Posición
      </label>
      <select
        id="position"
        name="position"
        defaultValue={value ?? ""}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        onChange={(event) => {
          const selected = event.currentTarget.value;
          const url = new URL(window.location.href);
          if (selected) {
            url.searchParams.set("position", selected);
          } else {
            url.searchParams.delete("position");
          }
          window.location.href = url.toString();
        }}
      >
        <option value="">Todas</option>
        {Object.values(Position).map((pos) => (
          <option key={pos} value={pos}>
            {pos}
          </option>
        ))}
      </select>
    </form>
  );
}