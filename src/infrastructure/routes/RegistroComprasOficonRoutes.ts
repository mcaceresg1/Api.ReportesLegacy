import { Router } from "express";
import { injectable, inject } from "inversify";
import { RegistroComprasOficonController } from "../controllers/RegistroComprasOficonController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { TYPES } from "../container/types";

@injectable()
export class RegistroComprasOficonRoutes {
  constructor(
    @inject(TYPES.RegistroComprasOficonController)
    private readonly registroComprasOficonController: RegistroComprasOficonController,
    @inject(TYPES.AuthMiddleware)
    private readonly authMiddleware: AuthMiddleware
  ) {}

  getRouter(): Router {
    const router = Router();

    console.log("🔧 Configurando rutas de Registro Compras OFICON...");

    // Aplicar middleware de autenticación a todas las rutas
    router.use(this.authMiddleware.verifyToken);

    // GET endpoint para generar reporte con parámetros de query
    router.get(
      "/generar-reporte",
      (req, res, next) => {
        console.log("📝 GET /generar-reporte - Parámetros:", req.query);
        next();
      },
      this.registroComprasOficonController.generarReporteRegistroComprasOficon.bind(
        this.registroComprasOficonController
      )
    );

    console.log(
      "✅ Rutas de Registro Compras OFICON configuradas correctamente"
    );
    return router;
  }
}
