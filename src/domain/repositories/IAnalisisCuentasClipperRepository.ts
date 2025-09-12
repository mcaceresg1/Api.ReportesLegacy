import {
  AnalisisCuentasClipper,
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
 * Interfaz del repositorio para Análisis de Cuentas Clipper
 * Define los métodos para acceder a los datos del reporte
 */
export interface IAnalisisCuentasClipperRepository {
  /**
   * Obtiene el reporte de análisis de cuentas clipper con filtros
   * @param filtros - Filtros para el reporte
   * @returns Promise con la respuesta del reporte
   */
  obtenerReporteAnalisisCuentasClipper(
    filtros: AnalisisCuentasClipperFiltros
  ): Promise<AnalisisCuentasClipperResponse>;

  obtenerReporteAnalisisCuentaRangoClipper(
    filtros: AnalisisCuentasRangoClipperFiltros
  ): Promise<AnalisisCuentasRangoClipperResponse>;

  /**
   * Obtiene el reporte de análisis de cuentas clipper por rango de fechas
   * @param filtros - Filtros para el reporte (baseDatos, fechaDesde, fechaHasta)
   * @returns Promise con la respuesta del reporte
   */
  obtenerReporteAnalisisCuentasFechasClipper(
    filtros: AnalisisCuentasFechasClipperFiltros
  ): Promise<AnalisisCuentasFechasClipperResponse>;

  /**
   * Obtiene el reporte de análisis de cuentas clipper por fecha de vencimiento
   * @param filtros - Filtros para el reporte (baseDatos, cuentaDesde, cuentaHasta, fechaVencimientoDesde, fechaVencimientoHasta)
   * @returns Promise con la respuesta del reporte
   */
  obtenerReporteAnalisisCuentasVencimientoClipper(
    filtros: AnalisisCuentasVencimientoClipperFiltros
  ): Promise<AnalisisCuentasVencimientoClipperResponse>;
}
