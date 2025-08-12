import { Router } from 'express';
import { container } from '../container/container';
import { ReporteMensualCuentaCentroController } from '../controllers/ReporteMensualCuentaCentroController';

export function createReporteMensualCuentaCentroRoutes(): Router {
  const router = Router();
  const controller = container.get<ReporteMensualCuentaCentroController>('ReporteMensualCuentaCentroController');

  router.get('/:conjunto', (req, res) => controller.obtener(req, res));

  return router;
}
