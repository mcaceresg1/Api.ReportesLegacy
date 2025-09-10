import { injectable, inject } from "inversify";
import { ILibroDiarioAsientosService } from "../../domain/services/ILibroDiarioAsientosService";
import { LibroDiarioAsientosRepository } from "../../infrastructure/repositories/LibroDiarioAsientosRepository";
import {
  LibroDiarioAsientos,
  LibroDiarioAsientosFiltros,
  LibroDiarioAsientosResponse,
  GenerarLibroDiarioAsientosParams,
  ExportarLibroDiarioAsientosExcelParams,
} from "../../domain/entities/LibroDiarioAsientos";

@injectable()
export class LibroDiarioAsientosService implements ILibroDiarioAsientosService {
  constructor(
    @inject("LibroDiarioAsientosRepository")
    private libroDiarioAsientosRepository: LibroDiarioAsientosRepository
  ) {}

  /**
   * Obtiene los filtros disponibles para el reporte
   */
  async obtenerFiltros(conjunto: string): Promise<{ asiento: string; tipoAsiento: string; paquete: string }[]> {
    try {
      console.log(`Obteniendo filtros para conjunto: ${conjunto}`);
      const filtros = await this.libroDiarioAsientosRepository.obtenerFiltros(conjunto);
      console.log(`Filtros obtenidos: ${filtros.length} registros`);
      return filtros;
    } catch (error) {
      console.error('Error en servicio al obtener filtros:', error);
      throw error;
    }
  }

  /**
   * Genera el reporte de Libro Diario Asientos
   */
  async generarReporte(
    conjunto: string,
    filtros: GenerarLibroDiarioAsientosParams
  ): Promise<LibroDiarioAsientos[]> {
    try {
      console.log(`Generando reporte para conjunto: ${conjunto}`, filtros);
      const reporte = await this.libroDiarioAsientosRepository.generarReporte(conjunto, filtros);
      console.log(`Reporte generado: ${reporte.length} registros`);
      return reporte;
    } catch (error) {
      console.error('Error en servicio al generar reporte:', error);
      throw error;
    }
  }

  /**
   * Obtiene los datos paginados del Libro Diario Asientos
   */
  async obtenerAsientos(
    conjunto: string,
    filtros: LibroDiarioAsientosFiltros
  ): Promise<LibroDiarioAsientosResponse> {
    try {
      console.log(`Obteniendo asientos para conjunto: ${conjunto}`, filtros);
      const response = await this.libroDiarioAsientosRepository.obtenerAsientos(conjunto, filtros);
      console.log(`Asientos obtenidos: ${response.data.length} registros`);
      return response;
    } catch (error) {
      console.error('Error en servicio al obtener asientos:', error);
      throw error;
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
      console.log(`Exportando Excel para conjunto: ${conjunto}`, filtros);
      const buffer = await this.libroDiarioAsientosRepository.exportarExcel(conjunto, filtros);
      console.log(`Excel exportado: ${buffer.length} bytes`);
      return buffer;
    } catch (error) {
      console.error('Error en servicio al exportar Excel:', error);
      throw error;
    }
  }
}
