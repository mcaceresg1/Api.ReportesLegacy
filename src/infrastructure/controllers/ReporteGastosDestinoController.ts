import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IReporteGastosDestinoRepository } from '../../domain/repositories/IReporteGastosDestinoRepository';

@injectable()
export class ReporteGastosDestinoController {
  constructor(
    @inject('IReporteGastosDestinoRepository') private repo: IReporteGastosDestinoRepository
  ) {}

  /**
   * @swagger
   * /api/reporte-gastos-destino/{conjunto}/generar:
   *   post:
   *     summary: Genera el reporte de gastos por clase destino
   *     tags: [Reporte Gastos Destino]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código de conjunto (esquema ASFSAC)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               fechaInicio:
   *                 type: string
   *                 format: date-time
   *               fechaFin:
   *                 type: string
   *                 format: date-time
   *     responses:
   *       200:
   *         description: Reporte generado
   *       400:
   *         description: Parámetros inválidos
   */
  async generar(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { fechaInicio, fechaFin } = req.body || {};

      if (!conjunto || !fechaInicio || !fechaFin) {
        res.status(400).json({ success: false, message: 'conjunto, fechaInicio y fechaFin son requeridos' });
        return;
      }

      const fi = new Date(fechaInicio);
      const ff = new Date(fechaFin);
      if (isNaN(fi.getTime()) || isNaN(ff.getTime())) {
        res.status(400).json({ success: false, message: 'fechas inválidas' });
        return;
      }

      await this.repo.generar(conjunto, fi, ff);
      res.json({ success: true, message: 'Reporte generado' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al generar reporte', error: error instanceof Error ? error.message : 'Error' });
    }
  }

  /**
   * @swagger
   * /api/reporte-gastos-destino/{conjunto}:
   *   get:
   *     summary: Lista resultados del reporte de gastos por clase destino
   *     tags: [Reporte Gastos Destino]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   */
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const limit = parseInt((req.query['limit'] as string) || '100', 10);
      const offset = parseInt((req.query['offset'] as string) || '0', 10);
      if (!conjunto) {
        res.status(400).json({ success: false, message: 'conjunto requerido' });
        return;
      }
      const result = await this.repo.listar(conjunto, limit, offset);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al listar reporte', error: error instanceof Error ? error.message : 'Error' });
    }
  }
}


