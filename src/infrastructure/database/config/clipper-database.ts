// src/infrastructure/database/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const clipperSequelize = {
  dialect: 'mssql' as const,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
  logging: false,
  define: {
    timestamps: false,
    freezeTableName: true,
  },
};

const sequelizeClipperLima = new Sequelize(
    process.env['CLIPPER_LIMA_DB_NAME'] || 'CLIPPER_PARQUE',
    process.env['CLIPPER_LIMA_DB_USER'] || '',
    process.env['CLIPPER_LIMA_DB_PASSWORD'] || '',
    {
      host: process.env['CLIPPER_LIMA_DB_HOST'] || 'localhost',
      ...clipperSequelize,
    }
  );
  
  const sequelizeClipperTacna = new Sequelize(
    process.env['CLIPPER_TACNA_DB_NAME'] || 'CLIPPER_PARQUE_TACNA',
    process.env['CLIPPER_TACNA_DB_USER'] || '',
    process.env['CLIPPER_TACNA_DB_PASSWORD'] || '',
    {
      host: process.env['CLIPPER_TACNA_DB_HOST'] || 'localhost',
      ...clipperSequelize,
    }
  );
  
  const sequelizeClipperLurin = new Sequelize(
    process.env['CLIPPER_LURIN_DB_NAME'] || 'CLIPPER_SV_LURIN',
    process.env['CLIPPER_LURIN_DB_USER'] || '',
    process.env['CLIPPER_LURIN_DB_PASSWORD'] || '',
    {
      host: process.env['CLIPPER_LURIN_DB_HOST'] || 'localhost',
      ...clipperSequelize,
    }
  );
  
// Exportar mapa de conexiones
export const clipperDatabases = {
  'clipper-lima': sequelizeClipperLima,
  'clipper-tacna': sequelizeClipperTacna,
  'clipper-lurin': sequelizeClipperLurin,
};
