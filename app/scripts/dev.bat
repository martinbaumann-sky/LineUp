@echo off
setlocal EnableExtensions

rem Script legado: delega al nuevo start-lineup.bat en la raiz
set "ROOT_DIR=%~dp0..\.."
if exist "%ROOT_DIR%\start-lineup.bat" (
    call "%ROOT_DIR%\start-lineup.bat"
) else (
    echo [ERROR] No se encontro start-lineup.bat en "%ROOT_DIR%".
    echo Ejecuta "npm run dev" manualmente en la carpeta app.
    exit /b 1
)
