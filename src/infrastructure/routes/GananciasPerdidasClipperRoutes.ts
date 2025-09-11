import { Router } from "express";
import { container } from "../container/container";
import { GananciasPerdidasClipperController } from "../controllers/GananciasPerdidasClipperController";
import { timeoutMiddleware } from "../middleware/TimeoutMiddleware";
import { responseLimitMiddleware } from "../middleware/ResponseLimitMiddleware";
import { rateLimitMiddleware } from "../middleware/RateLimitMiddleware";

export function createGananciasPerdidasClipperRoutes(): Router {
  const router = Router();

  // Obtener instancia del controlador desde el contenedor de Inversify
  const controller = container.get<GananciasPerdidasClipperController>(
    "GananciasPerdidasClipperController"
  );

  // Aplicar middlewares de optimización a todas las rutas
  router.use(timeoutMiddleware.reportTimeout()); // 60 segundos para reportes
  router.use(responseLimitMiddleware.reportLimit()); // 50MB para reportes
  router.use(rateLimitMiddleware.reportRateLimit()); // 10 peticiones por 5 minutos

  // Ruta principal para obtener ganancias y pérdidas clipper
  router.get("/:bdClipperGPC", (req, res) =>
    controller.obtenerGananciasPerdidasClipper(req, res)
  );

  return router;
}
