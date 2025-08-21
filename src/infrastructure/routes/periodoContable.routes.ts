import { Router } from 'express';
import { container } from '../container/container';
import { PeriodoContableController } from '../controllers/PeriodoContableController';

const router = Router();
const periodoContableController = container.get<PeriodoContableController>(PeriodoContableController);

// Obtener centros de costo para un conjunto
router.get('/:conjunto/centros-costo', (req, res) => {
  periodoContableController.obtenerCentrosCosto(req, res);
});

// Generar reporte de periodos contables
router.post('/:conjunto/generar', (req, res) => {
  periodoContableController.generarReporte(req, res);
});

export default router;
