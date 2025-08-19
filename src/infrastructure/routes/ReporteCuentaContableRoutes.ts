import { Router } from 'express';
import { IReporteCuentaContableRepository } from '../../domain/repositories/IReporteCuentaContableRepository';
import { ReporteCuentaContableController } from '../controllers/ReporteCuentaContableController';

export function createReporteCuentaContableRoutes(
  reporteCuentaContableRepository: IReporteCuentaContableRepository
): Router {
  const router = Router();
  const reporteCuentaContableController = new ReporteCuentaContableController(reporteCuentaContableRepository);

  // Ruta para obtener filtro de centros de costo
  router.get('/:conjunto/filtro-centros-costo', (req, res) => 
    reporteCuentaContableController.obtenerFiltroCentrosCosto(req, res)
  );

  // Ruta para obtener información de un centro de costo específico
  router.get('/:conjunto/centro-costo/:centroCosto', (req, res) => 
    reporteCuentaContableController.obtenerCentroCostoPorCodigo(req, res)
  );

  // Ruta para obtener cuentas contables por centro de costo
  router.get('/:conjunto/cuentas-contables/:centroCosto', (req, res) => 
    reporteCuentaContableController.obtenerCuentasContablesPorCentroCosto(req, res)
  );

  // POST /api/reporte-cuenta-contable/:conjunto/cuentas-contables/:centroCosto/exportar-excel - Exportar a Excel
  router.post('/:conjunto/cuentas-contables/:centroCosto/exportar-excel', (req, res) => 
    reporteCuentaContableController.exportarExcel(req, res)
  );

  return router;
}
