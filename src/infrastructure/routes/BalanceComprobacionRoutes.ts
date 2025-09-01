import { Router } from "express";
import { injectable, inject } from "inversify";
import { BalanceComprobacionController } from "../controllers/BalanceComprobacionController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

@injectable()
export class BalanceComprobacionRoutes {
  constructor(
    @inject("BalanceComprobacionController")
    private balanceComprobacionController: BalanceComprobacionController,
    @inject("AuthMiddleware") private authMiddleware: AuthMiddleware
  ) {}

  getRouter(): Router {
    const router = Router();

    // Aplicar middleware de autenticación a todas las rutas
    router.use(this.authMiddleware.verifyToken);

    // Health check
    router.get(
      "/health",
      this.balanceComprobacionController.health.bind(
        this.balanceComprobacionController
      )
    );

    // Generar reporte
    router.post(
      "/generar",
      this.balanceComprobacionController.generarReporte.bind(
        this.balanceComprobacionController
      )
    );

    // Obtener datos del reporte
    router.get(
      "/obtener",
      this.balanceComprobacionController.obtenerBalanceComprobacion.bind(
        this.balanceComprobacionController
      )
    );

    // Exportar a Excel
    router.get(
      "/exportar-excel",
      this.balanceComprobacionController.exportarExcel.bind(
        this.balanceComprobacionController
      )
    );

    return router;
  }
}
