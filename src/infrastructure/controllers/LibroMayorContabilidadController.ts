import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { ICommandBus } from '../../domain/cqrs/ICommandBus';
import { IQueryBus } from '../../domain/cqrs/IQueryBus';
import { ILibroMayorContabilidadService } from '../../domain/services/ILibroMayorContabilidadService';
import { 
  GenerarReporteLibroMayorCommand,
  LimpiarReporteLibroMayorCommand 
} from '../../application/commands/libroMayorContabilidad';
import { 
  GetLibroMayorContabilidadQuery,
  GetLibroMayorContabilidadByIdQuery,
  GetLibroMayorContabilidadByFiltrosQuery,
  GetLibroMayorContabilidadByCuentaContableQuery,
  GetLibroMayorContabilidadByCentroCostoQuery,
  GetLibroMayorContabilidadByFechaRangeQuery,
  GetLibroMayorContabilidadByAsientoQuery,
  GetLibroMayorContabilidadByNITQuery,
  GetSaldosPorCuentaQuery,
  GetSaldosPorCentroCostoQuery,
  GetResumenPorPeriodoQuery
} from '../../application/queries/libroMayorContabilidad';
import { 
  LibroMayorContabilidadResponseDto,
  LibroMayorContabilidadSingleResponseDto,
  GenerarReporteRequestDto,
  GenerarReporteResponseDto,
  LimpiarReporteRequestDto,
  LimpiarReporteResponseDto,
  FiltrosRequestDto,
  LibroMayorContabilidadPagedResponseDto
} from '../../domain/dto/LibroMayorContabilidadDto';

@injectable()
export class LibroMayorContabilidadController {
  constructor(
    @inject(TYPES.CommandBus)
    private readonly commandBus: ICommandBus,
    @inject(TYPES.QueryBus)
    private readonly queryBus: IQueryBus,
    @inject(TYPES.LibroMayorContabilidadService)
    private readonly libroMayorContabilidadService: ILibroMayorContabilidadService
  ) {}

  // Métodos básicos CRUD
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const librosMayor = await this.libroMayorContabilidadService.getAllLibrosMayor();
      
