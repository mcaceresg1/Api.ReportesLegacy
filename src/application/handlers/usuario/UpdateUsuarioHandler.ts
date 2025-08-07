import { injectable, inject } from 'inversify';
import { ICommandHandler } from '../../../domain/cqrs/ICommandHandler';
import { UpdateUsuarioCommand } from '../../commands/usuario/UpdateUsuarioCommand';
import { IUsuarioService } from '../../../domain/services/IUsuarioService';

@injectable()
export class UpdateUsuarioHandler implements ICommandHandler<UpdateUsuarioCommand, void> {
  constructor(
    @inject('IUsuarioService') private usuarioService: IUsuarioService
  ) {}

  async handle(command: UpdateUsuarioCommand): Promise<void> {
    await this.usuarioService.updateUsuario(command.id, command.data);
  }
}
