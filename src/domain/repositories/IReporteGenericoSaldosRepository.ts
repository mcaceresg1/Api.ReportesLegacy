import {
  ReporteGenericoSaldos,
  FiltrosReporteGenericoSaldos,
  ReporteGenericoSaldosResponse,
  EstadisticasReporteGenericoSaldos,
} from "../entities/ReporteGenericoSaldos";

export interface IReporteGenericoSaldosRepository {
  /**
   * Genera el reporte genérico de saldos
   */
  generarReporteGenericoSaldos(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad?: string,
    tipoAsiento?: string,
    claseAsiento?: string
  ): Promise<void>;

  /**
   * Obtiene los datos del reporte genérico de saldos con filtros y paginación
   */
  obtenerReporteGenericoSaldos(
    conjunto: string,
    filtros: FiltrosReporteGenericoSaldos
  ): Promise<ReporteGenericoSaldosResponse>;

  /**
   * Exporta el reporte genérico de saldos a Excel
   */
  exportarExcel(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad?: string,
    tipoAsiento?: string,
    claseAsiento?: string,
    limit?: number
  ): Promise<Buffer>;

  /**
   * Obtiene estadísticas del reporte genérico de saldos
   */
  obtenerEstadisticas(
    conjunto: string,
    filtros: FiltrosReporteGenericoSaldos
  ): Promise<EstadisticasReporteGenericoSaldos>;
}
