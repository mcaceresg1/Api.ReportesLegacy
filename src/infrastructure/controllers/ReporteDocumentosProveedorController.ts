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
   *     summary: Obtiene una lista de proveedores de un conjunto específico con búsqueda dinámica optimizada.
   *     description: Este endpoint permite buscar proveedores de manera dinámica. Sin filtro retorna los primeros 50 proveedores activos. Con filtro busca hasta 100 proveedores que coincidan con el texto de búsqueda. La búsqueda se realiza tanto en el código como en el nombre del proveedor y los resultados se ordenan por relevancia.
   *     tags:
   *       - Tesorería y Caja - Lista Proveedor
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: "Nombre del esquema o base de datos (por ejemplo: ASFSAC)"
   *       - in: query
   *         name: filtro
   *         required: false
   *         schema:
   *           type: string
   *         description: "Texto de búsqueda para filtrar proveedores por nombre o código. Dejar vacío para obtener los primeros 50 proveedores activos."
   *         example: "PROV001"
   *     responses:
   *       200:
   *         description: "Lista de proveedores obtenida correctamente"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       proveedor:
   *                         type: string
   *                       nombre:
   *                         type: string
   *                       alias:
   *                         type: string
   *                       activo:
   *                         type: string
   *                       moneda:
   *                         type: string
   *                       saldo:
   *                         type: number
   *       400:
   *         description: "Parámetro 'conjunto' requerido"
   *       500:
   *         description: "Error interno del servidor"
   */

  async obtenerProveedor(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { filtro = "" } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro 'conjunto' es requerido",
        });
        return;
      }

      const proveedores = await this.reporteService.obtenerProveedor(
        conjunto,
        filtro.toString()
      );

      res.json({
        success: true,
        data: proveedores,
      });
    } catch (error) {
      console.error(
        "Error en ReporteDocumentosProveedorController.obtenerProveedor:",
        error
      );
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
   *       - Tesoreria y Caja - Documentos Proveedor
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         schema:
   *           type: string
   *         required: true
   *         description: "Nombre del esquema o base de datos"
   *       - in: query
   *         name: proveedor
   *         schema:
   *           type: string
   *         required: false
   *         description: "Código del proveedor"
   *       - in: query
   *         name: fechaInicio
   *         schema:
   *           type: string
   *           format: date
   *         required: false
   *         description: "Fecha inicial (YYYY-MM-DD)"
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         required: false
   *         description: "Fecha final (YYYY-MM-DD)"
   *     responses:
   *       200:
   *         description: "Reporte de documentos obtenido correctamente"
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
   *         description: "Parámetros incompletos"
   *       500:
   *         description: "Error interno del servidor"
   */

  async obtenerReporteDocumentosPorProveedor(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { conjunto, proveedor, fechaInicio, fechaFin } = req.query;

      if (!conjunto || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message:
            "Parámetros incompletos. Se requieren conjunto, fechaInicio y fechaFin.",
        });
        return;
      }

      // Convertir proveedor vacío a null
      const proveedorParam =
        (proveedor as string)?.trim() === "" ? null : (proveedor as string);

      const reporte =
        await this.reporteService.obtenerReporteDocumentosPorProveedor(
          conjunto as string,
          proveedorParam,
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

  /**
   * @swagger
   * /api/documentos-proveedor/documentosPorPagar:
   *   get:
   *     summary: Obtiene el reporte de documentos de un proveedor entre un rango de fechas
   *     tags:
   *       - Tesoreria y Caja - Detalle Movimientos por Pagar
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         schema:
   *           type: string
   *         required: true
   *         description: "Nombre del esquema o base de datos"
   *       - in: query
   *         name: proveedor
   *         schema:
   *           type: string
   *         required: false
   *         description: "Código del proveedor"
   *       - in: query
   *         name: fechaInicio
   *         schema:
   *           type: string
   *           format: date
   *         required: false
   *         description: "Fecha inicial (YYYY-MM-DD)"
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         required: false
   *         description: "Fecha final (YYYY-MM-DD)"
   *     responses:
   *       200:
   *         description: "Reporte de documentos por pagar obtenido correctamente"
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
   *         description: "Parámetros incompletos"
   *       500:
   *         description: "Error interno del servidor"
   */

  async obtenerReporteDocumentosPorPagar(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { conjunto, proveedor, fechaInicio, fechaFin } = req.query;

      console.log("🔍 [Backend] Parámetros recibidos en documentosPorPagar:", {
        conjunto,
        proveedor,
        fechaInicio,
        fechaFin,
      });

      if (!conjunto) {
        console.log("❌ [Backend] Error: conjunto no proporcionado");
        res.status(400).json({
          success: false,
          message: "Parámetros incompletos. Se requieren conjunto",
        });
        return;
      }

      console.log("📡 [Backend] Llamando al servicio con parámetros:", {
        conjunto: conjunto as string,
        proveedor: proveedor as string,
        fechaInicio: fechaInicio as string,
        fechaFin: fechaFin as string,
      });

      const reporte =
        await this.reporteService.obtenerReporteDocumentosPorPagar(
          conjunto as string,
          proveedor as string,
          fechaInicio as string,
          fechaFin as string
        );

      console.log("📊 [Backend] Reporte obtenido del servicio:", {
        cantidad: reporte?.length || 0,
        primerosElementos: reporte?.slice(0, 2) || [],
      });

      res.json({
        success: true,
        data: reporte,
      });
    } catch (error) {
      console.error(
        "❌ [Backend] Error en ReporteDocumentosProveedorController.obtenerReporteDocumentosPorPagar:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Error interno del servidor.",
      });
    }
  }
}
