import { Router } from "express";
import { container } from "../container/container";
import { EmpresasOficonController } from "../controllers/EmpresasOficonController";
import { TYPES } from "../container/types";

const router = Router();
const empresasOficonController = container.get<EmpresasOficonController>(
  TYPES.EmpresasOficonController
);

// GET /api/empresas-oficon - Obtener lista de empresas OFICON
router.get("/", (req, res) => {
  empresasOficonController.getEmpresas(req, res);
});

export { router as EmpresasOficonRoutes };
export default router;
