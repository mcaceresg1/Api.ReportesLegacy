import { ICommand } from '../../../domain/cqrs/ICommand';
import { FiltrosReporteGenericoSaldos } from '../../../domain/entities/ReporteGenericoSaldos';
import { v4 as uuid } from 'uuid';

export class GenerarReporteGenericoSaldosCommand implements ICommand {
  readonly commandId = uuid();
  readonly timestamp = new Date();

  constructor(
    public readonly conjunto: string,
    public readonly filtros: FiltrosReporteGenericoSaldos
  ) {}
}
