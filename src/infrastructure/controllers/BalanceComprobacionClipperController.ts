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
   * /api/balance-comprobacion-clipper/{baseDatos}:
   *   get:
   *     summary: Obtener balance de comprobación desde Clipper
   *     tags: [Clipper - Balance de Comprobación]
   *     description: "Retorna el balance de comprobación con saldos acumulados, movimientos del mes y saldos actuales desde la base de datos Clipper seleccionada."
   *     parameters:
   *       - in: path
   *         name: baseDatos
   *         required: true
   *         schema:
   *           type: string
   *           enum: [bdclipperGPC, bdclipperGPC2, bdclipperGPC3, bdclipperGPC4, bdclipperGPC5, bdclipperGPC6, bdclipperGPC7, bdclipperGPC8, bdclipperGPC9]
   *           example: "bdclipperGPC"
   *         description: "Nombre de la base de datos Clipper a utilizar. Opciones disponibles: ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC), PRUEBA (bdclipperGPC2), PARQUE DEL RECUERDO (bdclipperGPC3), MISION CEMENTERIO CATOLICO (bdclipperGPC4), PARQUE DEL RECUERDO (bdclipperGPC5), ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC6), MISION CEMENTERIO CATOLICO (bdclipperGPC7), COPIA DE ACSJB 01 (bdclipperGPC8), COPIA DE ACSJB 02 (bdclipperGPC9)"
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
    const { baseDatos } = req.params;

    if (!baseDatos || typeof baseDatos !== "string") {
      res.status(400).json({
        success: false,
        message: "El parámetro 'baseDatos' es obligatorio",
        data: null,
      });
      return;
    }

    try {
      const resultado =
        await this.balanceComprobacionClipperService.obtenerBalanceComprobacionClipper(
          baseDatos
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
}
