import { Router } from "express";
import { IReporteDocumentosProveedorRepository } from "../../domain/repositories/IReporteDocumentosProveedorRepository";
import { container } from "../container/container";
import { ReporteDocumentosProveedorController } from "../controllers/ReporteDocumentosProveedorController";

export function createReporteDocumentosProveedorRoutes(
  reporteDocumentosProveedorRepository: IReporteDocumentosProveedorRepository
): Router {
  const router = Router();

  // Obtén el controlador desde el contenedor 
  const controller = container.get<ReporteDocumentosProveedorController>('ClipperController');


  // Ruta para obtener la lista de proveedores filtrados por conjunto
  router.get('/proveedores/:conjunto', (req, res) => {
    console.log('>> Ruta /proveedores/:conjunto accedida con:', req.params.conjunto);
    controller.obtenerProveedor(req, res);
  });
  
  

  // Ruta para obtener el reporte de documentos por proveedor con parámetros en query
  router.get("/reporte", (req, res) => controller.obtenerReporteDocumentosPorProveedor(req, res));

  
  router.get("/documentosPorPagar", (req, res) => controller.obtenerReporteDocumentosPorPagar(req, res));

  return router;
}
