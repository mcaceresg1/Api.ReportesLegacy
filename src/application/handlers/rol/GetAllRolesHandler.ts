import { injectable, inject } from 'inversify';
import { IQueryHandler } from '../../../domain/cqrs/IQueryHandler';
import { GetAllRolesQuery } from '../../queries/rol/GetAllRolesQuery';
import { IRolService } from '../../../domain/services/IRolService';
import { Rol } from '../../../domain/entities/Rol';

@injectable()
export class GetAllRolesHandler implements IQueryHandler<GetAllRolesQuery, Rol[]> {
  constructor(
    @inject('IRolService') private rolService: IRolService
  ) {}

  async handle(query: GetAllRolesQuery): Promise<Rol[]> {
    return await this.rolService.getAllRoles();
  }
}
