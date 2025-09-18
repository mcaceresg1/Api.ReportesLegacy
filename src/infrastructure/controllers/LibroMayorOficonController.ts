import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { ILibroMayorOficonService } from "../../domain/services/ILibroMayorOficonService";
import { ICommandBus } from "../../domain/cqrs/ICommandBus";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";
import { GetLibroMayorOficonQuery } from "../../application/queries/libro-mayor-oficon/GetLibroMayorOficonQuery";
import {
  LibroMayorOficon,
  LibroMayorOficonRequest,
  LibroMayorOficonResponse,
} from "../../domain/entities/LibroMayorOficon";
import { TYPES } from "../container/types";

/**
 * @swagger
 * components:
 *   schemas:
 *     LibroMayorOficonAnalitico:
 *       type: object
 *       properties:
 *         NU_MESE_QUIE:
 *           type: integer
 *           description: Número de mes quiebre
 *           example: 1
 *         CO_CNTA_EMPR:
 *           type: string
 *           description: Código de cuenta empresa
 *           example: "110101"
 *         DE_CNTA_EMPR:
 *           type: string
 *           description: Descripción de cuenta empresa
 *           example: "CAJA GENERAL"
 *         TO_CARG:
 *           type: number
 *           format: double
 *           description: Total cargos
 *           example: 1000.00
 *         TO_ABON:
 *           type: number
 *           format: double
 *           description: Total abonos
 *           example: 500.00
 *         NU_MESE:
 *           type: integer
 *           description: Número de mes
 *           example: 1
 *         FE_ASTO_CNTB:
 *           type: string
 *           description: Fecha asiento contable
 *           example: "01/01/2024"
 *         NU_SECU:
 *           type: integer
 *           description: Número secuencial
 *           example: 1
 *         CN_CNTB_EMP1:
 *           type: string
 *           description: Código contable empresa 1
 *           example: "110101"
 *         TI_AUXI_EMPR:
 *           type: string
 *           description: Tipo auxiliar empresa
 *           example: "CLI"
 *         CO_AUXI_EMPR:
 *           type: string
 *           description: Código auxiliar empresa
 *           example: "001"
 *         CO_UNID_CNTB:
 *           type: string
 *           description: Código unidad contable
 *           example: "001"
 *         CO_OPRC_CNTB:
 *           type: string
 *           description: Código operación contable
 *           example: "007"
 *         NU_ASTO:
 *           type: integer
 *           description: Número asiento
 *           example: 1
 *         TI_DOCU:
 *           type: string
 *           description: Tipo documento
 *           example: "FAC"
 *         NU_DOCU:
 *           type: string
 *           description: Número documento
 *           example: "001-001"
 *         FE_DOCU:
 *           type: string
 *           description: Fecha documento
 *           example: "01/01/2024"
 *         IM_MVTO_ORIG:
 *           type: number
 *           format: double
 *           description: Importe movimiento original
 *           example: 1000.00
 *         DE_GLOS:
 *           type: string
 *           description: Descripción glosa
 *           example: "Venta de productos"
 *         IM_DEBE:
 *           type: number
 *           format: double
 *           description: Importe debe
 *           example: 1000.00
 *         IM_HABE:
 *           type: number
 *           format: double
 *           description: Importe haber
 *           example: 0.00
 *         CO_TABL_ORIG:
 *           type: string
 *           description: Código tabla origen
 *           example: "TAB001"
 *         CO_CLAV_TAOR:
 *           type: string
 *           description: Código clave tabla origen
 *           example: "CLV001"
 *         CAMPO:
 *           type: string
 *           description: Campo adicional
 *           example: "CAMPO1"
 *         CO_ORDE_SERV:
 *           type: string
 *           description: Código orden servicio
 *           example: "OS001"
 *       required:
 *         - NU_MESE_QUIE
 *         - CO_CNTA_EMPR
 *         - DE_CNTA_EMPR
 *         - TO_CARG
 *         - TO_ABON
 *         - IM_DEBE
 *         - IM_HABE
 *
 *     LibroMayorOficonResumen:
 *       type: object
 *       properties:
 *         NU_MESE_QUIE:
 *           type: integer
 *           description: Número de mes quiebre
 *           example: 1
 *         CO_CNTA_EMPR:
 *           type: string
 *           description: Código de cuenta empresa
 *           example: "110101"
 *         DE_CNTA_EMPR:
 *           type: string
 *           description: Descripción de cuenta empresa
 *           example: "CAJA GENERAL"
 *         TO_CARG:
 *           type: number
 *           format: double
 *           description: Total cargos
 *           example: 1000.00
 *         TO_ABON:
 *           type: number
 *           format: double
 *           description: Total abonos
 *           example: 500.00
 *         IM_DEBE:
 *           type: number
 *           format: double
 *           description: Importe debe
 *           example: 1000.00
 *         IM_HABE:
 *           type: number
 *           format: double
 *           description: Importe haber
 *           example: 500.00
 *       required:
 *         - NU_MESE_QUIE
 *         - CO_CNTA_EMPR
 *         - DE_CNTA_EMPR
 *         - TO_CARG
 *         - TO_ABON
 *         - IM_DEBE
 *         - IM_HABE
 *
 *     LibroMayorOficonRequest:
 *       type: object
 *       properties:
 *         ISCO_EMPR:
 *           type: string
 *           description: Código de empresa (REQUERIDO)
 *           example: "12"
 *         INNU_ANNO:
 *           type: integer
 *           description: Año (REQUERIDO)
 *           example: 2003
 *         INNU_MESE_INIC:
 *           type: integer
 *           description: Mes inicial (REQUERIDO)
 *           example: 1
 *         INNU_MESE_FINA:
 *           type: integer
 *           description: Mes final (REQUERIDO)
 *           example: 10
 *         ISCO_MONE:
 *           type: string
 *           description: Código moneda - SOL o DOL (REQUERIDO)
 *           enum: [SOL, DOL]
 *           example: "SOL"
 *         ISTI_REPO:
 *           type: string
 *           description: Tipo de reporte (REQUERIDO)
 *           enum: [CUD, COD, CVD, CFD, CUR, COR, CVR, CFR]
 *           example: "CUR"
 *       required:
 *         - ISCO_EMPR
 *         - INNU_ANNO
 *         - INNU_MESE_INIC
 *         - INNU_MESE_FINA
 *         - ISCO_MONE
 *         - ISTI_REPO
 *
 *     LibroMayorOficonResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si la operación fue exitosa
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             oneOf:
 *               - $ref: '#/components/schemas/LibroMayorOficonAnalitico'
 *               - $ref: '#/components/schemas/LibroMayorOficonResumen'
 *           description: Array de datos del reporte
 *         message:
 *           type: string
 *           description: Mensaje descriptivo
 *           example: "Reporte de libro mayor OFICON generado exitosamente. Total de registros: 150"
 *         totalRecords:
 *           type: integer
 *           description: Total de registros devueltos
 *           example: 150
 *         tipoReporte:
 *           type: string
 *           description: Tipo de reporte generado
 *           enum: [ANALITICO, RESUMEN]
 *           example: "RESUMEN"
 *       required:
 *         - success
 *         - data
 *         - totalRecords
 *         - tipoReporte
 */

