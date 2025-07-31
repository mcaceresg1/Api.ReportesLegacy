import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar variables de entorno antes de configurar Sequelize
dotenv.config();

// Debug: Verificar valores que se pasan a Sequelize
const dbName = process.env['DB_NAME'] || '';
const dbUser = process.env['DB_USER'] || '';
const dbPassword = process.env['DB_PASSWORD'] || '';
const dbHost = process.env['DB_HOST'] || 'localhost';
const dbDialect = (process.env['DB_DIALECT'] as any) || 'mssql';

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    dialect: dbDialect,
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    },
    logging: false,
  }
);

export { sequelize }; 