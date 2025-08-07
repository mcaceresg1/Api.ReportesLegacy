import { injectable, inject } from 'inversify';
import { ICommandHandler } from '../../../domain/cqrs/ICommandHandler';
import { CreateRolCommand } from '../../commands/rol/CreateRolCommand';
import { IRolService } from '../../../domain/services/IRolService';

@injectable()
export class CreateRolHandler implements ICommandHandler<CreateRolCommand, void> {
  constructor(
    @inject('IRolService') private rolService: IRolService
  ) {}

  async handle(command: CreateRolCommand): Promise<void> {
    await this.rolService.createRol(command.data);
  }
}
