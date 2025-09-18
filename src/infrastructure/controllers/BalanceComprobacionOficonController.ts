import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IBalanceComprobacionOficonService } from "../../domain/services/IBalanceComprobacionOficonService";
import { ICommandBus } from "../../domain/cqrs/ICommandBus";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";
import { GetBalanceComprobacionOficonQuery } from "../../application/queries/balance-comprobacion-oficon/GetBalanceComprobacionOficonQuery";
import {
  BalanceComprobacionOficon,
  BalanceComprobacionOficonRequest,
  BalanceComprobacionOficonResponse,
} from "../../domain/entities/BalanceComprobacionOficon";
import { TYPES } from "../container/types";

/**
 * @swagger
 * components:
 *   schemas:
 *     BalanceComprobacionOficonRequest:
 *       type: object
 *       required:
 *         - ISCO_EMPR
 *         - INNU_ANNO
 *         - INNU_MESE
 *       properties:
 *         ISCO_EMPR:
 *           type: string
 *           description: "Código de empresa (REQUERIDO)"
 *           example: "01"
 *         INNU_ANNO:
 *           type: integer
 *           description: "Año (REQUERIDO)"
 *           example: 1998
 *         INNU_MESE:
 *           type: integer
 *           description: "Mes (REQUERIDO)"
 *           example: 10
 *         ISTI_BALA:
 *           type: string
 *           description: "Tipo balance (OPCIONAL) - M: mensual, A: acumulado"
 *           enum: [M, A]
 *           example: "M"
 *         ISST_QUIE:
 *           type: string
 *           description: "Selección quiebre (OPCIONAL) - N: sin quiebre, S: con quiebre"
 *           enum: [N, S]
 *           example: "N"
 *         INNV_PRES:
 *           type: integer
 *           description: "Presentación (OPCIONAL)"
 *           example: 1
 *         ISCO_CNTA_INIC:
 *           type: string
 *           description: "Cuenta inicial (OPCIONAL)"
 *           example: ""
 *         ISCO_CNTA_FINA:
 *           type: string
 *           description: "Cuenta final (OPCIONAL)"
 *           example: ""
 *         INNU_DGTO:
 *           type: integer
 *           description: "Balance dígito (OPCIONAL)"
 *           example: 2
 *         ISTI_PRES:
 *           type: string
 *           description: "Tipo presentación (OPCIONAL) - REP: reporte, TAB: tabla"
 *           enum: [REP, TAB]
 *           example: "REP"
 *         ISTI_MONT:
 *           type: string
 *           description: "Filtro de filas (OPCIONAL) - M: con Monto, T: Todas las Filas"
 *           enum: [M, T]
 *           example: "M"
 *
 *     BalanceComprobacionOficonResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BalanceComprobacionOficon'
 *         totalRecords:
 *           type: integer
 *           example: 150
 *         tipoBalance:
 *           type: string
 *           enum: [MENSUAL, ACUMULADO]
 *           example: "MENSUAL"
 *         tipoQuiebre:
 *           type: string
 *           enum: [SIN_QUIEBRE, CON_QUIEBRE]
 *           example: "SIN_QUIEBRE"
 *         tipoPresentacion:
 *           type: string
 *           enum: [REPORTE, TABLA]
 *           example: "REPORTE"
 *         tipoMonto:
 *           type: string
 *           enum: [CON_MONTO, TODAS_FILAS]
 *           example: "CON_MONTO"
 *         message:
 *           type: string
 *           example: "Reporte de balance comprobación OFICON generado exitosamente. Total de registros: 150"
 *
 *     BalanceComprobacionOficon:
 *       type: object
 *       properties:
 *         CO_CNTA_EMPR:
 *           type: string
 *           description: "Código cuenta empresa"
 *         DE_CNTA_EMPR:
 *           type: string
 *           description: "Descripción cuenta empresa"
 *         IM_SALD_ANTE:
 *           type: number
 *           format: "double"
 *           description: "Saldo anterior"
 *         IM_CARG_MESE:
 *           type: number
 *           format: "double"
 *           description: "Cargo mes"
 *         IM_ABON_MESE:
 *           type: number
 *           format: "double"
 *           description: "Abono mes"
 *         IM_SALD_CARG:
 *           type: number
 *           format: "double"
 *           description: "Saldo cargo"
 *         IM_SALD_ABON:
 *           type: number
 *           format: "double"
 *           description: "Saldo abono"
 *         IM_ACTI_INVE:
 *           type: number
 *           format: "double"
 *           description: "Activo inventario"
 *         IM_PASI_INVE:
 *           type: number
 *           format: "double"
 *           description: "Pasivo inventario"
 *         IM_PERD_NATU:
 *           type: number
 *           format: "double"
 *           description: "Pérdida natural"
 *         IM_GANA_NATU:
 *           type: number
 *           format: "double"
 *           description: "Ganancia natural"
 *         IM_PERD_FUNC:
 *           type: number
 *           format: "double"
 *           description: "Pérdida funcional"
 *         IM_GANA_FUNC:
 *           type: number
 *           format: "double"
 *           description: "Ganancia funcional"
 *         COL_EXTRA_1:
 *           type: number
 *           format: "double"
 *           description: "Columna extra 1 (solo cuando ISTI_PRES = 'REP')"
 *         COL_EXTRA_2:
 *           type: number
 *           format: "double"
 *           description: "Columna extra 2 (solo cuando ISTI_PRES = 'REP')"
 *         COL_EXTRA_3:
 *           type: number
 *           format: "double"
 *           description: "Columna extra 3 (solo cuando ISTI_PRES = 'REP')"
 *         COL_EXTRA_4:
 *           type: number
 *           format: "double"
 *           description: "Columna extra 4 (solo cuando ISTI_PRES = 'REP')"
 *         COL_EXTRA_5:
 *           type: number
 *           format: "double"
 *           description: "Columna extra 5 (solo cuando ISTI_PRES = 'REP')"
 *         COL_EXTRA_6:
 *           type: number
 *           format: "double"
 *           description: "Columna extra 6 (solo cuando ISTI_PRES = 'REP')"
 *         COL_EXTRA_7:
 *           type: number
 *           format: "double"
 *           description: "Columna extra 7 (solo cuando ISTI_PRES = 'REP')"
 *         COL_EXTRA_8:
 *           type: number
 *           format: "double"
 *           description: "Columna extra 8 (solo cuando ISTI_PRES = 'REP')"
 *         COL_EXTRA_9:
 *           type: number
 *           format: "double"
 *           description: "Columna extra 9 (solo cuando ISTI_PRES = 'REP')"
 *         COL_EXTRA_10:
 *           type: number
 *           format: "double"
 *           description: "Columna extra 10 (solo cuando ISTI_PRES = 'REP')"
 *         COL_EXTRA_11:
 *           type: number
 *           format: "double"
 *           description: "Columna extra 11 (solo cuando ISTI_PRES = 'REP')"
 *         COL_EXTRA_12:
 *           type: number
 *           format: "double"
 *           description: "Columna extra 12 (solo cuando ISTI_PRES = 'REP')"
 *         COL_EXTRA_13:
 *           type: number
 *           format: "double"
 *           description: "Columna extra 13 (solo cuando ISTI_PRES = 'REP')"
 */

