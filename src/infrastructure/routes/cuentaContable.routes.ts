import { Router } from 'express';
import { CuentaContableController } from '../controllers/CuentaContableController';
import { container } from '../container/container';

export const createCuentaContableRoutes = () => {
  const router = Router();
  const controller = container.get<CuentaContableController>('CuentaContableController');

  /**
   * @swagger
   * tags:
   *   name: Cuentas Contables
   *   description: Endpoints para gestionar cuentas contables
   */

  router.get(
    '/:conjunto/modificadas',
    (req, res) => controller.obtenerCuentasContablesModificadas(req, res)
  );

  return router;
};
