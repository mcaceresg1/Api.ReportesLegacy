import { Router } from 'express';
import { container } from '../container/container';
import { ReporteMovimientosContablesController } from '../controllers/ReporteMovimientosContablesController';

export function createReporteMovimientosContablesRoutes(): Router {
  const router = Router();
  const controller = container.get<ReporteMovimientosContablesController>('ReporteMovimientosContablesController');

  router.get('/:conjunto', (req, res) => controller.obtener(req, res));

  return router;
}
