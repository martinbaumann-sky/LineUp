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
  { href: "/dashboard/perfil", label: "Perfil" },
  { href: "/dashboard/directiva", label: "Directiva" },
  { href: "/dashboard/configuracion", label: "Configuración" }
];

export function DashboardTabs() {
  const pathname = usePathname();
  const value = routes.find((route) => pathname?.startsWith(route.href))?.href ?? routes[0].href;

  return (
    <div className="border-t border-primary/10 bg-gradient-to-r from-background via-primary/5 to-transparent">
      <div className="mx-auto max-w-6xl px-6">
        <Tabs value={value} className="w-full overflow-x-auto">
          <TabsList className="w-full justify-start gap-2 overflow-x-auto rounded-2xl border border-primary/15 bg-white/70 p-2 shadow-sm shadow-primary/10">
            {routes.map((route) => (
              <TabsTrigger
                key={route.href}
                value={route.href}
                asChild
                className={cn(
                  "rounded-lg px-3 py-1 text-sm transition-colors data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500/15 data-[state=active]:via-primary/15 data-[state=active]:to-indigo-500/15 data-[state=active]:text-primary"
                )}
              >
                <Link href={route.href}>{route.label}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}