import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración para la base de datos EXACTUS (solo lectura)
const exactusDbName = process.env['EXACTUS_DB_NAME'] || 'EXACTUS';
const exactusDbUser = process.env['EXACTUS_DB_USER'] || '';
const exactusDbPassword = process.env['EXACTUS_DB_PASSWORD'] || '';
const exactusDbHost = process.env['EXACTUS_DB_HOST'] || 'localhost';
const exactusDbDialect = (process.env['EXACTUS_DB_DIALECT'] as any) || 'mssql';

const exactusSequelize = new Sequelize(
  exactusDbName,
  exactusDbUser,
  exactusDbPassword,
  {
    host: exactusDbHost,
    dialect: exactusDbDialect,
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
        readOnlyIntent: true, // Indicar que es solo lectura
        // Optimizaciones para consultas de solo lectura
        isolationLevel: 2, // READ_COMMITTED = 2
        requestTimeout: 30000, // 30 segundos
        cancelTimeout: 5000,   // 5 segundos
      },
    },
    logging: false, // Desactivar logging para mejorar rendimiento
    benchmark: false, // Desactivar benchmark para mejorar rendimiento
    define: {
      timestamps: false, // Desactivar timestamps automáticos
      freezeTableName: true, // Usar nombres de tabla exactos
    },
    pool: {
      max: 10,        // Aumentar el pool para manejar más conexiones concurrentes
      min: 2,         // Mantener al menos 2 conexiones activas
      acquire: 60000, // Aumentar tiempo de adquisición
      idle: 30000,    // Aumentar tiempo de inactividad
      evict: 60000,   // Evict connections after 60 seconds
    }
  }
);

export { exactusSequelize };
