import { Router } from "express";
import { container } from "../container/container";
import { ClipperLibroDiarioController } from "../controllers/ClipperLibroDiarioController";
import { timeoutMiddleware } from "../middleware/TimeoutMiddleware";
import { responseLimitMiddleware } from "../middleware/ResponseLimitMiddleware";
import { rateLimitMiddleware } from "../middleware/RateLimitMiddleware";

export function createClipperLibroDiarioRoutes(): Router {
  const router = Router();

  // Obtener instancia del controlador desde el contenedor de Inversify
  const controller = container.get<ClipperLibroDiarioController>(
    "ClipperLibroDiarioController"
  );

  // Aplicar middlewares de optimización a todas las rutas
  router.use(timeoutMiddleware.reportTimeout()); // 60 segundos para reportes
  router.use(responseLimitMiddleware.reportLimit()); // 50MB para reportes
  router.use(rateLimitMiddleware.reportRateLimit()); // 10 peticiones por 5 minutos

  // Rutas del libro diario (agregando el parámetro bdClipperGPC)
  router.get("/:bdClipperGPC/:libro/:mes/comprobantes", (req, res) =>
    controller.listarComprobantes(req, res)
  );

  // Ruta de streaming para grandes volúmenes de datos
  router.get(
    "/:bdClipperGPC/:libro/:mes/comprobantes-stream",
    timeoutMiddleware.exportTimeout(), // 2 minutos para streaming
    responseLimitMiddleware.reportLimit(), // 50MB para reportes
    rateLimitMiddleware.exportRateLimit(), // 5 peticiones por 10 minutos
    (req, res) => controller.listarComprobantesStream(req, res)
  );

  router.get("/:bdClipperGPC/:libro/:mes/comprobantes-agrupados", (req, res) =>
    controller.listarComprobantesAgrupados(req, res)
  );

  router.get("/:bdClipperGPC/:libro/:mes/totales", (req, res) =>
    controller.obtenerTotalesGenerales(req, res)
  );

  // Ruta para detalle de comprobante con middlewares más permisivos
  router.get(
    "/:bdClipperGPC/comprobante/:numeroComprobante",
    timeoutMiddleware.quickTimeout(), // 10 segundos para consultas rápidas
    responseLimitMiddleware.quickLimit(), // 1MB para consultas rápidas
    rateLimitMiddleware.quickRateLimit(), // 100 peticiones por minuto
    (req, res) => controller.obtenerDetalleComprobante(req, res)
  );

  return router;
}
