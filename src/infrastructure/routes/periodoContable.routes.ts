import { Router } from 'express';
import { container } from '../container/container';
import { PeriodoContableController } from '../controllers/PeriodoContableController';

export function createPeriodoContableRoutes(): Router {
  const router = Router();
  const controller = new PeriodoContableController(
    container.get('IPeriodoContableRepository')
  );

  // Obtener centros de costo para un conjunto
  router.get('/:conjunto/centros-costo', (req, res) => {
    controller.obtenerCentrosCosto(req, res);
  });

  // Generar reporte de periodos contables
  router.post('/:conjunto/generar', (req, res) => {
    controller.generarReporte(req, res);
  });

  return router;
}
