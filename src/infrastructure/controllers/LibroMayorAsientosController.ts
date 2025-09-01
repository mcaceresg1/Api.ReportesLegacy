import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ILibroMayorAsientosService } from '../../domain/services/ILibroMayorAsientosService';
import { FiltrosLibroMayorAsientos } from '../../domain/entities/LibroMayorAsientos';

@injectable()
export class LibroMayorAsientosController {
  constructor(
    @inject('ILibroMayorAsientosService')
    private readonly libroMayorAsientosService: ILibroMayorAsientosService
  ) {}

  async obtenerFiltros(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es obligatorio'
        });
        return;
      }

      const resultado = await this.libroMayorAsientosService.obtenerFiltros(conjunto);
      res.json(resultado);
    } catch (error) {
      console.error('Error en obtenerFiltros:', error);
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
      const filtros: FiltrosLibroMayorAsientos = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es obligatorio'
        });
        return;
      }

      // Convertir parámetros de query a tipos correctos
      if (filtros.page && typeof filtros.page === 'string') {
        filtros.page = parseInt(filtros.page);
      }
      if (filtros.limit && typeof filtros.limit === 'string') {
        filtros.limit = parseInt(filtros.limit);
      }
      if (filtros.clases_asiento && typeof filtros.clases_asiento === 'string') {
        filtros.clases_asiento = (filtros.clases_asiento as string).split(',');
      }
      if (filtros.origen && typeof filtros.origen === 'string') {
        filtros.origen = (filtros.origen as string).split(',');
      }

      const datos = await this.libroMayorAsientosService.obtener(conjunto, filtros);

      res.json({
        success: true,
        data: datos,
        pagination: {
          page: filtros.page || 1,
          limit: filtros.limit || 1000,
          total: datos.length,
          totalPages: Math.ceil(datos.length / (filtros.limit || 1000)),
          hasNext: false,
          hasPrev: false
        },
        message: 'Reporte generado exitosamente'
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

  async obtenerAsientos(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros: FiltrosLibroMayorAsientos = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es obligatorio'
        });
        return;
      }

      // Convertir parámetros de query a tipos correctos
      if (filtros.page && typeof filtros.page === 'string') {
        filtros.page = parseInt(filtros.page);
      }
      if (filtros.limit && typeof filtros.limit === 'string') {
        filtros.limit = parseInt(filtros.limit);
      }
      if (filtros.clases_asiento && typeof filtros.clases_asiento === 'string') {
        filtros.clases_asiento = (filtros.clases_asiento as string).split(',');
      }
      if (filtros.origen && typeof filtros.origen === 'string') {
        filtros.origen = (filtros.origen as string).split(',');
      }

      const datos = await this.libroMayorAsientosService.obtener(conjunto, filtros);

      res.json({
        success: true,
        data: datos,
        pagination: {
          page: filtros.page || 1,
          limit: filtros.limit || 1000,
          total: datos.length,
          totalPages: Math.ceil(datos.length / (filtros.limit || 1000)),
          hasNext: false,
          hasPrev: false
        },
        message: 'Datos obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en obtenerAsientos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros: FiltrosLibroMayorAsientos = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es obligatorio'
        });
        return;
      }

      // Convertir parámetros de query a tipos correctos
      if (filtros.clases_asiento && typeof filtros.clases_asiento === 'string') {
        filtros.clases_asiento = (filtros.clases_asiento as string).split(',');
      }
      if (filtros.origen && typeof filtros.origen === 'string') {
        filtros.origen = (filtros.origen as string).split(',');
      }

      const excelBuffer = await this.libroMayorAsientosService.exportarExcel(conjunto, filtros);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="libro-mayor-asientos-${conjunto}-${new Date().toISOString().split('T')[0]}.xlsx"`);
      res.setHeader('Content-Length', excelBuffer.length);

      res.send(excelBuffer);
    } catch (error) {
      console.error('Error en exportarExcel:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async exportarPDF(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros: FiltrosLibroMayorAsientos = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es obligatorio'
        });
        return;
      }

      // Convertir parámetros de query a tipos correctos
      if (filtros.clases_asiento && typeof filtros.clases_asiento === 'string') {
        filtros.clases_asiento = (filtros.clases_asiento as string).split(',');
      }
      if (filtros.origen && typeof filtros.origen === 'string') {
        filtros.origen = (filtros.origen as string).split(',');
      }

      const pdfBuffer = await this.libroMayorAsientosService.exportarPDF(conjunto, filtros);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="libro-mayor-asientos-${conjunto}-${new Date().toISOString().split('T')[0]}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);

      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error en exportarPDF:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
