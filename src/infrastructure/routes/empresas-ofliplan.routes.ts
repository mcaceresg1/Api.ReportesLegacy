import { Router } from "express";
import { container } from "../container/container";
import { EmpresasOfliplanController } from "../controllers/EmpresasOfliplanController";
import { TYPES } from "../container/types";

const router = Router();
const empresasOfliplanController = container.get<EmpresasOfliplanController>(
  TYPES.EmpresasOfliplanController
);

// GET /api/empresas-ofliplan - Obtener lista de empresas OFIPLAN
router.get("/", (req, res) => {
  empresasOfliplanController.getEmpresas(req, res);
});

export { router as EmpresasOfliplanRoutes };
export default router;
