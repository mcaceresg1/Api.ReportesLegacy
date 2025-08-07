import 'reflect-metadata';

import app from './app';
import { sequelize } from './infrastructure/database/config/database';
import './infrastructure/database/models'; // Importar modelos para establecer asociaciones
import './infrastructure/container/container'; // Importar contenedor para inicializar DI

const PORT = process.env['PORT'] || 3001;

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
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
      console.log(`🔗 Swagger en http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health check en http://localhost:${PORT}/health`);
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