import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IClipperLibroDiarioService } from "../../domain/services/IClipperLibroDiarioService";
import { StreamingService } from "../../application/services/StreamingService";

/**
 * @swagger
 * tags:
 *   - name: Clipper - Libro Diario
 *     description: Endpoints del módulo de Libro Diario Contable
 */
@injectable()
export class ClipperLibroDiarioController {
  constructor(
    @inject("IClipperLibroDiarioService")
    private readonly clipperLibroDiarioService: IClipperLibroDiarioService
  ) {}

  /**
   * @swagger
   * /api/libro-diario-clipper/{bdClipperGPC}/{libro}/{mes}/comprobantes:
   *   get:
   *     summary: Listar comprobantes del libro diario (con paginación)
   *     tags: [Clipper - Libro Diario]
   *     description: "Retorna los comprobantes contables para un libro y mes determinado con paginación para optimizar el rendimiento."
   *     parameters:
   *       - in: path
   *         name: bdClipperGPC
   *         required: true
   *         schema:
   *           type: string
   *           example: "bdclipperGPC"
   *       - in: path
   *         name: libro
   *         required: true
   *         schema:
   *           type: string
   *           example: "D"
   *       - in: path
   *         name: mes
   *         required: true
   *         schema:
   *           type: string
   *           example: "08"
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *           example: 1
   *       - in: query
   *         name: limit
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 1000
   *           default: 50
   *           example: 50
   *     responses:
   *       200:
   *         description: Lista de comprobantes con información de paginación
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ClipperLibroDiario'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     total:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   *                     hasNext:
   *                       type: boolean
   *                     hasPrev:
   *                       type: boolean
   *       400: { description: Parámetros inválidos }
   *       500: { description: Error interno }
   */
  async listarComprobantes(req: Request, res: Response): Promise<void> {
    const { bdClipperGPC, libro, mes } = req.params;
    const page = parseInt(req.query["page"] as string) || 1;
    const limit = parseInt(req.query["limit"] as string) || 50;

    if (!bdClipperGPC || !libro || !mes) {
      res.status(400).json({
        success: false,
        message: "Parámetros bdClipperGPC, libro y mes son requeridos",
        data: null,
      });
      return;
    }

    // Validar límites de paginación
    if (limit > 1000) {
      res.status(400).json({
        success: false,
        message: "El límite máximo por página es 1000",
        data: null,
      });
      return;
    }

    try {
      const pagination = { page, limit };
      const result = await this.clipperLibroDiarioService.listarComprobantes(
        libro,
        mes,
        bdClipperGPC,
        pagination
      );

      res.json({
        success: true,
        message: "Comprobantes obtenidos exitosamente",
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNext: result.hasNext,
          hasPrev: result.hasPrev,
        },
      });
    } catch (error) {
      console.error("❌ Error en listarComprobantes:", error);
      res.status(500).json({
        success: false,
        message: "Error interno",
        error: error instanceof Error ? error.message : "Error desconocido",
        data: null,
      });
    }
  }

  /**
   * @swagger
   * /api/libro-diario-clipper/{bdClipperGPC}/{libro}/{mes}/comprobantes-agrupados:
   *   get:
   *     summary: Listar comprobantes agrupados por número
   *     tags: [Clipper - Libro Diario]
   *     description: "Retorna los comprobantes agrupados por número, con totales de debe y haber."
   *     parameters:
   *       - in: path
   *         name: bdClipperGPC
   *         required: true
   *         schema:
   *           type: string
   *           example: "bdclipperGPC"
   *       - in: path
   *         name: libro
   *         required: true
   *         schema:
   *           type: string
   *           example: "D"
   *       - in: path
   *         name: mes
   *         required: true
   *         schema:
   *           type: string
   *           example: "08"
   *     responses:
   *       200: { description: Lista de comprobantes agrupados }
   *       400: { description: Parámetros inválidos }
   *       500: { description: Error interno }
   */
  async listarComprobantesAgrupados(
    req: Request,
    res: Response
  ): Promise<void> {
    const { bdClipperGPC, libro, mes } = req.params;
    const page = parseInt(req.query["page"] as string) || 1;
    const limit = parseInt(req.query["limit"] as string) || 50;

    if (!bdClipperGPC || !libro || !mes) {
      res.status(400).json({
        success: false,
        message: "Parámetros bdClipperGPC, libro y mes son requeridos",
        data: null,
      });
      return;
    }

    // Validar límites de paginación
    if (limit > 1000) {
      res.status(400).json({
        success: false,
        message: "El límite máximo por página es 1000",
        data: null,
      });
      return;
    }

    try {
      const pagination = { page, limit };
      const result =
        await this.clipperLibroDiarioService.listarComprobantesAgrupados(
          libro,
          mes,
          bdClipperGPC,
          pagination
        );

      res.json({
        success: true,
        message: "Comprobantes agrupados obtenidos exitosamente",
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNext: result.hasNext,
          hasPrev: result.hasPrev,
        },
      });
    } catch (error) {
      console.error("❌ Error en listarComprobantesAgrupados:", error);
      res.status(500).json({
        success: false,
        message: "Error interno",
        error: error instanceof Error ? error.message : "Error desconocido",
        data: null,
      });
    }
  }

  /**
   * @swagger
   * /api/libro-diario-clipper/{bdClipperGPC}/{libro}/{mes}/totales:
   *   get:
   *     summary: Obtener totales generales del libro diario
   *     tags: [Clipper - Libro Diario]
   *     description: "Retorna el total del debe y haber del libro diario."
   *     parameters:
   *       - in: path
   *         name: bdClipperGPC
   *         required: true
   *         schema:
   *           type: string
   *           example: "bdclipperGPC"
   *       - in: path
   *         name: libro
   *         required: true
   *         schema:
   *           type: string
   *           example: "D"
   *       - in: path
   *         name: mes
   *         required: true
   *         schema:
   *           type: string
   *           example: "08"
   *     responses:
   *       200: { description: Totales obtenidos exitosamente }
   *       400: { description: Parámetros inválidos }
   *       500: { description: Error interno }
   */
  async obtenerTotalesGenerales(req: Request, res: Response): Promise<void> {
    const { bdClipperGPC, libro, mes } = req.params;

    if (!bdClipperGPC || !libro || !mes) {
      res.status(400).json({
        success: false,
        message: "Parámetros bdClipperGPC, libro y mes son requeridos",
        data: null,
      });
      return;
    }

    try {
      const totales =
        await this.clipperLibroDiarioService.obtenerTotalesGenerales(
          libro,
          mes,
          bdClipperGPC
        );
      res.json({
        success: true,
        message: "Totales generales obtenidos",
        data: totales,
      });
    } catch (error) {
      console.error("❌ Error en obtenerTotalesGenerales:", error);
      res.status(500).json({
        success: false,
        message: "Error interno",
        error: error instanceof Error ? error.message : "Error desconocido",
        data: null,
      });
    }
  }

  /**
   * @swagger
   * /api/libro-diario-clipper/{bdClipperGPC}/comprobante/{numeroComprobante}:
   *   get:
   *     summary: Obtener detalle de un comprobante
   *     tags: [Clipper - Libro Diario]
   *     description: "Devuelve el detalle de un comprobante contable específico (por ejemplo: 'D00/00001')."
   *     parameters:
   *       - in: path
   *         name: bdClipperGPC
   *         required: true
   *         schema:
   *           type: string
   *           example: "bdclipperGPC"
   *       - in: path
   *         name: numeroComprobante
   *         required: true
   *         schema:
   *           type: string
   *           example: "D00/00001"
   *     responses:
   *       200: { description: Detalle del comprobante obtenido exitosamente }
   *       400: { description: Parámetro inválido }
   *       404: { description: Comprobante no encontrado }
   *       500: { description: Error interno }
   */
  async obtenerDetalleComprobante(req: Request, res: Response): Promise<void> {
    const { bdClipperGPC, numeroComprobante } = req.params;

    if (!bdClipperGPC || !numeroComprobante) {
      res.status(400).json({
        success: false,
        message:
          "Parámetros bdClipperGPC y número de comprobante son requeridos",
        data: null,
      });
      return;
    }

    try {
      const detalle =
        await this.clipperLibroDiarioService.obtenerDetalleComprobante(
          numeroComprobante,
          bdClipperGPC
        );
      if (!detalle || detalle.length === 0) {
        res.status(404).json({
          success: false,
          message: "Comprobante no encontrado",
          data: null,
        });
        return;
      }
      res.json({
        success: true,
        message: "Detalle comprobante obtenido",
        data: detalle,
      });
    } catch (error) {
      console.error("❌ Error en obtenerDetalleComprobante:", error);
      res.status(500).json({
        success: false,
        message: "Error interno",
        error: error instanceof Error ? error.message : "Error desconocido",
        data: null,
      });
    }
  }

  /**
   * @swagger
   * /api/libro-diario-clipper/{bdClipperGPC}/{libro}/{mes}/comprobantes-stream:
   *   get:
   *     summary: Listar comprobantes del libro diario con streaming
   *     tags: [Clipper - Libro Diario]
   *     description: "Retorna los comprobantes contables usando streaming para manejar grandes volúmenes de datos."
   *     parameters:
   *       - in: path
   *         name: bdClipperGPC
   *         required: true
   *         schema:
   *           type: string
   *           example: "bdclipperGPC"
   *       - in: path
   *         name: libro
   *         required: true
   *         schema:
   *           type: string
   *           example: "D"
   *       - in: path
   *         name: mes
   *         required: true
   *         schema:
   *           type: string
   *           example: "08"
   *       - in: query
   *         name: chunkSize
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 10
   *           maximum: 1000
   *           default: 100
   *           example: 100
   *       - in: query
   *         name: delay
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 0
   *           maximum: 1000
   *           default: 0
   *           example: 0
   *     responses:
   *       200:
   *         description: Stream de comprobantes
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ClipperLibroDiario'
   *       400: { description: Parámetros inválidos }
   *       500: { description: Error interno }
   */
  async listarComprobantesStream(req: Request, res: Response): Promise<void> {
    const { bdClipperGPC, libro, mes } = req.params;
    const chunkSize = parseInt(req.query["chunkSize"] as string) || 100;
    const delay = parseInt(req.query["delay"] as string) || 0;

    if (!bdClipperGPC || !libro || !mes) {
      res.status(400).json({
        success: false,
        message: "Parámetros bdClipperGPC, libro y mes son requeridos",
        data: null,
      });
      return;
    }

    // Validar parámetros de streaming
    if (chunkSize < 10 || chunkSize > 1000) {
      res.status(400).json({
        success: false,
        message: "El tamaño de chunk debe estar entre 10 y 1000",
        data: null,
      });
      return;
    }

    if (delay < 0 || delay > 1000) {
      res.status(400).json({
        success: false,
        message: "El delay debe estar entre 0 y 1000ms",
        data: null,
      });
      return;
    }

    try {
      console.log(
        `🔄 Iniciando streaming de comprobantes: ${libro}/${mes}/${bdClipperGPC}`
      );

      // Obtener todos los datos (sin paginación para streaming)
      const result = await this.clipperLibroDiarioService.listarComprobantes(
        libro,
        mes,
        bdClipperGPC,
        { page: 1, limit: 10000 }
      );

      // Usar streaming para enviar los datos
      StreamingService.streamJsonArray(result.data, res, {
        chunkSize,
        delay,
        onProgress: (progress) => {
          console.log(
            `📊 Progreso streaming: ${progress.percentage}% (${progress.processed}/${progress.total})`
          );
        },
        onError: (error) => {
          console.error("❌ Error en streaming:", error);
        },
        onComplete: () => {
          console.log("✅ Streaming completado exitosamente");
        },
      });
    } catch (error) {
      console.error("❌ Error en listarComprobantesStream:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error interno",
          error: error instanceof Error ? error.message : "Error desconocido",
          data: null,
        });
      }
    }
  }
}
