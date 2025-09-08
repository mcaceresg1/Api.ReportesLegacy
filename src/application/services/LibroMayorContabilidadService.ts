import { injectable, inject } from 'inversify';
import { ILibroMayorContabilidadService } from '../../domain/services/ILibroMayorContabilidadService';
import { ILibroMayorContabilidadRepository } from '../../domain/repositories/ILibroMayorContabilidadRepository';
import { 
  LibroMayorContabilidad, 
  FiltrosLibroMayorContabilidad, 
  CuentaContableInfo, 
  PeriodoContableInfo 
} from '../../domain/entities/LibroMayorContabilidad';

@injectable()
export class LibroMayorContabilidadService implements ILibroMayorContabilidadService {
  constructor(
    @inject('ILibroMayorContabilidadRepository') 
    private libroMayorContabilidadRepository: ILibroMayorContabilidadRepository
  ) {}

  async obtenerCuentasContables(conjunto: string): Promise<CuentaContableInfo[]> {
    try {
      return await this.libroMayorContabilidadRepository.obtenerCuentasContables(conjunto);
    } catch (error) {
      console.error('Error en LibroMayorContabilidadService.obtenerCuentasContables:', error);
      throw error;
    }
  }

  async obtenerPeriodosContables(conjunto: string): Promise<PeriodoContableInfo[]> {
    try {
      return await this.libroMayorContabilidadRepository.obtenerPeriodosContables(conjunto);
    } catch (error) {
      console.error('Error en LibroMayorContabilidadService.obtenerPeriodosContables:', error);
      throw error;
    }
  }

  async generarReporte(filtros: FiltrosLibroMayorContabilidad): Promise<LibroMayorContabilidad[]> {
    try {
      // Validar filtros requeridos
      if (!filtros.conjunto) {
        throw new Error('El conjunto es requerido');
      }
      if (!filtros.fechaDesde) {
        throw new Error('La fecha desde es requerida');
      }
      if (!filtros.fechaHasta) {
        throw new Error('La fecha hasta es requerida');
      }

      return await this.libroMayorContabilidadRepository.generarReporte(filtros);
    } catch (error) {
      console.error('Error en LibroMayorContabilidadService.generarReporte:', error);
      throw error;
    }
  }

  async obtenerLibroMayorContabilidad(filtros: FiltrosLibroMayorContabilidad): Promise<{
    data: LibroMayorContabilidad[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    try {
      // Validar filtros requeridos
      if (!filtros.conjunto) {
        throw new Error('El conjunto es requerido');
      }
      if (!filtros.fechaDesde) {
        throw new Error('La fecha desde es requerida');
      }
      if (!filtros.fechaHasta) {
        throw new Error('La fecha hasta es requerida');
      }

      return await this.libroMayorContabilidadRepository.obtenerLibroMayorContabilidad(filtros);
    } catch (error) {
      console.error('Error en LibroMayorContabilidadService.obtenerLibroMayorContabilidad:', error);
      throw error;
    }
  }

  async exportarExcel(filtros: FiltrosLibroMayorContabilidad): Promise<Buffer> {
    try {
      // Validar filtros requeridos
      if (!filtros.conjunto) {
        throw new Error('El conjunto es requerido');
      }
      if (!filtros.fechaDesde) {
        throw new Error('La fecha desde es requerida');
      }
      if (!filtros.fechaHasta) {
        throw new Error('La fecha hasta es requerida');
      }

      return await this.libroMayorContabilidadRepository.exportarExcel(filtros);
    } catch (error) {
      console.error('Error en LibroMayorContabilidadService.exportarExcel:', error);
      throw error;
    }
  }

  async exportarPDF(filtros: FiltrosLibroMayorContabilidad): Promise<Buffer> {
    try {
      // Validar filtros requeridos
      if (!filtros.conjunto) {
        throw new Error('El conjunto es requerido');
      }
      if (!filtros.fechaDesde) {
        throw new Error('La fecha desde es requerida');
      }
      if (!filtros.fechaHasta) {
        throw new Error('La fecha hasta es requerida');
      }

      return await this.libroMayorContabilidadRepository.exportarPDF(filtros);
    } catch (error) {
      console.error('Error en LibroMayorContabilidadService.exportarPDF:', error);
      throw error;
    }
  }
}
