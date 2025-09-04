import { injectable, inject } from 'inversify';
import { IEstadoResultadosService } from '../../domain/services/IEstadoResultadosService';
import { EstadoResultadosRepository } from '../../infrastructure/repositories/EstadoResultadosRepository';
import { TYPES } from '../../infrastructure/container/types';
import { EstadoResultados, FiltrosEstadoResultados, TipoEgp, PeriodoContable } from '../../domain/entities/EstadoResultados';

@injectable()
export class EstadoResultadosService implements IEstadoResultadosService {
  constructor(
    @inject(TYPES.EstadoResultadosRepository) private estadoResultadosRepository: EstadoResultadosRepository
  ) {}

  async getTiposEgp(conjunto: string, usuario: string): Promise<TipoEgp[]> {
    return await this.estadoResultadosRepository.getTiposEgp(conjunto, usuario);
  }

  async getPeriodosContables(conjunto: string, fecha: string): Promise<PeriodoContable[]> {
    return await this.estadoResultadosRepository.getPeriodosContables(conjunto, fecha);
  }

  async getEstadoResultados(
    conjunto: string, 
    usuario: string, 
    filtros: FiltrosEstadoResultados,
    page: number = 1,
    pageSize: number = 20
  ): Promise<EstadoResultados[]> {
    return await this.estadoResultadosRepository.getEstadoResultados(conjunto, usuario, filtros, page, pageSize);
  }

  async getTotalRecords(conjunto: string, usuario: string, filtros: FiltrosEstadoResultados): Promise<number> {
    return await this.estadoResultadosRepository.getTotalRecords(conjunto, usuario, filtros);
  }
}
