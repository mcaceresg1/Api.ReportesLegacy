import { ReporteComparativoCentrosCosto, FiltrosComparativoCentrosCosto } from '../entities/ReporteComparativoCentrosCosto';

export interface IReporteComparativoCentrosCostoRepository {
  obtenerComparativoCentrosCosto(
    conjunto: string,
    filtros: FiltrosComparativoCentrosCosto
  ): Promise<ReporteComparativoCentrosCosto[]>;

  exportarExcel(
    conjunto: string,
    filtros: FiltrosComparativoCentrosCosto
  ): Promise<Buffer>;
}

