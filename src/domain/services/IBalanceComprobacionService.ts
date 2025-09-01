import {
  BalanceComprobacion,
  BalanceComprobacionFiltros,
  BalanceComprobacionResponse,
} from "../entities/BalanceComprobacion";

/**
 * Interfaz del servicio para Balance de Comprobación
 * Define los contratos para la lógica de negocio del reporte de Balance de Comprobación
 */
export interface IBalanceComprobacionService {
  /**
   * Genera el reporte de Balance de Comprobación
   * @param conjunto Código del conjunto contable
   * @param usuario Usuario que genera el reporte
   * @param fechaInicio Fecha de inicio del período
   * @param fechaFin Fecha de fin del período
   * @param contabilidad Tipo de contabilidad ('F', 'A', 'F,A')
   * @param tipoReporte Tipo de reporte ('Preliminar', 'Oficial')
   */
  generarReporteBalanceComprobacion(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad?: string,
    tipoReporte?: string
  ): Promise<void>;

  /**
   * Obtiene los datos del Balance de Comprobación con filtros y paginación
   * @param conjunto Código del conjunto contable
   * @param filtros Filtros para la consulta
   * @returns Respuesta paginada con los datos del reporte
   */
  obtenerBalanceComprobacion(
    conjunto: string,
    filtros: BalanceComprobacionFiltros
  ): Promise<BalanceComprobacionResponse>;

  /**
   * Exporta el Balance de Comprobación a Excel
   * @param conjunto Código del conjunto contable
   * @param usuario Usuario que exporta
   * @param fechaInicio Fecha de inicio del período
   * @param fechaFin Fecha de fin del período
   * @param contabilidad Tipo de contabilidad
   * @param tipoReporte Tipo de reporte
   * @param limit Límite de registros a exportar
   * @returns Buffer del archivo Excel
   */
  exportarExcel(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad?: string,
    tipoReporte?: string,
    limit?: number
  ): Promise<Buffer>;
}
