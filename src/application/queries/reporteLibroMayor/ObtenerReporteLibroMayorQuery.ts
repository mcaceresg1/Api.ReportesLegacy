import { IQuery } from '../../../domain/cqrs/IQuery';
import { FiltrosReporteLibroMayor, ReporteLibroMayorResponse } from '../../../domain/entities/ReporteLibroMayor';
import { v4 as uuid } from 'uuid';

export class ObtenerReporteLibroMayorQuery implements IQuery<ReporteLibroMayorResponse> {
  readonly queryId = uuid();
  readonly timestamp = new Date();
  
  constructor(
    public readonly filtros: FiltrosReporteLibroMayor
  ) {}
}
