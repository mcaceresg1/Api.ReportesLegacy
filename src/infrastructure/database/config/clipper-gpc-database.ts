import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

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
  process.env["CLIPPER_GPC_DB_NAME"] || "CLIPPER_GPC_EMP002",
  process.env["CLIPPER_GPC_DB_USER"] || "",
  process.env["CLIPPER_GPC_DB_PASSWORD"] || "",
  {
    host: process.env["CLIPPER_GPC_DB_HOST"] || "localhost",
    ...clipperGPCSequelizeOptions,
  }
);
const sequelizeClipperGPC3 = new Sequelize(
  process.env["CLIPPER_GPC_DB_NAME"] || "CLIPPER_GPC_EMP003",
  process.env["CLIPPER_GPC_DB_USER"] || "",
  process.env["CLIPPER_GPC_DB_PASSWORD"] || "",
  {
    host: process.env["CLIPPER_GPC_DB_HOST"] || "localhost",
    ...clipperGPCSequelizeOptions,
  }
);
const sequelizeClipperGPC4 = new Sequelize(
  process.env["CLIPPER_GPC_DB_NAME"] || "CLIPPER_GPC_EMP004",
  process.env["CLIPPER_GPC_DB_USER"] || "",
  process.env["CLIPPER_GPC_DB_PASSWORD"] || "",
  {
    host: process.env["CLIPPER_GPC_DB_HOST"] || "localhost",
    ...clipperGPCSequelizeOptions,
  }
);
const sequelizeClipperGPC5 = new Sequelize(
  process.env["CLIPPER_GPC_DB_NAME"] || "CLIPPER_GPC_EMP005",
  process.env["CLIPPER_GPC_DB_USER"] || "",
  process.env["CLIPPER_GPC_DB_PASSWORD"] || "",
  {
    host: process.env["CLIPPER_GPC_DB_HOST"] || "localhost",
    ...clipperGPCSequelizeOptions,
  }
);
const sequelizeClipperGPC6 = new Sequelize(
  process.env["CLIPPER_GPC_DB_NAME"] || "CLIPPER_GPC_EMP006",
  process.env["CLIPPER_GPC_DB_USER"] || "",
  process.env["CLIPPER_GPC_DB_PASSWORD"] || "",
  {
    host: process.env["CLIPPER_GPC_DB_HOST"] || "localhost",
    ...clipperGPCSequelizeOptions,
  }
);
const sequelizeClipperGPC7 = new Sequelize(
  process.env["CLIPPER_GPC_DB_NAME"] || "CLIPPER_GPC_EMP007",
  process.env["CLIPPER_GPC_DB_USER"] || "",
  process.env["CLIPPER_GPC_DB_PASSWORD"] || "",
  {
    host: process.env["CLIPPER_GPC_DB_HOST"] || "localhost",
    ...clipperGPCSequelizeOptions,
  }
);
const sequelizeClipperGPC8 = new Sequelize(
  process.env["CLIPPER_GPC_DB_NAME"] || "CLIPPER_GPC_EMP008",
  process.env["CLIPPER_GPC_DB_USER"] || "",
  process.env["CLIPPER_GPC_DB_PASSWORD"] || "",
  {
    host: process.env["CLIPPER_GPC_DB_HOST"] || "localhost",
    ...clipperGPCSequelizeOptions,
  }
);
const sequelizeClipperGPC9 = new Sequelize(
  process.env["CLIPPER_GPC_DB_NAME"] || "CLIPPER_GPC_EMP009",
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
  bdclipperGPC2: sequelizeClipperGPC2,
  bdclipperGPC3: sequelizeClipperGPC3,
  bdclipperGPC4: sequelizeClipperGPC4,
  bdclipperGPC5: sequelizeClipperGPC5,
  bdclipperGPC6: sequelizeClipperGPC6,
  bdclipperGPC7: sequelizeClipperGPC7,
  bdclipperGPC8: sequelizeClipperGPC8,
  bdclipperGPC9: sequelizeClipperGPC9,
};
