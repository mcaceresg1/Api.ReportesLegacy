import express from "express";
import cors from "cors";
import router from "./src/routes/connections.route.js";
import sequelize from "./src/config/db.js";
import "./src/models/associations.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

app.use("/api", router);

try {
  await sequelize.authenticate();
  console.log("✅ Conexión a SQL Server establecida correctamente");
  await sequelize.sync({ alter: true });

  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
} catch (error) {
  console.error("❌ No se pudo conectar a SQL Server:", error.message);
}
