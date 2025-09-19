import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Cargar variables de entorno desde .env
dotenv.config();

// Configuración para la base de datos OFIPLAN (solo lectura)
const ofliplanDbName = process.env["OFIPLAN_DB_NAME"] || "OFIPLAN";
const ofliplanDbUser = process.env["OFIPLAN_DB_USER"] || "";
const ofliplanDbPassword = process.env["OFIPLAN_DB_PASSWORD"] || "";
const ofliplanDbHost = process.env["OFIPLAN_DB_HOST"] || "localhost";
const ofliplanDbDialect = (process.env["OFIPLAN_DB_DIALECT"] as any) || "mssql";

console.log("🔧 Configuración OFIPLAN:", {
  host: ofliplanDbHost,
  database: ofliplanDbName,
  user: ofliplanDbUser,
  dialect: ofliplanDbDialect,
});

const ofliplanSequelize = new Sequelize(
  ofliplanDbName,
  ofliplanDbUser,
  ofliplanDbPassword,
  {
    host: ofliplanDbHost,
    dialect: ofliplanDbDialect,
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
        readOnlyIntent: true, // Indicar que es solo lectura
        // Optimizaciones para consultas de solo lectura
        isolationLevel: 2, // READ_COMMITTED = 2
        requestTimeout: 120000, // 120 segundos (2 minutos)
        cancelTimeout: 10000, // 10 segundos
      },
    },
    logging: false, // Desactivar logging para mejorar rendimiento
    benchmark: false, // Desactivar benchmark para mejorar rendimiento
    define: {
      timestamps: false, // Desactivar timestamps automáticos
      freezeTableName: true, // Usar nombres de tabla exactos
    },
    pool: {
      max: 15, // Aumentar el pool para manejar más conexiones concurrentes
      min: 3, // Mantener al menos 3 conexiones activas
      acquire: 120000, // Aumentar tiempo de adquisición a 2 minutos
      idle: 60000, // Aumentar tiempo de inactividad a 1 minuto
      evict: 120000, // Evict connections after 2 minutes
    },
  }
);

export { ofliplanSequelize };
