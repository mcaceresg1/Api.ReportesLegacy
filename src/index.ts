import 'reflect-metadata';
import dotenv from 'dotenv';

// Configurar variables de entorno según el ambiente
const environment = process.env['NODE_ENV'] || 'development';
console.log(`🌍 Iniciando en ambiente: ${environment}`);

// Cargar archivo de configuración específico del ambiente
let envFile: string;
if (environment === 'production') {
  envFile = 'config.production.env';
} else {
  envFile = 'config.development.env';
}

dotenv.config({ path: envFile });

import app from './app';
import { sequelize } from './infrastructure/database/config/database';
import './infrastructure/database/models'; // Importar modelos para establecer asociaciones
import './infrastructure/container/container'; // Importar contenedor para inicializar DI

const PORT = process.env['PORT'] || (environment === 'production' ? 3000 : 3002);
const HOST = process.env['HOST'] || (environment === 'production' ? '192.168.90.73' : 'localhost');

async function startServer() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a SQL Server establecida correctamente');

    // Sincronizar modelos con la base de datos (solo crear tablas si no existen)
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados con la base de datos');

    // Iniciar servidor
    app.listen(PORT, () => {
      const baseUrl = `http://${HOST}:${PORT}`;
      console.log(`🚀 Servidor escuchando en ${baseUrl}`);
      console.log(`🔗 Swagger disponible en ${baseUrl}/api-docs`);
      console.log(`🏥 Health check en ${baseUrl}/health`);
      console.log(`📚 Documentación API en ${baseUrl}/api-docs`);
      
      if (environment === 'development') {
        console.log(`🔧 Modo DESARROLLO - Puerto ${PORT}`);
        console.log(`🔗 Acceso local: http://localhost:${PORT}`);
      } else {
        console.log(`🚀 Modo PRODUCCIÓN - Servidor ${HOST}:${PORT}`);
        console.log(`🌐 Acceso remoto: ${baseUrl}`);
      }
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales para cierre graceful
process.on('SIGTERM', async () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

startServer(); 