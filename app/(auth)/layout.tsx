import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const highlights = [
  "Convocatorias inteligentes y chats en vivo",
  "Alineaciones tácticas listas para compartir",
  "Perfiles personalizables para todo el plantel"
];

export const metadata: Metadata = {
  title: "LineUp | Acceso",
  description: "Ingresa para gestionar tu equipo."
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/3 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(129,140,248,0.18),_transparent_60%)] blur-3xl"
      />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-10 rounded-3xl border border-white/15 bg-white/10 p-8 shadow-[0_40px_80px_-40px_rgba(12,74,110,0.45)] backdrop-blur-2xl lg:grid-cols-[1.1fr,1fr] lg:p-12">
          <div className="hidden flex-col justify-between text-slate-100 lg:flex">
            <div className="space-y-6">
              <Link href="/" className="inline-flex items-center text-lg font-semibold tracking-tight">
                LineUp
              </Link>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold leading-tight">
                  Organización clara para clubes que juegan en serio.
                </h1>
                <p className="text-sm text-slate-300">
                  Reúne a tu plantel, comparte alineaciones y mantén a todo el equipo en la misma página desde un panel único.
                </p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-200/90">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex w-full justify-center">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-background/95 p-8 shadow-lg shadow-sky-500/10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}