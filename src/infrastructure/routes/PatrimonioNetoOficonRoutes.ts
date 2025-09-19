import { Router } from "express";
import { injectable, inject } from "inversify";
import { PatrimonioNetoOficonController } from "../controllers/PatrimonioNetoOficonController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { TYPES } from "../container/types";

@injectable()
export class PatrimonioNetoOficonRoutes {
  constructor(
    @inject(TYPES.PatrimonioNetoOficonController)
    private readonly patrimonioNetoOficonController: PatrimonioNetoOficonController,
    @inject(TYPES.AuthMiddleware)
    private readonly authMiddleware: AuthMiddleware
  ) {}

  getRouter(): Router {
    const router = Router();

    console.log("🔧 Configurando rutas de Patrimonio Neto OFICON...");

    // Aplicar middleware de autenticación a todas las rutas
    router.use(this.authMiddleware.verifyToken);

    // GET endpoint para generar reporte con parámetros de query
    router.get(
      "/generar-reporte",
      (req, res, next) => {
        console.log("📝 GET /generar-reporte - Parámetros:", req.query);
        next();
      },
      this.patrimonioNetoOficonController.generarReportePatrimonioNetoOficon.bind(
        this.patrimonioNetoOficonController
      )
    );

    console.log(
      "✅ Rutas de Patrimonio Neto OFICON configuradas correctamente"
    );
    return router;
  }
}
