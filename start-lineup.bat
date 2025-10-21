@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem =========================================================
rem  LineUp - Script de arranque para entorno local (Windows)
rem =========================================================

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "APP_DIR=%ROOT_DIR%\app"

if not exist "%APP_DIR%\package.json" (
    echo [ERROR] No se encontro package.json en "%APP_DIR%".
    echo Ejecuta este script desde la carpeta raiz del repositorio LineUp.
    exit /b 1
)

pushd "%ROOT_DIR%" >nul || (
    echo [ERROR] No se pudo acceder al directorio del repositorio.
    exit /b 1
)

set "APP_PUSHED="
pushd "%APP_DIR%" >nul || goto :error
set "APP_PUSHED=1"

call :ensureEnvFiles || goto :error

call :runStep "npm install" "Instalando dependencias (npm install)..." || goto :error
call :runStep "npx --yes prisma generate" "Generando cliente de Prisma..." || goto :error
call :applyPrisma || goto :error
call :runStep "npx --yes tsx prisma/seed.ts" "Cargando datos de ejemplo..." || goto :error

echo.
echo Iniciando servidor de desarrollo (Ctrl+C para detener)...
call npm run dev
set "EXIT_CODE=%ERRORLEVEL%"
goto :end

:runStep
set "COMMAND=%~1"
set "MESSAGE=%~2"
if defined MESSAGE echo %MESSAGE%
call %COMMAND%
if errorlevel 1 exit /b 1
exit /b 0

:applyPrisma
if exist "prisma\migrations" (
    for /f "delims=" %%M in ('dir /b /ad "prisma\migrations" ^| findstr /r "^[0-9]"') do (
        echo Aplicando migraciones de Prisma...
        call npx --yes prisma migrate deploy
        if errorlevel 1 exit /b 1
        goto :applyPrismaDone
    )
)

echo Sin migraciones detectadas, sincronizando esquema con prisma db push...
call npx --yes prisma db push
if errorlevel 1 exit /b 1

:applyPrismaDone
exit /b 0

:ensureEnvFiles
set "ROOT_ENV=%ROOT_DIR%\.env"
set "ROOT_ENV_EXAMPLE=%ROOT_DIR%\.env.example"
set "APP_ENV=%APP_DIR%\.env"

if not exist "%ROOT_ENV%" (
    if exist "%ROOT_ENV_EXAMPLE%" (
        echo Creando archivo .env en la raiz a partir de .env.example...
        copy /Y "%ROOT_ENV_EXAMPLE%" "%ROOT_ENV%" >nul
    )
)

if not exist "%APP_ENV%" (
    if exist "%ROOT_ENV%" (
        echo Copiando configuracion de .env hacia app\.env...
        copy /Y "%ROOT_ENV%" "%APP_ENV%" >nul
    ) else if exist "%ROOT_ENV_EXAMPLE%" (
        echo Creando app\.env a partir de .env.example...
        copy /Y "%ROOT_ENV_EXAMPLE%" "%APP_ENV%" >nul
    ) else (
        echo [ADVERTENCIA] No se encontro un archivo .env ni .env.example.
        echo Configura las variables de entorno manualmente antes de continuar.
    )
)
exit /b 0

:error
set "EXIT_CODE=%ERRORLEVEL%"
echo.
echo [ERROR] El script se detuvo por un problema. Revisa los mensajes anteriores.

:end
if defined APP_PUSHED popd >nul
popd >nul
exit /b %EXIT_CODE%
