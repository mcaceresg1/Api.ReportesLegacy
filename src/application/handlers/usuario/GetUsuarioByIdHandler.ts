import { injectable, inject } from 'inversify';
import { IQueryHandler } from '../../../domain/cqrs/IQueryHandler';
import { GetUsuarioByIdQuery } from '../../queries/usuario/GetUsuarioByIdQuery';
import { IUsuarioService } from '../../../domain/services/IUsuarioService';
import { Usuario } from '../../../domain/entities/Usuario';

@injectable()
export class GetUsuarioByIdHandler implements IQueryHandler<GetUsuarioByIdQuery, Usuario | null> {
  constructor(
    @inject('IUsuarioService') private usuarioService: IUsuarioService
  ) {}

  async handle(query: GetUsuarioByIdQuery): Promise<Usuario | null> {
    return await this.usuarioService.getUsuarioById(query.id);
  }
}
