import { Router } from 'express';
import { container } from '../container/container';
import { ReporteMensualCuentaCentroController } from '../controllers/ReporteMensualCuentaCentroController';

export function createReporteMensualCuentaCentroRoutes(): Router {
  const router = Router();
  const controller = container.get<ReporteMensualCuentaCentroController>('ReporteMensualCuentaCentroController');

  router.get('/:conjunto', (req, res) => controller.obtener(req, res));

  // POST /api/reporte-mensual-cuenta-centro/:conjunto/exportar-excel - Exportar a Excel
  router.post('/:conjunto/exportar-excel', (req, res) => controller.exportarExcel(req, res));

  return router;
}
