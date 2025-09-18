# Script para verificar el estado del servidor
Write-Host "Verificando procesos de Node.js..."
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Procesos de Node.js encontrados:"
    $nodeProcesses | Format-Table Id, ProcessName, CPU
    Write-Host "Terminando procesos..."
    $nodeProcesses | Stop-Process -Force
    Write-Host "Procesos terminados."
} else {
    Write-Host "No hay procesos de Node.js ejecutándose."
}

Write-Host "Verificando puerto 3000..."
$port3000 = netstat -an | findstr :3000
if ($port3000) {
    Write-Host "Puerto 3000 en uso:"
    Write-Host $port3000
} else {
    Write-Host "Puerto 3000 libre."
}

Write-Host "Iniciando servidor..."
npm run dev