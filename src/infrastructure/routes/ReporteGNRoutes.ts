import { Router } from "express";
import { ReporteGNController } from "../controllers/ReporteGNController";
import { container } from "../container/container";

export function createReporteGNRoutes(): Router {
  const router = Router();

  const controller = container.get<ReporteGNController>("ReporteGNController");

  router.get("/acciones-de-personal/:conjunto", (req, res) =>
    controller.getAccionesDePersonal(req, res)
  );

  router.get("/contratos/:conjunto", (req, res) => controller.getContratos(req, res));

  router.get("/rol-de-vacaciones/:conjunto", (req, res) =>
    controller.getRolDeVacaciones(req, res)
  );

  router.get("/anualizado/:conjunto", (req, res) => controller.getAnualizado(req, res));

  router.get("/prestamo-cta-cte/:conjunto", (req, res) =>
    controller.getPrestamoCtaCte(req, res)
  );

  return router;
}
