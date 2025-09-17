import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";
import { ObtenerLibroDiarioAsientosQuery } from "../../application/queries/libro-diario-asientos/ObtenerLibroDiarioAsientosQuery";
import { GenerarLibroDiarioAsientosQuery } from "../../application/queries/libro-diario-asientos/GenerarLibroDiarioAsientosQuery";
import { ObtenerFiltrosLibroDiarioAsientosQuery } from "../../application/queries/libro-diario-asientos/ObtenerFiltrosLibroDiarioAsientosQuery";
import {
  LibroDiarioAsientosFiltros,
  GenerarLibroDiarioAsientosParams,
  ExportarLibroDiarioAsientosExcelParams,
} from "../../domain/entities/LibroDiarioAsientos";
import { ILibroDiarioAsientosService } from "../../domain/services/ILibroDiarioAsientosService";

/**
 * Controlador para Libro Diario Asientos
 * Maneja las peticiones HTTP para el reporte de Libro Diario Asientos
 */
@injectable()
export class LibroDiarioAsientosController {
  constructor(
    @inject("IQueryBus") private readonly queryBus: IQueryBus,
    @inject("ILibroDiarioAsientosService")
    private readonly libroDiarioAsientosService: ILibroDiarioAsientosService
  ) {}

  /**
   * Health check del controlador
   */
  async health(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      message: "Libro Diario Asientos Controller is healthy",
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Obtiene los filtros disponibles para el reporte
   * @swagger
   * /api/libro-diario-asientos/{conjunto}/filtros:
   *   get:
   *     tags:
   *       - Libro Diario Asientos
   *     summary: Obtiene los filtros disponibles
   *     description: Retorna los filtros disponibles para el reporte de Libro Diario Asientos
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
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
   *                   type: object
   *                   properties:
   *                     asientos:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           asiento:
   *                             type: string
   *                             example: "000001"
   *                     tiposAsiento:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           tipoAsiento:
   *                             type: string
   *                             example: "N"
   *                           descripcion:
   *                             type: string
   *                             example: "Normal"
   *                     clasesAsiento:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           clase:
   *                             type: string
   *                             example: "N"
   *                           descripcion:
   *                             type: string
   *                             example: "Normal"
   *                     origenes:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           origen:
   *                             type: string
   *                             example: "01"
   *                           descripcion:
   *                             type: string
   *                             example: "Manual"
   *                     paquetes:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           paquete:
   *                             type: string
   *                             example: "001"
   *                           descripcion:
   *                             type: string
   *                             example: "Paquete Principal"
   *                     contabilidades:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           codigo:
   *                             type: string
   *                             example: "F"
   *                           descripcion:
   *                             type: string
   *                             example: "Fiscal"
   *                     documentosGlobales:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           documento:
   *                             type: string
   *                             example: "DOC001"
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

      const query = new ObtenerFiltrosLibroDiarioAsientosQuery(conjunto);
      const filtros = await this.queryBus.execute(query);

      res.json({
        success: true,
        data: filtros,
        message: "Filtros obtenidos exitosamente",
      });
    } catch (error) {
      console.error("Error obteniendo filtros:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Genera el reporte de Libro Diario Asientos
   * @swagger
   * /api/libro-diario-asientos/{conjunto}/generar:
   *   post:
   *     tags:
   *       - Libro Diario Asientos
   *     summary: Genera el reporte de Libro Diario Asientos
   *     description: Ejecuta el proceso para generar el reporte de Libro Diario Asientos
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
   *       - in: query
   *         name: asientoDesde
   *         schema:
   *           type: string
   *         description: Filtro por asiento desde
   *         example: "000001"
   *       - in: query
   *         name: asientoHasta
   *         schema:
   *           type: string
   *         description: Filtro por asiento hasta
   *         example: "000100"
   *       - in: query
   *         name: tipoAsientoDesde
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento desde
   *         example: "N"
   *       - in: query
   *         name: tipoAsientoHasta
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento hasta
   *         example: "N"
   *       - in: query
   *         name: fechaDesde
   *         schema:
   *           type: string
   *           format: date
   *         description: Filtro por fecha desde
   *         example: "2024-01-01"
   *       - in: query
   *         name: fechaHasta
   *         schema:
   *           type: string
   *           format: date
   *         description: Filtro por fecha hasta
   *         example: "2024-12-31"
   *       - in: query
   *         name: claseAsiento
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Filtro por clase de asiento
   *         example: ["N", "A"]
   *       - in: query
   *         name: origen
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Filtro por origen
   *         example: ["01", "02"]
   *       - in: query
   *         name: paqueteDesde
   *         schema:
   *           type: string
   *         description: Filtro por paquete desde
   *         example: "001"
   *       - in: query
   *         name: paqueteHasta
   *         schema:
   *           type: string
   *         description: Filtro por paquete hasta
   *         example: "999"
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Filtro por contabilidad
   *         example: ["F", "C"]
   *       - in: query
   *         name: documentoGlobalDesde
   *         schema:
   *           type: string
   *         description: Filtro por documento global desde
   *         example: "DOC001"
   *       - in: query
   *         name: documentoGlobalHasta
   *         schema:
   *           type: string
   *         description: Filtro por documento global hasta
   *         example: "DOC999"
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
   *                     $ref: '#/components/schemas/LibroDiarioAsientos'
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

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      const filtros: GenerarLibroDiarioAsientosParams = {
        asientoDesde: req.query['asientoDesde'] as string,
        asientoHasta: req.query['asientoHasta'] as string,
        tipoAsientoDesde: req.query['tipoAsientoDesde'] as string,
        tipoAsientoHasta: req.query['tipoAsientoHasta'] as string,
        fechaDesde: req.query['fechaDesde'] as string,
        fechaHasta: req.query['fechaHasta'] as string,
        claseAsiento: req.query['claseAsiento'] as string[],
        origen: req.query['origen'] as string[],
        paqueteDesde: req.query['paqueteDesde'] as string,
        paqueteHasta: req.query['paqueteHasta'] as string,
        contabilidad: req.query['contabilidad'] as string[],
        documentoGlobalDesde: req.query['documentoGlobalDesde'] as string,
        documentoGlobalHasta: req.query['documentoGlobalHasta'] as string,
      };

      const query = new GenerarLibroDiarioAsientosQuery(conjunto, filtros);
      const response = await this.queryBus.execute(query);

      res.json(response);
    } catch (error) {
      console.error("Error generando reporte:", error);
      res.status(500).json({
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Obtiene los datos paginados del reporte
   * @swagger
   * /api/libro-diario-asientos/{conjunto}/obtener:
   *   get:
   *     tags:
   *       - Libro Diario Asientos
   *     summary: Obtiene los datos paginados del reporte
   *     description: Retorna los datos paginados del reporte de Libro Diario Asientos
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Número de página
   *         example: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 1000
   *           default: 20
   *         description: Número de registros por página
   *         example: 20
   *       - in: query
   *         name: asientoDesde
   *         schema:
   *           type: string
   *         description: Filtro por asiento desde
   *         example: "000001"
   *       - in: query
   *         name: asientoHasta
   *         schema:
   *           type: string
   *         description: Filtro por asiento hasta
   *         example: "000100"
   *       - in: query
   *         name: tipoAsientoDesde
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento desde
   *         example: "N"
   *       - in: query
   *         name: tipoAsientoHasta
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento hasta
   *         example: "N"
   *       - in: query
   *         name: fechaDesde
   *         schema:
   *           type: string
   *           format: date
   *         description: Filtro por fecha desde
   *         example: "2024-01-01"
   *       - in: query
   *         name: fechaHasta
   *         schema:
   *           type: string
   *           format: date
   *         description: Filtro por fecha hasta
   *         example: "2024-12-31"
   *       - in: query
   *         name: claseAsiento
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Filtro por clase de asiento
   *         example: ["N", "A"]
   *       - in: query
   *         name: origen
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Filtro por origen
   *         example: ["01", "02"]
   *       - in: query
   *         name: paqueteDesde
   *         schema:
   *           type: string
   *         description: Filtro por paquete desde
   *         example: "001"
   *       - in: query
   *         name: paqueteHasta
   *         schema:
   *           type: string
   *         description: Filtro por paquete hasta
   *         example: "999"
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Filtro por contabilidad
   *         example: ["F", "C"]
   *       - in: query
   *         name: documentoGlobalDesde
   *         schema:
   *           type: string
   *         description: Filtro por documento global desde
   *         example: "DOC001"
   *       - in: query
   *         name: documentoGlobalHasta
   *         schema:
   *           type: string
   *         description: Filtro por documento global hasta
   *         example: "DOC999"
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
   *                     $ref: '#/components/schemas/LibroDiarioAsientos'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 20
   *                     total:
   *                       type: integer
   *                       example: 150
   *                     totalPages:
   *                       type: integer
   *                       example: 8
   *                     hasNext:
   *                       type: boolean
   *                       example: true
   *                     hasPrev:
   *                       type: boolean
   *                       example: false
   *                 message:
   *                   type: string
   *                   example: "Se encontraron 150 registros"
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerAsientos(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 20;

      const filtros: LibroDiarioAsientosFiltros = {
        conjunto,
        page,
        limit,
        asientoDesde: req.query['asientoDesde'] as string,
        asientoHasta: req.query['asientoHasta'] as string,
        tipoAsientoDesde: req.query['tipoAsientoDesde'] as string,
        tipoAsientoHasta: req.query['tipoAsientoHasta'] as string,
        fechaDesde: req.query['fechaDesde'] as string,
        fechaHasta: req.query['fechaHasta'] as string,
        claseAsiento: req.query['claseAsiento'] as string[],
        origen: req.query['origen'] as string[],
        paqueteDesde: req.query['paqueteDesde'] as string,
        paqueteHasta: req.query['paqueteHasta'] as string,
        contabilidad: req.query['contabilidad'] as string[],
        documentoGlobalDesde: req.query['documentoGlobalDesde'] as string,
        documentoGlobalHasta: req.query['documentoGlobalHasta'] as string,
      };

      const query = new ObtenerLibroDiarioAsientosQuery(conjunto, filtros);
      const response = await this.queryBus.execute(query);

      res.json(response);
    } catch (error) {
      console.error("Error obteniendo asientos:", error);
      res.status(500).json({
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Exporta el reporte a Excel
   * @swagger
   * /api/libro-diario-asientos/{conjunto}/exportar/excel:
   *   get:
   *     tags:
   *       - Libro Diario Asientos
   *     summary: Exporta el reporte a Excel
   *     description: Genera y descarga el reporte de Libro Diario Asientos en formato Excel
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
   *       - in: query
   *         name: asientoDesde
   *         schema:
   *           type: string
   *         description: Filtro por asiento desde
   *         example: "000001"
   *       - in: query
   *         name: asientoHasta
   *         schema:
   *           type: string
   *         description: Filtro por asiento hasta
   *         example: "000100"
   *       - in: query
   *         name: tipoAsientoDesde
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento desde
   *         example: "N"
   *       - in: query
   *         name: tipoAsientoHasta
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento hasta
   *         example: "N"
   *       - in: query
   *         name: fechaDesde
   *         schema:
   *           type: string
   *           format: date
   *         description: Filtro por fecha desde
   *         example: "2024-01-01"
   *       - in: query
   *         name: fechaHasta
   *         schema:
   *           type: string
   *           format: date
   *         description: Filtro por fecha hasta
   *         example: "2024-12-31"
   *       - in: query
   *         name: claseAsiento
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Filtro por clase de asiento
   *         example: ["N", "A"]
   *       - in: query
   *         name: origen
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Filtro por origen
   *         example: ["01", "02"]
   *       - in: query
   *         name: paqueteDesde
   *         schema:
   *           type: string
   *         description: Filtro por paquete desde
   *         example: "001"
   *       - in: query
   *         name: paqueteHasta
   *         schema:
   *           type: string
   *         description: Filtro por paquete hasta
   *         example: "999"
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Filtro por contabilidad
   *         example: ["F", "C"]
   *       - in: query
   *         name: documentoGlobalDesde
   *         schema:
   *           type: string
   *         description: Filtro por documento global desde
   *         example: "DOC001"
   *       - in: query
   *         name: documentoGlobalHasta
   *         schema:
   *           type: string
   *         description: Filtro por documento global hasta
   *         example: "DOC999"
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 10000
   *           default: 1000
   *         description: Límite de registros para exportar
   *         example: 1000
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

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      const filtros: ExportarLibroDiarioAsientosExcelParams = {
        asientoDesde: req.query['asientoDesde'] as string,
        asientoHasta: req.query['asientoHasta'] as string,
        tipoAsientoDesde: req.query['tipoAsientoDesde'] as string,
        tipoAsientoHasta: req.query['tipoAsientoHasta'] as string,
        fechaDesde: req.query['fechaDesde'] as string,
        fechaHasta: req.query['fechaHasta'] as string,
        claseAsiento: req.query['claseAsiento'] as string[],
        origen: req.query['origen'] as string[],
        paqueteDesde: req.query['paqueteDesde'] as string,
        paqueteHasta: req.query['paqueteHasta'] as string,
        contabilidad: req.query['contabilidad'] as string[],
        documentoGlobalDesde: req.query['documentoGlobalDesde'] as string,
        documentoGlobalHasta: req.query['documentoGlobalHasta'] as string,
        limit: parseInt(req.query['limit'] as string) || 1000,
      };

      const buffer = await this.libroDiarioAsientosService.exportarExcel(conjunto, filtros);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="libro-diario-asientos-${conjunto}-${new Date().toISOString().split('T')[0]}.xlsx"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error exportando Excel:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Exporta el reporte a PDF
   * @swagger
   * /api/libro-diario-asientos/{conjunto}/exportar/pdf:
   *   get:
   *     tags:
   *       - Libro Diario Asientos
   *     summary: Exporta el reporte a PDF
   *     description: Genera y descarga el reporte de Libro Diario Asientos en formato PDF
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
   *       - in: query
   *         name: asientoDesde
   *         schema:
   *           type: string
   *         description: Filtro por asiento desde
   *         example: "000001"
   *       - in: query
   *         name: asientoHasta
   *         schema:
   *           type: string
   *         description: Filtro por asiento hasta
   *         example: "000100"
   *       - in: query
   *         name: tipoAsientoDesde
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento desde
   *         example: "N"
   *       - in: query
   *         name: tipoAsientoHasta
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento hasta
   *         example: "N"
   *       - in: query
   *         name: fechaDesde
   *         schema:
   *           type: string
   *           format: date
   *         description: Filtro por fecha desde
   *         example: "2024-01-01"
   *       - in: query
   *         name: fechaHasta
   *         schema:
   *           type: string
   *           format: date
   *         description: Filtro por fecha hasta
   *         example: "2024-12-31"
   *       - in: query
   *         name: claseAsiento
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Filtro por clase de asiento
   *         example: ["N", "A"]
   *       - in: query
   *         name: origen
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Filtro por origen
   *         example: ["01", "02"]
   *       - in: query
   *         name: paqueteDesde
   *         schema:
   *           type: string
   *         description: Filtro por paquete desde
   *         example: "001"
   *       - in: query
   *         name: paqueteHasta
   *         schema:
   *           type: string
   *         description: Filtro por paquete hasta
   *         example: "999"
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Filtro por contabilidad
   *         example: ["F", "C"]
   *       - in: query
   *         name: documentoGlobalDesde
   *         schema:
   *           type: string
   *         description: Filtro por documento global desde
   *         example: "DOC001"
   *       - in: query
   *         name: documentoGlobalHasta
   *         schema:
   *           type: string
   *         description: Filtro por documento global hasta
   *         example: "DOC999"
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 10000
   *           default: 1000
   *         description: Límite de registros para exportar
   *         example: 1000
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

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      const filtros: ExportarLibroDiarioAsientosExcelParams = {
        asientoDesde: req.query['asientoDesde'] as string,
        asientoHasta: req.query['asientoHasta'] as string,
        tipoAsientoDesde: req.query['tipoAsientoDesde'] as string,
        tipoAsientoHasta: req.query['tipoAsientoHasta'] as string,
        fechaDesde: req.query['fechaDesde'] as string,
        fechaHasta: req.query['fechaHasta'] as string,
        claseAsiento: req.query['claseAsiento'] as string[],
        origen: req.query['origen'] as string[],
        paqueteDesde: req.query['paqueteDesde'] as string,
        paqueteHasta: req.query['paqueteHasta'] as string,
        contabilidad: req.query['contabilidad'] as string[],
        documentoGlobalDesde: req.query['documentoGlobalDesde'] as string,
        documentoGlobalHasta: req.query['documentoGlobalHasta'] as string,
        limit: parseInt(req.query['limit'] as string) || 1000,
      };

      const buffer = await this.libroDiarioAsientosService.exportarPDF(conjunto, filtros);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="libro-diario-asientos-${conjunto}-${new Date().toISOString().split('T')[0]}.pdf"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error exportando PDF:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
