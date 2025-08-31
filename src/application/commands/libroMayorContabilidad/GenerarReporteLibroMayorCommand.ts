import { ICommand } from '../../../domain/cqrs/ICommand';
import { v4 as uuid } from 'uuid';
import { FiltrosLibroMayorContabilidad } from '../../../domain/entities/LibroMayorContabilidad';

export class GenerarReporteLibroMayorCommand implements ICommand {
  readonly commandId = uuid();
  readonly timestamp = new Date();
  
  constructor(
    public readonly usuario: string,
    public readonly filtros: FiltrosLibroMayorContabilidad,
    public readonly fechaInicial: string,
    public readonly fechaFinal: string
  ) {}
}
