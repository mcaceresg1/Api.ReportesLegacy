import { ICommand } from '../../../domain/cqrs/ICommand';
import { v4 as uuid } from 'uuid';
import { FiltrosReporteMovimientosContablesAgrupados } from '../../../domain/entities/ReporteMovimientosContablesAgrupados';

export class GenerarReporteMovimientosContablesAgrupadosCommand implements ICommand {
  readonly commandId: string;
  readonly timestamp: Date;
  
  constructor(
    public readonly filtros: FiltrosReporteMovimientosContablesAgrupados,
    public readonly usuario: string
  ) {
    this.commandId = uuid();
    this.timestamp = new Date();
  }
}
