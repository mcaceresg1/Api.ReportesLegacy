import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IVentasGeneralesOficonService } from "../../domain/services/IVentasGeneralesOficonService";
import { ICommandBus } from "../../domain/cqrs/ICommandBus";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";
import { GetVentasGeneralesOficonQuery } from "../../application/queries/ventas-generales-oficon/GetVentasGeneralesOficonQuery";
import {
  VentasGeneralesOficon,
  VentasGeneralesOficonRequest,
  VentasGeneralesOficonResponse,
} from "../../domain/entities/VentasGeneralesOficon";
import { TYPES } from "../container/types";

/**
 * @swagger
 * components:
 *   schemas:
 *     VentasGeneralesOficonRequest:
 *       type: object
 *       required:
 *         - ISCO_EMPR
 *         - INNU_ANNO
 *         - INNU_MESE_INIC
 *         - INNU_MESE_FINA
 *       properties:
 *         ISCO_EMPR:
 *           type: string
 *           description: "Código de empresa (REQUERIDO)"
 *           example: "12"
 *         INNU_ANNO:
 *           type: integer
 *           description: "Año (REQUERIDO)"
 *           example: 2003
 *         INNU_MESE_INIC:
 *           type: integer
 *           description: "Mes inicial (REQUERIDO)"
 *           example: 1
 *         INNU_MESE_FINA:
 *           type: integer
 *           description: "Mes final (REQUERIDO)"
 *           example: 1
 *         ISTI_REPO:
 *           type: string
 *           description: "Tipo impresión (OPCIONAL) - ANA: analítico, RES: resumen"
 *           example: "ANA"
 *         ISTI_ORDE_REPO:
 *           type: string
 *           description: "Ordenado por (OPCIONAL) - VOU: voucher, FEC: fecha"
 *           example: "FEC"
 *         ISTI_INFO:
 *           type: string
 *           description: "Tipo reporte (OPCIONAL) - ORI: origen/contable, OFI: oficial"
 *           example: "ORI"
 *
 *     VentasGeneralesOficonResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VentasGeneralesOficon'
 *         totalRecords:
 *           type: integer
 *           example: 150
 *         empresa:
 *           type: string
 *           example: "12"
 *         año:
 *           type: integer
 *           example: 2003
 *         mesInicial:
 *           type: integer
 *           example: 1
 *         mesFinal:
 *           type: integer
 *           example: 1
 *         tipoReporte:
 *           type: string
 *           example: "ANALITICO"
 *         tipoOrden:
 *           type: string
 *           example: "FECHA"
 *         tipoInfo:
 *           type: string
 *           example: "ORIGEN/CONTABLE"
 *         message:
 *           type: string
 *           example: "Reporte de ventas generales OFICON generado exitosamente. Total de registros: 150"
 *
 *     VentasGeneralesOficon:
 *       type: object
 *       properties:
 *         FE_DOCU:
 *           type: string
 *           description: "Fecha documento (solo en reporte analítico)"
 *         TI_DOCU_SUNA:
 *           type: string
 *           description: "Tipo documento SUNAT"
 *         TI_DOCU:
 *           type: string
 *           description: "Tipo documento"
 *         NO_DOCU:
 *           type: string
 *           description: "Nombre documento"
 *         NU_DOCU:
 *           type: string
 *           description: "Número documento (solo en reporte analítico)"
 *         CO_UNID_CNTB:
 *           type: string
 *           description: "Código unidad contable (solo en reporte analítico)"
 *         CO_OPRC:
 *           type: string
 *           description: "Código operación (solo en reporte analítico)"
 *         NU_ASTO:
 *           type: string
 *           description: "Número asiento (solo en reporte analítico)"
 *         CO_CLIE:
 *           type: string
 *           description: "Código cliente (solo en reporte analítico)"
 *         NO_CORT_CLIE:
 *           type: string
 *           description: "Nombre corto cliente (solo en reporte analítico)"
 *         NU_RUCS_CLIE:
 *           type: string
 *           description: "Número RUC cliente (solo en reporte analítico)"
 *         CO_MONE:
 *           type: string
 *           description: "Código moneda (solo en reporte analítico)"
 *         IM_INAF_ORIG:
 *           type: number
 *           format: "double"
 *           description: "Importe inafecto origen"
 *         IM_AFEC_ORIG:
 *           type: number
 *           format: "double"
 *           description: "Importe afecto origen"
 *         IM_IIGV_ORIG:
 *           type: number
 *           format: "double"
 *           description: "Importe IGV origen"
 *         IM_TOTA_ORIG:
 *           type: number
 *           format: "double"
 *           description: "Importe total origen"
 *         IM_INAF_CNTB:
 *           type: number
 *           format: "double"
 *           description: "Importe inafecto contable"
 *         IM_AFEC_CNTB:
 *           type: number
 *           format: "double"
 *           description: "Importe afecto contable"
 *         IM_IIGV_CNTB:
 *           type: number
 *           format: "double"
 *           description: "Importe IGV contable"
 *         IM_TOTA_CNTB:
 *           type: number
 *           format: "double"
 *           description: "Importe total contable"
 *         FA_CAMB:
 *           type: number
 *           format: "double"
 *           description: "Factor cambio (solo en reporte analítico)"
 *         IM_EXPO_ORIG:
 *           type: number
 *           format: "double"
 *           description: "Importe exportación origen (solo cuando ISTI_INFO = 'OFI')"
 *         IM_EXPO_CNTB:
 *           type: number
 *           format: "double"
 *           description: "Importe exportación contable (solo cuando ISTI_INFO = 'OFI')"
 *         IM_IIGV_IISC:
 *           type: number
 *           format: "double"
 *           description: "Importe IGV IISC (solo cuando ISTI_INFO = 'OFI')"
 */

