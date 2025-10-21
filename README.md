# LineUp

LineUp es una plataforma web para la gestión integral de equipos de fútbol amateur y semiprofesional. Permite coordinar planteles, partidos y alineaciones sin depender de chats o planillas dispersas.

## ¿Qué hace LineUp?

- Registro y login de jugadores.
- Creación y administración de equipos.
- Perfiles personalizables con avatar, bio, dorsal y posición.
- Fixture y gestión completa de partidos.
- Confirmación de asistencia (Voy / No voy / Tal vez).
- Invitación de jugadores mediante link o token.
- Roles personalizados (dueño, staff, jugador, etc.).
- Alineación táctica editable para cada partido (drag & drop).
- Chat del equipo y del partido en tiempo real.
- Notificaciones básicas.
- Interfaz moderna, minimalista y simple.

## Stack técnico

| Área            | Tecnología                           |
| -------------- | ------------------------------------ |
| Framework      | Next.js 14 (App Router) + TypeScript |
| Base de datos  | Prisma + SQLite (local)              |
| UI             | Tailwind CSS + shadcn/ui             |
| Autenticación  | NextAuth (Credentials)               |
| Tiempo real    | Socket.IO                            |
| Validación     | Zod + React Hook Form                |
| Scripts        | `.bat` para entorno local en Windows |

## Requisitos previos

- Node.js 18 o superior.
- Git.
- npm o pnpm.
- (Opcional) Visor de SQLite para inspeccionar la base de datos.

## Setup local

### Windows (script automatizado)

1. Clona el repositorio y entra en la carpeta `LineUp`.
2. Haz doble click en `start-lineup.bat` (o ejecuta `start-lineup.bat` desde una terminal de PowerShell/CMD).
3. El script creará el archivo `.env` si no existe, instalará dependencias, sincronizará la base SQLite y dejará la base limpia para que generes tus propios datos antes de abrir el servidor de desarrollo en `http://localhost:3000`.

### macOS / Linux (script automatizado)

```bash
cd LineUp
chmod +x setup-lineup.sh   # Solo la primera vez
./setup-lineup.sh          # Añade --no-start o --skip-seed si lo necesitas
```

Por defecto se instalan dependencias, se ejecuta Prisma (generate + migrate/db push), se limpia la base de datos y se inicia `npm run dev`. Usa `--no-start` para solo preparar el entorno o `--skip-seed` para conservar tus datos actuales.

### Manual (cualquier sistema operativo)

```bash
git clone https://github.com/TU-USUARIO/LineUp.git
cd LineUp/app

cp ../.env.example .env   # Ajusta secretos y URLs si es necesario

npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts   # Limpia la base de datos (sin datos demo)
npm run dev
```

Luego abre `http://localhost:3000` en tu navegador.

## Estructura (simplificada)

```
/app
  /(auth)
  /dashboard
    /inicio
    /plantel
    /fixture
    /alineacion
    /chat
    /directiva
    /configuracion
/prisma
/scripts
/components
/lib
```

## Roadmap (próximas features)

- Push notifications y correos recordatorios.
- Estadísticas individuales y del equipo.
- Exportar PDF de fichas o planilla táctica.
- Multi-equipo por usuario.
- Modo torneo con ligas privadas.

## Contribuir

Se aceptan PR orientadas a:

- UX clara y consistente.
- Código tipado y coherente.
- Funcionalidades alineadas a la gestión real de equipos.

## Licencia

MIT: libre para estudiar, modificar y usar.
