import { Router } from 'express';
import { ExactusController } from '../controllers/ExactusController';
import { ICentroCuentaRepository } from '../../domain/repositories/ICentroCuentaRepository';
import { ICuentaContableRepository } from '../../domain/repositories/ICuentaContableRepository';

export function createExactusRoutes(
  centroCuentaRepository: ICentroCuentaRepository,
  cuentaContableRepository: ICuentaContableRepository
): Router {
  const router = Router();
  const exactusController = new ExactusController(centroCuentaRepository, cuentaContableRepository);

  // Rutas para centros cuenta
  // GET /api/exactus/:conjunto/centros-cuenta - Obtener centros cuenta por conjunto
  router.get('/:conjunto/centros-cuenta', (req, res) => exactusController.getCentrosCuentaByConjunto(req, res));

  // GET /api/exactus/:conjunto/centros-cuenta/cuenta/:cuentaContable - Obtener centros cuenta por cuenta contable
  router.get('/:conjunto/centros-cuenta/cuenta/:cuentaContable', (req, res) => exactusController.getCentrosCuentaByCuenta(req, res));

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
