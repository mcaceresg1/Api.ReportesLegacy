import { Router } from 'express';
import { IReporteGenericoSaldosRepository } from '../../domain/repositories/IReporteGenericoSaldosRepository';
import { ReporteGenericoSaldosController } from '../controllers/ReporteGenericoSaldosController';
import { container } from '../container/container';

export function createReporteGenericoSaldosRoutes(reporteGenericoSaldosRepository: IReporteGenericoSaldosRepository): Router {
  const router = Router();
  const controller = container.get<ReporteGenericoSaldosController>('ReporteGenericoSaldosController');

  // Obtener filtro de cuentas contables
  router.get('/:conjunto/filtro-cuentas-contables', 
    (req, res) => controller.obtenerFiltroCuentasContables(req, res)
  );

  // Obtener detalle de cuenta contable
  router.get('/:conjunto/detalle-cuenta-contable/:cuentaContable', 
    (req, res) => controller.obtenerDetalleCuentaContable(req, res)
  );

  // Obtener filtro de tipos de documento
  router.get('/:conjunto/filtro-tipos-documento', 
    (req, res) => controller.obtenerFiltroTiposDocumento(req, res)
  );

  // Obtener filtro de tipos de asiento
  router.get('/:conjunto/filtro-tipos-asiento', 
    (req, res) => controller.obtenerFiltroTiposAsiento(req, res)
  );

  // Obtener filtro de clases de asiento
  router.get('/:conjunto/filtro-clases-asiento', 
    (req, res) => controller.obtenerFiltroClasesAsiento(req, res)
  );

  // Generar reporte genérico de saldos
  router.post('/:conjunto/generar', 
    (req, res) => controller.generarReporte(req, res)
  );

  // Exportar a Excel
  router.post('/:conjunto/exportar-excel', 
    (req, res) => controller.exportarExcel(req, res)
  );

  // Exportar a PDF
  router.post('/:conjunto/exportar-pdf', 
    (req, res) => controller.exportarPDF(req, res)
  );

  // Limpiar caché de tablas temporales
  router.post('/cache/limpiar', 
    (req, res) => controller.limpiarCache(req, res)
  );

  // Obtener estadísticas del caché
  router.get('/cache/estadisticas', 
    (req, res) => controller.obtenerEstadisticasCache(req, res)
  );

  return router;
}
