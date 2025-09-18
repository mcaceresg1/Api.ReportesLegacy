import { Router } from "express";
import { injectable, inject } from "inversify";
import { LibroMayorOficonController } from "../controllers/LibroMayorOficonController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { TYPES } from "../container/types";

@injectable()
export class LibroMayorOficonRoutes {
  constructor(
    @inject(TYPES.LibroMayorOficonController)
    private readonly libroMayorOficonController: LibroMayorOficonController,
    @inject(TYPES.AuthMiddleware)
    private readonly authMiddleware: AuthMiddleware
  ) {}

  getRouter(): Router {
    const router = Router();

    console.log("🔧 Configurando rutas de Libro Mayor OFICON...");

    // Aplicar middleware de autenticación a todas las rutas
    router.use(this.authMiddleware.verifyToken);

    // GET endpoint para generar reporte con parámetros de query
    router.get(
      "/generar-reporte",
      (req, res, next) => {
        console.log("📝 GET /generar-reporte - Parámetros:", req.query);
        next();
      },
      this.libroMayorOficonController.generarReporteLibroMayorOficon.bind(
        this.libroMayorOficonController
      )
    );

    console.log("✅ Rutas de Libro Mayor OFICON configuradas correctamente");
    return router;
  }
}
