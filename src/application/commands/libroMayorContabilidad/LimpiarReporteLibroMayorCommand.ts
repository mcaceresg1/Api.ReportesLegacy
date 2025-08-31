import { ICommand } from '../../../domain/cqrs/ICommand';
import { v4 as uuid } from 'uuid';

export class LimpiarReporteLibroMayorCommand implements ICommand {
  readonly commandId = uuid();
  readonly timestamp = new Date();
  
  constructor(
    public readonly usuario: string
  ) {}
}
