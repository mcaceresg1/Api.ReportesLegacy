import { injectable, inject } from "inversify";
import { Router } from "express";
import { AnalisisCuentasClipperController } from "../controllers/AnalisisCuentasClipperController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

/**
 * Rutas para Análisis de Cuentas Clipper
 * Define los endpoints para el reporte
 */
@injectable()
export class AnalisisCuentasClipperRoutes {
  constructor(
    @inject("AnalisisCuentasClipperController")
    private readonly analisisCuentasClipperController: AnalisisCuentasClipperController,
    @inject("AuthMiddleware")
    private readonly authMiddleware: AuthMiddleware
  ) {}

  /**
   * Configura y retorna el router con todas las rutas
   */
  getRouter(): Router {
    const router = Router();

    // Aplicar middleware de autenticación a todas las rutas
    router.use(this.authMiddleware.verifyToken);

    // GET /api/analisis-cuentas-clipper
    // Obtiene el reporte con filtros y paginación
    router.get(
      "/",
      this.analisisCuentasClipperController.obtenerReporte.bind(
        this.analisisCuentasClipperController
      )
    );

    // GET /api/analisis-cuentas-rango-clipper
    // Obtiene el reporte de análisis de cuentas por rango
    router.get(
      "/rango",
      this.analisisCuentasClipperController.obtenerReporteAnalisisCuentaRangoClipper.bind(
        this.analisisCuentasClipperController
      )
    );

    // GET /api/analisis-cuentas-clipper/fechas
    // Obtiene el reporte de análisis de cuentas por fechas
    router.get(
      "/fechas",
      this.analisisCuentasClipperController.obtenerReporteAnalisisCuentasFechasClipper.bind(
        this.analisisCuentasClipperController
      )
    );

    // GET /api/analisis-cuentas-clipper/vencimiento
    // Obtiene el reporte de análisis de cuentas por fecha de vencimiento
    router.get(
      "/vencimiento",
      this.analisisCuentasClipperController.obtenerReporteAnalisisCuentasVencimientoClipper.bind(
        this.analisisCuentasClipperController
      )
    );

    return router;
  }
}