@injectable()
export class BalanceComprobacionOficonController {
  constructor(
    @inject(TYPES.IBalanceComprobacionOficonService)
    private readonly balanceComprobacionOficonService: IBalanceComprobacionOficonService,
    @inject(TYPES.ICommandBus)
    private readonly commandBus: ICommandBus,
    @inject(TYPES.IQueryBus)
    private readonly queryBus: IQueryBus
  ) {}

  /**
   * @swagger
   * /api/balance-comprobacion-oficon/generar-reporte:
   *   get:
   *     summary: Generar reporte de Balance Comprobación OFICON (Query Bus)
   *     description: Genera un reporte de balance comprobación OFICON utilizando el stored procedure SP_TASALD_EMPR_Q01
   *     tags: [Balance Comprobación OFICON]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: ISCO_EMPR
   *         required: true
   *         schema:
   *           type: string
   *         description: Código de empresa
   *         example: "01"
   *       - in: query
   *         name: INNU_ANNO
   *         required: true
   *         schema:
   *           type: integer
   *         description: Año
   *         example: 1998
   *       - in: query
   *         name: INNU_MESE
   *         required: true
   *         schema:
   *           type: integer
   *         description: Mes
   *         example: 10
   *       - in: query
   *         name: ISTI_BALA
   *         required: false
   *         schema:
   *           type: string
   *           enum: [M, A]
   *         description: |
   *           Tipo balance (OPCIONAL) - Parámetro de dos tipos:
   *           1. M - Mensual
   *           2. A - Acumulado
   *         example: "M"
   *       - in: query
   *         name: ISST_QUIE
   *         required: false
   *         schema:
   *           type: string
   *           enum: [N, S]
   *         description: |
   *           Selección quiebre (OPCIONAL) - Parámetro de dos tipos:
   *           1. N - Sin quiebre
   *           2. S - Con quiebre
   *         example: "N"
   *       - in: query
   *         name: INNV_PRES
   *         required: false
   *         schema:
   *           type: integer
   *         description: Presentación
   *         example: 1
   *       - in: query
   *         name: INNU_DGTO
   *         required: false
   *         schema:
   *           type: integer
   *         description: Balance dígito
   *         example: 2
   *       - in: query
   *         name: ISTI_PRES
   *         required: false
   *         schema:
   *           type: string
   *           enum: [REP, TAB]
   *         description: |
   *           Tipo presentación (OPCIONAL) - Parámetro de dos tipos:
   *           1. REP - Reporte
   *           2. TAB - Tabla
   *         example: "REP"
   *       - in: query
   *         name: ISTI_MONT
   *         required: false
   *         schema:
   *           type: string
   *           enum: [M, T]
   *         description: |
   *           Filtro de filas (OPCIONAL) - Parámetro de dos tipos:
   *           1. M - Con Monto
   *           2. T - Todas las Filas
   *         example: "M"
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BalanceComprobacionOficonResponse'
   *       400:
   *         description: Error de validación - Parámetros requeridos faltantes o inválidos
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
   *                   example: "Faltan parámetros requeridos"
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
   *                   example: "Error interno del servidor"
   *                 error:
   *                   type: string
   *                   example: "Error al ejecutar stored procedure"
   */
  async generarReporteBalanceComprobacionOficon(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      console.log(
        "🔍 BalanceComprobacionOficonController - Iniciando generación de reporte"
      );
      console.log("📋 Parámetros recibidos:", req.query);

      // Validar parámetros requeridos
      const { ISCO_EMPR, INNU_ANNO, INNU_MESE } = req.query;

      if (!ISCO_EMPR || !INNU_ANNO || !INNU_MESE) {
        res.status(400).json({
          success: false,
          message:
            "Faltan parámetros requeridos: ISCO_EMPR, INNU_ANNO, INNU_MESE",
        });
        return;
      }

      // Construir request con valores por defecto
      const request: BalanceComprobacionOficonRequest = {
        ISCO_EMPR: ISCO_EMPR as string,
        INNU_ANNO: parseInt(INNU_ANNO as string),
        INNU_MESE: parseInt(INNU_MESE as string),
        ISTI_BALA: (req.query["ISTI_BALA"] as string) || "M",
        ISST_QUIE: (req.query["ISST_QUIE"] as string) || "N",
        INNV_PRES: req.query["INNV_PRES"]
          ? parseInt(req.query["INNV_PRES"] as string)
          : 1,
        ISCO_CNTA_INIC: (req.query["ISCO_CNTA_INIC"] as string) || "",
        ISCO_CNTA_FINA: (req.query["ISCO_CNTA_FINA"] as string) || "",
        INNU_DGTO: req.query["INNU_DGTO"]
          ? parseInt(req.query["INNU_DGTO"] as string)
          : 2,
        ISTI_PRES: (req.query["ISTI_PRES"] as string) || "REP",
        ISTI_MONT: (req.query["ISTI_MONT"] as string) || "M",
      };

      console.log("📋 Request construido:", request);

      // Usar query bus para obtener datos
      const data = (await this.queryBus.execute(
        new GetBalanceComprobacionOficonQuery(request)
      )) as BalanceComprobacionOficon[];

      // Determinar tipos de reporte
      const tipoBalance = request.ISTI_BALA === "A" ? "ACUMULADO" : "MENSUAL";
      const tipoQuiebre =
        request.ISST_QUIE === "S" ? "CON_QUIEBRE" : "SIN_QUIEBRE";
      const tipoPresentacion =
        request.ISTI_PRES === "TAB" ? "TABLA" : "REPORTE";
      const tipoMonto = request.ISTI_MONT === "T" ? "TODAS_FILAS" : "CON_MONTO";

      const response: BalanceComprobacionOficonResponse = {
        success: true,
        data,
        totalRecords: data.length,
        tipoBalance,
        tipoQuiebre,
        tipoPresentacion,
        tipoMonto,
        message: `Reporte de balance comprobación OFICON generado exitosamente. Total de registros: ${data.length}`,
      };

      console.log(
        `✅ BalanceComprobacionOficonController - Reporte generado exitosamente. Registros: ${data.length}`
      );

      res.json(response);
    } catch (error) {
      console.error(
        "Error en BalanceComprobacionOficonController.generarReporteBalanceComprobacionOficon:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
