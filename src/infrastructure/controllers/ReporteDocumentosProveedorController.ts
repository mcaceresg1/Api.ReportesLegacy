import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IReporteDocumentosProveedorService } from "../../domain/services/IReporteDocumentosProveedorService";

@injectable()
export class ReporteDocumentosProveedorController {
  constructor(
    @inject("IReporteDocumentosProveedorService")
    private readonly reporteService: IReporteDocumentosProveedorService
  ) {}

 /**
 * @swagger
 * /api/documentos-proveedor/proveedores/{conjunto}:
 *   get:
 *     summary: Obtiene la lista de proveedores de un conjunto específico
 *     tags:
 *       - Documentos Proveedor
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         schema:
 *           type: string
 *         required: true
 *         description: "Nombre del esquema o base de datos (por ejemplo: ASFSAC)"
 *     responses:
 *       200:
 *         description: Lista de proveedores obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       proveedor:
 *                         type: string
 *                         example: "00811007008"
 *                       nombre:
 *                         type: string
 *                         example: "Proveedor XYZ"
 *                       alias:
 *                         type: string
 *                         example: "PXYZ"
 *                       activo:
 *                         type: boolean
 *                         example: true
 *                       moneda:
 *                         type: string
 *                         example: "USD"
 *                       saldo:
 *                         type: number
 *                         example: 1234.56
 *       400:
 *         description: Parámetro 'conjunto' es requerido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "El parámetro conjunto es requerido"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error al obtener proveedores"
 */

  async obtenerProveedor(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
  
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro 'conjunto' es requerido",
        });
        return;
      }
  
      const proveedores = await this.reporteService.obtenerProveedor(conjunto);
  
      res.json({
        success: true,
        data: proveedores,
      });
    } catch (error) {
      console.error("Error en ReporteDocumentosProveedorController.obtenerProveedor:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener proveedores",
      });
    }
  }
  
  

  /**
   * @swagger
   * /api/documentos-proveedor/reporte:
   *   get:
   *     summary: Obtiene el reporte de documentos de un proveedor entre un rango de fechas
   *     tags:
   *       - Documentos Proveedor
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         schema:
   *           type: string
   *         required: true
   *         description: Nombre del esquema o base de datos
   *       - in: query
   *         name: proveedor
   *         schema:
   *           type: string
   *         required: true
   *         description: Código del proveedor
   *       - in: query
   *         name: fechaInicio
   *         schema:
   *           type: string
   *           format: date
   *         required: true
   *         description: Fecha inicial (YYYY-MM-DD)
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         required: true
   *         description: Fecha final (YYYY-MM-DD)
   *     responses:
   *       200:
   *         description: Reporte de documentos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   proveedor:
   *                     type: string
   *                   nombre:
   *                     type: string
   *                   fecha_vence:
   *                     type: string
   *                     format: date
   *                   tipo:
   *                     type: string
   *                   documento:
   *                     type: string
   *                   aplicacion:
   *                     type: string
   *                   moneda:
   *                     type: string
   *                   monto:
   *                     type: number
   *       400:
   *         description: Parámetros incompletos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerReporteDocumentosPorProveedor(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { conjunto, proveedor, fechaInicio, fechaFin } = req.query;

      if (!conjunto || !proveedor || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message:
            "Parámetros incompletos. Se requieren conjunto, proveedor, fechaInicio y fechaFin.",
        });
        return;
      }

      const reporte =
        await this.reporteService.obtenerReporteDocumentosPorProveedor(
          conjunto as string,
          proveedor as string,
          fechaInicio as string,
          fechaFin as string
        );

      res.json({
        success: true,
        data: reporte,
      });
    } catch (error) {
      console.error(
        "Error en ReporteDocumentosProveedorController.obtenerReporteDocumentosPorProveedor:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Error interno del servidor.",
      });
    }
  }
}
