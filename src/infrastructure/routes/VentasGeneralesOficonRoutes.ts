import { Router } from "express";
import { injectable, inject } from "inversify";
import { VentasGeneralesOficonController } from "../controllers/VentasGeneralesOficonController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { TYPES } from "../container/types";

@injectable()
export class VentasGeneralesOficonRoutes {
  constructor(
    @inject(TYPES.VentasGeneralesOficonController)
    private readonly ventasGeneralesOficonController: VentasGeneralesOficonController,
    @inject(TYPES.AuthMiddleware)
    private readonly authMiddleware: AuthMiddleware
  ) {}

  getRouter(): Router {
    const router = Router();

    console.log("🔧 Configurando rutas de Ventas Generales OFICON...");

    // Aplicar middleware de autenticación a todas las rutas
    router.use(this.authMiddleware.verifyToken);

    // GET endpoint para generar reporte con parámetros de query
    router.get(
      "/generar-reporte",
      (req, res, next) => {
        console.log("📝 GET /generar-reporte - Parámetros:", req.query);
        next();
      },
      this.ventasGeneralesOficonController.generarReporteVentasGeneralesOficon.bind(
        this.ventasGeneralesOficonController
      )
    );

    console.log(
      "✅ Rutas de Ventas Generales OFICON configuradas correctamente"
    );
    return router;
  }
}
