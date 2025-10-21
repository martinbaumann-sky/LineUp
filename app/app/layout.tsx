import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LineUp",
  description:
    "La plataforma integral para clubes amateurs y semiprofesionales que necesitan coordinar planteles, fixtures, alineaciones y comunicación en un solo lugar."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased text-foreground",
          inter.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
