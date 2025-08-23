@echo off

REM Script de inicio para PRODUCCIÓN (Windows)
echo 🚀 Iniciando Globalis API en modo PRODUCCIÓN...
echo 📍 Puerto: 3000
echo 🌐 URL: http://192.168.90.73:3000
echo 📚 Swagger: http://192.168.90.73:3000/api-docs
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js primero.
    pause
    exit /b 1
)

REM Verificar si npm está instalado
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm no está instalado. Por favor instala npm primero.
    pause
    exit /b 1
)

REM Verificar si las dependencias están instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
)

REM Verificar si existe el archivo de configuración
if not exist "config.production.env" (
    echo ❌ Archivo config.production.env no encontrado.
    echo Por favor crea el archivo con las variables de entorno necesarias.
    pause
    exit /b 1
)

REM Configurar variables de entorno
set NODE_ENV=production

REM Verificar si el puerto está disponible
netstat -an | find "3000" | find "LISTENING" >nul
if not errorlevel 1 (
    echo ⚠️ El puerto 3000 ya está en uso.
    echo Por favor cierra la aplicación que está usando el puerto 3000 o cambia el puerto.
    pause
    exit /b 1
)

REM Compilar el proyecto si no existe dist
if not exist "dist" (
    echo 🔨 Compilando proyecto...
    npm run build
    if errorlevel 1 (
        echo ❌ Error al compilar el proyecto.
        pause
        exit /b 1
    )
)

echo ✅ Iniciando servidor en modo producción...
echo 🔧 Presiona Ctrl+C para detener el servidor
echo.

REM Iniciar el servidor
npm run start:prod

pause
