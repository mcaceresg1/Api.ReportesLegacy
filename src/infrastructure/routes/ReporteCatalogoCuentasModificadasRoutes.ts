import { Router } from 'express';
import { container } from '../container/container';
import { ReporteCatalogoCuentasModificadasController } from '../controllers/ReporteCatalogoCuentasModificadasController';

export function createReporteCatalogoCuentasModificadasRoutes(): Router {
  const router = Router();
  const controller = container.get<ReporteCatalogoCuentasModificadasController>('ReporteCatalogoCuentasModificadasController');

  // POST /api/reporte-catalogo-cuentas-modificadas/:conjunto/exportar-excel - Exportar a Excel
  router.post('/:conjunto/exportar-excel', (req, res) => controller.exportarExcel(req, res));

  return router;
}
