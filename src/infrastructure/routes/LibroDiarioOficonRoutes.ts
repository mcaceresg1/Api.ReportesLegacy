import { Router } from "express";
import { injectable, inject } from "inversify";
import { LibroDiarioOficonController } from "../controllers/LibroDiarioOficonController";
import { TYPES } from "../container/types";

@injectable()
export class LibroDiarioOficonRoutes {
  constructor(
    @inject(TYPES.LibroDiarioOficonController)
    private readonly libroDiarioOficonController: LibroDiarioOficonController
  ) {}

  getRouter(): Router {
    const router = Router();

    console.log("🔧 Configurando rutas de Libro Diario OFICON...");

    // GET endpoint para generar reporte con parámetros de query
    router.get(
      "/generar-reporte",
      (req, res, next) => {
        console.log("📝 GET /generar-reporte - Parámetros:", req.query);
        next();
      },
      this.libroDiarioOficonController.generarReporteLibroDiarioOficon.bind(
        this.libroDiarioOficonController
      )
    );

    console.log("✅ Rutas de Libro Diario OFICON configuradas correctamente");
    return router;
  }
}
