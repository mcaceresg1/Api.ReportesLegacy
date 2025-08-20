import { IQuery } from '../../../domain/cqrs/IQuery';
import { DiarioContabilidadFiltros } from '../../../domain/entities/DiarioContabilidad';
import { v4 as uuid } from 'uuid';

export class ObtenerDiarioContabilidadQuery implements IQuery {
  readonly queryId: string;
  readonly timestamp: Date;

  constructor(
    public readonly filtros: DiarioContabilidadFiltros
  ) {
    this.queryId = uuid();
    this.timestamp = new Date();
  }
}
