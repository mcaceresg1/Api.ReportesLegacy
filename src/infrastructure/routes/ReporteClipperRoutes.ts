// src/infrastructure/routes/createReporteClipperRoutes.ts
import { Router } from "express";
import { container } from "../container/container";
import { ClipperController } from "../controllers/ClipperController";
import { IReporteClipperRepository } from "../../domain/repositories/IReporteClipperRepository";

export function createReporteClipperRoutes(
  reporteClipperRepository: IReporteClipperRepository
): Router {
  const router = Router();
  const controller = container.get<ClipperController>("ClipperController");

  // GET /api/reporte-clipper/:ruta/contratos
  router.get("/:ruta/contratos", (req, res) =>
    controller.obtenerContratos(req, res)
  );

  // GET /api/reporte-clipper/:ruta/contratos-paginados
  router.get("/:ruta/contratos-paginados", (req, res) =>
    controller.obtenerContratosPaginados(req, res)
  );

  // GET /api/reporte-clipper/:ruta/contratos/:contrato/:control
  router.get("/:ruta/contratos/:contrato?/:control?", (req, res) =>
    controller.obtenerContratoPorId(req, res)
  );

  return router;
}
