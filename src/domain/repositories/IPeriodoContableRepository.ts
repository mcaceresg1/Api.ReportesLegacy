import { PeriodoContable, FiltroPeriodoContable, CentroCosto } from '../entities/PeriodoContable';

export interface IPeriodoContableRepository {
  obtenerCentrosCosto(conjunto: string): Promise<CentroCosto[]>;
  generarReporte(filtros: FiltroPeriodoContable): Promise<PeriodoContable[]>;
}
