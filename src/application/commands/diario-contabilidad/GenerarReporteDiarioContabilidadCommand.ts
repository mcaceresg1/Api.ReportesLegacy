import { ICommand } from '../../../domain/cqrs/ICommand';
import { v4 as uuid } from 'uuid';

export class GenerarReporteDiarioContabilidadCommand implements ICommand {
  readonly commandId: string;
  readonly timestamp: Date;

  constructor(
    public readonly conjunto: string,
    public readonly usuario: string,
    public readonly fechaInicio: Date,
    public readonly fechaFin: Date,
    public readonly contabilidad?: string,
    public readonly tipoReporte?: string
  ) {
    this.commandId = uuid();
    this.timestamp = new Date();
  }
}
