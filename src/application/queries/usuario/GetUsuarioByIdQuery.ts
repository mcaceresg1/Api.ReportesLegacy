import { IQuery } from '../../../domain/cqrs/IQuery';
import { Usuario } from '../../../domain/entities/Usuario';

export class GetUsuarioByIdQuery implements IQuery<Usuario | null> {
  readonly queryId: string;
  readonly timestamp: Date;
  readonly id: number;

  constructor(id: number) {
    this.queryId = `get-usuario-by-id-${Date.now()}`;
    this.timestamp = new Date();
    this.id = id;
  }
}
