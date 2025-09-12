import {
  LibroDiarioAsientos,
  LibroDiarioAsientosFiltros,
  LibroDiarioAsientosResponse,
  GenerarLibroDiarioAsientosParams,
  ExportarLibroDiarioAsientosExcelParams,
  FiltrosDisponibles,
} from "../entities/LibroDiarioAsientos";

/**
 * Interfaz del servicio para Libro Diario Asientos
 * Define los contratos para la lógica de negocio del reporte de Libro Diario Asientos
 */
export interface ILibroDiarioAsientosService {
  /**
   * Obtiene los filtros disponibles para el reporte
   * @param conjunto Código del conjunto contable
   * @returns Filtros disponibles
   */
  obtenerFiltros(conjunto: string): Promise<FiltrosDisponibles>;

  /**
   * Genera el reporte de Libro Diario Asientos
   * @param conjunto Código del conjunto contable
   * @param filtros Filtros para la consulta
   * @returns Respuesta con los datos del reporte
   */
  generarReporte(
    conjunto: string,
    filtros: GenerarLibroDiarioAsientosParams
  ): Promise<LibroDiarioAsientosResponse>;

  /**
   * Obtiene los datos paginados del reporte
   * @param conjunto Código del conjunto contable
   * @param filtros Filtros para la consulta
   * @returns Respuesta paginada con los datos del reporte
   */
  obtenerAsientos(
    conjunto: string,
    filtros: LibroDiarioAsientosFiltros
  ): Promise<LibroDiarioAsientosResponse>;

  /**
   * Exporta el reporte a Excel
   * @param conjunto Código del conjunto contable
   * @param filtros Filtros para la consulta
   * @returns Buffer del archivo Excel
   */
  exportarExcel(
    conjunto: string,
    filtros: ExportarLibroDiarioAsientosExcelParams
  ): Promise<Buffer>;

  /**
   * Exporta el reporte a PDF
   * @param conjunto Código del conjunto contable
   * @param filtros Filtros para la consulta
   * @returns Buffer del archivo PDF
   */
  exportarPDF(
    conjunto: string,
    filtros: ExportarLibroDiarioAsientosExcelParams
  ): Promise<Buffer>;
}
