import { FiltrosReporteMovimientosContables, ReporteMovimientoContableItem } from '../entities/ReporteMovimientosContables';

export interface IReporteMovimientosContablesRepository {
  obtener(
    conjunto: string,
    filtros: FiltrosReporteMovimientosContables
  ): Promise<ReporteMovimientoContableItem[]>;
  
  exportarExcel(
    conjunto: string,
    filtros: FiltrosReporteMovimientosContables
  ): Promise<Buffer>;
}
