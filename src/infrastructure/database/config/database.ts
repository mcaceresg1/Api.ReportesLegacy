import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar variables de entorno antes de configurar Sequelize
dotenv.config();

// Debug: Verificar valores que se pasan a Sequelize
const dbName = process.env['DB_NAME'] || '';
const dbUser = process.env['DB_USER'] || '';
const dbPassword = process.env['DB_PASSWORD'] || '';
const dbHost = process.env['DB_HOST'] || 'localhost';
const dbPort = process.env['DB_PORT'] || '1433';
const dbInstance = process.env['DB_INSTANCE'] || '';
const dbDialect = (process.env['DB_DIALECT'] as any) || 'mssql';

// Construir connection string para SQL Server
let connectionString = '';
if (dbInstance) {
  connectionString = `${dbHost}\\${dbInstance}`;
} else {
  connectionString = `${dbHost}:${dbPort}`;
}

console.log(`🔗 Configurando conexión a base de datos:`);
console.log(`   Host: ${dbHost}`);
console.log(`   Puerto: ${dbPort}`);
console.log(`   Instancia: ${dbInstance || 'N/A'}`);
console.log(`   Base de datos: ${dbName}`);
console.log(`   Usuario: ${dbUser}`);
console.log(`   Connection String: ${connectionString}`);

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    port: parseInt(dbPort),
    dialect: dbDialect,
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
        instanceName: dbInstance || undefined,
        enableArithAbort: true,
        requestTimeout: 30000,
        connectionTimeout: 30000,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      max: 3,
      timeout: 1000,
    },
    logging: process.env['NODE_ENV'] === 'development' ? console.log : false,
  }
);

export { sequelize }; 