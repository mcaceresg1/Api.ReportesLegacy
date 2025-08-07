import { injectable, inject } from 'inversify';
import { IQueryHandler } from '../../../domain/cqrs/IQueryHandler';
import { GetRolByIdQuery } from '../../queries/rol/GetRolByIdQuery';
import { IRolService } from '../../../domain/services/IRolService';
import { Rol } from '../../../domain/entities/Rol';

@injectable()
export class GetRolByIdHandler implements IQueryHandler<GetRolByIdQuery, Rol | null> {
  constructor(
    @inject('IRolService') private rolService: IRolService
  ) {}

  async handle(query: GetRolByIdQuery): Promise<Rol | null> {
    return await this.rolService.getRolById(query.id);
  }
}
