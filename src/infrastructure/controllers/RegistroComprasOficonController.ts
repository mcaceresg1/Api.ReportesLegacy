import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IRegistroComprasOficonService } from "../../domain/services/IRegistroComprasOficonService";
import { ICommandBus } from "../../domain/cqrs/ICommandBus";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";
import { GetRegistroComprasOficonQuery } from "../../application/queries/registro-compras-oficon/GetRegistroComprasOficonQuery";
import {
  RegistroComprasOficon,
  RegistroComprasOficonRequest,
  RegistroComprasOficonResponse,
} from "../../domain/entities/RegistroComprasOficon";
import { TYPES } from "../container/types";

/**
 * @swagger
 * components:
 *   schemas:
 *     RegistroComprasOficonRequest:
 *       type: object
 *       required:
 *         - ISCO_EMPR
 *         - INNU_ANNO
 *         - INNU_MESE_INIC
 *         - INNU_MESE_FINA
 *       properties:
 *         ISCO_EMPR:
 *           type: string
 *           description: Código de empresa (REQUERIDO)
 *           example: "01"
 *         INNU_ANNO:
 *           type: integer
 *           description: Año (REQUERIDO)
 *           example: 1998
 *         INNU_MESE_INIC:
 *           type: integer
 *           description: Mes inicial (REQUERIDO)
 *           example: 9
 *         INNU_MESE_FINA:
 *           type: integer
 *           description: Mes final (REQUERIDO)
 *           example: 10
 *         ISTI_REPO:
 *           type: string
 *           description: "Tipo de impresión (OPCIONAL) - Parámetro de dos tipos: ANA - Analítico, RES - Resumen"
 *           enum: [ANA, RES]
 *           example: "ANA"
 *         ISTI_ORDE_REPO:
 *           type: string
 *           description: "Ordenado por (OPCIONAL) - Parámetro de dos tipos: VOU - Voucher, FEC - Fecha"
 *           enum: [VOU, FEC]
 *           example: "FEC"
 *         ISTI_INFO:
 *           type: string
 *           description: "Tipo de reporte (OPCIONAL) - Parámetro de dos tipos: ORI - Origen/Contable, OFI - Oficial"
 *           enum: [ORI, OFI]
 *           example: "ORI"
 *
 *     RegistroComprasOficonResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RegistroComprasOficon'
 *         totalRecords:
 *           type: integer
 *           example: 150
 *         tipoReporte:
 *           type: string
 *           enum: [ANALITICO, RESUMEN, OFICIAL]
 *           example: "ANALITICO"
 *         tipoOrden:
 *           type: string
 *           enum: [VOUCHER, FECHA]
 *           example: "FECHA"
 *         tipoInfo:
 *           type: string
 *           enum: [ORIGEN, OFICIAL]
 *           example: "ORIGEN"
 *         message:
 *           type: string
 *           example: "Reporte de registro compras OFICON generado exitosamente. Total de registros: 150"
 *
 *     RegistroComprasOficon:
 *       type: object
 *       properties:
 *         ISCO_EMPR:
 *           type: string
 *           description: Código de empresa
 *         FE_DOCU:
 *           type: string
 *           description: Fecha del documento
 *         TI_DOCU_SUNA:
 *           type: string
 *           description: Tipo de documento SUNAT
 *         TI_DOCU_CNTB:
 *           type: string
 *           description: Tipo de documento contable
 *         NO_DOCU:
 *           type: string
 *           description: Número de documento
 *         NU_DOCU:
 *           type: string
 *           description: Número de documento
 *         CO_UNID_CNTB:
 *           type: string
 *           description: Código unidad contable
 *         CO_OPRC:
 *           type: string
 *           description: Código operación
 *         NU_ASTO:
 *           type: string
 *           description: Número de asiento
 *         CO_PROV:
 *           type: string
 *           description: Código de proveedor
 *         NO_CORT_PROV:
 *           type: string
 *           description: Nombre corto del proveedor
 *         NU_RUCS_PROV:
 *           type: string
 *           description: RUC del proveedor
 *         CO_MONE:
 *           type: string
 *           description: Código de moneda
 *         IM_INAF_ORIG:
 *           type: number
 *           description: Importe inafecto origen
 *         IM_AFEC_ORIG:
 *           type: number
 *           description: Importe afecto origen
 *         IM_IIGV_ORIG:
 *           type: number
 *           description: IGV origen
 *         IM_TOTA_ORIG:
 *           type: number
 *           description: Total origen
 *         IM_INAF_CNTB:
 *           type: number
 *           description: Importe inafecto contable
 *         IM_AFEC_CNTB:
 *           type: number
 *           description: Importe afecto contable
 *         IM_IIGV_CNTB:
 *           type: number
 *           description: IGV contable
 *         IM_TOTA_CNTB:
 *           type: number
 *           description: Total contable
 *         FA_CAMB:
 *           type: number
 *           description: Factor de cambio
 *         ST_RETE_AUXI:
 *           type: string
 *           description: Estado retención auxiliar
 *         ST_RETE_DOCU:
 *           type: string
 *           description: Estado retención documento
 *         VNIM_MAXI_NRET:
 *           type: number
 *           description: Valor máximo no retenido
 *         ST_RETE_BCON:
 *           type: string
 *           description: Estado retención banco
 *         ST_STAT:
 *           type: string
 *           description: Estado estadístico
 *         ST_NDEB:
 *           type: string
 *           description: Estado no débito
 *         PO_IMPT:
 *           type: number
 *           description: Porcentaje importe
 */

