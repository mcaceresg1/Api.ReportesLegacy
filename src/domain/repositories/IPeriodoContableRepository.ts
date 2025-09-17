import { PeriodoContable, FiltroPeriodoContable, CentroCosto, PeriodoContableInfo } from '../entities/PeriodoContable';

export interface IPeriodoContableRepository {
  obtenerCentrosCosto(conjunto: string): Promise<CentroCosto[]>;
  obtenerPeriodosContables(conjunto: string): Promise<PeriodoContableInfo[]>;
  generarReporte(filtros: FiltroPeriodoContable, page?: number, limit?: number): Promise<{
    success: boolean;
    data: PeriodoContable[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    message: string;
  }>;
}
