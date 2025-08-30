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
 *     description: Consulta un contrato específico desde la base de datos HMIS.
 *     parameters:
 *       - in: path
 *         name: dbAlias
 *         required: true
 *         schema:
 *           type: string
 *           enum: [bdhmis, bdhmis1]
 *         description: Alias de la base de datos HMIS
 *       - in: path
 *         name: contrato
 *         required: true
 *         schema:
 *           type: string
 *         description: Número del contrato
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
 *         description: Parámetros inválidos
 *       404:
 *         description: Contrato no encontrado
 *       500:
 *         description: Error interno del servidor
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
