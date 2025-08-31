import { ILibroMayorContabilidadService } from '../../domain/services/ILibroMayorContabilidadService';
import { ILibroMayorContabilidadRepository } from '../../domain/repositories/ILibroMayorContabilidadRepository';
import { LibroMayorContabilidad, FiltrosLibroMayorContabilidad } from '../../domain/entities/LibroMayorContabilidad';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';

@injectable()
export class LibroMayorContabilidadService implements ILibroMayorContabilidadService {
  constructor(
    @inject(TYPES.LibroMayorContabilidadRepository)
    private readonly libroMayorContabilidadRepository: ILibroMayorContabilidadRepository
  ) {}

  // Métodos básicos CRUD
  async getAllLibrosMayor(): Promise<LibroMayorContabilidad[]> {
    try {
      return await this.libroMayorContabilidadRepository.getAll();
    } catch (error) {
      console.error('Error en getAllLibrosMayor:', error);
      throw error;
    }
  }

  async getLibroMayorById(id: number): Promise<LibroMayorContabilidad | null> {
    try {
      return await this.libroMayorContabilidadRepository.getById(id);
    } catch (error) {
      console.error('Error en getLibroMayorById:', error);
      throw error;
    }
  }

  async createLibroMayor(entity: LibroMayorContabilidad): Promise<LibroMayorContabilidad> {
    try {
      return await this.libroMayorContabilidadRepository.create(entity);
    } catch (error) {
      console.error('Error en createLibroMayor:', error);
      throw error;
    }
  }

  async updateLibroMayor(id: number, entity: Partial<LibroMayorContabilidad>): Promise<LibroMayorContabilidad> {
    try {
      return await this.libroMayorContabilidadRepository.update(id, entity);
    } catch (error) {
      console.error('Error en updateLibroMayor:', error);
      throw error;
    }
  }

  async deleteLibroMayor(id: number): Promise<boolean> {
    try {
      return await this.libroMayorContabilidadRepository.delete(id);
    } catch (error) {
      console.error('Error en deleteLibroMayor:', error);
      throw error;
    }
  }

  // Métodos específicos del negocio
  async generarReporteLibroMayor(
    usuario: string, 
    filtros: FiltrosLibroMayorContabilidad, 
    fechaInicial: string, 
    fechaFinal: string
  ): Promise<{
    registrosGenerados: number;
    fechaGeneracion: Date;
    usuario: string;
    filtros: FiltrosLibroMayorContabilidad;
  }> {
    try {
      const registrosGenerados = await this.libroMayorContabilidadRepository.generarReporte(
        usuario,
        filtros,
        fechaInicial,
        fechaFinal
      );

      return {
        registrosGenerados,
        fechaGeneracion: new Date(),
        usuario,
        filtros
      };
    } catch (error) {
      console.error('Error en generarReporteLibroMayor:', error);
      throw error;
    }
  }

  async limpiarReporteLibroMayor(usuario: string): Promise<{
    registrosEliminados: number;
    fechaLimpieza: Date;
    usuario: string;
  }> {
    try {
      const registrosEliminados = await this.libroMayorContabilidadRepository.limpiarReporte(usuario);

      return {
        registrosEliminados,
        fechaLimpieza: new Date(),
        usuario
      };
    } catch (error) {
      console.error('Error en limpiarReporteLibroMayor:', error);
      throw error;
    }
  }

  async obtenerReporteGenerado(usuario: string): Promise<LibroMayorContabilidad[]> {
    try {
      return await this.libroMayorContabilidadRepository.obtenerReporteGenerado(usuario);
    } catch (error) {
      console.error('Error en obtenerReporteGenerado:', error);
      throw error;
    }
  }

  // Métodos de consulta con filtros
  async getLibrosMayorByFiltros(
    filtros: FiltrosLibroMayorContabilidad, 
    page?: number, 
    limit?: number
  ): Promise<{
    data: LibroMayorContabilidad[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      return await this.libroMayorContabilidadRepository.getByFiltros(filtros, page, limit);
    } catch (error) {
      console.error('Error en getLibrosMayorByFiltros:', error);
      throw error;
    }
  }

  // Métodos de consulta específicos
  async getLibrosMayorByCuentaContable(cuentaContable: string): Promise<LibroMayorContabilidad[]> {
    try {
      return await this.libroMayorContabilidadRepository.getByCuentaContable(cuentaContable);
    } catch (error) {
      console.error('Error en getLibrosMayorByCuentaContable:', error);
      throw error;
    }
  }

