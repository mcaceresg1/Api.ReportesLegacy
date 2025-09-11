import {
  AnalisisCuentasClipperFiltros,
  AnalisisCuentasClipperResponse,
  AnalisisCuentasRangoClipperFiltros,
  AnalisisCuentasRangoClipperResponse,
  AnalisisCuentasFechasClipperFiltros,
  AnalisisCuentasFechasClipperResponse,
  AnalisisCuentasVencimientoClipperFiltros,
  AnalisisCuentasVencimientoClipperResponse,
} from "../entities/AnalisisCuentasClipper";

/**
 * Interfaz del servicio para Análisis de Cuentas Clipper
 * Define los métodos de negocio para el reporte
 */
export interface IAnalisisCuentasClipperService {
  /**
   * Obtiene el reporte de análisis de cuentas clipper con filtros y paginación
   * @param filtros - Filtros para el reporte
   * @returns Promise con la respuesta del reporte
   */
  obtenerReporteAnalisisCuentasClipper(
    filtros: AnalisisCuentasClipperFiltros
  ): Promise<AnalisisCuentasClipperResponse>;

  /**
   * Obtiene el reporte de análisis de cuentas por rango
   * @param filtros - Filtros para la consulta
   * @returns Promise con la respuesta del reporte
   */
  obtenerReporteAnalisisCuentaRangoClipper(
    filtros: AnalisisCuentasRangoClipperFiltros
  ): Promise<AnalisisCuentasRangoClipperResponse>;

  /**
   * Obtiene el reporte de análisis de cuentas por rango de fechas
   * @param filtros - Filtros para la consulta (baseDatos, fechaDesde, fechaHasta)
   * @returns Promise con la respuesta del reporte
   */
  obtenerReporteAnalisisCuentasFechasClipper(
    filtros: AnalisisCuentasFechasClipperFiltros
  ): Promise<AnalisisCuentasFechasClipperResponse>;

  /**
   * Obtiene el reporte de análisis de cuentas por fecha de vencimiento
   * @param filtros - Filtros para la consulta (baseDatos, cuentaDesde, cuentaHasta, fechaVencimientoDesde, fechaVencimientoHasta)
   * @returns Promise con la respuesta del reporte
   */
  obtenerReporteAnalisisCuentasVencimientoClipper(
    filtros: AnalisisCuentasVencimientoClipperFiltros
  ): Promise<AnalisisCuentasVencimientoClipperResponse>;
}
