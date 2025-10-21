import Link from "next/link";
import {
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  Trophy,
  Users,
  Zap
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

const navigation = [
  { name: "Funciones", href: "#features" },
  { name: "Flujo de trabajo", href: "#workflow" },
  { name: "Experiencias", href: "#experience" }
];

const highlights = [
  "Convocatorias con un clic",
  "Alineaciones tácticas interactivas",
  "Chat en vivo y control de asistencia",
  "Estadísticas accionables para el cuerpo técnico"
];

const featureTabs = [
  {
    value: "convocatorias",
    label: "Convocatorias",
    icon: CalendarCheck,
    title: "Confirma quién llega sin perseguir jugadores",
    description:
      "Envía invitaciones inteligentes, automatiza recordatorios y consolida respuestas en un panel claro para cada partido o entrenamiento.",
    bullets: [
      "Recordatorios automáticos por canal preferido",
      "Historial de asistencia individual",
      "Integración con calendarios personales"
    ]
  },
  {
    value: "editor",
    label: "Editor táctico",
    icon: LayoutDashboard,
    title: "Diseña tu estrategia con precisión",
    description:
      "Arrastra y suelta jugadores sobre una cancha interactiva, guarda variantes y comparte la táctica con tu staff en segundos.",
    bullets: [
      "Plantillas personalizadas por torneo",
      "Comparte versiones con roles y notas",
      "Simulaciones para balón parado"
    ]
  },
  {
    value: "comunicacion",
    label: "Comms",
    icon: MessageCircle,
    title: "Mantén al plantel alineado todo el tiempo",
    description:
      "Centraliza los mensajes en salas organizadas por competencia, añade encuestas rápidas y controla el estado en línea de cada integrante.",
    bullets: [
      "Chats por partido, línea o staff",
      "Encuestas instantáneas para decisiones rápidas",
      "Menciones y adjuntos con historial ordenado"
    ]
  },
  {
    value: "perfiles",
    label: "Perfiles",
    icon: Users,
    title: "Cada jugador con su identidad",
    description:
      "Permite que cada integrante configure su foto, bio, dorsal y posición para que el cuerpo técnico tenga datos actualizados al instante.",
    bullets: [
      "Perfiles editables desde el panel",
      "Historial de dorsales y posiciones",
      "Datos coherentes en todo el plantel"
    ]
  },
  {
    value: "estadisticas",
    label: "Estadísticas",
    icon: BarChart3,
    title: "Toma decisiones con datos confiables",
    description:
      "Visualiza cargas de minutos, rachas de rendimiento y métricas de salud para anticipar riesgos y potenciar el rendimiento del equipo.",
    bullets: [
      "KPIs personalizables por rol",
      "Alertas de sobrecarga y lesiones",
      "Reportes listos para compartir en PDF"
    ]
  }
];

const defaultFeatureTab = featureTabs[0]?.value ?? "convocatorias";

const workflow = [
  {
    title: "Convoca",
    description:
      "Genera un evento, define requisitos y la convocatoria se envía a todo el plantel en segundos.",
    icon: Users
  },
  {
    title: "Organiza",
    description:
      "Confirma asistencia, arma la alineación y comparte la táctica definitiva con tu staff.",
    icon: ShieldCheck
  },
  {
    title: "Ejecuta",
    description:
      "Coordina el día del partido con chats en vivo, registro de presencia y notas clave.",
    icon: Zap
  },
  {
    title: "Analiza",
    description:
      "Recibe reportes automáticos, detecta patrones y planifica el próximo encuentro con contexto.",
    icon: Trophy
  }
];

const experienceHighlights = [
  {
    title: "Perfiles vivos",
    description: "Cada jugador define su avatar, bio y dorsal para mantener al staff actualizado."
  },
  {
    title: "Equipos conectados",
    description: "Chats y notificaciones en tiempo real centralizan la comunicación clave."
  },
  {
    title: "Decisiones con contexto",
    description: "Disponibilidad y alineaciones siempre accesibles para planificar sin sorpresas."
  }
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_60%)]"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-16">
        <header className="flex flex-wrap items-center justify-between gap-4 py-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            LineUp
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                {item.name}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Crear cuenta</Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-12 py-12 md:grid-cols-[minmax(0,1fr),minmax(0,420px)] md:items-center">
          <div className="space-y-8">
            <Badge variant="secondary" className="w-fit">
              Beta abierta para clubes latinoamericanos
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                Coordina tu club en un solo lugar, con claridad y foco.
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                LineUp combina gestión deportiva, comunicación y analítica para cuerpos técnicos que necesitan moverse rápido sin
                perder el control.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/sign-up">Probar LineUp</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Ver funcionalidades</Link>
              </Button>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-2xl shadow-primary/10 backdrop-blur">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" aria-hidden />
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
                  <span>Plantel mayor</span>
                  <span>Próximo partido</span>
                </div>
                <p className="mt-2 text-2xl font-semibold">Tu próximo partido</p>
                <p className="text-sm text-muted-foreground">Configura rival, fecha y sede y comparte la información con todo el plantel.</p>
              </div>
              <div className="grid gap-4 rounded-2xl bg-muted/60 p-4">
                {mockLineup.map((player) => (
                  <div key={player.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {player.number}
                      </span>
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-xs text-muted-foreground">{player.role}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{player.status}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Asistencia confirmada: datos en vivo</span>
                <span>Sincronizado en tiempo real</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="space-y-8 py-16">
          <div className="space-y-4 text-center">
            <Badge variant="secondary" className="mx-auto w-fit">
              Todo lo que un cuerpo técnico necesita
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Funcionalidades pensadas para tu staff</h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              Cambia entre módulos para ver cómo LineUp unifica convocatorias, táctica, comunicación y análisis en una experiencia
              simple y potente.
            </p>
          </div>
          <Tabs defaultValue={defaultFeatureTab} className="mx-auto w-full max-w-4xl">
            <TabsList className="flex flex-wrap justify-center gap-2 bg-muted/60 p-2">
              {featureTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:bg-background">
                  <tab.icon className="mr-2 h-4 w-4" aria-hidden />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {featureTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <Card className="border-border/70 bg-card/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <tab.icon className="h-6 w-6 text-primary" aria-hidden />
                      {tab.title}
                    </CardTitle>
                    <CardDescription className="text-base">{tab.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-3 sm:grid-cols-3">
                      {tab.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        <section id="workflow" className="space-y-8 py-16">
          <div className="grid gap-4 text-center">
            <Badge variant="secondary" className="mx-auto w-fit">
              Un flujo claro de principio a fin
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Gestiona cada partido con la misma precisión</h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              LineUp guía a tu equipo desde la convocatoria hasta el análisis post partido, para que siempre tengas la información y
              las acciones clave a la mano.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {workflow.map((step, index) => (
              <Card key={step.title} className="border-border/70 bg-card/80 backdrop-blur">
                <CardHeader className="flex flex-row items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <CardTitle className="text-xl">
                      <step.icon className="mr-2 inline-block h-5 w-5 text-primary" aria-hidden />
                      {step.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm text-muted-foreground">
                      {step.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="experience" className="space-y-8 py-16">
          <div className="grid gap-4 text-center">
            <Badge variant="secondary" className="mx-auto w-fit">
              Diseñado para el día a día del club
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Una experiencia que crece con tu plantel</h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              LineUp evoluciona con tu equipo: desde la personalización del perfil hasta la coordinación de cada partido.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {experienceHighlights.map((item) => (
              <Card key={item.title} className="border-border/70 bg-card/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{item.description}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/20 p-10 text-center shadow-lg">
          <div className="absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" aria-hidden />
          <div className="absolute -right-16 top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" aria-hidden />
          <div className="relative space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              ¿Listo para llevar a tu club al siguiente nivel?
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              Crea tu cuenta gratuita, invita a tu plantel y empieza a coordinar partidos, chats y alineaciones en minutos.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/sign-up">Crear cuenta gratis</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Ver funcionalidades</Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="mt-16 flex flex-col items-center gap-3 border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
          <div className="font-medium text-foreground">LineUp</div>
          <div className="flex flex-wrap justify-center gap-4">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                {item.name}
              </a>
            ))}
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacidad
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Términos
            </Link>
          </div>
          <p>© {new Date().getFullYear()} LineUp. Todos los derechos reservados.</p>
        </footer>
      </div>
    </main>
  );
}

const mockLineup = [
  { number: 1, name: "Jugador/a 1", role: "Arquero/a", status: "Confirmado" },
  { number: 4, name: "Jugador/a 2", role: "Defensor/a", status: "Por definir" },
  { number: 5, name: "Jugador/a 3", role: "Volante", status: "En evaluación" },
  { number: 9, name: "Jugador/a 4", role: "Delantero/a", status: "Confirmado" }
];
