import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { ILibroMayorAsientosService } from "../../domain/services/ILibroMayorAsientosService";
import {
  LibroMayorAsientosFiltros,
  LibroMayorAsientosResponse,
  GenerarLibroMayorAsientosParams,
  ExportarLibroMayorAsientosExcelParams,
} from "../../domain/entities/LibroMayorAsientos";

@injectable()
export class LibroMayorAsientosController {
  constructor(
    @inject("ILibroMayorAsientosService")
    private libroMayorAsientosService: ILibroMayorAsientosService
  ) {}

  /**
   * Health check endpoint
   */
  async health(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: "Servicio de Libro Mayor Asientos funcionando correctamente",
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Obtiene los filtros disponibles
   * @swagger
   * /api/libro-mayor-asientos/{conjunto}/filtros:
   *   get:
   *     tags:
   *       - Libro Mayor Asientos
   *     summary: Obtiene los filtros disponibles
   *     description: Recupera los asientos y tipos de asiento disponibles para filtrar
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "001"
   *     responses:
   *       200:
   *         description: Filtros obtenidos exitosamente
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
   *                       asiento:
   *                         type: string
   *                         example: "000001"
   *                       tipoAsiento:
   *                         type: string
   *                         example: "N"
   *                 message:
   *                   type: string
   *                   example: "Filtros obtenidos exitosamente"
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerFiltros(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      const filtros = await this.libroMayorAsientosService.obtenerFiltros(conjunto);

      res.status(200).json({
        success: true,
        data: filtros,
        message: "Filtros obtenidos exitosamente",
      });
    } catch (error) {
      console.error("Error en obtenerFiltros:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener filtros",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Genera el reporte de Libro Mayor Asientos
   * @swagger
   * /api/libro-mayor-asientos/{conjunto}/generar:
   *   get:
   *     tags:
   *       - Libro Mayor Asientos
   *     summary: Genera el reporte de Libro Mayor Asientos
   *     description: Ejecuta el proceso para generar el reporte de Libro Mayor Asientos
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "001"
   *       - in: query
   *         name: asiento
   *         schema:
   *           type: string
   *         description: Filtro por asiento
   *         example: "000001"
   *       - in: query
   *         name: tipoAsiento
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento
   *         example: "N"
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
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
   *                     $ref: '#/components/schemas/LibroMayorAsientos'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 1000
   *                     total:
   *                       type: integer
   *                       example: 150
   *                     totalPages:
   *                       type: integer
   *                       example: 1
   *                     hasNext:
   *                       type: boolean
   *                       example: false
   *                     hasPrev:
   *                       type: boolean
   *                       example: false
   *                 message:
   *                   type: string
   *                   example: "Reporte generado exitosamente"
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { asiento, tipoAsiento } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      // Preparar filtros simplificados
      const filtros: GenerarLibroMayorAsientosParams = {
        conjunto,
        asiento: asiento as string,
        tipoAsiento: tipoAsiento as string,
      };

      const resultado = await this.libroMayorAsientosService.generarReporte(conjunto, filtros);

      res.status(200).json(resultado);
    } catch (error) {
      console.error("Error en generarReporte:", error);
      res.status(500).json({
        success: false,
        message: "Error al generar el reporte",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Obtiene los datos paginados del reporte
   * @swagger
   * /api/libro-mayor-asientos/{conjunto}/obtener:
   *   get:
   *     tags:
   *       - Libro Mayor Asientos
   *     summary: Obtiene los datos del Libro Mayor Asientos
   *     description: Recupera los datos del reporte con filtros opcionales y paginación
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "001"
   *       - in: query
   *         name: asiento
   *         schema:
   *           type: string
   *         description: Filtro por asiento
   *         example: "000001"
   *       - in: query
   *         name: tipoAsiento
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento
   *         example: "N"
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Número de página
   *         example: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 1000
   *         description: Registros por página
   *         example: 25
   *     responses:
   *       200:
   *         description: Datos obtenidos exitosamente
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
   *                     $ref: '#/components/schemas/LibroMayorAsientos'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 25
   *                     total:
   *                       type: integer
   *                       example: 150
   *                     totalPages:
   *                       type: integer
   *                       example: 6
   *                     hasNext:
   *                       type: boolean
   *                       example: true
   *                     hasPrev:
   *                       type: boolean
   *                       example: false
   *                 message:
   *                   type: string
   *                   example: "Datos obtenidos exitosamente"
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerAsientos(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { asiento, tipoAsiento, page, limit } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      // Validar y convertir paginación
      const pageNum = page ? parseInt(page as string, 10) : 1;
      const limitNum = limit ? parseInt(limit as string, 10) : 25;

      if (pageNum < 1 || limitNum < 1 || limitNum > 1000) {
        res.status(400).json({
          success: false,
          message: "La página debe ser >= 1 y el límite debe estar entre 1 y 1000",
        });
        return;
      }

      // Preparar filtros simplificados
      const filtros: LibroMayorAsientosFiltros = {
        conjunto,
        asiento: asiento as string,
        tipoAsiento: tipoAsiento as string,
        page: pageNum,
        limit: limitNum,
      };

      const resultado = await this.libroMayorAsientosService.obtenerAsientos(conjunto, filtros);

      res.status(200).json(resultado);
    } catch (error) {
      console.error("Error en obtenerAsientos:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener asientos",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Exporta el reporte a Excel
   * @swagger
   * /api/libro-mayor-asientos/{conjunto}/excel:
   *   get:
   *     tags:
   *       - Libro Mayor Asientos
   *     summary: Exporta el Libro Mayor Asientos a Excel
   *     description: Genera y descarga un archivo Excel con los datos del Libro Mayor Asientos
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "001"
   *       - in: query
   *         name: asiento
   *         schema:
   *           type: string
   *         description: Filtro por asiento
   *         example: "000001"
   *       - in: query
   *         name: tipoAsiento
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento
   *         example: "N"
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 50000
   *         description: Límite de registros a exportar
   *         example: 10000
   *     responses:
   *       200:
   *         description: Archivo Excel generado exitosamente
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { asiento, tipoAsiento, limit } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      // Validar límite
      const limitNum = limit ? parseInt(limit as string, 10) : 10000;
      if (limitNum < 1 || limitNum > 50000) {
        res.status(400).json({
          success: false,
          message: "El límite debe estar entre 1 y 50000",
        });
        return;
      }

      // Preparar filtros simplificados
      const filtros: ExportarLibroMayorAsientosExcelParams = {
        conjunto,
        asiento: asiento as string,
        tipoAsiento: tipoAsiento as string,
        limit: limitNum,
      };

      const excelBuffer = await this.libroMayorAsientosService.exportarExcel(conjunto, filtros);

      // Configurar headers para descarga
      const fileName = `libro-mayor-asientos-${conjunto}-${new Date().toISOString().split('T')[0]}.xlsx`;
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Length", excelBuffer.length);

      // Enviar archivo
      res.send(excelBuffer);
    } catch (error) {
      console.error("Error en exportarExcel:", error);
      res.status(500).json({
        success: false,
        message: "Error al exportar Libro Mayor Asientos a Excel",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Exporta el reporte a PDF
   * @swagger
   * /api/libro-mayor-asientos/{conjunto}/pdf:
   *   get:
   *     tags:
   *       - Libro Mayor Asientos
   *     summary: Exporta el Libro Mayor Asientos a PDF
   *     description: Genera y descarga un archivo PDF con los datos del Libro Mayor Asientos
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "001"
   *       - in: query
   *         name: asiento
   *         schema:
   *           type: string
   *         description: Filtro por asiento
   *         example: "000001"
   *       - in: query
   *         name: tipoAsiento
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento
   *         example: "N"
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 50000
   *         description: Límite de registros a exportar
   *         example: 10000
   *     responses:
   *       200:
   *         description: Archivo PDF generado exitosamente
   *         content:
   *           application/pdf:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async exportarPDF(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { asiento, tipoAsiento, limit } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      // Validar límite
      const limitNum = limit ? parseInt(limit as string, 10) : 10000;
      if (limitNum < 1 || limitNum > 50000) {
        res.status(400).json({
          success: false,
          message: "El límite debe estar entre 1 y 50000",
        });
        return;
      }

      // Preparar filtros simplificados
      const filtros: ExportarLibroMayorAsientosExcelParams = {
        conjunto,
        asiento: asiento as string,
        tipoAsiento: tipoAsiento as string,
        limit: limitNum,
      };

      const pdfBuffer = await this.libroMayorAsientosService.exportarPDF(conjunto, filtros);

      // Configurar headers para descarga
      const fileName = `libro-mayor-asientos-${conjunto}-${new Date().toISOString().split('T')[0]}.pdf`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      // Enviar archivo
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error en exportarPDF:", error);
      res.status(500).json({
        success: false,
        message: "Error al exportar Libro Mayor Asientos a PDF",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}






