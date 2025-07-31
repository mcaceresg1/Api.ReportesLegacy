import { Router } from 'express';
import { container } from '../container/container';
import { CentroCostoController } from '../controllers/CentroCostoController';

const router = Router();
const centroCostoController = container.get<CentroCostoController>('CentroCostoController');

// Rutas para centros de costo
router.get('/', (req, res) => centroCostoController.getAllCentrosCostos(req, res));
router.get('/activos', (req, res) => centroCostoController.getCentrosCostosActivos(req, res));
router.get('/:id', (req, res) => centroCostoController.getCentroCostoById(req, res));
router.get('/codigo/:codigo', (req, res) => centroCostoController.getCentroCostoByCodigo(req, res));
router.post('/', (req, res) => centroCostoController.createCentroCosto(req, res));
router.post('/filter', (req, res) => centroCostoController.getCentrosCostosByFilter(req, res));
router.put('/:id', (req, res) => centroCostoController.updateCentroCosto(req, res));
router.delete('/:id', (req, res) => centroCostoController.deleteCentroCosto(req, res));

export default router; 