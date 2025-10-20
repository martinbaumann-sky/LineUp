import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        LineUp
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        La plataforma integral para clubes amateurs y semiprofesionales que
        necesitan coordinar planteles, fixtures, alineaciones y comunicación en
        un solo lugar.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild>
          <Link href="/sign-up">Crear cuenta</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/sign-in">Iniciar sesión</Link>
        </Button>
      </div>
      <div className="mt-10 grid w-full gap-4 text-left sm:grid-cols-2">
        {highlights.map((item) => (
          <div key={item.title} className="rounded-lg border border-border bg-card/50 p-6">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

const highlights = [
  {
    title: "Convocatorias inteligentes",
    description: "Gestiona asistencias y notifica cambios al plantel en segundos."
  },
  {
    title: "Editor táctico",
    description: "Diseña la alineación ideal con drag-and-drop sobre una cancha interactiva."
  },
  {
    title: "Chat y presencia",
    description: "Mantén al equipo conectado con salas por partido y estado en línea."
  },
  {
    title: "Estadísticas claras",
    description: "Visibiliza minutos, asistencias y rachas para tomar mejores decisiones."
  }
];