import {
  LibroMayorAsientos,
  LibroMayorAsientosFiltros,
  LibroMayorAsientosResponse,
  GenerarLibroMayorAsientosParams,
  ExportarLibroMayorAsientosExcelParams,
} from "../entities/LibroMayorAsientos";

/**
 * Interfaz del servicio para Libro Mayor Asientos
 * Define los contratos para la lógica de negocio del reporte de Libro Mayor Asientos
 */
export interface ILibroMayorAsientosService {
  /**
   * Obtiene los filtros disponibles (asientos y referencias)
   * @param conjunto Código del conjunto contable
   * @returns Lista de filtros disponibles
   */
  obtenerFiltros(conjunto: string): Promise<{ asiento: string; referencia: string }[]>;

  /**
   * Genera el reporte de Libro Mayor Asientos
   * @param conjunto Código del conjunto contable
   * @param filtros Filtros para la consulta
   * @returns Respuesta con los datos del reporte
   */
  generarReporte(
    conjunto: string,
    filtros: GenerarLibroMayorAsientosParams
  ): Promise<LibroMayorAsientosResponse>;

  /**
   * Obtiene los datos paginados del reporte
   * @param conjunto Código del conjunto contable
   * @param filtros Filtros para la consulta
   * @returns Respuesta paginada con los datos del reporte
   */
  obtenerAsientos(
    conjunto: string,
    filtros: LibroMayorAsientosFiltros
  ): Promise<LibroMayorAsientosResponse>;

  /**
   * Exporta el reporte a Excel
   * @param conjunto Código del conjunto contable
   * @param filtros Filtros para la consulta
   * @returns Buffer del archivo Excel
   */
  exportarExcel(
    conjunto: string,
    filtros: ExportarLibroMayorAsientosExcelParams
  ): Promise<Buffer>;

  /**
   * Exporta el reporte a PDF
   * @param conjunto Código del conjunto contable
   * @param filtros Filtros para la consulta
   * @returns Buffer del archivo PDF
   */
  exportarPDF(
    conjunto: string,
    filtros: ExportarLibroMayorAsientosExcelParams
  ): Promise<Buffer>;
}
