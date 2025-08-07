import { injectable, inject } from 'inversify';
import { ICommandHandler } from '../../../domain/cqrs/ICommandHandler';
import { DeleteRolCommand } from '../../commands/rol/DeleteRolCommand';
import { IRolService } from '../../../domain/services/IRolService';

@injectable()
export class DeleteRolHandler implements ICommandHandler<DeleteRolCommand, void> {
  constructor(
    @inject('IRolService') private rolService: IRolService
  ) {}

  async handle(command: DeleteRolCommand): Promise<void> {
    await this.rolService.deleteRol(command.id);
  }
}
