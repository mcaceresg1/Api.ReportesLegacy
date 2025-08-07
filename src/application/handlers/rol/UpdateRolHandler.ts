import { injectable, inject } from 'inversify';
import { ICommandHandler } from '../../../domain/cqrs/ICommandHandler';
import { UpdateRolCommand } from '../../commands/rol/UpdateRolCommand';
import { IRolService } from '../../../domain/services/IRolService';

@injectable()
export class UpdateRolHandler implements ICommandHandler<UpdateRolCommand, void> {
  constructor(
    @inject('IRolService') private rolService: IRolService
  ) {}

  async handle(command: UpdateRolCommand): Promise<void> {
    await this.rolService.updateRol(command.id, command.data);
  }
}
