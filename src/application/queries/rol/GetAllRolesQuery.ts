import { IQuery } from '../../../domain/cqrs/IQuery';
import { Rol } from '../../../domain/entities/Rol';

export class GetAllRolesQuery implements IQuery<Rol[]> {
  readonly queryId: string;
  readonly timestamp: Date;

  constructor() {
    this.queryId = `get-all-roles-${Date.now()}`;
    this.timestamp = new Date();
  }
}
