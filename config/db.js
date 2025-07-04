import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "ConfiguracionesConexionDB",
  "springuser",
  "springpass123",
  {
    host: "localhost",
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    },
    logging: false,
  }
);

export default sequelize;