@injectable()
export class LibroMayorOficonController {
  constructor(
    @inject(TYPES.ILibroMayorOficonService)
    private readonly libroMayorOficonService: ILibroMayorOficonService,
    @inject(TYPES.ICommandBus)
    private readonly commandBus: ICommandBus,
    @inject(TYPES.IQueryBus)
    private readonly queryBus: IQueryBus
  ) {}

  /**
   * @swagger
   * /api/libro-mayor-oficon/generar-reporte:
   *   get:
   *     summary: Generar reporte de Libro Mayor OFICON (Query Bus)
   *     description: Genera un reporte de libro mayor OFICON utilizando el stored procedure SP_TXMVTO_CNTB_Q13 con valores fijos
   *     tags: [Libro Mayor OFICON]
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
   *         example: 10
   *       - in: query
   *         name: ISCO_MONE
   *         required: true
   *         schema:
   *           type: string
   *           enum: [SOL, DOL]
   *         description: Código moneda - SOL o DOL
   *         example: "SOL"
   *       - in: query
   *         name: ISTI_REPO
   *         required: true
   *         schema:
   *           type: string
   *           enum: [CUD, COD, CVD, CFD, CUR, COR, CVR, CFR]
   *         description: |
   *           Tipo de reporte - Parámetro de dos tipos:
   *           1. INFORMACIÓN ANALÍTICA: CUD, COD, CVD, CFD
   *           2. INFORMACIÓN RESUMEN: CUR, COR, CVR, CFR
   *         example: "CUR"
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LibroMayorOficonResponse'
   *             examples:
   *               resumen:
   *                 summary: Respuesta Resumen
   *                 value:
   *                   success: true
   *                   data:
   *                     - NU_MESE_QUIE: 1
   *                       CO_CNTA_EMPR: "110101"
   *                       DE_CNTA_EMPR: "CAJA GENERAL"
   *                       TO_CARG: 1000.00
   *                       TO_ABON: 500.00
   *                       IM_DEBE: 1000.00
   *                       IM_HABE: 500.00
   *                   totalRecords: 1
   *                   tipoReporte: "RESUMEN"
   *                   message: "Reporte de libro mayor OFICON generado exitosamente. Total de registros: 1"
   *               analitico:
   *                 summary: Respuesta Analítica
   *                 value:
   *                   success: true
   *                   data:
   *                     - NU_MESE_QUIE: 1
   *                       CO_CNTA_EMPR: "110101"
   *                       DE_CNTA_EMPR: "CAJA GENERAL"
   *                       TO_CARG: 1000.00
   *                       TO_ABON: 500.00
   *                       NU_MESE: 1
   *                       FE_ASTO_CNTB: "01/01/2024"
   *                       NU_SECU: 1
   *                       CN_CNTB_EMP1: "110101"
   *                       TI_AUXI_EMPR: "CLI"
   *                       CO_AUXI_EMPR: "001"
   *                       CO_UNID_CNTB: "001"
   *                       CO_OPRC_CNTB: "007"
   *                       NU_ASTO: 1
   *                       TI_DOCU: "FAC"
   *                       NU_DOCU: "001-001"
   *                       FE_DOCU: "01/01/2024"
   *                       IM_MVTO_ORIG: 1000.00
   *                       DE_GLOS: "Venta de productos"
   *                       IM_DEBE: 1000.00
   *                       IM_HABE: 0.00
   *                       CO_TABL_ORIG: "TAB001"
   *                       CO_CLAV_TAOR: "CLV001"
   *                       CAMPO: "CAMPO1"
   *                       CO_ORDE_SERV: "OS001"
   *                   totalRecords: 1
   *                   tipoReporte: "ANALITICO"
   *                   message: "Reporte de libro mayor OFICON generado exitosamente. Total de registros: 1"
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
   *                   example: "Faltan parámetros requeridos: ISCO_EMPR, INNU_ANNO, INNU_MESE_INIC, INNU_MESE_FINA, ISCO_MONE, ISTI_REPO"
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
  async generarReporteLibroMayorOficon(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const {
        ISCO_EMPR,
        INNU_ANNO,
        INNU_MESE_INIC,
        INNU_MESE_FINA,
        ISCO_MONE,
        ISTI_REPO,
      } = req.query;

      // Validar parámetros requeridos
      if (
        !ISCO_EMPR ||
        !INNU_ANNO ||
        !INNU_MESE_INIC ||
        !INNU_MESE_FINA ||
        !ISCO_MONE ||
        !ISTI_REPO
      ) {
        res.status(400).json({
          success: false,
          message:
            "Faltan parámetros requeridos: ISCO_EMPR, INNU_ANNO, INNU_MESE_INIC, INNU_MESE_FINA, ISCO_MONE, ISTI_REPO",
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
      const tiposAnalitico = ["CUD", "COD", "CVD", "CFD"];
      const tiposResumen = ["CUR", "COR", "CVR", "CFR"];
      const tiposValidos = [...tiposAnalitico, ...tiposResumen];

      if (!tiposValidos.includes(ISTI_REPO as string)) {
        res.status(400).json({
          success: false,
          message: `ISTI_REPO debe ser uno de los siguientes valores:
          1. INFORMACIÓN ANALÍTICA: CUD, COD, CVD, CFD
          2. INFORMACIÓN RESUMEN: CUR, COR, CVR, CFR
          Valor recibido: ${ISTI_REPO}`,
        });
        return;
      }

      // Validar ISCO_MONE
      if (!["SOL", "DOL"].includes(ISCO_MONE as string)) {
        res.status(400).json({
          success: false,
          message: "ISCO_MONE debe ser 'SOL' o 'DOL'",
        });
        return;
      }

      // Crear request object
      const request: LibroMayorOficonRequest = {
        ISCO_EMPR: ISCO_EMPR as string,
        INNU_ANNO: anno,
        INNU_MESE_INIC: mesInic,
        INNU_MESE_FINA: mesFina,
        ISCO_MONE: ISCO_MONE as string,
        ISTI_REPO: ISTI_REPO as string,
      };

      // Usar query bus para obtener datos
      const data = (await this.queryBus.execute(
        new GetLibroMayorOficonQuery(request)
      )) as LibroMayorOficon[];

      const response: LibroMayorOficonResponse = {
        success: true,
        data,
        totalRecords: data.length,
        tipoReporte: tiposResumen.includes(ISTI_REPO as string)
          ? "RESUMEN"
          : "ANALITICO",
        message: `Reporte de libro mayor OFICON generado exitosamente. Total de registros: ${data.length}`,
      };

      res.json(response);
    } catch (error) {
      console.error(
        "Error en LibroMayorOficonController.generarReporteLibroMayorOficon:",
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
