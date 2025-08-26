import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../container/types';
import { ILibroMayorAsientosService } from '../../domain/services/ILibroMayorAsientosService';
import { LibroMayorAsientosRequest } from '../../domain/entities/LibroMayorAsientos';

@injectable()
export class LibroMayorAsientosController {

  constructor(
    @inject(TYPES.ILibroMayorAsientosService)
    private readonly libroMayorAsientosService: ILibroMayorAsientosService
  ) {}

  /**
   * Obtiene los filtros disponibles (asientos y referencias)
   */
  async obtenerFiltros(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const resultado = await this.libroMayorAsientosService.obtenerFiltros(conjunto);
      
      if (resultado.success) {
        res.json(resultado);
      } else {
        res.status(500).json(resultado);
      }

    } catch (error) {
      console.error('Error en controlador al obtener filtros:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Genera el reporte de Libro Mayor Asientos
   */
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { asiento, referencia, page, limit } = req.query;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const request: LibroMayorAsientosRequest = {
        conjunto,
        asiento: asiento as string,
        referencia: referencia as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 25
      };

      const resultado = await this.libroMayorAsientosService.generarReporteAsientos(request);
      
      if (resultado.success) {
        res.json(resultado);
      } else {
        res.status(500).json(resultado);
      }

    } catch (error) {
      console.error('Error en controlador al generar reporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Obtiene los datos paginados del reporte
   */
  async obtenerAsientos(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { asiento, referencia, page, limit } = req.query;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const request: LibroMayorAsientosRequest = {
        conjunto,
        asiento: asiento as string,
        referencia: referencia as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 25
      };

      const resultado = await this.libroMayorAsientosService.obtenerAsientos(request);
      
      if (resultado.success) {
        res.json(resultado);
      } else {
        res.status(500).json(resultado);
      }

    } catch (error) {
      console.error('Error en controlador al obtener asientos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { asiento, referencia } = req.query;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const request: LibroMayorAsientosRequest = {
        conjunto,
        asiento: asiento as string,
        referencia: referencia as string
      };

      const buffer = await this.libroMayorAsientosService.exportarExcel(request);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=LibroMayorAsientos_${conjunto}.xlsx`);
      res.send(buffer);

    } catch (error) {
      console.error('Error en controlador al exportar Excel:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar a Excel',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Exporta el reporte a PDF
   */
  async exportarPDF(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { asiento, referencia } = req.query;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const request: LibroMayorAsientosRequest = {
        conjunto,
        asiento: asiento as string,
        referencia: referencia as string
      };

      const buffer = await this.libroMayorAsientosService.exportarPDF(request);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=LibroMayorAsientos_${conjunto}.pdf`);
      res.send(buffer);

    } catch (error) {
      console.error('Error en controlador al exportar PDF:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar a PDF',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
