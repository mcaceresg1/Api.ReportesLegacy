import {
  LibroDiarioAsientos,
  LibroDiarioAsientosFiltros,
  LibroDiarioAsientosResponse,
  GenerarLibroDiarioAsientosParams,
  ExportarLibroDiarioAsientosExcelParams,
} from "../entities/LibroDiarioAsientos";

/**
 * Interfaz para el servicio de Libro Diario Asientos
 * Define los contratos para las operaciones del reporte de Libro Diario Asientos
 */
export interface ILibroDiarioAsientosService {
  /**
   * Obtiene los filtros disponibles para el reporte
   * @param conjunto - Código del conjunto contable
   * @returns Promise con los filtros disponibles
   */
  obtenerFiltros(conjunto: string): Promise<{ asiento: string; tipoAsiento: string; paquete: string }[]>;

  /**
   * Genera el reporte de Libro Diario Asientos
   * @param conjunto - Código del conjunto contable
   * @param filtros - Filtros para el reporte
   * @returns Promise con los datos del reporte
   */
  generarReporte(
    conjunto: string,
    filtros: GenerarLibroDiarioAsientosParams
  ): Promise<LibroDiarioAsientos[]>;

  /**
   * Obtiene los datos paginados del Libro Diario Asientos
   * @param conjunto - Código del conjunto contable
   * @param filtros - Filtros para el reporte
   * @returns Promise con la respuesta paginada
   */
  obtenerAsientos(
    conjunto: string,
    filtros: LibroDiarioAsientosFiltros
  ): Promise<LibroDiarioAsientosResponse>;

  /**
   * Exporta el reporte a Excel
   * @param conjunto - Código del conjunto contable
   * @param filtros - Filtros para el reporte
   * @returns Promise con el buffer del archivo Excel
   */
  exportarExcel(
    conjunto: string,
    filtros: ExportarLibroDiarioAsientosExcelParams
  ): Promise<Buffer>;
}
