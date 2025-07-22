// se enfoca en la app Express.

import express from "express";
import cors from "cors";
import router from "./routes/connections.route.js";
import menuRoutes from "./routes/menus.route.js";
import { swaggerUi, specs } from "./config/swagger.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true
}));

// Rutas
app.use("/api", router); // Rutas generales bajo /api/
app.use("/api/menus", menuRoutes); // Rutas de menús bajo /api/menus/

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'API Reportes Legacy',
    version: '1.0.0',
    docs: '/api-docs',
    endpoints: {
      menus: '/api/menus',
      general: '/api'
    }
  });
});

export default app;
