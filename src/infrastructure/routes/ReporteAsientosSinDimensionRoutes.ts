import { Router } from 'express';
import { container } from '../container/container';
import { ReporteAsientosSinDimensionController } from '../controllers/ReporteAsientosSinDimensionController';

const router = Router();

// Obtener instancia del controlador desde el contenedor
const reporteAsientosSinDimensionController = container.get<ReporteAsientosSinDimensionController>('ReporteAsientosSinDimensionController');

// Rutas para el reporte de asientos sin dimensión
router.post('/:conjunto/generar', (req, res) => reporteAsientosSinDimensionController.generar(req, res));
router.get('/:conjunto/listar', (req, res) => reporteAsientosSinDimensionController.listar(req, res));
router.get('/:conjunto/detalle', (req, res) => reporteAsientosSinDimensionController.listarDetalle(req, res));
router.get('/:conjunto/:id', (req, res) => reporteAsientosSinDimensionController.getById(req, res));

export default router;
