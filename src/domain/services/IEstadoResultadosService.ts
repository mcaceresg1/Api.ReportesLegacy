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
  ): Promise<EstadoResultados[]>;
  getTotalRecords(conjunto: string, usuario: string, filtros: FiltrosEstadoResultados): Promise<number>;
}
