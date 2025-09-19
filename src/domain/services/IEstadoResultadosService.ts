import { EstadoResultados, FiltrosEstadoResultados, TipoEgp, PeriodoContable } from '../entities/EstadoResultados';

export interface IEstadoResultadosService {
  getTiposEgp(conjunto: string, usuario: string): Promise<TipoEgp[]>;
  getPeriodosContables(conjunto: string, fecha: string): Promise<PeriodoContable[]>;
  getEstadoResultados(
    conjunto: string, 
    usuario: string, 
    filtros: FiltrosEstadoResultados,
    page?: number,
    pageSize?: number
  ): Promise<{
    success: boolean;
    data: EstadoResultados[];
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
  getTotalRecords(conjunto: string, usuario: string, filtros: FiltrosEstadoResultados): Promise<number>;
}
