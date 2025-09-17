import { ReporteComparativoCentrosCosto, FiltrosComparativoCentrosCosto } from '../entities/ReporteComparativoCentrosCosto';

export interface ReporteComparativoCentrosCostoResponse {
  success: boolean;
  data: ReporteComparativoCentrosCosto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message: string;
}

export interface IReporteComparativoCentrosCostoRepository {
  obtenerComparativoCentrosCosto(
    conjunto: string,
    filtros: FiltrosComparativoCentrosCosto,
    page?: number,
    limit?: number
  ): Promise<ReporteComparativoCentrosCostoResponse>;

  exportarExcel(
    conjunto: string,
    filtros: FiltrosComparativoCentrosCosto
  ): Promise<Buffer>;
}

