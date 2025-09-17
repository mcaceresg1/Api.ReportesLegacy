import { Router } from "express";
import { container } from "../container/container";
import { TestClipperDatabasesController } from "../controllers/TestClipperDatabasesController";

export function createTestClipperDatabasesRoutes(): Router {
  const router = Router();

  // Obtener instancia del controlador desde el contenedor de Inversify
  const controller = container.get<TestClipperDatabasesController>(
    "TestClipperDatabasesController"
  );

  // Ruta para probar todas las bases de datos (SIN rate limiting)
  router.get("/", (req, res) => controller.testAllDatabases(req, res));

  // Ruta para probar una base de datos específica (SIN rate limiting)
  router.get("/:bdClipperGPC", (req, res) =>
    controller.testSpecificDatabase(req, res)
  );

  // Ruta para limpiar rate limiting (SIN rate limiting)
  router.post("/clear-rate-limit", (req, res) =>
    controller.clearRateLimit(req, res)
  );

  return router;
}
