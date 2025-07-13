import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables del archivo .env

const sequelize = new Sequelize(
  process.env.DB_NAME,       // Nombre de la BD
  process.env.DB_USER,       // Usuario
  process.env.DB_PASSWORD,   // Contraseña
  {
    host: process.env.DB_HOST,   // Servidor
    dialect: process.env.DB_DIALECT, // Dialecto (ej: 'mssql')
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    },
    logging: false, // Desactiva logs de Sequelize
  }
);


export default sequelize;
