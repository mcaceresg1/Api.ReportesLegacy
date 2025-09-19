import { Router } from "express";
import { injectable, inject } from "inversify";
import { LibroInventarioBalanceOficonController } from "../controllers/LibroInventarioBalanceOficonController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { TYPES } from "../container/types";

@injectable()
export class LibroInventarioBalanceOficonRoutes {
  constructor(
    @inject(TYPES.LibroInventarioBalanceOficonController)
    private readonly libroInventarioBalanceOficonController: LibroInventarioBalanceOficonController,
    @inject(TYPES.AuthMiddleware)
    private readonly authMiddleware: AuthMiddleware
  ) {}

  getRouter(): Router {
    const router = Router();

    console.log("🔧 Configurando rutas de Libro Inventario Balance OFICON...");

    // Aplicar middleware de autenticación a todas las rutas
    router.use(this.authMiddleware.verifyToken);

    // GET endpoint para generar reporte con parámetros de query
    router.get(
      "/generar-reporte",
      (req, res, next) => {
        console.log("📝 GET /generar-reporte - Parámetros:", req.query);
        next();
      },
      this.libroInventarioBalanceOficonController.generarReporteLibroInventarioBalanceOficon.bind(
        this.libroInventarioBalanceOficonController
      )
    );

    console.log(
      "✅ Rutas de Libro Inventario Balance OFICON configuradas correctamente"
    );
    return router;
  }
}
