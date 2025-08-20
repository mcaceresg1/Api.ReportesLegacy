import { IQuery } from '../../../domain/cqrs/IQuery';
import { v4 as uuid } from 'uuid';

export class ExportarDiarioContabilidadExcelQuery implements IQuery {
  readonly queryId: string;
  readonly timestamp: Date;

  constructor(
    public readonly conjunto: string,
    public readonly usuario: string,
    public readonly fechaInicio: Date,
    public readonly fechaFin: Date,
    public readonly contabilidad?: string,
    public readonly tipoReporte?: string,
    public readonly limit?: number
  ) {
    this.queryId = uuid();
    this.timestamp = new Date();
  }
}
