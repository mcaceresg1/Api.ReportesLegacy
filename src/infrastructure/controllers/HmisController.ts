import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IReporteHmisService } from "../../domain/services/IReporteHmisService";
import { hmisDatabases } from "../../infrastructure/database/config/hmis-database";

@injectable()
export class HmisController {
  constructor(
    @inject("IReporteHmisService")
    private readonly hmisService: IReporteHmisService
  ) {}
/**
 * @swagger
 * /api/reporte-hmis/{dbAlias}/contratos/{contrato}:
 *   get:
 *     tags:
 *       - HMIS - Reporte por Contrato
 *     summary: Obtener contrato por ID desde HMIS
 *     description: >
 *       Consulta los detalles de un contrato específico desde la base de datos HMIS,
 *       incluyendo cabecera, información del contrato, comisionistas, claims y comentarios relacionados.
 *     parameters:
 *       - in: path
 *         name: dbAlias
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - bdhmis
 *             - bdhmis1
 *         description: Alias de la base de datos HMIS
 *       - in: path
 *         name: contrato
 *         required: true
 *         schema:
 *           type: string
 *         description: Número del contrato a consultar
 *     responses:
 *       200:
 *         description: Consulta exitosa
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
 *                   example: Consulta exitosa
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HmisReporte'
 *       400:
 *         description: Parámetros inválidos (por ejemplo, alias de BD incorrecto)
 *       404:
 *         description: Contrato no encontrado en la base de datos
 *       500:
 *         description: Error interno del servidor
 *
 * components:
 *   schemas:
 *     HmisReporte:
 *       type: object
 *       properties:
 *         CabeceraContratoHmis:
 *           $ref: '#/components/schemas/CabeceraContratoHmis'
 *         HmisContrato:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               InformacionContrato:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/InformacionContratoConDetalles'
 *
 *     CabeceraContratoHmis:
 *       type: object
 *       properties:
 *         salesContractNumber:
 *           type: string
 *           example: "CN123456"
 *         primaryFullName:
 *           type: string
 *           example: "Juan Pérez"
 *         batchId:
 *           type: integer
 *           example: 101
 *         active:
 *           type: boolean
 *           example: true
 *         guaranteedOwnership:
 *           type: boolean
 *           example: false
 *         planEffectiveDate:
 *           type: string
 *           format: date
 *           example: "2023-01-15"
 *         batchNumber:
 *           type: string
 *           example: "B202301"
 *         posted:
 *           type: boolean
 *           example: true
 *
 *     InformacionContratoConDetalles:
 *       allOf:
 *         - $ref: '#/components/schemas/InformacionContrato'
 *         - type: object
 *           properties:
 *             Comisionista:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comisionista'
 *             Claims:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Claims'
 *             ComentarioLink:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ComentarioLink'
 *
 *     InformacionContrato:
 *       type: object
 *       properties:
 *         sales_id:
 *           type: integer
 *           example: 7890
 *         Sales_Contract_Nbr:
 *           type: string
 *           example: "CN123456"
 *         Sale_Dt:
 *           type: string
 *           format: date
 *           example: "2023-01-01"
 *         Location_Cd:
 *           type: string
 *           example: "LOC001"
 *         Sales_Status_Cd:
 *           type: string
 *           example: "Active"
 *         Sales_Type_Cd:
 *           type: string
 *           example: "Retail"
 *         Sales_Need_Type_Cd:
 *           type: string
 *           example: "New"
 *         Lead_Src_Cd:
 *           type: string
 *           example: "Online"
 *         Currency_Cd:
 *           type: string
 *           example: "USD"
 *         Descr_01:
 *           type: string
 *           example: "Descripción 1"
 *         Descr_02:
 *           type: string
 *           example: "Descripción 2"
 *         Descr_03:
 *           type: string
 *           example: "Descripción 3"
 *         Fund_Location_Group_Cd:
 *           type: string
 *           example: "FLG001"
 *         Product_Location_Group_Cd:
 *           type: string
 *           example: "PLG002"
 *         Qualified_For_Case_Volume:
 *           type: boolean
 *           example: true
 *         pre_printed_contract_nbr:
 *           type: string
 *           example: "PRE123"
 *
 *     Comisionista:
 *       type: object
 *       properties:
 *         Name:
 *           type: string
 *           example: "Comisionista Nombre"
 *         No:
 *           type: string
 *           example: "12345"
 *
 *     Claims:
 *       type: object
 *       properties:
 *         Due_Dt:
 *           type: string
 *           format: date
 *           example: "2023-02-15"
 *         Sales_ID:
 *           type: integer
 *           example: 7890
 *         claim_cd:
 *           type: string
 *           example: "CLM001"
 *         Reference_Nbr:
 *           type: string
 *           example: "REF789"
 *         Amt:
 *           type: number
 *           format: float
 *           example: 1500.75
 *         Amt_Received:
 *           type: number
 *           format: float
 *           example: 1000.50
 *         Received_Dt:
 *           type: string
 *           format: date
 *           example: "2023-02-20"
 *         Last_Update_Dt:
 *           type: string
 *           format: date-time
 *           example: "2023-02-25T15:30:00Z"
 *         Update_User_ID:
 *           type: string
 *           example: "user123"
 *
 *     ComentarioLink:
 *       type: object
 *       properties:
 *         object_id:
 *           type: integer
 *           example: 456
 *         Object_Nbr:
 *           type: string
 *           example: "CN123456"
 *         Object_type_cd:
 *           type: string
 *           example: "Sales"
 *         Primary_Name_sort:
 *           type: string
 *           example: "Perez, Juan"
 *         Name_ID:
 *           type: integer
 *           example: 789
 *         AUDFlag:
 *           type: integer
 *           example: 1
 */


  async obtenerContratoPorId(req: Request, res: Response): Promise<void> {
    try {
      const dbAlias = req.params["dbAlias"];
      const contrato = req.params["contrato"];

      if (!dbAlias || !(dbAlias in hmisDatabases)) {
        res.status(400).json({ success: false, message: "dbAlias no válida", data: null });
        return;
      }
      if (!contrato) {
        res.status(400).json({ success: false, message: 'Parámetro "contrato" es requerido', data: null });
        return;
      }

      const data = await this.hmisService.obtenerContratos(
  
        dbAlias as keyof typeof hmisDatabases,contrato
      );

      if (!data || data.length === 0) {
        res.status(404).json({ success: false, message: "Contrato no encontrado", data: null });
        return;
      }

      res.json({ success: true, message: "Consulta exitosa", data });
    } catch (error) {
      console.error("❌ Error en HmisController.obtenerContratoPorId:", error);
      res.status(500).json({
        success: false,
        message: "Error interno",
        error: error instanceof Error ? error.message : "Error desconocido",
        data: null,
      });
    }
  }
}
