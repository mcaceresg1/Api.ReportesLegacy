import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IPatrimonioNetoOficonService } from "../../domain/services/IPatrimonioNetoOficonService";
import { ICommandBus } from "../../domain/cqrs/ICommandBus";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";
import { GetPatrimonioNetoOficonQuery } from "../../application/queries/patrimonio-neto-oficon/GetPatrimonioNetoOficonQuery";
import {
  PatrimonioNetoOficon,
  PatrimonioNetoOficonRequest,
  PatrimonioNetoOficonResponse,
} from "../../domain/entities/PatrimonioNetoOficon";
import { TYPES } from "../container/types";

/**
 * @swagger
 * components:
 *   schemas:
 *     PatrimonioNetoOficonRequest:
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
 *
 *     PatrimonioNetoOficonResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PatrimonioNetoOficon'
 *         totalRecords:
 *           type: integer
 *           example: 150
 *         empresa:
 *           type: string
 *           example: "01"
 *         año:
 *           type: integer
 *           example: 1998
 *         mes:
 *           type: integer
 *           example: 10
 *         message:
 *           type: string
 *           example: "Reporte de patrimonio neto OFICON generado exitosamente. Total de registros: 150"
 *
 *     PatrimonioNetoOficon:
 *       type: object
 *       properties:
 *         NU_ANNO:
 *           type: integer
 *           description: "Número año"
 *         NO_TITU:
 *           type: string
 *           description: "Nombre título"
 *         IM_SALD_0001:
 *           type: number
 *           format: "double"
 *           description: "Importe saldo 0001"
 *         IM_SALD_0002:
 *           type: number
 *           format: "double"
 *           description: "Importe saldo 0002"
 *         IM_SALD_0003:
 *           type: number
 *           format: "double"
 *           description: "Importe saldo 0003"
 *         IM_SALD_0004:
 *           type: number
 *           format: "double"
 *           description: "Importe saldo 0004"
 *         IM_SALD_0005:
 *           type: number
 *           format: "double"
 *           description: "Importe saldo 0005"
 */

@injectable()
export class PatrimonioNetoOficonController {
  constructor(
    @inject(TYPES.IPatrimonioNetoOficonService)
    private readonly patrimonioNetoOficonService: IPatrimonioNetoOficonService,
    @inject(TYPES.ICommandBus)
    private readonly commandBus: ICommandBus,
    @inject(TYPES.IQueryBus)
    private readonly queryBus: IQueryBus
  ) {}

  /**
   * @swagger
   * /api/patrimonio-neto-oficon/generar-reporte:
   *   get:
   *     summary: Generar reporte de Patrimonio Neto OFICON (Query Bus)
   *     description: Genera un reporte de patrimonio neto OFICON utilizando el stored procedure SP_TXMVTO_CNTB_Q06
   *     tags: [Patrimonio Neto OFICON]
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
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PatrimonioNetoOficonResponse'
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
  async generarReportePatrimonioNetoOficon(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      console.log(
        "🔍 PatrimonioNetoOficonController - Iniciando generación de reporte"
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

      // Construir request
      const request: PatrimonioNetoOficonRequest = {
        ISCO_EMPR: ISCO_EMPR as string,
        INNU_ANNO: parseInt(INNU_ANNO as string),
        INNU_MESE: parseInt(INNU_MESE as string),
      };

      console.log("📋 Request construido:", request);

      // Usar query bus para obtener datos
      const data = (await this.queryBus.execute(
        new GetPatrimonioNetoOficonQuery(request)
      )) as PatrimonioNetoOficon[];

      const response: PatrimonioNetoOficonResponse = {
        success: true,
        data,
        totalRecords: data.length,
        empresa: request.ISCO_EMPR,
        año: request.INNU_ANNO,
        mes: request.INNU_MESE,
        message: `Reporte de patrimonio neto OFICON generado exitosamente. Total de registros: ${data.length}`,
      };

      console.log(
        `✅ PatrimonioNetoOficonController - Reporte generado exitosamente. Registros: ${data.length}`
      );

      res.json(response);
    } catch (error) {
      console.error(
        "Error en PatrimonioNetoOficonController.generarReportePatrimonioNetoOficon:",
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
