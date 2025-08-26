import { injectable, inject } from 'inversify';
import { IQueryHandler } from '../../../domain/cqrs/IQueryHandler';
import { ExportarLibroMayorExcelQuery } from '../../queries/libro-mayor/ExportarLibroMayorExcelQuery';
import { ILibroMayorRepository } from '../../../domain/repositories/ILibroMayorRepository';

@injectable()
export class ExportarLibroMayorExcelHandler implements IQueryHandler<ExportarLibroMayorExcelQuery, Buffer> {
  constructor(
    @inject('ILibroMayorRepository') private libroMayorRepository: ILibroMayorRepository
  ) {}

  async handle(query: ExportarLibroMayorExcelQuery): Promise<Buffer> {
    return await this.libroMayorRepository.exportarExcel(
      query.conjunto,
      query.usuario,
      query.fechaInicio,
      query.fechaFin,
      query.limit
    );
  }
}
