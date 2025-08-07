import { ICommand } from '../../../domain/cqrs/ICommand';
import { UsuarioCreate } from '../../../domain/entities/Usuario';

export class CreateUsuarioCommand implements ICommand {
  readonly commandId: string;
  readonly timestamp: Date;
  readonly data: UsuarioCreate;

  constructor(data: UsuarioCreate) {
    this.commandId = `create-usuario-${Date.now()}`;
    this.timestamp = new Date();
    this.data = data;
  }
}