@injectable()
export class RegistroComprasOficonController {
  constructor(
    @inject(TYPES.IRegistroComprasOficonService)
    private readonly registroComprasOficonService: IRegistroComprasOficonService,
    @inject(TYPES.ICommandBus)
    private readonly commandBus: ICommandBus,
    @inject(TYPES.IQueryBus)
    private readonly queryBus: IQueryBus
  ) {}

  /**
   * @swagger
   * /api/registro-compras-oficon/generar-reporte:
   *   get:
   *     summary: Generar reporte de Registro Compras OFICON (Query Bus)
   *     description: Genera un reporte de registro compras OFICON utilizando el stored procedure SP_TXMVTO_CNTB_Q20
   *     tags: [Registro Compras OFICON]
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
   *         name: INNU_MESE_INIC
   *         required: true
   *         schema:
   *           type: integer
   *         description: Mes inicial
   *         example: 9
   *       - in: query
   *         name: INNU_MESE_FINA
   *         required: true
   *         schema:
   *           type: integer
   *         description: Mes final
   *         example: 10
   *       - in: query
   *         name: ISTI_REPO
   *         required: false
   *         schema:
   *           type: string
   *           enum: [ANA, RES]
   *         description: |
   *           Tipo de impresión (OPCIONAL) - Parámetro de dos tipos:
   *           1. ANA - Analítico
   *           2. RES - Resumen
   *         example: "ANA"
   *       - in: query
   *         name: ISTI_ORDE_REPO
   *         required: false
   *         schema:
   *           type: string
   *           enum: [VOU, FEC]
   *         description: |
   *           Ordenado por (OPCIONAL) - Parámetro de dos tipos:
   *           1. VOU - Voucher
   *           2. FEC - Fecha
   *         example: "FEC"
   *       - in: query
   *         name: ISTI_INFO
   *         required: false
   *         schema:
   *           type: string
   *           enum: [ORI, OFI]
   *         description: |
   *           Tipo de reporte (OPCIONAL) - Parámetro de dos tipos:
   *           1. ORI - Origen/Contable
   *           2. OFI - Oficial
   *         example: "ORI"
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RegistroComprasOficonResponse'
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
  async generarReporteRegistroComprasOficon(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const {
        ISCO_EMPR,
        INNU_ANNO,
        INNU_MESE_INIC,
        INNU_MESE_FINA,
        ISTI_REPO,
        ISTI_ORDE_REPO,
        ISTI_INFO,
      } = req.query;

      // Validar parámetros requeridos
      if (
        !ISCO_EMPR ||
        !INNU_ANNO ||
        !INNU_MESE_INIC ||
        !INNU_MESE_FINA ||
        !ISTI_REPO ||
        !ISTI_ORDE_REPO ||
        !ISTI_INFO
      ) {
        res.status(400).json({
          success: false,
          message:
            "Faltan parámetros requeridos: ISCO_EMPR, INNU_ANNO, INNU_MESE_INIC, INNU_MESE_FINA, ISTI_REPO, ISTI_ORDE_REPO, ISTI_INFO",
        });
        return;
      }

      // Validar que INNU_ANNO sea un número
      const anno = parseInt(INNU_ANNO as string);
      if (isNaN(anno)) {
        res.status(400).json({
          success: false,
          message: "INNU_ANNO debe ser un número válido",
        });
        return;
      }

      // Validar que INNU_MESE_INIC sea un número
      const mesInic = parseInt(INNU_MESE_INIC as string);
      if (isNaN(mesInic)) {
        res.status(400).json({
          success: false,
          message: "INNU_MESE_INIC debe ser un número válido",
        });
        return;
      }

      // Validar que INNU_MESE_FINA sea un número
      const mesFina = parseInt(INNU_MESE_FINA as string);
      if (isNaN(mesFina)) {
        res.status(400).json({
          success: false,
          message: "INNU_MESE_FINA debe ser un número válido",
        });
        return;
      }

      // Validar valores de ISTI_REPO
      const tiposRepos = ["ANA", "RES"];
      if (!tiposRepos.includes(ISTI_REPO as string)) {
        res.status(400).json({
          success: false,
          message: `ISTI_REPO debe ser uno de los siguientes valores:
          1. ANA - Analítico
          2. RES - Resumen
          Valor recibido: ${ISTI_REPO}`,
        });
        return;
      }

      // Validar valores de ISTI_ORDE_REPO
      const tiposOrden = ["VOU", "FEC"];
      if (!tiposOrden.includes(ISTI_ORDE_REPO as string)) {
        res.status(400).json({
          success: false,
          message: `ISTI_ORDE_REPO debe ser uno de los siguientes valores:
          1. VOU - Voucher
          2. FEC - Fecha
          Valor recibido: ${ISTI_ORDE_REPO}`,
        });
        return;
      }

      // Validar valores de ISTI_INFO
      const tiposInfo = ["ORI", "OFI"];
      if (!tiposInfo.includes(ISTI_INFO as string)) {
        res.status(400).json({
          success: false,
          message: `ISTI_INFO debe ser uno de los siguientes valores:
          1. ORI - Origen/Contable
          2. OFI - Oficial
          Valor recibido: ${ISTI_INFO}`,
        });
        return;
      }

      // Crear request object
      const request: RegistroComprasOficonRequest = {
        ISCO_EMPR: ISCO_EMPR as string,
        INNU_ANNO: anno,
        INNU_MESE_INIC: mesInic,
        INNU_MESE_FINA: mesFina,
        ISTI_REPO: ISTI_REPO as string,
        ISTI_ORDE_REPO: ISTI_ORDE_REPO as string,
        ISTI_INFO: ISTI_INFO as string,
      };

      // Usar query bus para obtener datos
      const data = (await this.queryBus.execute(
        new GetRegistroComprasOficonQuery(request)
      )) as RegistroComprasOficon[];

      // Determinar tipo de reporte
      const tipoReporte =
        ISTI_REPO === "ANA"
          ? "ANALITICO"
          : ISTI_REPO === "RES"
          ? "RESUMEN"
          : "OFICIAL";

      // Determinar tipo de orden
      const tipoOrden = ISTI_ORDE_REPO === "VOU" ? "VOUCHER" : "FECHA";

      // Determinar tipo de info
      const tipoInfo = ISTI_INFO === "ORI" ? "ORIGEN" : "OFICIAL";

      const response: RegistroComprasOficonResponse = {
        success: true,
        data,
        totalRecords: data.length,
        tipoReporte: tipoReporte as "ANALITICO" | "RESUMEN" | "OFICIAL",
        tipoOrden: tipoOrden as "VOUCHER" | "FECHA",
        tipoInfo: tipoInfo as "ORIGEN" | "OFICIAL",
        message: `Reporte de registro compras OFICON generado exitosamente. Total de registros: ${data.length}`,
      };

      res.json(response);
    } catch (error) {
      console.error(
        "Error en RegistroComprasOficonController.generarReporteRegistroComprasOficon:",
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
