import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LineUp | Acceso",
  description: "Ingresa para gestionar tu equipo."
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-muted/20 p-6">{children}</div>;
}