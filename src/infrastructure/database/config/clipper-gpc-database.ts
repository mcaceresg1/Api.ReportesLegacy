import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const clipperGPCSequelizeOptions = {
  dialect: 'mssql' as const,
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
  process.env["CLIPPER_GPC_DB_NAME"] || "CLIPPER_GPC_EMP009",
  process.env["CLIPPER_GPC_DB_USER"] || "",
  process.env["CLIPPER_GPC_DB_PASSWORD"] || "",
  {
    host: process.env["CLIPPER_GPC_DB_HOST"] || "localhost",
    ...clipperGPCSequelizeOptions,
  }
);

const sequelizeClipperGPC1 = new Sequelize(
  process.env["CLIPPER_GPC_DB_NAME"] || "IT2_TEST_1",
  process.env["CLIPPER_GPC_DB_USER"] || "",
  process.env["CLIPPER_GPC_DB_PASSWORD"] || "",
  {
    host: process.env["CLIPPER_GPC_DB_HOST"] || "localhost",
    ...clipperGPCSequelizeOptions,
  }
);

// Firma de índice para evitar error TS7053
export const clipperGPCDatabases: { [key: string]: Sequelize } = {
  bdclipperGPC: sequelizeClipperGPC,
  bdclipperGPC1: sequelizeClipperGPC1,
};
