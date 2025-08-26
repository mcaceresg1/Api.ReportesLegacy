import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { ILibroMayorService } from '../../domain/services/ILibroMayorService';
import { LibroMayorFiltros } from '../../domain/entities/LibroMayor';

@injectable()
export class LibroMayorController {
  
  constructor(
    @inject('ILibroMayorService') private readonly libroMayorService: ILibroMayorService
  ) {}

  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, usuario, fechaInicio, fechaFin, cuentaContableDesde, cuentaContableHasta, saldoAntesCierre, page, limit } = req.body;

      // Validar parámetros requeridos
      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Faltan parámetros requeridos: conjunto, usuario, fechaInicio, fechaFin'
        });
        return;
      }

      const filtros: LibroMayorFiltros = {
        conjunto,
        usuario,
        fechaDesde: fechaInicio,
        fechaHasta: fechaFin,
        cuentaContableDesde,
        cuentaContableHasta,
        saldoAntesCierre,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 25
      };

      const resultado = await this.libroMayorService.generarReporte(filtros);
      
      res.json(resultado);

    } catch (error) {
      console.error('Error en LibroMayorController.generarReporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async obtenerLibroMayor(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, usuario, fechaInicio, fechaFin, cuentaContableDesde, cuentaContableHasta, saldoAntesCierre, page, limit } = req.query;

      // Validar parámetros requeridos
      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Faltan parámetros requeridos: conjunto, usuario, fechaInicio, fechaFin'
        });
        return;
      }

      const filtros: LibroMayorFiltros = {
        conjunto: conjunto as string,
        usuario: usuario as string,
        fechaDesde: fechaInicio as string,
        fechaHasta: fechaFin as string,
        cuentaContableDesde: cuentaContableDesde as string,
        cuentaContableHasta: cuentaContableHasta as string,
        saldoAntesCierre: saldoAntesCierre === 'true',
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 25
      };

      const resultado = await this.libroMayorService.obtenerLibroMayor(filtros);
      
      res.json(resultado);

    } catch (error) {
      console.error('Error en LibroMayorController.obtenerLibroMayor:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, usuario, fechaInicio, fechaFin, cuentaContableDesde, cuentaContableHasta, saldoAntesCierre } = req.query;

      // Validar parámetros requeridos
      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Faltan parámetros requeridos: conjunto, usuario, fechaInicio, fechaFin'
        });
        return;
      }

      const filtros: LibroMayorFiltros = {
        conjunto: conjunto as string,
        usuario: usuario as string,
        fechaDesde: fechaInicio as string,
        fechaHasta: fechaFin as string,
        cuentaContableDesde: cuentaContableDesde as string,
        cuentaContableHasta: cuentaContableHasta as string,
        saldoAntesCierre: saldoAntesCierre === 'true'
      };

      const buffer = await this.libroMayorService.exportarExcel(filtros);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=LibroMayor_${conjunto}_${fechaInicio}_${fechaFin}.xlsx`);
      res.send(buffer);

    } catch (error) {
      console.error('Error en LibroMayorController.exportarExcel:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async exportarPDF(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, usuario, fechaInicio, fechaFin, cuentaContableDesde, cuentaContableHasta, saldoAntesCierre } = req.query;

      // Validar parámetros requeridos
      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Faltan parámetros requeridos: conjunto, usuario, fechaInicio, fechaFin'
        });
        return;
      }

      const filtros: LibroMayorFiltros = {
        conjunto: conjunto as string,
        usuario: usuario as string,
        fechaDesde: fechaInicio as string,
        fechaHasta: fechaFin as string,
        cuentaContableDesde: cuentaContableDesde as string,
        cuentaContableHasta: cuentaContableHasta as string,
        saldoAntesCierre: saldoAntesCierre === 'true'
      };

      const buffer = await this.libroMayorService.exportarPDF(filtros);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=LibroMayor_${conjunto}_${fechaInicio}_${fechaFin}.pdf`);
      res.send(buffer);

    } catch (error) {
      console.error('Error en LibroMayorController.exportarPDF:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
