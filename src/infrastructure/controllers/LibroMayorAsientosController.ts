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
   *     description: Recupera los asientos y referencias disponibles para filtrar
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
   *                       referencia:
   *                         type: string
   *                         example: "DOC001"
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
   *         name: referencia
   *         schema:
   *           type: string
   *         description: Filtro por referencia
   *         example: "DOC001"
   *       - in: query
   *         name: fechaInicio
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio
   *         example: "2024-01-01"
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin
   *         example: "2024-12-31"
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: string
   *         description: Tipo de contabilidad
   *         example: "F"
   *       - in: query
   *         name: tipoAsiento
   *         schema:
   *           type: string
   *         description: Tipo de asiento
   *         example: "N"
   *       - in: query
   *         name: origen
   *         schema:
   *           type: string
   *         description: Origen del asiento
   *         example: "01"
   *       - in: query
   *         name: exportado
   *         schema:
   *           type: string
   *         description: Estado de exportación
   *         example: "S"
   *       - in: query
   *         name: mayorizacion
   *         schema:
   *           type: string
   *         description: Estado de mayorización
   *         example: "N"
   *       - in: query
   *         name: documentoGlobal
   *         schema:
   *           type: string
   *         description: Documento global
   *         example: "DOC001"
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
      const {
        asiento,
        referencia,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoAsiento,
        origen,
        exportado,
        mayorizacion,
        documentoGlobal,
      } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      // Preparar filtros
      const filtros: GenerarLibroMayorAsientosParams = {
        conjunto,
        asiento: asiento as string,
        referencia: referencia as string,
        ...(fechaInicio && { fechaInicio: new Date(fechaInicio as string) }),
        ...(fechaFin && { fechaFin: new Date(fechaFin as string) }),
        contabilidad: contabilidad as string,
        tipoAsiento: tipoAsiento as string,
        origen: origen as string,
        exportado: exportado as string,
        mayorizacion: mayorizacion as string,
        documentoGlobal: documentoGlobal as string,
      };

      // Validar fechas si se proporcionan
      if (filtros.fechaInicio && isNaN(filtros.fechaInicio.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (filtros.fechaFin && isNaN(filtros.fechaFin.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de fin debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (filtros.fechaInicio && filtros.fechaFin && filtros.fechaInicio > filtros.fechaFin) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio no puede ser mayor que la fecha de fin",
        });
        return;
      }

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
   *         name: referencia
   *         schema:
   *           type: string
   *         description: Filtro por referencia
   *         example: "DOC001"
   *       - in: query
   *         name: fechaInicio
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio
   *         example: "2024-01-01"
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin
   *         example: "2024-12-31"
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: string
   *         description: Tipo de contabilidad
   *         example: "F"
   *       - in: query
   *         name: tipoAsiento
   *         schema:
   *           type: string
   *         description: Tipo de asiento
   *         example: "N"
   *       - in: query
   *         name: origen
   *         schema:
   *           type: string
   *         description: Origen del asiento
   *         example: "01"
   *       - in: query
   *         name: exportado
   *         schema:
   *           type: string
   *         description: Estado de exportación
   *         example: "S"
   *       - in: query
   *         name: mayorizacion
   *         schema:
   *           type: string
   *         description: Estado de mayorización
   *         example: "N"
   *       - in: query
   *         name: documentoGlobal
   *         schema:
   *           type: string
   *         description: Documento global
   *         example: "DOC001"
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
      const {
        asiento,
        referencia,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoAsiento,
        origen,
        exportado,
        mayorizacion,
        documentoGlobal,
        page,
        limit,
      } = req.query;

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

      // Preparar filtros
      const filtros: LibroMayorAsientosFiltros = {
        conjunto,
        asiento: asiento as string,
        referencia: referencia as string,
        ...(fechaInicio && { fechaInicio: new Date(fechaInicio as string) }),
        ...(fechaFin && { fechaFin: new Date(fechaFin as string) }),
        contabilidad: contabilidad as string,
        tipoAsiento: tipoAsiento as string,
        origen: origen as string,
        exportado: exportado as string,
        mayorizacion: mayorizacion as string,
        documentoGlobal: documentoGlobal as string,
        page: pageNum,
        limit: limitNum,
      };

      // Validar fechas si se proporcionan
      if (filtros.fechaInicio && isNaN(filtros.fechaInicio.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (filtros.fechaFin && isNaN(filtros.fechaFin.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de fin debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (filtros.fechaInicio && filtros.fechaFin && filtros.fechaInicio > filtros.fechaFin) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio no puede ser mayor que la fecha de fin",
        });
        return;
      }

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
   *         name: referencia
   *         schema:
   *           type: string
   *         description: Filtro por referencia
   *         example: "DOC001"
   *       - in: query
   *         name: fechaInicio
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio
   *         example: "2024-01-01"
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin
   *         example: "2024-12-31"
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: string
   *         description: Tipo de contabilidad
   *         example: "F"
   *       - in: query
   *         name: tipoAsiento
   *         schema:
   *           type: string
   *         description: Tipo de asiento
   *         example: "N"
   *       - in: query
   *         name: origen
   *         schema:
   *           type: string
   *         description: Origen del asiento
   *         example: "01"
   *       - in: query
   *         name: exportado
   *         schema:
   *           type: string
   *         description: Estado de exportación
   *         example: "S"
   *       - in: query
   *         name: mayorizacion
   *         schema:
   *           type: string
   *         description: Estado de mayorización
   *         example: "N"
   *       - in: query
   *         name: documentoGlobal
   *         schema:
   *           type: string
   *         description: Documento global
   *         example: "DOC001"
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
      const {
        asiento,
        referencia,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoAsiento,
        origen,
        exportado,
        mayorizacion,
        documentoGlobal,
        limit,
      } = req.query;

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

      // Preparar filtros
      const filtros: ExportarLibroMayorAsientosExcelParams = {
        conjunto,
        asiento: asiento as string,
        referencia: referencia as string,
        ...(fechaInicio && { fechaInicio: new Date(fechaInicio as string) }),
        ...(fechaFin && { fechaFin: new Date(fechaFin as string) }),
        contabilidad: contabilidad as string,
        tipoAsiento: tipoAsiento as string,
        origen: origen as string,
        exportado: exportado as string,
        mayorizacion: mayorizacion as string,
        documentoGlobal: documentoGlobal as string,
        limit: limitNum,
      };

      // Validar fechas si se proporcionan
      if (filtros.fechaInicio && isNaN(filtros.fechaInicio.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (filtros.fechaFin && isNaN(filtros.fechaFin.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de fin debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (filtros.fechaInicio && filtros.fechaFin && filtros.fechaInicio > filtros.fechaFin) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio no puede ser mayor que la fecha de fin",
        });
        return;
      }

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
   *         name: referencia
   *         schema:
   *           type: string
   *         description: Filtro por referencia
   *         example: "DOC001"
   *       - in: query
   *         name: fechaInicio
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio
   *         example: "2024-01-01"
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin
   *         example: "2024-12-31"
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: string
   *         description: Tipo de contabilidad
   *         example: "F"
   *       - in: query
   *         name: tipoAsiento
   *         schema:
   *           type: string
   *         description: Tipo de asiento
   *         example: "N"
   *       - in: query
   *         name: origen
   *         schema:
   *           type: string
   *         description: Origen del asiento
   *         example: "01"
   *       - in: query
   *         name: exportado
   *         schema:
   *           type: string
   *         description: Estado de exportación
   *         example: "S"
   *       - in: query
   *         name: mayorizacion
   *         schema:
   *           type: string
   *         description: Estado de mayorización
   *         example: "N"
   *       - in: query
   *         name: documentoGlobal
   *         schema:
   *           type: string
   *         description: Documento global
   *         example: "DOC001"
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
      const {
        asiento,
        referencia,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoAsiento,
        origen,
        exportado,
        mayorizacion,
        documentoGlobal,
        limit,
      } = req.query;

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

      // Preparar filtros
      const filtros: ExportarLibroMayorAsientosExcelParams = {
        conjunto,
        asiento: asiento as string,
        referencia: referencia as string,
        ...(fechaInicio && { fechaInicio: new Date(fechaInicio as string) }),
        ...(fechaFin && { fechaFin: new Date(fechaFin as string) }),
        contabilidad: contabilidad as string,
        tipoAsiento: tipoAsiento as string,
        origen: origen as string,
        exportado: exportado as string,
        mayorizacion: mayorizacion as string,
        documentoGlobal: documentoGlobal as string,
        limit: limitNum,
      };

      // Validar fechas si se proporcionan
      if (filtros.fechaInicio && isNaN(filtros.fechaInicio.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (filtros.fechaFin && isNaN(filtros.fechaFin.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de fin debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (filtros.fechaInicio && filtros.fechaFin && filtros.fechaInicio > filtros.fechaFin) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio no puede ser mayor que la fecha de fin",
        });
        return;
      }

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





