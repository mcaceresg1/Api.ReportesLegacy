import { injectable, inject } from 'inversify';
import { ICommandHandler } from '../../../domain/cqrs/ICommandHandler';
import { DeleteUsuarioCommand } from '../../commands/usuario/DeleteUsuarioCommand';
import { IUsuarioService } from '../../../domain/services/IUsuarioService';

@injectable()
export class DeleteUsuarioHandler implements ICommandHandler<DeleteUsuarioCommand, void> {
  constructor(
    @inject('IUsuarioService') private usuarioService: IUsuarioService
  ) {}

  async handle(command: DeleteUsuarioCommand): Promise<void> {
    await this.usuarioService.deleteUsuario(command.id);
  }
}
