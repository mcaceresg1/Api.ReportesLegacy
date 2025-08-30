import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const hmisSequelize = {
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

const sequelizeHmis = new Sequelize(
    process.env['HMIS_DB_NAME'] || 'IT2_TEST',
    process.env['HMIS_DB_USER'] || '',
    process.env['HMIS_DB_PASSWORD'] || '',
    {
      host: process.env['HMIS_DB_HOST'] || 'localhost',
      ...hmisSequelize,
    }
  );
  
  const sequelizeHmis1 = new Sequelize(
    process.env['HMIS1_DB_NAME'] || 'IT2_TEST_1',
    process.env['HMIS1_DB_USER'] || '',
    process.env['HMIS1_DB_PASSWORD'] || '',
    {
      host: process.env['HMIS1_DB_HOST'] || 'localhost',
      ...hmisSequelize,
    }
  );
  
//   const sequelizeClipperLurin = new Sequelize(
//     process.env['CLIPPER_LURIN_DB_NAME'] || 'CLIPPER_SV_LURIN',
//     process.env['CLIPPER_LURIN_DB_USER'] || '',
//     process.env['CLIPPER_LURIN_DB_PASSWORD'] || '',
//     {
//       host: process.env['CLIPPER_LURIN_DB_HOST'] || 'localhost',
//       ...clipperSequelize,
//     }
//   );
  
// Exportar mapa de conexiones
export const hmisDatabases = {
  'bdhmis': sequelizeHmis,
  'bdhmis1': sequelizeHmis1,

};
