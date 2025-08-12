import { FiltrosReporteMovimientosContables, ReporteMovimientoContableItem } from '../entities/ReporteMovimientosContables';

export interface IReporteMovimientosContablesService {
  obtener(
    conjunto: string,
    filtros: FiltrosReporteMovimientosContables
  ): Promise<ReporteMovimientoContableItem[]>;
}
