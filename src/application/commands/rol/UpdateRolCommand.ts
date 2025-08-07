import { ICommand } from '../../../domain/cqrs/ICommand';
import { RolUpdate } from '../../../domain/entities/Rol';

export class UpdateRolCommand implements ICommand {
  readonly commandId: string;
  readonly timestamp: Date;
  readonly id: number;
  readonly data: RolUpdate;

  constructor(id: number, data: RolUpdate) {
    this.commandId = `update-rol-${Date.now()}`;
    this.timestamp = new Date();
    this.id = id;
    this.data = data;
  }
}
