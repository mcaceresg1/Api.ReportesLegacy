import { ICommand } from '../../../domain/cqrs/ICommand';
import { RolCreate } from '../../../domain/entities/Rol';

export class CreateRolCommand implements ICommand {
  readonly commandId: string;
  readonly timestamp: Date;
  readonly data: RolCreate;

  constructor(data: RolCreate) {
    this.commandId = `create-rol-${Date.now()}`;
    this.timestamp = new Date();
    this.data = data;
  }
}
