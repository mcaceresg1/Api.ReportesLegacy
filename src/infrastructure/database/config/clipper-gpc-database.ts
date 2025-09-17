import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

/**
 * Configuración de bases de datos Clipper GPC
 *
 * Variables de entorno requeridas:
 * - CLIPPER_GPC_DB_NAME, CLIPPER_GPC_DB_USER, CLIPPER_GPC_DB_PASSWORD, CLIPPER_GPC_DB_HOST (base principal)
 * - CLIPPER_GPC2_DB_NAME, CLIPPER_GPC2_DB_USER, CLIPPER_GPC2_DB_PASSWORD, CLIPPER_GPC2_DB_HOST (opcional, usa las principales como fallback)
 * - CLIPPER_GPC3_DB_NAME, CLIPPER_GPC3_DB_USER, CLIPPER_GPC3_DB_PASSWORD, CLIPPER_GPC3_DB_HOST (opcional, usa las principales como fallback)
 * - ... y así sucesivamente para todas las bases de datos
 *
 * Si no se especifican variables específicas para cada base de datos,
 * se usarán las variables principales como fallback.
 */

const clipperGPCSequelizeOptions = {
  dialect: "mssql" as const,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      multipleStatements: true,
    },
  },
  logging: false,
  define: {
    timestamps: false,
    freezeTableName: true,
  },
};

const sequelizeClipperGPC = new Sequelize(
  process.env["CLIPPER_GPC_DB_NAME"] || "CLIPPER_GPC_EMP001",
  process.env["CLIPPER_GPC_DB_USER"] || "",
  process.env["CLIPPER_GPC_DB_PASSWORD"] || "",
  {
    host: process.env["CLIPPER_GPC_DB_HOST"] || "localhost",
    ...clipperGPCSequelizeOptions,
  }
);

const sequelizeClipperGPC2 = new Sequelize(
  process.env["CLIPPER_GPC2_DB_NAME"] || "CLIPPER_GPC_EMP002",
  process.env["CLIPPER_GPC2_DB_USER"] ||
    process.env["CLIPPER_GPC_DB_USER"] ||
    "",
  process.env["CLIPPER_GPC2_DB_PASSWORD"] ||
    process.env["CLIPPER_GPC_DB_PASSWORD"] ||
    "",
  {
    host:
      process.env["CLIPPER_GPC2_DB_HOST"] ||
      process.env["CLIPPER_GPC_DB_HOST"] ||
      "localhost",
    ...clipperGPCSequelizeOptions,
  }
);

const sequelizeClipperGPC3 = new Sequelize(
  process.env["CLIPPER_GPC3_DB_NAME"] || "CLIPPER_GPC_EMP003",
  process.env["CLIPPER_GPC3_DB_USER"] ||
    process.env["CLIPPER_GPC_DB_USER"] ||
    "",
  process.env["CLIPPER_GPC3_DB_PASSWORD"] ||
    process.env["CLIPPER_GPC_DB_PASSWORD"] ||
    "",
  {
    host:
      process.env["CLIPPER_GPC3_DB_HOST"] ||
      process.env["CLIPPER_GPC_DB_HOST"] ||
      "localhost",
    ...clipperGPCSequelizeOptions,
  }
);

const sequelizeClipperGPC4 = new Sequelize(
  process.env["CLIPPER_GPC4_DB_NAME"] || "CLIPPER_GPC_EMP004",
  process.env["CLIPPER_GPC4_DB_USER"] ||
    process.env["CLIPPER_GPC_DB_USER"] ||
    "",
  process.env["CLIPPER_GPC4_DB_PASSWORD"] ||
    process.env["CLIPPER_GPC_DB_PASSWORD"] ||
    "",
  {
    host:
      process.env["CLIPPER_GPC4_DB_HOST"] ||
      process.env["CLIPPER_GPC_DB_HOST"] ||
      "localhost",
    ...clipperGPCSequelizeOptions,
  }
);

