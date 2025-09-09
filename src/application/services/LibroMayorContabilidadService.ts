import { injectable, inject } from 'inversify';
import { ILibroMayorContabilidadRepository } from '../../domain/repositories/ILibroMayorContabilidadRepository';
import { ILibroMayorContabilidadService } from '../../domain/services/ILibroMayorContabilidadService';
import { 
  LibroMayorContabilidad, 
  FiltrosLibroMayorContabilidad, 
  CuentaContableInfo, 
  PeriodoContableInfo,
  TipoAsientoInfo,
  CentroCostoInfo,
  PaqueteInfo
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

  async obtenerTiposAsiento(conjunto: string): Promise<TipoAsientoInfo[]> {
    try {
      return await this.libroMayorContabilidadRepository.obtenerTiposAsiento(conjunto);
    } catch (error) {
      console.error('Error en LibroMayorContabilidadService.obtenerTiposAsiento:', error);
      throw error;
    }
  }

  async obtenerCentrosCosto(conjunto: string): Promise<CentroCostoInfo[]> {
    try {
      return await this.libroMayorContabilidadRepository.obtenerCentrosCosto(conjunto);
    } catch (error) {
      console.error('Error en LibroMayorContabilidadService.obtenerCentrosCosto:', error);
      throw error;
    }
  }

  async obtenerPaquetes(conjunto: string): Promise<PaqueteInfo[]> {
    try {
      return await this.libroMayorContabilidadRepository.obtenerPaquetes(conjunto);
    } catch (error) {
      console.error('Error en LibroMayorContabilidadService.obtenerPaquetes:', error);
      throw error;
    }
  }

  async generarReporte(filtros: FiltrosLibroMayorContabilidad): Promise<LibroMayorContabilidad[]> {
    try {
      // Validar filtros requeridos
      if (!filtros.conjunto) {
        throw new Error('El parámetro conjunto es requerido');
      }
      if (!filtros.fechaDesde || !filtros.fechaHasta) {
        throw new Error('Las fechas desde y hasta son requeridas');
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
        throw new Error('El parámetro conjunto es requerido');
      }
      if (!filtros.fechaDesde || !filtros.fechaHasta) {
        throw new Error('Las fechas desde y hasta son requeridas');
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
        throw new Error('El parámetro conjunto es requerido');
      }
      if (!filtros.fechaDesde || !filtros.fechaHasta) {
        throw new Error('Las fechas desde y hasta son requeridas');
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
        throw new Error('El parámetro conjunto es requerido');
      }
      if (!filtros.fechaDesde || !filtros.fechaHasta) {
        throw new Error('Las fechas desde y hasta son requeridas');
      }

      return await this.libroMayorContabilidadRepository.exportarPDF(filtros);
    } catch (error) {
      console.error('Error en LibroMayorContabilidadService.exportarPDF:', error);
      throw error;
    }
  }
}
