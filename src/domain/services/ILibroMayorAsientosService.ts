import { LibroMayorAsientos, LibroMayorAsientosRequest, LibroMayorAsientosResponse, FiltroAsientosResponse } from '../entities/LibroMayorAsientos';

export interface ILibroMayorAsientosService {
  /**
   * Obtiene los filtros disponibles (asientos y referencias)
   */
  obtenerFiltros(conjunto: string): Promise<FiltroAsientosResponse>;

  /**
   * Genera el reporte de Libro Mayor Asientos
   */
  generarReporteAsientos(request: LibroMayorAsientosRequest): Promise<LibroMayorAsientosResponse>;

  /**
   * Obtiene los datos paginados del reporte
   */
  obtenerAsientos(request: LibroMayorAsientosRequest): Promise<LibroMayorAsientosResponse>;

  /**
   * Exporta el reporte a Excel
   */
  exportarExcel(request: LibroMayorAsientosRequest): Promise<Buffer>;

  /**
   * Exporta el reporte a PDF
   */
  exportarPDF(request: LibroMayorAsientosRequest): Promise<Buffer>;
}
