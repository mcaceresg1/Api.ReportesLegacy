import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';
import { ILibroMayorAsientosService } from '../../domain/services/ILibroMayorAsientosService';
import { ILibroMayorAsientosRepository } from '../../domain/repositories/ILibroMayorAsientosRepository';
import { LibroMayorAsientos, LibroMayorAsientosRequest, LibroMayorAsientosResponse, FiltroAsientosResponse } from '../../domain/entities/LibroMayorAsientos';

@injectable()
export class LibroMayorAsientosService implements ILibroMayorAsientosService {

  constructor(
    @inject(TYPES.ILibroMayorAsientosRepository)
    private readonly libroMayorAsientosRepository: ILibroMayorAsientosRepository
  ) {}

  /**
   * Obtiene los filtros disponibles (asientos y referencias)
   */
  async obtenerFiltros(conjunto: string): Promise<FiltroAsientosResponse> {
    try {
      return await this.libroMayorAsientosRepository.obtenerFiltros(conjunto);
    } catch (error) {
      console.error('Error en servicio al obtener filtros:', error);
      return {
        success: false,
        data: [],
        message: 'Error al obtener filtros'
      };
    }
  }

  /**
   * Genera el reporte de Libro Mayor Asientos
   */
  async generarReporteAsientos(request: LibroMayorAsientosRequest): Promise<LibroMayorAsientosResponse> {
    try {
      return await this.libroMayorAsientosRepository.generarReporteAsientos(request);
    } catch (error) {
      console.error('Error en servicio al generar reporte:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 25,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: 'Error al generar reporte'
      };
    }
  }

  /**
   * Obtiene los datos paginados del reporte
   */
  async obtenerAsientos(request: LibroMayorAsientosRequest): Promise<LibroMayorAsientosResponse> {
    try {
      return await this.libroMayorAsientosRepository.obtenerAsientos(request);
    } catch (error) {
      console.error('Error en servicio al obtener asientos:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 25,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: 'Error al obtener asientos'
      };
    }
  }

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(request: LibroMayorAsientosRequest): Promise<Buffer> {
    try {
      return await this.libroMayorAsientosRepository.exportarExcel(request);
    } catch (error) {
      console.error('Error en servicio al exportar Excel:', error);
      throw error;
    }
  }

  /**
   * Exporta el reporte a PDF
   */
  async exportarPDF(request: LibroMayorAsientosRequest): Promise<Buffer> {
    try {
      return await this.libroMayorAsientosRepository.exportarPDF(request);
    } catch (error) {
      console.error('Error en servicio al exportar PDF:', error);
      throw error;
    }
  }
}
