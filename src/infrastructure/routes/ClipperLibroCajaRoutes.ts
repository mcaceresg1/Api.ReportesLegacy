import { Router } from "express";
import { container } from "../container/container";
import { ClipperLibroCajaController } from "../controllers/ClipperLibroCajaController";
import { timeoutMiddleware } from "../middleware/TimeoutMiddleware";
import { responseLimitMiddleware } from "../middleware/ResponseLimitMiddleware";
import { rateLimitMiddleware } from "../middleware/RateLimitMiddleware";

export function createClipperLibroCajaRoutes(): Router {
  const router = Router();

  // Obtener instancia del controlador desde el contenedor de Inversify
  const controller = container.get<ClipperLibroCajaController>(
    "ClipperLibroCajaController"
  );

  // Aplicar middlewares de optimización a todas las rutas
  router.use(timeoutMiddleware.reportTimeout()); // 60 segundos para reportes
  // router.use(responseLimitMiddleware.reportLimit()); // 50MB para reportes - DESHABILITADO para comprobantes
  // router.use(rateLimitMiddleware.reportRateLimit()); // 10 peticiones por 5 minutos - DESHABILITADO para comprobantes

  // Ruta para filtrar comprobantes por clase específica (DEBE IR ANTES que /comprobantes)
  router.get(
    "/:bdClipperGPC/:libro/:mes/comprobantes/clase/:clase",
    // SIN MIDDLEWARE DE PAGINACIÓN O LÍMITES
    (req, res) => controller.listarComprobantesPorClase(req, res)
  );

  // Ruta para comprobantes de resumen (DEBE IR ANTES que /comprobantes)
  router.get(
    "/:bdClipperGPC/:libro/:mes/comprobantes-resumen",
    // SIN MIDDLEWARE DE PAGINACIÓN O LÍMITES
    (req, res) => controller.listarComprobantesResumen(req, res)
  );

  // Rutas del libro caja (agregando el parámetro bdClipperGPC)
  router.get(
    "/:bdClipperGPC/:libro/:mes/comprobantes",
    // SIN MIDDLEWARE DE PAGINACIÓN O LÍMITES
    (req, res) => controller.listarComprobantes(req, res)
  );

  return router;
}