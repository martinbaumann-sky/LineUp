@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem =========================================================
rem  LineUp - Setup inicial (Windows)
rem =========================================================

set "START_DEV=true"
set "SKIP_SEED=false"

call :parseArgs %*
if errorlevel 1 exit /b 1

if /I "%HELP_REQUESTED%"=="true" (
    call :printUsage
    exit /b 0
)

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "APP_DIR=%ROOT_DIR%\app"

if not exist "%APP_DIR%\package.json" (
    call :error "No se encontró package.json en \"%APP_DIR%\". Ejecuta este script desde la raíz del proyecto."
    exit /b 1
)

call :ensureEnvFiles || goto :errorHandler

pushd "%ROOT_DIR%" >nul || (
    call :error "No se pudo acceder al directorio del repositorio."
    exit /b 1
)
set "ROOT_PUSHED=1"

pushd "%APP_DIR%" >nul || goto :errorHandler
set "APP_PUSHED=1"

call :info "Instalando dependencias (npm install)..."
call npm install || goto :errorHandler

call :info "Generando cliente de Prisma..."
call npx --yes prisma generate || goto :errorHandler

call :applyPrisma || goto :errorHandler
call :runSeed || goto :errorHandler

if /I "%START_DEV%"=="true" (
    call :info "Iniciando servidor de desarrollo (Ctrl+C para detener)..."
    call npm run dev
    set "EXIT_CODE=%ERRORLEVEL%"
) else (
    call :info "Setup completado. Ejecuta \"cd app && npm run dev\" para iniciar el servidor."
    set "EXIT_CODE=0"
)
goto :cleanup

:parseArgs
set "HELP_REQUESTED=false"
:parseLoop
if "%~1"=="" goto :eof
if /I "%~1"=="--no-start" (
    set "START_DEV=false"
) else if /I "%~1"=="--skip-seed" (
    set "SKIP_SEED=true"
) else if /I "%~1"=="-h" (
    set "HELP_REQUESTED=true"
) else if /I "%~1"=="--help" (
    set "HELP_REQUESTED=true"
) else (
    call :error "Opción desconocida: %~1"
    call :printUsage
    exit /b 1
)
shift
goto :parseLoop

:printUsage
echo Uso: setup.bat [opciones]
echo.
echo Opciones disponibles:
echo   --no-start    Solo prepara el entorno sin iniciar el servidor de desarrollo.
echo   --skip-seed   Omite la carga de datos de ejemplo (prisma\seed.ts).
echo   -h, --help    Muestra esta ayuda.
goto :eof

:ensureEnvFiles
set "ROOT_ENV=%ROOT_DIR%\.env"
set "ROOT_ENV_EXAMPLE=%ROOT_DIR%\.env.example"
set "APP_ENV=%APP_DIR%\.env"

if not exist "%ROOT_ENV%" (
    if exist "%ROOT_ENV_EXAMPLE%" (
        call :info "Creando archivo .env en la raíz a partir de .env.example..."
        copy /Y "%ROOT_ENV_EXAMPLE%" "%ROOT_ENV%" >nul || exit /b 1
    )
)

if not exist "%APP_ENV%" (
    if exist "%ROOT_ENV%" (
        call :info "Copiando configuración hacia app\.env..."
        copy /Y "%ROOT_ENV%" "%APP_ENV%" >nul || exit /b 1
    ) else if exist "%ROOT_ENV_EXAMPLE%" (
        call :info "Creando app\.env a partir de .env.example..."
        copy /Y "%ROOT_ENV_EXAMPLE%" "%APP_ENV%" >nul || exit /b 1
    ) else (
        call :warn "No se encontró un archivo .env ni .env.example. Configura las variables manualmente."
    )
)
exit /b 0

:applyPrisma
set "MIGRATIONS_DIR=%APP_DIR%\prisma\migrations"
if exist "%MIGRATIONS_DIR%" (
    for /f "delims=" %%M in ('dir /b /ad "%MIGRATIONS_DIR%" ^| findstr /r "^[0-9]"') do (
        call :info "Aplicando migraciones de Prisma..."
        call npx --yes prisma migrate deploy || exit /b 1
        goto :applyPrismaDone
    )
)

call :info "Sin migraciones detectadas, sincronizando esquema con prisma db push..."
call npx --yes prisma db push || exit /b 1

:applyPrismaDone
exit /b 0

:runSeed
if /I "%SKIP_SEED%"=="true" (
    call :info "Se omite la carga de datos de ejemplo (--skip-seed)."
    exit /b 0
)

if exist "%APP_DIR%\prisma\seed.ts" (
    call :info "Cargando datos de ejemplo (prisma\seed.ts)..."
    call npx --yes tsx prisma/seed.ts || exit /b 1
) else (
    call :warn "No se encontró prisma\seed.ts. Se omite la carga de datos."
)
exit /b 0

:info
echo [INFO] %*
goto :eof

:warn
echo [ADVERTENCIA] %*
goto :eof

:error
echo [ERROR] %*
goto :eof

:errorHandler
set "EXIT_CODE=%ERRORLEVEL%"
call :error "El script se detuvo por un problema. Revisa los mensajes anteriores."
goto :cleanup

:cleanup
if defined APP_PUSHED popd >nul
if defined ROOT_PUSHED popd >nul
exit /b %EXIT_CODE%
