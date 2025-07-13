// se enfoca en la app Express.

import express from "express";
import cors from "cors";
import router from "./routes/connections.route.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use("/api", router); // Todas las rutas bajo /api/

export default app;
