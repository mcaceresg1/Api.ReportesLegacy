import { Router } from "express";
import { IReporteDocumentosProveedorRepository } from "../../domain/repositories/IReporteDocumentosProveedorRepository";
import { ReporteDocumentosProveedorController } from "../controllers/ReporteDocumentosProveedorController";
import { container } from "../container/container";

export function createReporteDocumentosProveedorRoutes(
  reporteDocumentosProveedorRepository: IReporteDocumentosProveedorRepository
): Router {
  const router = Router();

  // Obtén el controlador desde el contenedor de Inversify
  const controller = container.get<ReporteDocumentosProveedorController>(
    "ReporteDocumentosProveedorController"
  );

  // Ruta para obtener la lista de proveedores filtrados por conjunto
  router.get('/proveedores/:conjunto', (req, res) => controller.obtenerProveedor(req, res));


  // Ruta para obtener el reporte de documentos por proveedor con parámetros en query
  router.get("/reporte", (req, res) => controller.obtenerReporteDocumentosPorProveedor(req, res));

  
  router.get("/documentosPorPagar", (req, res) => controller.obtenerReporteDocumentosPorPagar(req, res));

  return router;
}
