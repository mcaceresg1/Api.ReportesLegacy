import { injectable, inject } from 'inversify';
import { ICommandHandler } from '../../../domain/cqrs/ICommandHandler';
import { CreateUsuarioCommand } from '../../commands/usuario/CreateUsuarioCommand';
import { IUsuarioService } from '../../../domain/services/IUsuarioService';

@injectable()
export class CreateUsuarioHandler implements ICommandHandler<CreateUsuarioCommand, void> {
  constructor(
    @inject('IUsuarioService') private usuarioService: IUsuarioService
  ) {}

  async handle(command: CreateUsuarioCommand): Promise<void> {
    await this.usuarioService.createUsuario(command.data);
  }
}
