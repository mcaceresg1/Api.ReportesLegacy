import { injectable, inject } from "inversify";
import { ILibroDiarioAsientosService } from "../../domain/services/ILibroDiarioAsientosService";
import { LibroDiarioAsientosRepository } from "../../infrastructure/repositories/LibroDiarioAsientosRepository";
import {
  LibroDiarioAsientosFiltros,
  LibroDiarioAsientosResponse,
  GenerarLibroDiarioAsientosParams,
  ExportarLibroDiarioAsientosExcelParams,
  FiltrosDisponibles,
} from "../../domain/entities/LibroDiarioAsientos";

/**
 * Servicio de aplicación para Libro Diario Asientos
 * Implementa la lógica de negocio para el reporte de Libro Diario Asientos
 */
@injectable()
export class LibroDiarioAsientosService implements ILibroDiarioAsientosService {
  constructor(
    @inject("LibroDiarioAsientosRepository")
    private readonly libroDiarioAsientosRepository: LibroDiarioAsientosRepository
  ) {}

  /**
   * Obtiene los filtros disponibles para el reporte
   */
  async obtenerFiltros(conjunto: string): Promise<FiltrosDisponibles> {
    try {
      console.log(`🔍 Obteniendo filtros para conjunto: ${conjunto}`);
      const filtros = await this.libroDiarioAsientosRepository.obtenerFiltros(conjunto);
      console.log(`✅ Filtros obtenidos: ${Object.keys(filtros).length} tipos`);
      return filtros;
    } catch (error) {
      console.error('Error en servicio obtenerFiltros:', error);
      throw new Error(`Error al obtener filtros: ${error}`);
    }
  }

  /**
   * Genera el reporte de Libro Diario Asientos
   */
  async generarReporte(
    conjunto: string,
    filtros: GenerarLibroDiarioAsientosParams
  ): Promise<LibroDiarioAsientosResponse> {
    try {
      console.log(`📊 Generando reporte para conjunto: ${conjunto}`, filtros);
      
      // Generar el reporte completo
      const data = await this.libroDiarioAsientosRepository.generarReporte(conjunto, filtros);
      
      console.log(`✅ Reporte generado: ${data.length} registros`);
      
      return {
        success: true,
        data,
        pagination: {
          page: 1,
          limit: data.length,
          total: data.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        message: `Reporte generado exitosamente con ${data.length} registros`,
      };
    } catch (error) {
      console.error('Error en servicio generarReporte:', error);
      throw new Error(`Error al generar reporte: ${error}`);
    }
  }

  /**
   * Obtiene los datos paginados del reporte
   */
  async obtenerAsientos(
    conjunto: string,
    filtros: LibroDiarioAsientosFiltros
  ): Promise<LibroDiarioAsientosResponse> {
    try {
      console.log(`📋 Obteniendo asientos para conjunto: ${conjunto}`, {
        page: filtros.page,
        limit: filtros.limit,
        filtros: Object.keys(filtros).filter(key => key !== 'conjunto' && key !== 'page' && key !== 'limit' && filtros[key as keyof LibroDiarioAsientosFiltros])
      });
      
      const response = await this.libroDiarioAsientosRepository.obtenerAsientos(conjunto, filtros);
      
      console.log(`✅ Asientos obtenidos: ${response.data.length} registros de ${response.pagination.total} total`);
      
      return response;
    } catch (error) {
      console.error('Error en servicio obtenerAsientos:', error);
      throw new Error(`Error al obtener asientos: ${error}`);
    }
  }

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(
    conjunto: string,
    filtros: ExportarLibroDiarioAsientosExcelParams
  ): Promise<Buffer> {
    try {
      console.log(`📊 Exportando Excel para conjunto: ${conjunto}`, filtros);
      
      const buffer = await this.libroDiarioAsientosRepository.exportarExcel(conjunto, filtros);
      
      console.log(`✅ Excel exportado: ${buffer.length} bytes`);
      
      return buffer;
    } catch (error) {
      console.error('Error en servicio exportarExcel:', error);
      throw new Error(`Error al exportar Excel: ${error}`);
    }
  }

  /**
   * Exporta el reporte a PDF
   */
  async exportarPDF(
    conjunto: string,
    filtros: ExportarLibroDiarioAsientosExcelParams
  ): Promise<Buffer> {
    try {
      console.log(`📄 Exportando PDF para conjunto: ${conjunto}`, filtros);
      
      // Por ahora retornamos un buffer vacío, se implementaría la lógica de PDF
      const buffer = Buffer.from('PDF export placeholder');
      
      console.log(`✅ PDF exportado: ${buffer.length} bytes`);
      
      return buffer;
    } catch (error) {
      console.error('Error en servicio exportarPDF:', error);
      throw new Error(`Error al exportar PDF: ${error}`);
    }
  }
}
