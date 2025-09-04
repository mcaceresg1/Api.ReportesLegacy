import { Router } from 'express';
import { container } from '../container/container';
import { EstadoResultadosController } from '../controllers/EstadoResultadosController';
import { TYPES } from '../container/types';

const router = Router();
const estadoResultadosController = container.get<EstadoResultadosController>(TYPES.EstadoResultadosController);

// Rutas para filtros
router.get('/:conjunto/tipos-egp', (req, res) => estadoResultadosController.getTiposEgp(req, res));
router.get('/:conjunto/periodos-contables', (req, res) => estadoResultadosController.getPeriodosContables(req, res));

// Ruta principal para obtener el reporte
router.get('/:conjunto/reporte', (req, res) => estadoResultadosController.getReporte(req, res));

// Rutas de exportación
router.post('/:conjunto/exportar-excel', (req, res) => estadoResultadosController.exportarExcel(req, res));
router.post('/:conjunto/exportar-pdf', (req, res) => estadoResultadosController.exportarPDF(req, res));

export default router;