@injectable()
export class VentasGeneralesOficonController {
  constructor(
    @inject(TYPES.IVentasGeneralesOficonService)
    private readonly ventasGeneralesOficonService: IVentasGeneralesOficonService,
    @inject(TYPES.ICommandBus)
    private readonly commandBus: ICommandBus,
    @inject(TYPES.IQueryBus)
    private readonly queryBus: IQueryBus
  ) {}

  /**
   * @swagger
   * /api/ventas-generales-oficon/generar-reporte:
   *   get:
   *     summary: Generar reporte de Ventas Generales OFICON (Query Bus)
   *     description: Genera un reporte de ventas generales OFICON utilizando el stored procedure SP_TXMVTO_CNTB_Q21
   *     tags: [Ventas Generales OFICON]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: ISCO_EMPR
   *         required: true
   *         schema:
   *           type: string
   *         description: Código de empresa
   *         example: "12"
   *       - in: query
   *         name: INNU_ANNO
   *         required: true
   *         schema:
   *           type: integer
   *         description: Año
   *         example: 2003
   *       - in: query
   *         name: INNU_MESE_INIC
   *         required: true
   *         schema:
   *           type: integer
   *         description: Mes inicial
   *         example: 1
   *       - in: query
   *         name: INNU_MESE_FINA
   *         required: true
   *         schema:
   *           type: integer
   *         description: Mes final
   *         example: 1
   *       - in: query
   *         name: ISTI_REPO
   *         required: false
   *         schema:
   *           type: string
   *         description: "Tipo impresión (OPCIONAL) - ANA: analítico, RES: resumen"
   *         example: "ANA"
   *       - in: query
   *         name: ISTI_ORDE_REPO
   *         required: false
   *         schema:
   *           type: string
   *         description: "Ordenado por (OPCIONAL) - VOU: voucher, FEC: fecha"
   *         example: "FEC"
   *       - in: query
   *         name: ISTI_INFO
   *         required: false
   *         schema:
   *           type: string
   *         description: "Tipo reporte (OPCIONAL) - ORI: origen/contable, OFI: oficial"
   *         example: "ORI"
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VentasGeneralesOficonResponse'
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
  async generarReporteVentasGeneralesOficon(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      console.log(
        "🔍 VentasGeneralesOficonController - Iniciando generación de reporte"
      );
      console.log("📋 Parámetros recibidos:", req.query);

      // Validar parámetros requeridos
      const { ISCO_EMPR, INNU_ANNO, INNU_MESE_INIC, INNU_MESE_FINA } =
        req.query;

      if (!ISCO_EMPR || !INNU_ANNO || !INNU_MESE_INIC || !INNU_MESE_FINA) {
        res.status(400).json({
          success: false,
          message:
            "Faltan parámetros requeridos: ISCO_EMPR, INNU_ANNO, INNU_MESE_INIC, INNU_MESE_FINA",
        });
        return;
      }

      // Construir request con valores por defecto
      const request: VentasGeneralesOficonRequest = {
        ISCO_EMPR: ISCO_EMPR as string,
        INNU_ANNO: parseInt(INNU_ANNO as string),
        INNU_MESE_INIC: parseInt(INNU_MESE_INIC as string),
        INNU_MESE_FINA: parseInt(INNU_MESE_FINA as string),
        ISTI_REPO: (req.query["ISTI_REPO"] as string) || "ANA",
        ISTI_ORDE_REPO: (req.query["ISTI_ORDE_REPO"] as string) || "FEC",
        ISTI_INFO: (req.query["ISTI_INFO"] as string) || "ORI",
      };

      console.log("📋 Request construido:", request);

      // Usar query bus para obtener datos
      const data = (await this.queryBus.execute(
        new GetVentasGeneralesOficonQuery(request)
      )) as VentasGeneralesOficon[];

      // Determinar tipos de reporte
      const tipoReporte = request.ISTI_REPO === "RES" ? "RESUMEN" : "ANALITICO";
      const tipoOrden = request.ISTI_ORDE_REPO === "VOU" ? "VOUCHER" : "FECHA";
      const tipoInfo =
        request.ISTI_INFO === "OFI" ? "OFICIAL" : "ORIGEN/CONTABLE";

      const response: VentasGeneralesOficonResponse = {
        success: true,
        data,
        totalRecords: data.length,
        empresa: request.ISCO_EMPR,
        año: request.INNU_ANNO,
        mesInicial: request.INNU_MESE_INIC,
        mesFinal: request.INNU_MESE_FINA,
        tipoReporte,
        tipoOrden,
        tipoInfo,
        message: `Reporte de ventas generales OFICON generado exitosamente. Total de registros: ${data.length}`,
      };

      console.log(
        `✅ VentasGeneralesOficonController - Reporte generado exitosamente. Registros: ${data.length}`
      );

      res.json(response);
    } catch (error) {
      console.error(
        "Error en VentasGeneralesOficonController.generarReporteVentasGeneralesOficon:",
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
