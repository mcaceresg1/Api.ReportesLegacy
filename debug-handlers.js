// Verificar si el handler está registrado en el CqrsService
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de handlers...');

// Leer el archivo CqrsService compilado
const cqrsServicePath = './dist/infrastructure/cqrs/CqrsService.js';
if (fs.existsSync(cqrsServicePath)) {
  const content = fs.readFileSync(cqrsServicePath, 'utf8');
  
  // Verificar si el handler está registrado
  const hasHandler = content.includes('ObtenerLibroDiarioAsientosQuery');
  console.log('🔍 Handler ObtenerLibroDiarioAsientosQuery en CqrsService:', hasHandler ? '✅ Encontrado' : '❌ No encontrado');
  
  // Verificar si el handler está inyectado
  const hasInjection = content.includes('ObtenerLibroDiarioAsientosHandler');
  console.log('🔍 Inyección ObtenerLibroDiarioAsientosHandler:', hasInjection ? '✅ Encontrado' : '❌ No encontrado');
  
  // Mostrar líneas relevantes
  const lines = content.split('\n');
  const relevantLines = lines.filter(line => 
    line.includes('ObtenerLibroDiarioAsientos') || 
    line.includes('libro-diario-asientos')
  );
  
  console.log('📋 Líneas relevantes:');
  relevantLines.forEach(line => console.log('  ', line.trim()));
  
} else {
  console.log('❌ Archivo CqrsService.js no encontrado');
}

