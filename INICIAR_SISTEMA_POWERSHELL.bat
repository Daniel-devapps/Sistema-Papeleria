@echo off
title Sistema de Papeleria - Iniciando...
echo ========================================
echo      SISTEMA DE PAPELERIA DEVAPPS
echo ========================================
echo.
echo Iniciando Backend y Frontend...
echo.

REM Configurar Maven en el PATH
set PATH=%PATH%;C:\Apache\apache-maven-3.9.6\bin

REM Iniciar Backend en una nueva ventana
echo Iniciando Backend (Puerto 8080)...
start "Backend - Spring Boot" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"

REM Esperar un poco para que el backend se inicie
echo Esperando que el backend se inicie...
timeout /t 10 /nobreak >nul

REM Iniciar Frontend en una nueva ventana
echo Iniciando Frontend (Puerto 4200)...
start "Frontend - Angular" cmd /k "cd /d %~dp0frontend && ng serve"

echo.
echo ========================================
echo    SISTEMA INICIADO EXITOSAMENTE!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:4200
echo.
echo Ambos servicios se ejecutan en ventanas separadas.
echo Cierra las ventanas para detener los servicios.
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
