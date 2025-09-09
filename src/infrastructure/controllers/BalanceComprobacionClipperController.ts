import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IBalanceComprobacionClipperService } from "../../domain/services/IBalanceComprobacionClipperService";
import { ClipperBalanceComprobacion } from "../../domain/entities/BalanceCmprobacionClipper";

/**
 * @swagger
 * tags:
 *   - name: Clipper - Balance de Comprobación
 *     description: Endpoints del módulo de Balance de Comprobación desde Clipper
 */
@injectable()
export class BalanceComprobacionClipperController {
  constructor(
    @inject("IBalanceComprobacionClipperService")
    private readonly balanceComprobacionClipperService: IBalanceComprobacionClipperService
  ) {}

  /**
   * @swagger
   * /api/balance-comprobacion-clipper/{bdClipperGPC}:
   *   get:
   *     summary: Obtener balance de comprobación desde Clipper
   *     tags: [Clipper - Balance de Comprobación]
   *     description: "Retorna el balance de comprobación con saldos acumulados, movimientos del mes y saldos actuales desde la base de datos Clipper GPC."
   *     parameters:
   *       - in: path
   *         name: bdClipperGPC
   *         required: true
   *         schema:
   *           type: string
   *           enum: [bdclipperGPC, bdclipperGPC1]
   *           example: "bdclipperGPC"
   *         description: "Nombre de la base de datos Clipper GPC"
   *     responses:
   *       200:
   *         description: Balance de comprobación obtenido exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Balance de comprobación clipper obtenido exitosamente"
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ClipperBalanceComprobacion'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *       400:
   *         description: Parámetros inválidos
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
   *                   example: "El parámetro 'bdClipperGPC' es obligatorio"
   *                 error:
   *                   type: string
   *                   example: "Parámetro requerido faltante"
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
   *                   example: "Error al obtener balance de comprobación clipper"
   *                 error:
   *                   type: string
   *                   example: "Error de conexión a la base de datos"
   */
  async obtenerBalanceComprobacionClipper(
    req: Request,
    res: Response
  ): Promise<void> {
    const { bdClipperGPC } = req.params;

    if (!bdClipperGPC || typeof bdClipperGPC !== "string") {
      res.status(400).json({
        success: false,
        message: "El parámetro 'bdClipperGPC' es obligatorio",
        data: null,
      });
      return;
    }

    try {
      const resultado =
        await this.balanceComprobacionClipperService.obtenerBalanceComprobacionClipper(
          bdClipperGPC
        );

      res.json({
        success: true,
        message: "Balance de comprobación clipper obtenido exitosamente",
        data: resultado,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(
        "BalanceComprobacionClipperController.obtenerBalanceComprobacionClipper - Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Error al obtener balance de comprobación clipper",
        error: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * @swagger
   * /api/balance-comprobacion-clipper/info:
   *   get:
   *     summary: Obtener información del endpoint
   *     tags: [Clipper - Balance de Comprobación]
   *     description: "Retorna información detallada sobre el endpoint de Balance de Comprobación Clipper, incluyendo parámetros, estructura de datos y métodos disponibles."
   *     responses:
   *       200:
   *         description: Información del endpoint obtenida exitosamente
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
   *                     endpoint:
   *                       type: string
   *                       example: "Balance de Comprobación Clipper"
   *                     description:
   *                       type: string
   *                       example: "Obtiene los datos del balance de comprobación desde la base de datos Clipper"
   *                     version:
   *                       type: string
   *                       example: "1.0.0"
   *                     methods:
   *                       type: object
   *                       properties:
   *                         GET:
   *                           type: object
   *                           properties:
   *                             "/?bdClipperGPC=bdclipperGPC":
   *                               type: string
   *                               example: "Obtiene todos los registros del balance de comprobación clipper"
   *                             "/info":
   *                               type: string
   *                               example: "Obtiene información sobre este endpoint"
   *                     parameters:
   *                       type: object
   *                       properties:
   *                         bdClipperGPC:
   *                           type: string
   *                           example: "string - Nombre de la base de datos Clipper GPC (requerido). Valores disponibles: bdclipperGPC, bdclipperGPC1"
   *                     dataStructure:
   *                       type: object
   *                       properties:
   *                         cuenta:
   *                           type: string
   *                           example: "string - Código de la cuenta contable"
   *                         nombre:
   *                           type: string
   *                           example: "string - Nombre de la cuenta contable"
   *                         saldoAcumuladoDebe:
   *                           type: string
   *                           example: "number - Saldo acumulado en debe (enero a noviembre)"
   *                         saldoAcumuladoHaber:
   *                           type: string
   *                           example: "number - Saldo acumulado en haber (enero a noviembre)"
   *                         movimientoMesDebe:
   *                           type: string
   *                           example: "number - Movimiento del mes en debe (diciembre)"
   *                         movimientoMesHaber:
   *                           type: string
   *                           example: "number - Movimiento del mes en haber (diciembre)"
   *                         saldoActualDebe:
   *                           type: string
   *                           example: "number - Saldo actual en debe (enero a diciembre)"
   *                         saldoActualHaber:
   *                           type: string
   *                           example: "number - Saldo actual en haber (enero a diciembre)"
   *                     timestamp:
   *                       type: string
   *                       format: date-time
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
   *                   example: "Error al obtener información del endpoint"
   *                 error:
   *                   type: string
   *                   example: "Error interno del servidor"
   */
  async obtenerInfo(req: Request, res: Response): Promise<void> {
    try {
      const info = {
        endpoint: "Balance de Comprobación Clipper",
        description:
          "Obtiene los datos del balance de comprobación desde la base de datos Clipper",
        version: "1.0.0",
        methods: {
          GET: {
            "/?bdClipperGPC=bdclipperGPC":
              "Obtiene todos los registros del balance de comprobación clipper",
            "/info": "Obtiene información sobre este endpoint",
          },
        },
        parameters: {
          bdClipperGPC:
            "string - Nombre de la base de datos Clipper GPC (requerido). Valores disponibles: bdclipperGPC, bdclipperGPC1",
        },
        dataStructure: {
          cuenta: "string - Código de la cuenta contable",
          nombre: "string - Nombre de la cuenta contable",
          saldoAcumuladoDebe:
            "number - Saldo acumulado en debe (enero a noviembre)",
          saldoAcumuladoHaber:
            "number - Saldo acumulado en haber (enero a noviembre)",
          movimientoMesDebe: "number - Movimiento del mes en debe (diciembre)",
          movimientoMesHaber:
            "number - Movimiento del mes en haber (diciembre)",
          saldoActualDebe: "number - Saldo actual en debe (enero a diciembre)",
          saldoActualHaber:
            "number - Saldo actual en haber (enero a diciembre)",
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json({
        success: true,
        data: info,
      });
    } catch (error) {
      console.error(
        "Error en BalanceComprobacionClipperController.obtenerInfo:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Error al obtener información del endpoint",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
