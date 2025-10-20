import { describe, expect, it } from "vitest";
import { assertRole } from "@/lib/actions/guards";
import { Role } from "@prisma/client";
import { slugify } from "@/lib/utils";

describe("guard helpers", () => {
  it("permite roles autorizados", () => {
    expect(() => assertRole(Role.ADMIN, [Role.ADMIN, Role.OWNER])).not.toThrow();
  });

  it("lanza error cuando no hay permisos", () => {
    expect(() => assertRole(Role.PLAYER, [Role.COACH])).toThrow("Permisos insuficientes");
  });
});

describe("slugify", () => {
  it("normaliza cadenas en slugs legibles", () => {
    expect(slugify("Fútbol & Pasión" )).toBe("futbol-pasion");
  });
});