import { PeriodoContable, FiltroPeriodoContable, CentroCosto, PeriodoContableInfo } from '../entities/PeriodoContable';

export interface IPeriodoContableRepository {
  obtenerCentrosCosto(conjunto: string): Promise<CentroCosto[]>;
  obtenerPeriodosContables(conjunto: string): Promise<PeriodoContableInfo[]>;
  generarReporte(filtros: FiltroPeriodoContable): Promise<PeriodoContable[]>;
}
