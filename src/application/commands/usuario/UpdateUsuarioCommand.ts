import { ICommand } from '../../../domain/cqrs/ICommand';
import { UsuarioUpdate } from '../../../domain/entities/Usuario';

export class UpdateUsuarioCommand implements ICommand {
  readonly commandId: string;
  readonly timestamp: Date;
  readonly id: number;
  readonly data: UsuarioUpdate;

  constructor(id: number, data: UsuarioUpdate) {
    this.commandId = `update-usuario-${Date.now()}`;
    this.timestamp = new Date();
    this.id = id;
    this.data = data;
  }
}
