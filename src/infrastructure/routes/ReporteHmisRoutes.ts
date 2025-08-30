// src/infrastructure/routes/createReporteHmisRoutes.ts
import { Router } from "express";
import { container } from "../container/container";
import { HmisController } from "../controllers/HmisController";
import { IReporteHmisRepository } from "../../domain/repositories/IReporteHmisRepository";

export function createReporteHmisRoutes(reporteHmisRepository: IReporteHmisRepository): Router {
  const router = Router();
  const controller = container.get<HmisController>("HmisController");

  // 📌 GET /api/reporte-hmis/:dbAlias/contratos/:contrato
  router.get("/:dbAlias/contratos/:contrato", (req, res) => {
    console.log("📥 Petición recibida en /api/reporte-hmis");
    controller.obtenerContratoPorId(req, res);
  });
  
  
  
  
  return router;
}
