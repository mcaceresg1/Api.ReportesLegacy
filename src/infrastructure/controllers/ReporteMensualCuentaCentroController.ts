import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IReporteMensualCuentaCentroService } from '../../domain/services/IReporteMensualCuentaCentroService';

/**
 * @swagger
 * tags:
 *   - name: Reporte Mensual Cuenta-Centro
 *     description: Resumen mensual por cuenta contable y centro de costo
 * components:
 *   schemas:
 *     ReporteMensualCuentaCentroItem:
 *       type: object
 *       properties:
 *         cuentaContable: { type: string }
 *         descCuentaContable: { type: string }
 *         centroCosto: { type: string }
 *         descCentroCosto: { type: string }
 *         enero: { type: number }
 *         febrero: { type: number }
 *         marzo: { type: number }
 *         abril: { type: number }
 *         mayo: { type: number }
 *         junio: { type: number }
 *         julio: { type: number }
 *         agosto: { type: number }
 *         setiembre: { type: number }
 *         octubre: { type: number }
 *         noviembre: { type: number }
 *         diciembre: { type: number }
 *         mes1: { type: string, format: date }
 *         mes2: { type: string, format: date }
 *         mes3: { type: string, format: date }
 *         mes4: { type: string, format: date }
 *         mes5: { type: string, format: date }
 *         mes6: { type: string, format: date }
 *         mes7: { type: string, format: date }
 *         mes8: { type: string, format: date }
 *         mes9: { type: string, format: date }
 *         mes10: { type: string, format: date }
 *         mes11: { type: string, format: date }
 *         mes12: { type: string, format: date }
 */

@injectable()
export class ReporteMensualCuentaCentroController {
  constructor(
    @inject('IReporteMensualCuentaCentroService') private service: IReporteMensualCuentaCentroService
  ) {}

  /**
   * @swagger
   * /api/reporte-mensual-cuenta-centro/{conjunto}:
   *   get:
   *     summary: Obtiene resumen mensual por cuenta contable y centro de costo
   *     tags: [Reporte Mensual Cuenta-Centro]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema: { type: string }
   *       - in: query
   *         name: anio
   *         required: true
   *         schema: { type: integer }
   *       - in: query
   *         name: contabilidad
   *         required: false
   *         schema:
   *           type: string
   *           enum: [F, A]
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean }
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ReporteMensualCuentaCentroItem'
   *                 totalRegistros: { type: integer }
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtener(req: Request, res: Response): Promise<void> {
    try {
      const conjunto = req.params['conjunto'];
      const anioParam = req.query['anio'] as string;
      const contab = (req.query['contabilidad'] as 'F' | 'A' | undefined) || 'F';

      const anio = Number(anioParam);
      if (!conjunto || !anioParam || !Number.isInteger(anio)) {
        res.status(400).json({ success: false, message: 'conjunto y anio son requeridos' });
        return;
        }

      const data = await this.service.obtenerPorAnio(conjunto, anio, contab);
      res.json({ success: true, data, totalRegistros: data.length });
    } catch (error) {
      console.error('Error en ReporteMensualCuentaCentroController.obtener:', error);
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Error interno' });
    }
  }
}
