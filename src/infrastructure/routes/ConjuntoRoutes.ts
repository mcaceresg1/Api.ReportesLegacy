import { Router } from 'express';
import { ConjuntoController } from '../controllers/ConjuntoController';
import { IConjuntoService } from '../../domain/services/IConjuntoService';

export function createConjuntoRoutes(conjuntoService: IConjuntoService): Router {
  const router = Router();
  const conjuntoController = new ConjuntoController(conjuntoService);

  // GET /api/conjuntos - Obtener todos los conjuntos
  router.get('/', (req, res) => conjuntoController.getAllConjuntos(req, res));

  // GET /api/conjuntos/activos - Obtener conjuntos activos
  router.get('/activos', (req, res) => conjuntoController.getConjuntosActivos(req, res));

  // GET /api/conjuntos/:codigo - Obtener conjunto por código
  router.get('/:codigo', (req, res) => conjuntoController.getConjuntoByCodigo(req, res));

  return router;
}
