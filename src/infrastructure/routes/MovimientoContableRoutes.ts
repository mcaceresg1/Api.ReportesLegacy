import { Router } from 'express';
import { container } from '../container/container';
import { MovimientoContableController } from '../controllers/MovimientoContableController';

const router = Router();
const movimientoContableController = container.get<MovimientoContableController>('MovimientoContableController');

// Rutas para movimientos contables (sin middleware aquí, se aplica en app.ts)

// Rutas para movimientos contables
router.get('/', (req, res) => movimientoContableController.getAllMovimientosContables(req, res));
router.get('/:id', (req, res) => movimientoContableController.getMovimientoContableById(req, res));
router.post('/', (req, res) => movimientoContableController.createMovimientoContable(req, res));
router.put('/:id', (req, res) => movimientoContableController.updateMovimientoContable(req, res));
router.delete('/:id', (req, res) => movimientoContableController.deleteMovimientoContable(req, res));
router.get('/tipo/:tipo', (req, res) => movimientoContableController.getMovimientosContablesByTipo(req, res));
router.get('/centro-costo/:centroCostoId', (req, res) => movimientoContableController.getMovimientosContablesByCentroCosto(req, res));
router.post('/pdf', (req, res) => movimientoContableController.generatePDF(req, res));

// Ruta temporal para actualizar movimientos contables con compania_id
router.post('/update-compania', (req, res) => movimientoContableController.updateMovimientosCompania(req, res));

export default router; 