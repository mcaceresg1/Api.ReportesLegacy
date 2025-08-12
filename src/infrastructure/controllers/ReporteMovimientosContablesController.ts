import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IReporteMovimientosContablesService } from '../../domain/services/IReporteMovimientosContablesService';

@injectable()
export class ReporteMovimientosContablesController {
  constructor(
    @inject('IReporteMovimientosContablesService') private service: IReporteMovimientosContablesService
  ) {}

  /**
   * @swagger
   * /api/reporte-movimientos-contables/{conjunto}:
   *   get:
   *     summary: Reporte de Movimientos Contables
   *     tags: [Reporte Movimientos Contables]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema: { type: string }
   *       - in: query
   *         name: usuario
   *         required: true
   *         schema: { type: string }
   *       - in: query
   *         name: fechaInicio
   *         required: true
   *         schema: { type: string, format: date-time }
   *       - in: query
   *         name: fechaFin
   *         required: true
   *         schema: { type: string, format: date-time }
   *       - in: query
   *         name: contabilidad
   *         required: false
   *         schema: { type: string, enum: [F, A, T] }
   *     responses:
   *       200:
   *         description: OK
   */
  async obtener(req: Request, res: Response): Promise<void> {
    try {
      const conjuntoParam = req.params['conjunto'];
      if (!conjuntoParam) {
        res.status(400).json({ success: false, message: 'conjunto requerido' });
        return;
      }
      const conjunto: string = conjuntoParam;

      const usuarioQ = req.query['usuario'] as string | undefined;
      const fechaInicioQ = req.query['fechaInicio'] as string | undefined;
      const fechaFinQ = req.query['fechaFin'] as string | undefined;
      const contabilidad = (req.query['contabilidad'] as 'F' | 'A' | 'T') || 'T';

      if (!usuarioQ || !fechaInicioQ || !fechaFinQ) {
        res.status(400).json({ success: false, message: 'usuario, fechaInicio y fechaFin son requeridos' });
        return;
      }

      const fechaInicio = new Date(fechaInicioQ);
      const fechaFin = new Date(fechaFinQ);
      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        res.status(400).json({ success: false, message: 'Fechas inválidas' });
        return;
      }

      const data = await this.service.obtener(conjunto, { usuario: usuarioQ, fechaInicio, fechaFin, contabilidad });
      res.json({ success: true, data, totalRegistros: data.length });
    } catch (error) {
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Error' });
    }
  }
}
