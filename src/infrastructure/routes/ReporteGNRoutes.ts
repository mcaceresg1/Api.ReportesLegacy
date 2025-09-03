import { Router } from "express";
import { ReporteGNController } from "../controllers/ReporteGNController";
import { container } from "../container/container";

export function createReporteGNRoutes(): Router {
  const router = Router();

  const controller = container.get<ReporteGNController>("ReporteGNController");

  router.get("/acciones-de-personal", (req, res) =>
    controller.getAccionesDePersonal(req, res)
  );

  router.get("/contratos", (req, res) => controller.getContratos(req, res));

  router.get("/rol-de-vacaciones", (req, res) =>
    controller.getRolDeVacaciones(req, res)
  );

  router.get("/anualizado", (req, res) => controller.getAnualizado(req, res));

  router.get("/prestamo-cta-cte", (req, res) =>
    controller.getPrestamoCtaCte(req, res)
  );

  return router;
}
