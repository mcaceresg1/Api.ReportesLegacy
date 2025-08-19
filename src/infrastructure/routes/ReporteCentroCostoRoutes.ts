import { Router } from 'express';
import { IReporteCentroCostoRepository } from '../../domain/repositories/IReporteCentroCostoRepository';
import { ReporteCentroCostoController } from '../controllers/ReporteCentroCostoController';
import { container } from '../container/container';

export function createReporteCentroCostoRoutes(reporteCentroCostoRepository: IReporteCentroCostoRepository): Router {
  const router = Router();
  const controller = container.get<ReporteCentroCostoController>('ReporteCentroCostoController');

  // Obtener filtro de cuentas contables
  router.get('/:conjunto/filtro-cuentas-contables', 
    (req, res) => controller.obtenerFiltroCuentasContables(req, res)
  );

  // Obtener detalle de cuenta contable
  router.get('/:conjunto/detalle-cuenta-contable/:cuentaContable', 
    (req, res) => controller.obtenerDetalleCuentaContable(req, res)
  );

  // Obtener centros de costo por cuenta contable
  router.get('/:conjunto/centros-costo/:cuentaContable', 
    (req, res) => controller.obtenerCentrosCostoPorCuentaContable(req, res)
  );

  // POST /api/reporte-centro-costo/:conjunto/centros-costo/:cuentaContable/exportar-excel - Exportar a Excel
  router.post('/:conjunto/centros-costo/:cuentaContable/exportar-excel', 
    (req, res) => controller.exportarExcel(req, res)
  );

  return router;
}