  async getLibrosMayorByCentroCosto(centroCosto: string): Promise<LibroMayorContabilidad[]> {
    try {
      return await this.libroMayorContabilidadRepository.getByCentroCosto(centroCosto);
    } catch (error) {
      console.error('Error en getLibrosMayorByCentroCosto:', error);
      throw error;
    }
  }

  async getLibrosMayorByFechaRange(fechaInicial: Date, fechaFinal: Date): Promise<LibroMayorContabilidad[]> {
    try {
      return await this.libroMayorContabilidadRepository.getByFechaRange(fechaInicial, fechaFinal);
    } catch (error) {
      console.error('Error en getLibrosMayorByFechaRange:', error);
      throw error;
    }
  }

  async getLibrosMayorByAsiento(asiento: string): Promise<LibroMayorContabilidad[]> {
    try {
      return await this.libroMayorContabilidadRepository.getByAsiento(asiento);
    } catch (error) {
      console.error('Error en getLibrosMayorByAsiento:', error);
      throw error;
    }
  }

  async getLibrosMayorByNIT(nit: string): Promise<LibroMayorContabilidad[]> {
    try {
      return await this.libroMayorContabilidadRepository.getByNIT(nit);
    } catch (error) {
      console.error('Error en getLibrosMayorByNIT:', error);
      throw error;
    }
  }

  // Métodos de agregación
  async getSaldosPorCuenta(fechaInicial: Date, fechaFinal: Date): Promise<any[]> {
    try {
      return await this.libroMayorContabilidadRepository.getSaldosPorCuenta(fechaInicial, fechaFinal);
    } catch (error) {
      console.error('Error en getSaldosPorCuenta:', error);
      throw error;
    }
  }

  async getSaldosPorCentroCosto(fechaInicial: Date, fechaFinal: Date): Promise<any[]> {
    try {
      return await this.libroMayorContabilidadRepository.getSaldosPorCentroCosto(fechaInicial, fechaFinal);
    } catch (error) {
      console.error('Error en getSaldosPorCentroCosto:', error);
      throw error;
    }
  }

  async getResumenPorPeriodo(fechaInicial: Date, fechaFinal: Date): Promise<any[]> {
    try {
      return await this.libroMayorContabilidadRepository.getResumenPorPeriodo(fechaInicial, fechaFinal);
    } catch (error) {
      console.error('Error en getResumenPorPeriodo:', error);
      throw error;
    }
  }

  // Métodos de exportación
  async exportarReporteLibroMayor(filtros: FiltrosLibroMayorContabilidad, formato: string): Promise<Buffer> {
    try {
      return await this.libroMayorContabilidadRepository.exportarReporte(filtros, formato);
    } catch (error) {
      console.error('Error en exportarReporteLibroMayor:', error);
      throw error;
    }
  }

  // Métodos de validación
  async validarFiltros(filtros: FiltrosLibroMayorContabilidad): Promise<boolean> {
    try {
      // Validar que las fechas estén presentes
      if (!filtros.fechaInicial || !filtros.fechaFinal) {
        return false;
      }

      // Validar que la moneda sea válida
      const monedasValidas = ['PEN', 'USD', 'AMBOS'];
      if (!monedasValidas.includes(filtros.moneda)) {
        return false;
      }

      // Validar que la clase sea válida
      const clasesValidas = ['PRELIMINAR', 'OFICIAL'];
      if (!clasesValidas.includes(filtros.clase)) {
        return false;
      }

      // Validar que la contabilidad sea válida
      const contabilidadesValidas = ['F', 'C', 'A'];
      if (!contabilidadesValidas.includes(filtros.contabilidad)) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en validarFiltros:', error);
      return false;
    }
  }

  async validarFechas(fechaInicial: string, fechaFinal: string): Promise<boolean> {
    try {
      const fechaIni = new Date(fechaInicial);
      const fechaFin = new Date(fechaFinal);

      // Validar que las fechas sean válidas
      if (isNaN(fechaIni.getTime()) || isNaN(fechaFin.getTime())) {
        return false;
      }

      // Validar que la fecha inicial sea menor que la fecha final
      if (fechaIni >= fechaFin) {
        return false;
      }

      // Validar que las fechas no sean futuras
      const hoy = new Date();
      if (fechaIni > hoy || fechaFin > hoy) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en validarFechas:', error);
      return false;
    }
  }
}
