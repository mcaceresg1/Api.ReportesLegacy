import sql from "mssql";

const dbSettings = {
  user: "springuser",
  password: "springpass123",
  server: "localhost",
  database: "ConfiguracionesConexionDB",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  connectionTimeout: 30000,
};

export async function getConnection() {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
}

getConnection();
