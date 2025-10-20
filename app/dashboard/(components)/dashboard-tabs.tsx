"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const routes = [
  { href: "/dashboard/inicio", label: "Inicio" },
  { href: "/dashboard/plantel", label: "Plantel" },
  { href: "/dashboard/fixture", label: "Fixture" },
  { href: "/dashboard/alineacion", label: "Alineación" },
  { href: "/dashboard/chat", label: "Chat" },
  { href: "/dashboard/directiva", label: "Directiva" },
  { href: "/dashboard/configuracion", label: "Configuración" }
];

export function DashboardTabs() {
  const pathname = usePathname();
  const value = routes.find((route) => pathname?.startsWith(route.href))?.href ?? routes[0].href;

  return (
    <div className="border-t border-border bg-background/60">
      <div className="mx-auto max-w-6xl px-6">
        <Tabs value={value} className="w-full overflow-x-auto">
          <TabsList className="w-full justify-start gap-1 overflow-x-auto">
            {routes.map((route) => (
              <TabsTrigger key={route.href} value={route.href} asChild className={cn("rounded-md px-3 py-1")}>
                <Link href={route.href}>{route.label}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}