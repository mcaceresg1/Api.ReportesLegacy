import { IQuery } from '../../../domain/cqrs/IQuery';
import { Usuario } from '../../../domain/entities/Usuario';

export class GetAllUsuariosQuery implements IQuery<Usuario[]> {
  readonly queryId: string;
  readonly timestamp: Date;

  constructor() {
    this.queryId = `get-all-usuarios-${Date.now()}`;
    this.timestamp = new Date();
  }
}
