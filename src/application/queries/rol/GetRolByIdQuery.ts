import { IQuery } from '../../../domain/cqrs/IQuery';
import { Rol } from '../../../domain/entities/Rol';

export class GetRolByIdQuery implements IQuery<Rol | null> {
  readonly queryId: string;
  readonly timestamp: Date;
  readonly id: number;

  constructor(id: number) {
    this.queryId = `get-rol-by-id-${Date.now()}`;
    this.timestamp = new Date();
    this.id = id;
  }
}
