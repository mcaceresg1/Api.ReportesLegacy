import { Router } from "express";
import { container } from "../container/container";
import { PlanillaAnualizadaOfliplanController } from "../controllers/PlanillaAnualizadaOfliplanController";
import { TYPES } from "../container/types";

const router = Router();
const planillaAnualizadaOfliplanController =
  container.get<PlanillaAnualizadaOfliplanController>(
    TYPES.PlanillaAnualizadaOfliplanController
  );

/**
 * @swagger
 * tags:
 *   name: Planilla Anualizada OFIPLAN
 *   description: Endpoints para reportes de planilla anualizada OFIPLAN
 */

// GET /api/planilla-anualizada-ofliplan/generar-reporte
router.get(
  "/generar-reporte",
  planillaAnualizadaOfliplanController.generarReporte.bind(
    planillaAnualizadaOfliplanController
  )
);

export default router;
export { router as PlanillaAnualizadaOfliplanRoutes };
