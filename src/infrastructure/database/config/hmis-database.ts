import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const hmisSequelizeOptions = {
  dialect: "mssql" as const,
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

const sequelizeHmisAQP = new Sequelize(
  process.env["HMIS_AQP_DB_NAME"] || "IT2_TEST_AQP",
  process.env["HMIS_AQP_DB_USER"] || process.env["HMIS_DB_USER"] || "",
  process.env["HMIS_AQP_DB_PASSWORD"] || process.env["HMIS_DB_PASSWORD"] || "",
  {
    host:
      process.env["HMIS_AQP_DB_HOST"] ||
      process.env["HMIS_DB_HOST"] ||
      "localhost",
    ...hmisSequelizeOptions,
  }
);

const sequelizeHmisICA = new Sequelize(
  process.env["HMIS_ICA_DB_NAME"] || "IT2_TEST_ICA",
  process.env["HMIS_ICA_DB_USER"] || process.env["HMIS_DB_USER"] || "",
  process.env["HMIS_ICA_DB_PASSWORD"] || process.env["HMIS_DB_PASSWORD"] || "",
  {
    host:
      process.env["HMIS_ICA_DB_HOST"] ||
      process.env["HMIS_DB_HOST"] ||
      "localhost",
    ...hmisSequelizeOptions,
  }
);

const sequelizeHmisPIURA = new Sequelize(
  process.env["HMIS_PIURA_DB_NAME"] || "IT2_TEST_PIURA",
  process.env["HMIS_PIURA_DB_USER"] || process.env["HMIS_DB_USER"] || "",
  process.env["HMIS_PIURA_DB_PASSWORD"] ||
    process.env["HMIS_DB_PASSWORD"] ||
    "",
  {
    host:
      process.env["HMIS_PIURA_DB_HOST"] ||
      process.env["HMIS_DB_HOST"] ||
      "localhost",
    ...hmisSequelizeOptions,
  }
);

const sequelizeHmisTACNA = new Sequelize(
  process.env["HMIS_TACNA_DB_NAME"] || "IT2_TEST_TACNA",
  process.env["HMIS_TACNA_DB_USER"] || process.env["HMIS_DB_USER"] || "",
  process.env["HMIS_TACNA_DB_PASSWORD"] ||
    process.env["HMIS_DB_PASSWORD"] ||
    "",
  {
    host:
      process.env["HMIS_TACNA_DB_HOST"] ||
      process.env["HMIS_DB_HOST"] ||
      "localhost",
    ...hmisSequelizeOptions,
  }
);

// Exportar las conexiones en un objeto para seleccionarlas por alias
export const hmisDatabases = {
  bdhmis: sequelizeHmis,
  bdhmisAQP: sequelizeHmisAQP,
  bdhmisICA: sequelizeHmisICA,
  bdhmisPIURA: sequelizeHmisPIURA,
  bdhmisTACNA: sequelizeHmisTACNA,
};
