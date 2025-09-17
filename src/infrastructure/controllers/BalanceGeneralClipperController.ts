import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IBalanceGeneralClipperService } from "../../domain/services/IBalanceGeneralClipperService";
import { ClipperBalanceGeneral } from "../../domain/entities/BalanceGeneralClipper";

/**
 * @swagger
 * tags:
 *   - name: Clipper - Balance General
 *     description: Endpoints del módulo de Balance General desde Clipper
 */
@injectable()
export class BalanceGeneralClipperController {
  constructor(
    @inject("IBalanceGeneralClipperService")
    private readonly balanceGeneralClipperService: IBalanceGeneralClipperService
  ) {}

  /**
   * @swagger
   * /api/balance-general-clipper/{baseDatos}/{nivel}:
   *   get:
   *     summary: Obtener balance general por nivel
   *     tags: [Clipper - Balance General]
   *     description: "Retorna el balance general con saldos acumulados, movimientos del mes y saldos actuales por nivel de cuenta desde la base de datos Clipper seleccionada."
   *     parameters:
   *       - in: path
   *         name: baseDatos
   *         required: true
   *         schema:
   *           type: string
   *           enum: [bdclipperGPC, bdclipperGPC2, bdclipperGPC3, bdclipperGPC4, bdclipperGPC5, bdclipperGPC6, bdclipperGPC7, bdclipperGPC8, bdclipperGPC9]
   *           example: "bdclipperGPC"
   *         description: "Nombre de la base de datos Clipper a utilizar. Opciones disponibles: ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC), PRUEBA (bdclipperGPC2), PARQUE DEL RECUERDO (bdclipperGPC3), MISION CEMENTERIO CATOLICO (bdclipperGPC4), PARQUE DEL RECUERDO (bdclipperGPC5), ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC6), MISION CEMENTERIO CATOLICO (bdclipperGPC7), COPIA DE ACSJB 01 (bdclipperGPC8), COPIA DE ACSJB 02 (bdclipperGPC9)"
   *       - in: path
   *         name: nivel
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 5
   *           example: 3
   *         description: "Nivel de las cuentas contables (1-5)"
   *     responses:
   *       200:
   *         description: Balance general por nivel obtenido exitosamente
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
   *                   example: "Balance general por nivel obtenido exitosamente"
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ClipperBalanceGeneral'
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
   *                   example: "El parámetro 'nivel' debe ser un número entre 1 y 5"
   *                 data:
   *                   type: null
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
   *                   example: "Error al obtener balance general por nivel"
   *                 error:
   *                   type: string
   *                   example: "Error de conexión a la base de datos"
   */
  async obtenerBalanceGeneralPorNivel(
    req: Request,
    res: Response
  ): Promise<void> {
    const { baseDatos, nivel } = req.params;

    if (!baseDatos || typeof baseDatos !== "string") {
      res.status(400).json({
        success: false,
        message: "El parámetro 'baseDatos' es obligatorio",
        data: null,
      });
      return;
    }

    if (!nivel || typeof nivel !== "string") {
      res.status(400).json({
        success: false,
        message: "El parámetro 'nivel' es obligatorio",
        data: null,
      });
      return;
    }

    const nivelNum = parseInt(nivel);
    if (isNaN(nivelNum) || nivelNum < 1 || nivelNum > 5) {
      res.status(400).json({
        success: false,
        message: "El parámetro 'nivel' debe ser un número entre 1 y 5",
        data: null,
      });
      return;
    }

    try {
      const resultado =
        await this.balanceGeneralClipperService.obtenerBalanceGeneralPorNivel(
          baseDatos,
          nivelNum
        );

      res.json({
        success: true,
        message: "Balance general por nivel obtenido exitosamente",
        data: resultado,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(
        "BalanceGeneralClipperController.obtenerBalanceGeneralPorNivel - Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Error al obtener balance general por nivel",
        error: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * @swagger
   * /api/balance-general-clipper/{baseDatos}/{mes}/{nivel}:
   *   get:
   *     summary: Obtener balance general por mes y nivel
   *     tags: [Clipper - Balance General]
   *     description: "Retorna el balance general con saldos acumulados hasta el mes anterior, movimientos del mes especificado y saldos actuales por nivel de cuenta desde la base de datos Clipper seleccionada."
   *     parameters:
   *       - in: path
   *         name: baseDatos
   *         required: true
   *         schema:
   *           type: string
   *           enum: [bdclipperGPC, bdclipperGPC2, bdclipperGPC3, bdclipperGPC4, bdclipperGPC5, bdclipperGPC6, bdclipperGPC7, bdclipperGPC8, bdclipperGPC9]
   *           example: "bdclipperGPC"
   *         description: "Nombre de la base de datos Clipper a utilizar. Opciones disponibles: ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC), PRUEBA (bdclipperGPC2), PARQUE DEL RECUERDO (bdclipperGPC3), MISION CEMENTERIO CATOLICO (bdclipperGPC4), PARQUE DEL RECUERDO (bdclipperGPC5), ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC6), MISION CEMENTERIO CATOLICO (bdclipperGPC7), COPIA DE ACSJB 01 (bdclipperGPC8), COPIA DE ACSJB 02 (bdclipperGPC9)"
   *       - in: path
   *         name: mes
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 12
   *           example: 12
   *         description: "Mes contable a consultar (1-12)"
   *       - in: path
   *         name: nivel
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 5
   *           example: 1
   *         description: "Nivel de las cuentas contables (1-5)"
   *     responses:
   *       200:
   *         description: Balance general por mes y nivel obtenido exitosamente
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
   *                   example: "Balance general por mes y nivel obtenido exitosamente"
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ClipperBalanceGeneral'
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
   *                   example: "El parámetro 'mes' debe ser un número entre 1 y 12"
   *                 data:
   *                   type: null
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
   *                   example: "Error al obtener balance general por mes y nivel"
   *                 error:
   *                   type: string
   *                   example: "Error de conexión a la base de datos"
   */
  async obtenerBalanceGeneralPorMesYNivel(
    req: Request,
    res: Response
  ): Promise<void> {
    const { baseDatos, mes, nivel } = req.params;

    if (!baseDatos || typeof baseDatos !== "string") {
      res.status(400).json({
        success: false,
        message: "El parámetro 'baseDatos' es obligatorio",
        data: null,
      });
      return;
    }

    if (!mes || typeof mes !== "string") {
      res.status(400).json({
        success: false,
        message: "El parámetro 'mes' es obligatorio",
        data: null,
      });
      return;
    }

    if (!nivel || typeof nivel !== "string") {
      res.status(400).json({
        success: false,
        message: "El parámetro 'nivel' es obligatorio",
        data: null,
      });
      return;
    }

    const mesNum = parseInt(mes);
    if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
      res.status(400).json({
        success: false,
        message: "El parámetro 'mes' debe ser un número entre 1 y 12",
        data: null,
      });
      return;
    }

    const nivelNum = parseInt(nivel);
    if (isNaN(nivelNum) || nivelNum < 1 || nivelNum > 5) {
      res.status(400).json({
        success: false,
        message: "El parámetro 'nivel' debe ser un número entre 1 y 5",
        data: null,
      });
      return;
    }

    try {
      const resultado =
        await this.balanceGeneralClipperService.obtenerBalanceGeneralPorMesYNivel(
          baseDatos,
          mesNum,
          nivelNum
        );

      res.json({
        success: true,
        message: "Balance general por mes y nivel obtenido exitosamente",
        data: resultado,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(
        "BalanceGeneralClipperController.obtenerBalanceGeneralPorMesYNivel - Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Error al obtener balance general por mes y nivel",
        error: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * @swagger
   * /api/balance-general-clipper/info:
   *   get:
   *     summary: Información del módulo Balance General Clipper
   *     tags: [Clipper - Balance General]
   *     description: "Retorna información sobre los endpoints disponibles del módulo Balance General Clipper"
   *     responses:
   *       200:
   *         description: Información obtenida exitosamente
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
   *                   example: "Información del módulo Balance General Clipper"
   *                 data:
   *                   type: object
   *                   properties:
   *                     module:
   *                       type: string
   *                       example: "Balance General Clipper"
   *                     description:
   *                       type: string
   *                       example: "Módulo para obtener balances generales desde Clipper GPC"
   *                     endpoints:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           path:
   *                             type: string
   *                           method:
   *                             type: string
   *                           description:
   *                             type: string
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   */
  async obtenerInfo(req: Request, res: Response): Promise<void> {
    const info = {
      module: "Balance General Clipper",
      description: "Módulo para obtener balances generales desde Clipper GPC",
      endpoints: [
        {
          path: "/api/balance-general-clipper/{bdClipperGPC}/{nivel}",
          method: "GET",
          description: "Obtener balance general por nivel",
        },
        {
          path: "/api/balance-general-clipper/{bdClipperGPC}/{mes}/{nivel}",
          method: "GET",
          description: "Obtener balance general por mes y nivel",
        },
        {
          path: "/api/balance-general-clipper/info",
          method: "GET",
          description: "Información del módulo",
        },
      ],
    };

    res.json({
      success: true,
      message: "Información del módulo Balance General Clipper",
      data: info,
      timestamp: new Date().toISOString(),
    });
  }
}