const sequelizeClipperGPC5 = new Sequelize(
  process.env["CLIPPER_GPC5_DB_NAME"] || "CLIPPER_GPC_EMP005",
  process.env["CLIPPER_GPC5_DB_USER"] ||
    process.env["CLIPPER_GPC_DB_USER"] ||
    "",
  process.env["CLIPPER_GPC5_DB_PASSWORD"] ||
    process.env["CLIPPER_GPC_DB_PASSWORD"] ||
    "",
  {
    host:
      process.env["CLIPPER_GPC5_DB_HOST"] ||
      process.env["CLIPPER_GPC_DB_HOST"] ||
      "localhost",
    ...clipperGPCSequelizeOptions,
  }
);

const sequelizeClipperGPC6 = new Sequelize(
  process.env["CLIPPER_GPC6_DB_NAME"] || "CLIPPER_GPC_EMP006",
  process.env["CLIPPER_GPC6_DB_USER"] ||
    process.env["CLIPPER_GPC_DB_USER"] ||
    "",
  process.env["CLIPPER_GPC6_DB_PASSWORD"] ||
    process.env["CLIPPER_GPC_DB_PASSWORD"] ||
    "",
  {
    host:
      process.env["CLIPPER_GPC6_DB_HOST"] ||
      process.env["CLIPPER_GPC_DB_HOST"] ||
      "localhost",
    ...clipperGPCSequelizeOptions,
  }
);

const sequelizeClipperGPC7 = new Sequelize(
  process.env["CLIPPER_GPC7_DB_NAME"] || "CLIPPER_GPC_EMP007",
  process.env["CLIPPER_GPC7_DB_USER"] ||
    process.env["CLIPPER_GPC_DB_USER"] ||
    "",
  process.env["CLIPPER_GPC7_DB_PASSWORD"] ||
    process.env["CLIPPER_GPC_DB_PASSWORD"] ||
    "",
  {
    host:
      process.env["CLIPPER_GPC7_DB_HOST"] ||
      process.env["CLIPPER_GPC_DB_HOST"] ||
      "localhost",
    ...clipperGPCSequelizeOptions,
  }
);

const sequelizeClipperGPC8 = new Sequelize(
  process.env["CLIPPER_GPC8_DB_NAME"] || "CLIPPER_GPC_EMP008",
  process.env["CLIPPER_GPC8_DB_USER"] ||
    process.env["CLIPPER_GPC_DB_USER"] ||
    "",
  process.env["CLIPPER_GPC8_DB_PASSWORD"] ||
    process.env["CLIPPER_GPC_DB_PASSWORD"] ||
    "",
  {
    host:
      process.env["CLIPPER_GPC8_DB_HOST"] ||
      process.env["CLIPPER_GPC_DB_HOST"] ||
      "localhost",
    ...clipperGPCSequelizeOptions,
  }
);

const sequelizeClipperGPC9 = new Sequelize(
  process.env["CLIPPER_GPC9_DB_NAME"] || "CLIPPER_GPC_EMP009",
  process.env["CLIPPER_GPC9_DB_USER"] ||
    process.env["CLIPPER_GPC_DB_USER"] ||
    "",
  process.env["CLIPPER_GPC9_DB_PASSWORD"] ||
    process.env["CLIPPER_GPC_DB_PASSWORD"] ||
    "",
  {
    host:
      process.env["CLIPPER_GPC9_DB_HOST"] ||
      process.env["CLIPPER_GPC_DB_HOST"] ||
      "localhost",
    ...clipperGPCSequelizeOptions,
  }
);

// Firma de índice para evitar error TS7053
export const clipperGPCDatabases: { [key: string]: Sequelize } = {
  bdclipperGPC: sequelizeClipperGPC,
  bdclipperGPC2: sequelizeClipperGPC2,
  bdclipperGPC3: sequelizeClipperGPC3,
  bdclipperGPC4: sequelizeClipperGPC4,
  bdclipperGPC5: sequelizeClipperGPC5,
  bdclipperGPC6: sequelizeClipperGPC6,
  bdclipperGPC7: sequelizeClipperGPC7,
  bdclipperGPC8: sequelizeClipperGPC8,
  bdclipperGPC9: sequelizeClipperGPC9,
};
