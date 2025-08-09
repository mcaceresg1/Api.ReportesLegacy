import { Router } from 'express';
import { container } from '../container/container';
import { TipoAsientoController } from '../controllers/TipoAsientoController';

export function createTipoAsientoRoutes(): Router {
  const router = Router();
  const controller = container.get<TipoAsientoController>('TipoAsientoController');

  router.get('/:conjunto', (req, res) => controller.listar(req, res));

  return router;
}


