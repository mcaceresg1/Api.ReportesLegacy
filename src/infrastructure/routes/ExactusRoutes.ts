import { Router } from 'express';
import { ExactusController } from '../controllers/ExactusController';
import { ICentroCostoRepository } from '../../domain/repositories/ICentroCostoRepository';
import { ICuentaContableRepository } from '../../domain/repositories/ICuentaContableRepository';

export function createExactusRoutes(
  centroCostoRepository: ICentroCostoRepository,
  cuentaContableRepository: ICuentaContableRepository
): Router {
  const router = Router();
  const exactusController = new ExactusController(centroCostoRepository, cuentaContableRepository);

  // Rutas para centros costo
  // GET /api/exactus/:conjunto/centros-costo - Obtener centros costo por conjunto
  router.get('/:conjunto/centros-costo', (req, res) => exactusController.getCentrosCostoByConjunto(req, res));

  // GET /api/exactus/:conjunto/centros-costo/:codigo - Obtener centro costo por código
  router.get('/:conjunto/centros-costo/:codigo', (req, res) => exactusController.getCentroCostoByCodigo(req, res));

  // GET /api/exactus/:conjunto/centros-costo/tipo/:tipo - Obtener centros costo por tipo
  router.get('/:conjunto/centros-costo/tipo/:tipo', (req, res) => exactusController.getCentrosCostoByTipo(req, res));

  // GET /api/exactus/:conjunto/centros-costo/activos - Obtener centros costo activos
  router.get('/:conjunto/centros-costo/activos', (req, res) => exactusController.getCentrosCostoActivos(req, res));

  // Rutas para cuentas contables
  // GET /api/exactus/:conjunto/cuentas-contables - Obtener cuentas contables por conjunto
  router.get('/:conjunto/cuentas-contables', (req, res) => exactusController.getCuentasContablesByConjunto(req, res));

  // GET /api/exactus/:conjunto/cuentas-contables/activas - Obtener cuentas contables activas
  router.get('/:conjunto/cuentas-contables/activas', (req, res) => exactusController.getCuentasContablesActivas(req, res));

  // GET /api/exactus/:conjunto/cuentas-contables/tipo/:tipo - Obtener cuentas contables por tipo
  router.get('/:conjunto/cuentas-contables/tipo/:tipo', (req, res) => exactusController.getCuentasContablesByTipo(req, res));

  // GET /api/exactus/:conjunto/cuentas-contables/:codigo - Obtener cuenta contable por código
  router.get('/:conjunto/cuentas-contables/:codigo', (req, res) => exactusController.getCuentaContableByCodigo(req, res));

  return router;
}
