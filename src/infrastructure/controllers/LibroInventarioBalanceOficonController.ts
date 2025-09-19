import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { ILibroInventarioBalanceOficonService } from "../../domain/services/ILibroInventarioBalanceOficonService";
import { ICommandBus } from "../../domain/cqrs/ICommandBus";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";
import { GetLibroInventarioBalanceOficonQuery } from "../../application/queries/libro-inventario-balance-oficon/GetLibroInventarioBalanceOficonQuery";
import {
  LibroInventarioBalanceOficon,
  LibroInventarioBalanceOficonRequest,
  LibroInventarioBalanceOficonResponse,
} from "../../domain/entities/LibroInventarioBalanceOficon";
import { TYPES } from "../container/types";

/**
 * @swagger
 * components:
 *   schemas:
 *     LibroInventarioBalanceOficonRequest:
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
 *     LibroInventarioBalanceOficonResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LibroInventarioBalanceOficon'
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
 *           example: "Reporte de libro inventario balance OFICON generado exitosamente. Total de registros: 150"
 *
 *     LibroInventarioBalanceOficon:
 *       type: object
 *       properties:
 *         NU_QUIE_0001:
 *           type: string
 *           description: "Número quiebre 0001"
 *         NU_QUIE_0002:
 *           type: string
 *           description: "Número quiebre 0002"
 *         DE_QUIE_0002:
 *           type: string
 *           description: "Descripción quiebre 0002"
 *         CO_CNTA_QUIE:
 *           type: string
 *           description: "Código cuenta quiebre"
 *         DE_CNTA_EMPR:
 *           type: string
 *           description: "Descripción cuenta empresa"
 *         CO_CNTA_EMPR:
 *           type: string
 *           description: "Código cuenta empresa"
 *         IM_MVTO_TOTA:
 *           type: number
 *           format: "double"
 *           description: "Importe movimiento total"
 *         PAS_PATR:
 *           type: number
 *           format: "double"
 *           description: "Pasivo patrimonio"
 *         ACTIVO:
 *           type: number
 *           format: "double"
 *           description: "Activo"
 *         PASIVO:
 *           type: number
 *           format: "double"
 *           description: "Pasivo"
 *         PATRIMONIO:
 *           type: number
 *           format: "double"
 *           description: "Patrimonio"
 */

@injectable()
export class LibroInventarioBalanceOficonController {
  constructor(
    @inject(TYPES.ILibroInventarioBalanceOficonService)
    private readonly libroInventarioBalanceOficonService: ILibroInventarioBalanceOficonService,
    @inject(TYPES.ICommandBus)
    private readonly commandBus: ICommandBus,
    @inject(TYPES.IQueryBus)
    private readonly queryBus: IQueryBus
  ) {}

  /**
   * @swagger
   * /api/libro-inventario-balance-oficon/generar-reporte:
   *   get:
   *     summary: Generar reporte de Libro Inventario Balance OFICON (Query Bus)
   *     description: Genera un reporte de libro inventario balance OFICON utilizando el stored procedure SP_TASALD_EMPR_Q26
   *     tags: [Libro Inventario Balance OFICON]
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
   *               $ref: '#/components/schemas/LibroInventarioBalanceOficonResponse'
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
  async generarReporteLibroInventarioBalanceOficon(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      console.log(
        "🔍 LibroInventarioBalanceOficonController - Iniciando generación de reporte"
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
      const request: LibroInventarioBalanceOficonRequest = {
        ISCO_EMPR: ISCO_EMPR as string,
        INNU_ANNO: parseInt(INNU_ANNO as string),
        INNU_MESE: parseInt(INNU_MESE as string),
      };

      console.log("📋 Request construido:", request);

      // Usar query bus para obtener datos
      const data = (await this.queryBus.execute(
        new GetLibroInventarioBalanceOficonQuery(request)
      )) as LibroInventarioBalanceOficon[];

      const response: LibroInventarioBalanceOficonResponse = {
        success: true,
        data,
        totalRecords: data.length,
        empresa: request.ISCO_EMPR,
        año: request.INNU_ANNO,
        mes: request.INNU_MESE,
        message: `Reporte de libro inventario balance OFICON generado exitosamente. Total de registros: ${data.length}`,
      };

      console.log(
        `✅ LibroInventarioBalanceOficonController - Reporte generado exitosamente. Registros: ${data.length}`
      );

      res.json(response);
    } catch (error) {
      console.error(
        "Error en LibroInventarioBalanceOficonController.generarReporteLibroInventarioBalanceOficon:",
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
