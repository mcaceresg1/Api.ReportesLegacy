import { ICommand } from '../../../domain/cqrs/ICommand';

export class DeleteUsuarioCommand implements ICommand {
  readonly commandId: string;
  readonly timestamp: Date;
  readonly id: number;

  constructor(id: number) {
    this.commandId = `delete-usuario-${Date.now()}`;
    this.timestamp = new Date();
    this.id = id;
  }
}
