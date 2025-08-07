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
      },
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export { exactusSequelize };
