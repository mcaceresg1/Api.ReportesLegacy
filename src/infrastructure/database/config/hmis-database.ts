import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const hmisSequelizeOptions = {
  dialect: 'mssql' as const,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      multipleStatements: true, // NECESARIO
    },
  },
  logging: false,
  define: {
    timestamps: false,
    freezeTableName: true,
  },
};

// Conexión para la BD principal HMIS
  const sequelizeHmis = new Sequelize(
    process.env["HMIS_DB_NAME"] || "IT2_TEST",
    process.env["HMIS_DB_USER"] || "",
    process.env["HMIS_DB_PASSWORD"] || "",
    {
      host: process.env["HMIS_DB_HOST"] || "localhost",
      ...hmisSequelizeOptions,
    }
  );
  
  const sequelizeHmis1 = new Sequelize(
    process.env["HMIS1_DB_NAME"] || "IT2_TEST_1",
    process.env["HMIS1_DB_USER"] || "",
    process.env["HMIS1_DB_PASSWORD"] || "",
    {
      host: process.env["HMIS1_DB_HOST"] || "localhost",
      ...hmisSequelizeOptions,
    }
  );
  

// Exportar las conexiones en un objeto para seleccionarlas por alias
export const hmisDatabases = {
  bdhmis: sequelizeHmis,
  bdhmis1: sequelizeHmis1,
};
