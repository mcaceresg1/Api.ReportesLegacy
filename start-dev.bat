@echo off

REM Script de inicio para DESARROLLO (Windows)
echo 🚀 Iniciando Globalis API en modo DESARROLLO...
echo 📍 Puerto: 3002
echo 🌐 URL: http://localhost:3002
echo 📚 Swagger: http://localhost:3002/api-docs
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
if not exist "config.development.env" (
    echo ❌ Archivo config.development.env no encontrado.
    echo Por favor crea el archivo con las variables de entorno necesarias.
    pause
    exit /b 1
)

REM Configurar variables de entorno
set NODE_ENV=development

REM Verificar si el puerto está disponible
netstat -an | find "3002" | find "LISTENING" >nul
if not errorlevel 1 (
    echo ⚠️ El puerto 3002 ya está en uso.
    echo Por favor cierra la aplicación que está usando el puerto 3002 o cambia el puerto.
    pause
    exit /b 1
)

echo ✅ Iniciando servidor en modo desarrollo...
echo 🔧 Presiona Ctrl+C para detener el servidor
echo 🔄 Reinicio automático activado (nodemon)
echo.

REM Iniciar el servidor con watch
npm run dev:watch

pause
