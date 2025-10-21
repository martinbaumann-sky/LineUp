#!/usr/bin/env bash
set -euo pipefail

START_DEV=true
SKIP_SEED=false

usage() {
  cat <<'USAGE'
Uso: ./setup-lineup.sh [opciones]

Opciones disponibles:
  --no-start    Solo prepara el entorno sin iniciar el servidor de desarrollo.
  --skip-seed   Omite la carga de datos de ejemplo (prisma/seed.ts).
  -h, --help    Muestra esta ayuda.
USAGE
}

while (($#)); do
  case "$1" in
    --no-start)
      START_DEV=false
      ;;
    --skip-seed)
      SKIP_SEED=true
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Opción desconocida: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
  shift
done

info() {
  printf '\033[1;34m[INFO]\033[0m %s\n' "$1"
}

warn() {
  printf '\033[1;33m[ADVERTENCIA]\033[0m %s\n' "$1"
}

error_msg() {
  printf '\033[1;31m[ERROR]\033[0m %s\n' "$1"
}

trap 'error_msg "El script se detuvo por un problema. Revisa los mensajes anteriores."' ERR

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$ROOT_DIR/app"

if ! command -v npm >/dev/null 2>&1; then
  error_msg "npm no está instalado o no está disponible en el PATH."
  exit 1
fi

if [ ! -f "$APP_DIR/package.json" ]; then
  error_msg "No se encontró package.json en $APP_DIR. Ejecuta este script desde la raíz del repositorio LineUp."
  exit 1
fi

ensure_env_files() {
  local root_env="$ROOT_DIR/.env"
  local root_env_example="$ROOT_DIR/.env.example"
  local app_env="$APP_DIR/.env"

  if [ ! -f "$root_env" ] && [ -f "$root_env_example" ]; then
    info "Creando .env en la raíz a partir de .env.example..."
    cp "$root_env_example" "$root_env"
  fi

  if [ ! -f "$app_env" ]; then
    if [ -f "$root_env" ]; then
      info "Copiando configuración hacia app/.env..."
      cp "$root_env" "$app_env"
    elif [ -f "$root_env_example" ]; then
      info "Creando app/.env a partir de .env.example..."
      cp "$root_env_example" "$app_env"
    else
      warn "No se encontró archivo .env ni .env.example. Configura las variables manualmente."
    fi
  fi
}

apply_prisma() {
  if compgen -G "$APP_DIR/prisma/migrations/[0-9]*_*" >/dev/null; then
    info "Aplicando migraciones de Prisma..."
    npx prisma migrate deploy
  else
    info "Sin migraciones detectadas, sincronizando esquema con prisma db push..."
    npx prisma db push
  fi
}

run_seed() {
  if [ "$SKIP_SEED" = true ]; then
    info "Se omite la carga de datos de ejemplo (flag --skip-seed)."
    return
  fi

  if [ -f "$APP_DIR/prisma/seed.ts" ]; then
    info "Cargando datos de ejemplo (prisma/seed.ts)..."
    npx tsx prisma/seed.ts
  else
    warn "No se encontró prisma/seed.ts. Se omite la carga de datos."
  fi
}

ensure_env_files

pushd "$APP_DIR" >/dev/null || {
  error_msg "No se pudo acceder al directorio $APP_DIR."
  exit 1
}
trap 'popd >/dev/null 2>&1' EXIT

info "Instalando dependencias (npm install)..."
npm install

info "Generando cliente de Prisma..."
npx prisma generate

apply_prisma
run_seed

if [ "$START_DEV" = true ]; then
  info "Iniciando servidor de desarrollo (Ctrl+C para detener)..."
  npm run dev
else
  info "Setup completado. Ejecuta 'cd app && npm run dev' para iniciar el servidor."
fi
