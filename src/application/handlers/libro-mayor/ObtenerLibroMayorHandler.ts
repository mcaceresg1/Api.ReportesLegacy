import { injectable, inject } from 'inversify';
import { IQueryHandler } from '../../../domain/cqrs/IQueryHandler';
import { ObtenerLibroMayorQuery } from '../../queries/libro-mayor/ObtenerLibroMayorQuery';
import { ILibroMayorRepository } from '../../../domain/repositories/ILibroMayorRepository';
import { LibroMayorResponse } from '../../../domain/entities/LibroMayor';

@injectable()
export class ObtenerLibroMayorHandler implements IQueryHandler<ObtenerLibroMayorQuery, LibroMayorResponse> {
  constructor(
    @inject('ILibroMayorRepository') private libroMayorRepository: ILibroMayorRepository
  ) {}

  async handle(query: ObtenerLibroMayorQuery): Promise<LibroMayorResponse> {
    return await this.libroMayorRepository.obtenerLibroMayor(query.filtros);
  }
}
