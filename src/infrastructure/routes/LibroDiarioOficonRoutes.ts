import { Router } from "express";
import { injectable } from "inversify";
import { LibroDiarioOficonController } from "../controllers/LibroDiarioOficonController";

@injectable()
export class LibroDiarioOficonRoutes {
  constructor(
    private readonly libroDiarioOficonController: LibroDiarioOficonController
  ) {}

  getRouter(): Router {
    const router = Router();

    // GET endpoint para generar reporte con parámetros de query
    router.get(
      "/generar-reporte",
      this.libroDiarioOficonController.generarReporteLibroDiarioOficon.bind(
        this.libroDiarioOficonController
      )
    );

    // POST endpoint para generar reporte con parámetros en el body
    router.post(
      "/generar-reporte",
      this.libroDiarioOficonController.generarReporteLibroDiarioOficonPost.bind(
        this.libroDiarioOficonController
      )
    );

    return router;
  }
}
