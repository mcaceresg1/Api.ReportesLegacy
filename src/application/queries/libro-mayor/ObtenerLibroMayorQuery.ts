import { IQuery } from '../../../domain/cqrs/IQuery';
import { LibroMayorFiltros } from '../../../domain/entities/LibroMayor';
import { v4 as uuid } from 'uuid';

export class ObtenerLibroMayorQuery implements IQuery {
  readonly queryId: string;
  readonly timestamp: Date;

  constructor(
    public readonly filtros: LibroMayorFiltros
  ) {
    this.queryId = uuid();
    this.timestamp = new Date();
  }
}
