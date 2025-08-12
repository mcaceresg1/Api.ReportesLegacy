import { inject, injectable } from 'inversify';
import { IReporteMovimientosContablesService } from '../../domain/services/IReporteMovimientosContablesService';
import { IReporteMovimientosContablesRepository } from '../../domain/repositories/IReporteMovimientosContablesRepository';
import { FiltrosReporteMovimientosContables, ReporteMovimientoContableItem } from '../../domain/entities/ReporteMovimientosContables';

@injectable()
export class ReporteMovimientosContablesService implements IReporteMovimientosContablesService {
  constructor(
    @inject('IReporteMovimientosContablesRepository') private readonly repo: IReporteMovimientosContablesRepository
  ) {}

  async obtener(conjunto: string, filtros: FiltrosReporteMovimientosContables): Promise<ReporteMovimientoContableItem[]> {
    if (!conjunto) throw new Error('conjunto requerido');
    if (!filtros?.usuario) throw new Error('usuario requerido');
    if (!filtros?.fechaInicio || !filtros?.fechaFin) throw new Error('rango de fechas requerido');
    if (new Date(filtros.fechaInicio) > new Date(filtros.fechaFin)) throw new Error('fechaInicio > fechaFin');
    return this.repo.obtener(conjunto, filtros);
  }
}
