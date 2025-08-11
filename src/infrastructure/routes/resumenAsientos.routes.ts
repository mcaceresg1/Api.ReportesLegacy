import { Router } from 'express';
import { ResumenAsientosController } from '../controllers/ResumenAsientosController';
import { QueryOptimizationMiddleware } from '../middleware/QueryOptimizationMiddleware';

export function createResumenAsientosRoutes(): Router {
  const router = Router();
  const controller = new ResumenAsientosController();

  // Ruta principal para obtener resumen de asientos
  router.get(
    '/:conjunto/resumen',
    QueryOptimizationMiddleware.validateQueryParams,
    (req, res) => controller.obtenerResumenAsientos(req, res)
  );

  // Ruta alternativa para compatibilidad
  router.get(
    '/:conjunto',
    QueryOptimizationMiddleware.validateQueryParams,
    (req, res) => controller.obtenerResumenAsientos(req, res)
  );

  return router;
}
