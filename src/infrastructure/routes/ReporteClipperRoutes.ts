// src/infrastructure/routes/createReporteClipperRoutes.ts
import { Router } from 'express';
import { container } from '../container/container';
import { ClipperController } from '../controllers/ClipperController';
import { IReporteClipperRepository } from '../../domain/repositories/IReporteClipperRepository';

export function createReporteClipperRoutes(reporteClipperRepository: IReporteClipperRepository): Router {
  const router = Router();
  const controller = container.get<ClipperController>('ClipperController');

  // GET /api/reporte-clipper/:ruta/contratos
   router.get('/:ruta/contratos', (req, res) => controller.obtenerContratos(req, res));
  // router.get('/:ruta/contratos', (req, res) => {
  //   console.log(`✅ Ruta activa: GET /${req.params.ruta}/contratos`);
  //   controller.obtenerContratos(req, res);
  // });

  return router;
}
