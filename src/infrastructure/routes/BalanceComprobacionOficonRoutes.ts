import { Router } from "express";
import { injectable, inject } from "inversify";
import { BalanceComprobacionOficonController } from "../controllers/BalanceComprobacionOficonController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { TYPES } from "../container/types";

@injectable()
export class BalanceComprobacionOficonRoutes {
  constructor(
    @inject(TYPES.BalanceComprobacionOficonController)
    private readonly balanceComprobacionOficonController: BalanceComprobacionOficonController,
    @inject(TYPES.AuthMiddleware)
    private readonly authMiddleware: AuthMiddleware
  ) {}

  getRouter(): Router {
    const router = Router();

    console.log("🔧 Configurando rutas de Balance Comprobación OFICON...");

    // Aplicar middleware de autenticación a todas las rutas
    router.use(this.authMiddleware.verifyToken);

    // GET endpoint para generar reporte con parámetros de query
    router.get(
      "/generar-reporte",
      (req, res, next) => {
        console.log("📝 GET /generar-reporte - Parámetros:", req.query);
        next();
      },
      this.balanceComprobacionOficonController.generarReporteBalanceComprobacionOficon.bind(
        this.balanceComprobacionOficonController
      )
    );

    console.log(
      "✅ Rutas de Balance Comprobación OFICON configuradas correctamente"
    );
    return router;
  }
}
