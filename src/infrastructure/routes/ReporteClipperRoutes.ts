// src/infrastructure/routes/createReporteClipperRoutes.ts
import { Router } from 'express';
import { container } from '../container/container';
import { ClipperController } from '../controllers/ClipperController';
import { IReporteClipperRepository } from '../../domain/repositories/IReporteClipperRepository';

export function createReporteClipperRoutes(reporteClipperRepository: IReporteClipperRepository): Router {
  const router = Router();
  const controller = container.get<ClipperController>('ClipperController');

  // GET /api/reporte-clipper/:ruta/contratos/:contrato/:control (MÁS ESPECÍFICA PRIMERO)
  router.get('/:ruta/contratos/:contrato/:control', (req, res) =>
    controller.obtenerContratoPorId(req, res)
  );

  // GET /api/reporte-clipper/:ruta/contratos/:contrato (SOLO CONTRATO)
  router.get('/:ruta/contratos/:contrato', (req, res) =>
    controller.obtenerContratoPorId(req, res)
  );

  // GET /api/reporte-clipper/:ruta/contratos (LISTA DE CONTRATOS - MÁS GENERAL AL FINAL)
  router.get('/:ruta/contratos', (req, res) => controller.obtenerContratos(req, res));

  return router;
}