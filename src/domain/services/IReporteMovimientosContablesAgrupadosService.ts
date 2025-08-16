import { 
  FiltrosReporteMovimientosContablesAgrupados, 
  RespuestaReporteMovimientosContablesAgrupados 
} from '../entities/ReporteMovimientosContablesAgrupados';

export interface IReporteMovimientosContablesAgrupadosService {
  /**
   * Genera el reporte de movimientos contables agrupados
   * @param filtros Filtros para el reporte
   * @returns Respuesta con los datos del reporte
   */
  generarReporte(
    filtros: FiltrosReporteMovimientosContablesAgrupados
  ): Promise<RespuestaReporteMovimientosContablesAgrupados>;
  
  /**
   * Exporta el reporte en el formato especificado
   * @param filtros Filtros para el reporte
   * @param formato Formato de exportación
   * @returns Buffer con el archivo exportado
   */
  exportarReporte(
    filtros: FiltrosReporteMovimientosContablesAgrupados,
    formato: 'EXCEL' | 'PDF' | 'CSV'
  ): Promise<Buffer>;
  
  /**
   * Obtiene estadísticas del reporte
   * @param filtros Filtros para el reporte
   * @returns Estadísticas del reporte
   */
  obtenerEstadisticas(
    filtros: FiltrosReporteMovimientosContablesAgrupados
  ): Promise<{
    totalLocal: number;
    totalDolar: number;
    totalRegistros: number;
    subtotales: Array<{
      grupo: string;
      valor: string;
      totalLocal: number;
      totalDolar: number;
      cantidadRegistros: number;
    }>;
  }>;
  
  /**
   * Valida los filtros del reporte
   * @param filtros Filtros a validar
   * @returns Array de errores de validación
   */
  validarFiltros(
    filtros: FiltrosReporteMovimientosContablesAgrupados
  ): string[];
}
