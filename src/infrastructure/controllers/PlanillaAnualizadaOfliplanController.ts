import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { ICommandBus } from "../../domain/cqrs/ICommandBus";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";
import { GetPlanillaAnualizadaOfliplanQuery } from "../../application/queries/planilla-anualizada-ofliplan/GetPlanillaAnualizadaOfliplanQuery";
import { TYPES } from "../container/types";
import {
  PlanillaAnualizadaOfliplan,
  PlanillaAnualizadaOfliplanRequest,
  PlanillaAnualizadaOfliplanResponse,
} from "../../domain/entities/PlanillaAnualizadaOfliplan";

@injectable()
export class PlanillaAnualizadaOfliplanController {
  constructor(
    @inject(TYPES.ICommandBus) private readonly commandBus: ICommandBus,
    @inject(TYPES.IQueryBus) private readonly queryBus: IQueryBus
  ) {}

  /**
   * @swagger
   * /api/planilla-anualizada-ofliplan/generar-reporte:
   *   get:
   *     summary: Generar reporte de planilla anualizada OFIPLAN
   *     description: Genera un reporte de planilla anualizada usando el stored procedure SP_TMTRAB_CALC_Q04
   *     tags: [Planilla Anualizada OFIPLAN]
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
   *           type: number
   *         description: Año del reporte
   *         example: 2024
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
   *                     type: object
   *                     properties:
   *                       CO_EMPR_RPTS:
   *                         type: string
   *                         description: Código empresa reportes
   *                       DE_NOMB_CORT:
   *                         type: string
   *                         description: Descripción nombre corto
   *                       CO_UNID_RPTS:
   *                         type: string
   *                         description: Código unidad reportes
   *                       DE_UNID_RPTS:
   *                         type: string
   *                         description: Descripción unidad reportes
   *                       CO_PLAN_RPTS:
   *                         type: string
   *                         description: Código plan reportes
   *                       DE_TIPO_PLAN:
   *                         type: string
   *                         description: Descripción tipo plan
   *                       CO_TRAB_RPTS:
   *                         type: string
   *                         description: Código trabajador reportes
   *                       NO_TRAB_RPTS:
   *                         type: string
   *                         description: Nombre trabajador reportes
   *                       TI_CPTO_RPTS:
   *                         type: string
   *                         description: Tipo concepto reportes
   *                       CO_CPTO_FORM:
   *                         type: string
   *                         description: Código concepto formato
   *                       NU_ORDE_PRES:
   *                         type: number
   *                         description: Número orden presentación
   *                       DE_CPTO_RPTS:
   *                         type: string
   *                         description: Descripción concepto reportes
   *                       TI_AFEC_RPTS:
   *                         type: string
   *                         description: Tipo afectación reportes
   *                       CO_CENT_COST:
   *                         type: string
   *                         description: Código centro costo
   *                       DE_CENT_COST:
   *                         type: string
   *                         description: Descripción centro costo
   *                       CO_PUES_TRAB:
   *                         type: string
   *                         description: Código puesto trabajo
   *                       DE_PUES_TRAB:
   *                         type: string
   *                         description: Descripción puesto trabajo
   *                       NU_AFPS:
   *                         type: number
   *                         description: Número AFPS
   *                       NU_ESSA:
   *                         type: number
   *                         description: Número ESSA
   *                       CO_AFPS:
   *                         type: string
   *                         description: Código AFPS
   *                       NO_AFPS:
   *                         type: string
   *                         description: Nombre AFPS
   *                       NU_DATO_ENER:
   *                         type: number
   *                         description: Dato enero
   *                       NU_DATO_FEBR:
   *                         type: number
   *                         description: Dato febrero
   *                       NU_DATO_MARZ:
   *                         type: number
   *                         description: Dato marzo
   *                       NU_DATO_ABRI:
   *                         type: number
   *                         description: Dato abril
   *                       NU_DATO_MAYO:
   *                         type: number
   *                         description: Dato mayo
   *                       NU_DATO_JUNI:
   *                         type: number
   *                         description: Dato junio
   *                       NU_DATO_JULI:
   *                         type: number
   *                         description: Dato julio
   *                       NU_DATO_AGOS:
   *                         type: number
   *                         description: Dato agosto
   *                       NU_DATO_SETI:
   *                         type: number
   *                         description: Dato septiembre
   *                       NU_DATO_OCTU:
   *                         type: number
   *                         description: Dato octubre
   *                       NU_DATO_NOVI:
   *                         type: number
   *                         description: Dato noviembre
   *                       NU_DATO_DICI:
   *                         type: number
   *                         description: Dato diciembre
   *                 totalRecords:
   *                   type: number
   *                   description: Total de registros
   *                 empresa:
   *                   type: string
   *                   description: Código de empresa
   *                 año:
   *                   type: number
   *                   description: Año del reporte
   *                 message:
   *                   type: string
   *                   example: "Reporte generado exitosamente"
   *       400:
   *         description: Error en la solicitud
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
   *                   example: "Parámetros requeridos faltantes"
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
   */
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      console.log(
        "🔍 PlanillaAnualizadaOfliplanController - Iniciando generación de reporte"
      );

      // Validar parámetros requeridos
      const ISCO_EMPR = req.query["ISCO_EMPR"] as string;
      const INNU_ANNO = req.query["INNU_ANNO"] as string;

      if (!ISCO_EMPR || !INNU_ANNO) {
        const response: PlanillaAnualizadaOfliplanResponse = {
          success: false,
          data: [],
          totalRecords: 0,
          empresa: ISCO_EMPR || "",
          año: parseInt(INNU_ANNO || "0"),
          message: "Los parámetros ISCO_EMPR e INNU_ANNO son requeridos",
        };
        res.status(400).json(response);
        return;
      }

      // Crear request
      const request: PlanillaAnualizadaOfliplanRequest = {
        ISCO_EMPR: ISCO_EMPR,
        INNU_ANNO: parseInt(INNU_ANNO),
      };

      console.log("📋 Parámetros recibidos:", request);

      // Ejecutar query
      const query = new GetPlanillaAnualizadaOfliplanQuery(request);
      const data = (await this.queryBus.execute(
        query
      )) as PlanillaAnualizadaOfliplan[];

      console.log(
        `✅ PlanillaAnualizadaOfliplanController - Reporte generado exitosamente. Registros: ${data.length}`
      );

      // Crear respuesta
      const response: PlanillaAnualizadaOfliplanResponse = {
        success: true,
        data,
        totalRecords: data.length,
        empresa: ISCO_EMPR,
        año: parseInt(INNU_ANNO),
        message: "Reporte generado exitosamente",
      };

      res.json(response);
    } catch (error) {
      console.error(
        "Error en PlanillaAnualizadaOfliplanController.generarReporte:",
        error
      );

      const response: PlanillaAnualizadaOfliplanResponse = {
        success: false,
        data: [],
        totalRecords: 0,
        empresa: (req.query["ISCO_EMPR"] as string) || "",
        año: parseInt((req.query["INNU_ANNO"] as string) || "0"),
        message: "Error interno del servidor",
      };

      res.status(500).json(response);
    }
  }
}
