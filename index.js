import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import sequelize from "./src/config/db.js"; // conexión a la base de datos
import "./src/models/associations.js"; // relaciones entre modelos

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a SQL Server establecida correctamente");

    await sequelize.sync({ alter: true }); // Sincroniza modelos con la DB

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ No se pudo conectar a SQL Server:", error.message);
    console.log(error);
  }
}

startServer();