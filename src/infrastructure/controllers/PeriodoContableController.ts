import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IPeriodoContableRepository } from '../../domain/repositories/IPeriodoContableRepository';
import { FiltroPeriodoContable } from '../../domain/entities/PeriodoContable';

@injectable()
export class PeriodoContableController {
  constructor(
    @inject('IPeriodoContableRepository') private periodoContableRepository: IPeriodoContableRepository
  ) {}

  async obtenerCentrosCosto(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const centrosCosto = await this.periodoContableRepository.obtenerCentrosCosto(conjunto);

      res.json({
        success: true,
        data: centrosCosto,
        message: 'Centros de costo obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en obtenerCentrosCosto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async obtenerPeriodosContables(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const periodosContables = await this.periodoContableRepository.obtenerPeriodosContables(conjunto);

      res.json({
        success: true,
        data: periodosContables,
        message: 'Periodos contables obtenidos exitosamente',
        total: periodosContables.length
      });
    } catch (error) {
      console.error('Error en obtenerPeriodosContables:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const filtros: FiltroPeriodoContable = {
        conjunto,
        centro_costo: req.body.centro_costo,
        fechaDesde: req.body.fechaDesde,
        fechaHasta: req.body.fechaHasta,
        saldosAntesCierre: req.body.saldosAntesCierre || false,
        SoloCuentasMovimientos: req.body.SoloCuentasMovimientos || false
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      if (!filtros.fechaDesde || !filtros.fechaHasta) {
        res.status(400).json({
          success: false,
          message: 'Las fechas desde y hasta son requeridas'
        });
        return;
      }

      const reporte = await this.periodoContableRepository.generarReporte(filtros);

      res.json({
        success: true,
        data: reporte,
        message: 'Reporte generado exitosamente',
        total: reporte.length
      });
    } catch (error) {
      console.error('Error en generarReporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
