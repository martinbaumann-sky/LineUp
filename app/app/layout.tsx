import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LineUp",
  description:
    "La plataforma integral para clubes amateurs y semiprofesionales que necesitan coordinar planteles, fixtures, alineaciones y comunicación en un solo lugar."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
