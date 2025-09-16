// src/infrastructure/routes/createReporteHmisRoutes.ts
import { Router } from "express";
import { container } from "../container/container";
import { HmisController } from "../controllers/HmisController";
import { IReporteHmisRepository } from "../../domain/repositories/IReporteHmisRepository";

export function createReporteHmisRoutes(
  reporteHmisRepository: IReporteHmisRepository
): Router {
  const router = Router();
  const controller = container.get<HmisController>("HmisController");

  // 📌 GET /api/reporte-hmis/databases - Obtener lista de bases de datos disponibles
  router.get("/databases", (req, res) => {
    controller.obtenerBasesDeDatos(req, res);
  });

  // 📌 GET /api/reporte-hmis/databases/status - Verificar estado de conexiones
  router.get("/databases/status", (req, res) => {
    controller.verificarEstadoConexiones(req, res);
  });

  // 📌 GET /api/reporte-hmis/:dbAlias/contratos/:contrato - Obtener contrato por ID
  router.get("/:dbAlias/contratos/:contrato", (req, res) => {
    controller.obtenerContratoPorId(req, res);
  });

  // 📌 GET /api/reporte-hmis/contratos/:dbAlias - Obtener lista de contratos
  router.get("/contratos/:dbAlias", (req, res) =>
    controller.obtenerListaContratos(req, res)
  );

  return router;
}
