// Script para verificar los handlers registrados
const { container } = require('./dist/infrastructure/container/container');
const { CqrsService } = require('./dist/infrastructure/cqrs/CqrsService');

console.log('🔍 Verificando configuración de handlers...');

try {
  // Obtener el CqrsService
  const cqrsService = container.get('CqrsService');
  console.log('✅ CqrsService obtenido correctamente');
  
  // Obtener el QueryBus
  const queryBus = cqrsService.getQueryBus();
  console.log('✅ QueryBus obtenido correctamente');
  
  // Verificar handlers registrados
  console.log('📋 Handlers registrados:');
  console.log('QueryBus handlers:', queryBus.handlers ? Array.from(queryBus.handlers.keys()) : 'No disponible');
  
  // Verificar si el handler específico está registrado
  const handler = queryBus.handlers ? queryBus.handlers.get('ObtenerLibroDiarioAsientosQuery') : null;
  console.log('🔍 Handler ObtenerLibroDiarioAsientosQuery:', handler ? '✅ Registrado' : '❌ No registrado');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
}

