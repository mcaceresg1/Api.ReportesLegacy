import { Router } from 'express';
import { IMovimientoContableRepository } from '../../domain/repositories/IMovimientoContableRepository';
import { MovimientoContableController } from '../controllers/MovimientoContableController';

export function createMovimientoContableRoutes(
  movimientoContableRepository: IMovimientoContableRepository
): Router {
  const router = Router();
  const movimientoContableController = new MovimientoContableController(movimientoContableRepository);

  // POST /api/movimientos/:conjunto/generar-reporte - Generar reporte de movimientos
  router.post('/:conjunto/generar-reporte', (req, res) => movimientoContableController.generarReporte(req, res));

  // GET /api/movimientos/:conjunto/por-usuario/:usuario - Obtener movimientos por usuario
  router.get('/:conjunto/por-usuario/:usuario', (req, res) => movimientoContableController.obtenerMovimientosPorUsuario(req, res));

  // GET /api/movimientos/:conjunto/por-centro-costo/:centroCosto - Obtener movimientos por centro de costo
  router.get('/:conjunto/por-centro-costo/:centroCosto', (req, res) => movimientoContableController.obtenerMovimientosPorCentroCosto(req, res));

  // GET /api/movimientos/:conjunto/por-cuenta-contable/:cuentaContable - Obtener movimientos por cuenta contable
  router.get('/:conjunto/por-cuenta-contable/:cuentaContable', (req, res) => movimientoContableController.obtenerMovimientosPorCuentaContable(req, res));

  // POST /api/movimientos/:conjunto/exportar-excel - Exportar movimientos contables a Excel
  router.post('/:conjunto/exportar-excel', (req, res) => movimientoContableController.exportarExcel(req, res));

  return router;
}
