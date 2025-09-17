import { FiltrosReporteMovimientosContables, ReporteMovimientoContableItem, ReporteMovimientosContablesResponse } from '../entities/ReporteMovimientosContables';

export interface IReporteMovimientosContablesService {
  obtener(
    conjunto: string,
    filtros: FiltrosReporteMovimientosContables,
    page?: number,
    limit?: number
  ): Promise<ReporteMovimientosContablesResponse>;
  
  obtenerReporteMovimientosContables(
    conjunto: string,
    filtros: FiltrosReporteMovimientosContables,
    page?: number,
    limit?: number
  ): Promise<ReporteMovimientosContablesResponse>;
  
  exportarExcel(
    conjunto: string,
    filtros: FiltrosReporteMovimientosContables
  ): Promise<Buffer>;
}
