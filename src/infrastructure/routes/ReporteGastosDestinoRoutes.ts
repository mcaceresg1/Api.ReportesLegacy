import { Router } from 'express';
import { ReporteGastosDestinoController } from '../controllers/ReporteGastosDestinoController';
import { container } from '../container/container';

export function createReporteGastosDestinoRoutes(): Router {
  const router = Router();
  const controller = container.get<ReporteGastosDestinoController>('ReporteGastosDestinoController');

  router.post('/:conjunto/generar', (req, res) => controller.generar(req, res));
  router.get('/:conjunto', (req, res) => controller.listar(req, res));

  return router;
}


