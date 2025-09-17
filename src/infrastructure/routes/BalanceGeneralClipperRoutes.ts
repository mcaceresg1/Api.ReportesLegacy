import { Router } from "express";
import { container } from "../container/container";
import { BalanceGeneralClipperController } from "../controllers/BalanceGeneralClipperController";
import { timeoutMiddleware } from "../middleware/TimeoutMiddleware";
import { responseLimitMiddleware } from "../middleware/ResponseLimitMiddleware";
import { rateLimitMiddleware } from "../middleware/RateLimitMiddleware";

export function createBalanceGeneralClipperRoutes(): Router {
  const router = Router();

  // Obtener instancia del controlador desde el contenedor de Inversify
  const controller = container.get<BalanceGeneralClipperController>(
    "BalanceGeneralClipperController"
  );

  // Aplicar middlewares de optimización a todas las rutas
  router.use(timeoutMiddleware.reportTimeout()); // 60 segundos para reportes
  router.use(responseLimitMiddleware.reportLimit()); // 50MB para reportes
  // Rate limiting removido para balance general - permite más peticiones

  // Ruta para obtener balance general por nivel (SIN rate limiting)
  router.get("/:baseDatos/:nivel", (req, res) =>
    controller.obtenerBalanceGeneralPorNivel(req, res)
  );

  // Ruta para obtener balance general por mes y nivel (SIN rate limiting)
  router.get("/:baseDatos/:mes/:nivel", (req, res) =>
    controller.obtenerBalanceGeneralPorMesYNivel(req, res)
  );

  // Ruta de información del endpoint (SIN rate limiting)
  router.get("/info", (req, res) => controller.obtenerInfo(req, res));

  return router;
}
