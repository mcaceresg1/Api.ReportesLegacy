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
   *     summary: Listar comprobantes del libro diario
   *     tags: [Clipper - Libro Diario]
   *     description: "Retorna todos los comprobantes contables para un libro y mes determinado."
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
   *       200:
   *         description: Lista de comprobantes
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
  async listarComprobantes(req: Request, res: Response): Promise<void> {
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
      console.log("🔍 [CONTROLLER] Iniciando listarComprobantes...");
      const result = await this.clipperLibroDiarioService.listarComprobantes(
        libro,
        mes,
        bdClipperGPC
      );

      console.log("🔍 [CONTROLLER] Resultado del servicio:", {
        type: typeof result,
        isArray: Array.isArray(result),
        length: Array.isArray(result) ? result.length : "N/A",
        hasPagination:
          result && typeof result === "object" && "pagination" in result,
      });

      // Forzar respuesta sin paginación usando write directo
      const responseData = {
        success: true,
        message: "Comprobantes obtenidos exitosamente",
        data: result,
      };

      console.log("🔍 [CONTROLLER] ResponseData antes de enviar:", {
        hasPagination: "pagination" in responseData,
        dataType: typeof responseData.data,
        dataLength: Array.isArray(responseData.data)
          ? responseData.data.length
          : "N/A",
      });

      // Usar res.write + res.end para evitar cualquier middleware que intercepte res.json
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      });
      res.end(JSON.stringify(responseData));
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
   * /api/libro-diario-clipper/{bdClipperGPC}/{libro}/{mes}/comprobantes/clase/{clase}:
   *   get:
   *     summary: Listar comprobantes del libro diario filtrados por clase
   *     tags: [Clipper - Libro Diario]
   *     description: "Retorna los comprobantes contables filtrados por una clase específica."
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
   *       - in: path
   *         name: clase
   *         required: true
   *         schema:
   *           type: string
   *           example: "COMPRAS"
   *     responses:
   *       200:
   *         description: Lista de comprobantes filtrados por clase
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
  async listarComprobantesPorClase(req: Request, res: Response): Promise<void> {
    const { bdClipperGPC, libro, mes, clase } = req.params;

    if (!bdClipperGPC || !libro || !mes || !clase) {
      res.status(400).json({
        success: false,
        message: "Parámetros bdClipperGPC, libro, mes y clase son requeridos",
        data: null,
      });
      return;
    }

    try {
      console.log("🔍 [CONTROLLER] Iniciando listarComprobantesPorClase...");
      const result =
        await this.clipperLibroDiarioService.listarComprobantesPorClase(
          libro,
          mes,
          bdClipperGPC,
          clase
        );

      console.log("🔍 [CONTROLLER] Resultado del servicio por clase:", {
        type: typeof result,
        isArray: Array.isArray(result),
        length: Array.isArray(result) ? result.length : "N/A",
        clase: clase,
      });

      const responseData = {
        success: true,
        message: `Comprobantes de clase "${clase}" obtenidos exitosamente`,
        data: result,
      };

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      });
      res.end(JSON.stringify(responseData));
    } catch (error) {
      console.error("❌ Error en listarComprobantesPorClase:", error);
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
   * /api/libro-diario-clipper/{bdClipperGPC}/{libro}/{mes}/comprobantes-resumen:
   *   get:
   *     summary: Listar comprobantes únicos para resumen
   *     tags: [Clipper - Libro Diario]
   *     description: "Retorna la lista de comprobantes únicos agrupados por número y clase para vista de resumen."
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
   *       200:
   *         description: Lista de comprobantes únicos para resumen
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
   *                     type: object
   *                     properties:
   *                       comprobante:
   *                         type: string
   *                         example: "COMPROBANTE>>D06/00066"
   *                       clase:
   *                         type: string
   *                         example: "CLASE: COMPRAS"
   *       400: { description: Parámetros inválidos }
   *       500: { description: Error interno }
   */
  async listarComprobantesResumen(req: Request, res: Response): Promise<void> {
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
      console.log(
        `🔍 [CONTROLLER] Obteniendo comprobantes de resumen: ${libro}/${mes}/${bdClipperGPC}`
      );

      const comprobantesResumen =
        await this.clipperLibroDiarioService.listarComprobantesResumen(
          libro,
          mes,
          bdClipperGPC
        );

      console.log(
        `✅ [CONTROLLER] Comprobantes de resumen obtenidos: ${comprobantesResumen.length}`
      );

      res.json({
        success: true,
        message: `Comprobantes de resumen obtenidos exitosamente (${comprobantesResumen.length} registros)`,
        data: comprobantesResumen,
      });
    } catch (error) {
      console.error(
        "❌ [CONTROLLER] Error al obtener comprobantes de resumen:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Error interno",
        error: error instanceof Error ? error.message : "Unknown error",
        data: null,
      });
    }
  }
}
