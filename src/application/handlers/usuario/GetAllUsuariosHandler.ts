import { injectable, inject } from 'inversify';
import { IQueryHandler } from '../../../domain/cqrs/IQueryHandler';
import { GetAllUsuariosQuery } from '../../queries/usuario/GetAllUsuariosQuery';
import { IUsuarioService } from '../../../domain/services/IUsuarioService';
import { Usuario } from '../../../domain/entities/Usuario';

@injectable()
export class GetAllUsuariosHandler implements IQueryHandler<GetAllUsuariosQuery, Usuario[]> {
  constructor(
    @inject('IUsuarioService') private usuarioService: IUsuarioService
  ) {}

  async handle(query: GetAllUsuariosQuery): Promise<Usuario[]> {
    return await this.usuarioService.getAllUsuarios();
  }
}