      const response: LibroMayorContabilidadResponseDto = {
        success: true,
        message: 'Libros Mayor de Contabilidad obtenidos exitosamente',
        data: librosMayor,
        total: librosMayor.length
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error en getAll:', error);
      const response: LibroMayorContabilidadResponseDto = {
        success: false,
        message: 'Error al obtener los Libros Mayor de Contabilidad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
      res.status(500).json(response);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const response: LibroMayorContabilidadSingleResponseDto = {
          success: false,
          message: 'ID inválido',
          error: 'El ID debe ser un número válido'
        };
        res.status(400).json(response);
        return;
      }

      const libroMayor = await this.libroMayorContabilidadService.getLibroMayorById(id);
      
      if (!libroMayor) {
        const response: LibroMayorContabilidadSingleResponseDto = {
          success: false,
          message: 'Libro Mayor de Contabilidad no encontrado',
          error: `No se encontró el registro con ID ${id}`
        };
        res.status(404).json(response);
        return;
      }

      const response: LibroMayorContabilidadSingleResponseDto = {
        success: true,
        message: 'Libro Mayor de Contabilidad obtenido exitosamente',
        data: libroMayor
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error en getById:', error);
      const response: LibroMayorContabilidadSingleResponseDto = {
        success: false,
        message: 'Error al obtener el Libro Mayor de Contabilidad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
      res.status(500).json(response);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const libroMayorData = req.body;
      const libroMayor = await this.libroMayorContabilidadService.createLibroMayor(libroMayorData);
      
      const response: LibroMayorContabilidadSingleResponseDto = {
        success: true,
        message: 'Libro Mayor de Contabilidad creado exitosamente',
        data: libroMayor
      };
      
      res.status(201).json(response);
    } catch (error) {
      console.error('Error en create:', error);
      const response: LibroMayorContabilidadSingleResponseDto = {
        success: false,
        message: 'Error al crear el Libro Mayor de Contabilidad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
      res.status(500).json(response);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const response: LibroMayorContabilidadSingleResponseDto = {
          success: false,
          message: 'ID inválido',
          error: 'El ID debe ser un número válido'
        };
        res.status(400).json(response);
        return;
      }

      const libroMayorData = req.body;
      const libroMayor = await this.libroMayorContabilidadService.updateLibroMayor(id, libroMayorData);
      
      const response: LibroMayorContabilidadSingleResponseDto = {
        success: true,
        message: 'Libro Mayor de Contabilidad actualizado exitosamente',
        data: libroMayor
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error en update:', error);
      const response: LibroMayorContabilidadSingleResponseDto = {
        success: false,
        message: 'Error al actualizar el Libro Mayor de Contabilidad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
      res.status(500).json(response);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        const response: LibroMayorContabilidadSingleResponseDto = {
          success: false,
          message: 'ID inválido',
          error: 'El ID debe ser un número válido'
        };
        res.status(400).json(response);
        return;
      }

      const deleted = await this.libroMayorContabilidadService.deleteLibroMayor(id);
      
      if (!deleted) {
        const response: LibroMayorContabilidadSingleResponseDto = {
          success: false,
          message: 'Libro Mayor de Contabilidad no encontrado',
          error: `No se encontró el registro con ID ${id}`
        };
        res.status(404).json(response);
        return;
      }

      const response: LibroMayorContabilidadSingleResponseDto = {
        success: true,
        message: 'Libro Mayor de Contabilidad eliminado exitosamente'
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error en delete:', error);
      const response: LibroMayorContabilidadSingleResponseDto = {
        success: false,
        message: 'Error al eliminar el Libro Mayor de Contabilidad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
      res.status(500).json(response);
    }
  }

  // Métodos específicos del negocio
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { usuario, filtros, fechaInicial, fechaFinal }: GenerarReporteRequestDto = req.body;
      
      if (!usuario || !filtros || !fechaInicial || !fechaFinal) {
        const response: GenerarReporteResponseDto = {
          success: false,
          message: 'Datos incompletos',
          error: 'Se requieren usuario, filtros, fechaInicial y fechaFinal'
        };
        res.status(400).json(response);
        return;
      }

      const command = new GenerarReporteLibroMayorCommand(usuario, filtros, fechaInicial, fechaFinal);
      const resultado = await this.commandBus.execute(command);
      
      const response: GenerarReporteResponseDto = {
        success: true,
        message: 'Reporte generado exitosamente',
        data: resultado
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error en generarReporte:', error);
      const response: GenerarReporteResponseDto = {
        success: false,
        message: 'Error al generar el reporte',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
      res.status(500).json(response);
    }
  }

  async limpiarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { usuario }: LimpiarReporteRequestDto = req.body;
      
      if (!usuario) {
        const response: LimpiarReporteResponseDto = {
          success: false,
          message: 'Usuario requerido',
          error: 'Se requiere el usuario para limpiar el reporte'
        };
        res.status(400).json(response);
        return;
      }

      const command = new LimpiarReporteLibroMayorCommand(usuario);
      const resultado = await this.commandBus.execute(command);
      
      const response: LimpiarReporteResponseDto = {
        success: true,
        message: 'Reporte limpiado exitosamente',
        data: resultado
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error en limpiarReporte:', error);
      const response: LimpiarReporteResponseDto = {
        success: false,
        message: 'Error al limpiar el reporte',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
      res.status(500).json(response);
    }
  }

  async obtenerReporteGenerado(req: Request, res: Response): Promise<void> {
    try {
      const { usuario } = req.query;
      
      if (!usuario || typeof usuario !== 'string') {
        const response: LibroMayorContabilidadResponseDto = {
          success: false,
          message: 'Usuario requerido',
          error: 'Se requiere el usuario como parámetro de consulta'
        };
        res.status(400).json(response);
        return;
      }

      const librosMayor = await this.libroMayorContabilidadService.obtenerReporteGenerado(usuario);
      
      const response: LibroMayorContabilidadResponseDto = {
        success: true,
        message: 'Reporte generado obtenido exitosamente',
        data: librosMayor,
        total: librosMayor.length
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error en obtenerReporteGenerado:', error);
      const response: LibroMayorContabilidadResponseDto = {
        success: false,
        message: 'Error al obtener el reporte generado',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
      res.status(500).json(response);
    }
  }

  // Métodos de consulta con filtros
  async getByFiltros(req: Request, res: Response): Promise<void> {
    try {
      const { filtros }: FiltrosRequestDto = req.body;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      
      if (!filtros) {
        const response: LibroMayorContabilidadPagedResponseDto = {
          success: false,
          message: 'Filtros requeridos',
          error: 'Se requieren los filtros para la consulta'
        };
        res.status(400).json(response);
        return;
      }

      const query = new GetLibroMayorContabilidadByFiltrosQuery(filtros, page, limit);
      const resultado = await this.queryBus.execute(query);
      
      const response: LibroMayorContabilidadPagedResponseDto = {
        success: true,
        message: 'Libros Mayor de Contabilidad obtenidos exitosamente',
        data: resultado.data,
        pagination: {
          page: resultado.page,
          limit: resultado.limit,
          total: resultado.total
        }
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error en getByFiltros:', error);
      const response: LibroMayorContabilidadPagedResponseDto = {
        success: false,
        message: 'Error al obtener los Libros Mayor de Contabilidad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
      res.status(500).json(response);
    }
  }

  // Métodos de consulta específicos
  async getByCuentaContable(req: Request, res: Response): Promise<void> {
    try {
      const { cuentaContable } = req.params;
      
      if (!cuentaContable) {
        const response: LibroMayorContabilidadResponseDto = {
          success: false,
          message: 'Cuenta contable requerida',
          error: 'Se requiere la cuenta contable como parámetro'
        };
        res.status(400).json(response);
        return;
      }

      const query = new GetLibroMayorContabilidadByCuentaContableQuery(cuentaContable);
      const librosMayor = await this.queryBus.execute(query);
      
      const response: LibroMayorContabilidadResponseDto = {
        success: true,
        message: 'Libros Mayor de Contabilidad obtenidos exitosamente',
        data: librosMayor,
        total: librosMayor.length
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error en getByCuentaContable:', error);
      const response: LibroMayorContabilidadResponseDto = {
        success: false,
        message: 'Error al obtener los Libros Mayor de Contabilidad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
      res.status(500).json(response);
    }
  }

  async getByCentroCosto(req: Request, res: Response): Promise<void> {
    try {
      const { centroCosto } = req.params;
      
      if (!centroCosto) {
        const response: LibroMayorContabilidadResponseDto = {
          success: false,
          message: 'Centro de costo requerido',
          error: 'Se requiere el centro de costo como parámetro'
        };
        res.status(400).json(response);
        return;
      }

      const query = new GetLibroMayorContabilidadByCentroCostoQuery(centroCosto);
      const librosMayor = await this.queryBus.execute(query);
      
      const response: LibroMayorContabilidadResponseDto = {
        success: true,
        message: 'Libros Mayor de Contabilidad obtenidos exitosamente',
        data: librosMayor,
        total: librosMayor.length
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error en getByCentroCosto:', error);
      const response: LibroMayorContabilidadResponseDto = {
        success: false,
        message: 'Error al obtener los Libros Mayor de Contabilidad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
      res.status(500).json(response);
    }
  }

  async getByFechaRange(req: Request, res: Response): Promise<void> {
    try {
      const { fechaInicial, fechaFinal } = req.query;
      
      if (!fechaInicial || !fechaFinal) {
        const response: LibroMayorContabilidadResponseDto = {
          success: false,
          message: 'Fechas requeridas',
          error: 'Se requieren fechaInicial y fechaFinal como parámetros'
        };
        res.status(400).json(response);
        return;
      }

      const query = new GetLibroMayorContabilidadByFechaRangeQuery(
        new Date(fechaInicial as string),
        new Date(fechaFinal as string)
      );
      const librosMayor = await this.queryBus.execute(query);
      
      const response: LibroMayorContabilidadResponseDto = {
        success: true,
        message: 'Libros Mayor de Contabilidad obtenidos exitosamente',
        data: librosMayor,
        total: librosMayor.length
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error en getByFechaRange:', error);
      const response: LibroMayorContabilidadResponseDto = {
        success: false,
        message: 'Error al obtener los Libros Mayor de Contabilidad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
      res.status(500).json(response);
    }
  }

  async getByAsiento(req: Request, res: Response): Promise<void> {
    try {
      const { asiento } = req.params;
      
      if (!asiento) {
        const response: LibroMayorContabilidadResponseDto = {
          success: false,
          message: 'Asiento requerido',
          error: 'Se requiere el asiento como parámetro'
        };
        res.status(400).json(response);
        return;
      }

      const query = new GetLibroMayorContabilidadByAsientoQuery(asiento);
      const librosMayor = await this.queryBus.execute(query);
      
      const response: LibroMayorContabilidadResponseDto = {
        success: true,
        message: 'Libros Mayor de Contabilidad obtenidos exitosamente',
        data: librosMayor,
        total: librosMayor.length
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error en getByAsiento:', error);
      const response: LibroMayorContabilidadResponseDto = {
        success: false,
        message: 'Error al obtener los Libros Mayor de Contabilidad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
      res.status(500).json(response);
    }
  }

  async getByNIT(req: Request, res: Response): Promise<void> {
    try {
      const { nit } = req.params;
      
      if (!nit) {
        const response: LibroMayorContabilidadResponseDto = {
          success: false,
          message: 'NIT requerido',
          error: 'Se requiere el NIT como parámetro'
        };
        res.status(400).json(response);
        return;
      }

      const query = new GetLibroMayorContabilidadByNITQuery(nit);
      const librosMayor = await this.queryBus.execute(query);
      
      const response: LibroMayorContabilidadResponseDto = {
        success: true,
        message: 'Libros Mayor de Contabilidad obtenidos exitosamente',
        data: librosMayor,
        total: librosMayor.length
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error en getByNIT:', error);
      const response: LibroMayorContabilidadResponseDto = {
        success: false,
        message: 'Error al obtener los Libros Mayor de Contabilidad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
      res.status(500).json(response);
    }
  }

  // Métodos de agregación
  async getSaldosPorCuenta(req: Request, res: Response): Promise<void> {
    try {
      const { fechaInicial, fechaFinal } = req.query;
      
      if (!fechaInicial || !fechaFinal) {
        res.status(400).json({
          success: false,
          message: 'Fechas requeridas',
          error: 'Se requieren fechaInicial y fechaFinal como parámetros'
        });
        return;
      }

      const query = new GetSaldosPorCuentaQuery(
        new Date(fechaInicial as string),
        new Date(fechaFinal as string)
      );
      const saldos = await this.queryBus.execute(query);
      
      res.json({
        success: true,
        message: 'Saldos por cuenta obtenidos exitosamente',
        data: saldos
      });
    } catch (error) {
      console.error('Error en getSaldosPorCuenta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los saldos por cuenta',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getSaldosPorCentroCosto(req: Request, res: Response): Promise<void> {
    try {
      const { fechaInicial, fechaFinal } = req.query;
      
      if (!fechaInicial || !fechaFinal) {
        res.status(400).json({
          success: false,
          message: 'Fechas requeridas',
          error: 'Se requieren fechaInicial y fechaFinal como parámetros'
        });
        return;
      }

      const query = new GetSaldosPorCentroCostoQuery(
        new Date(fechaInicial as string),
        new Date(fechaFinal as string)
      );
      const saldos = await this.queryBus.execute(query);
      
      res.json({
        success: true,
        message: 'Saldos por centro de costo obtenidos exitosamente',
        data: saldos
      });
    } catch (error) {
      console.error('Error en getSaldosPorCentroCosto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los saldos por centro de costo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getResumenPorPeriodo(req: Request, res: Response): Promise<void> {
    try {
      const { fechaInicial, fechaFinal } = req.query;
      
      if (!fechaInicial || !fechaFinal) {
        res.status(400).json({
          success: false,
          message: 'Fechas requeridas',
          error: 'Se requieren fechaInicial y fechaFinal como parámetros'
        });
        return;
      }

      const query = new GetResumenPorPeriodoQuery(
        new Date(fechaInicial as string),
        new Date(fechaFinal as string)
      );
      const resumen = await this.queryBus.execute(query);
      
      res.json({
        success: true,
        message: 'Resumen por periodo obtenido exitosamente',
        data: resumen
      });
    } catch (error) {
      console.error('Error en getResumenPorPeriodo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el resumen por periodo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Métodos de exportación
  async exportarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { filtros } = req.body;
      const { formato } = req.query;
      
      if (!filtros) {
        res.status(400).json({
          success: false,
          message: 'Filtros requeridos',
          error: 'Se requieren los filtros para la exportación'
        });
        return;
      }

      if (!formato || typeof formato !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Formato requerido',
          error: 'Se requiere el formato como parámetro de consulta'
        });
        return;
      }

      const buffer = await this.libroMayorContabilidadService.exportarReporteLibroMayor(filtros, formato);
      
      const filename = `libro_mayor_contabilidad_${new Date().toISOString().split('T')[0]}.${formato.toLowerCase()}`;
      
      res.setHeader('Content-Type', this.getContentType(formato));
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Error en exportarReporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar el reporte',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  private getContentType(formato: string): string {
    switch (formato.toLowerCase()) {
      case 'csv':
        return 'text/csv';
      case 'json':
        return 'application/json';
      default:
        return 'application/octet-stream';
    }
  }
}
