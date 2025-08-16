import { IQuery } from '../../../domain/cqrs/IQuery';
import { v4 as uuid } from 'uuid';
import { FiltrosReporteMovimientosContablesAgrupados, RespuestaReporteMovimientosContablesAgrupados } from '../../../domain/entities/ReporteMovimientosContablesAgrupados';

export class ObtenerReporteMovimientosContablesAgrupadosQuery implements IQuery<RespuestaReporteMovimientosContablesAgrupados> {
  readonly queryId: string;
  readonly timestamp: Date;
  
  constructor(
    public readonly filtros: FiltrosReporteMovimientosContablesAgrupados
  ) {
    this.queryId = uuid();
    this.timestamp = new Date();
  }
}
