import { injectable, inject } from 'inversify';
import { IQueryHandler } from '../../../domain/cqrs/IQueryHandler';
import { ExportarDiarioContabilidadExcelQuery } from '../../queries/diario-contabilidad/ExportarDiarioContabilidadExcelQuery';
import { IDiarioContabilidadRepository } from '../../../domain/repositories/IDiarioContabilidadRepository';

@injectable()
export class ExportarDiarioContabilidadExcelHandler implements IQueryHandler<ExportarDiarioContabilidadExcelQuery, Buffer> {
  constructor(
    @inject('IDiarioContabilidadRepository') private diarioContabilidadRepository: IDiarioContabilidadRepository
  ) {}

  async handle(query: ExportarDiarioContabilidadExcelQuery): Promise<Buffer> {
    console.log('Ejecutando query ExportarDiarioContabilidadExcelQuery');
    
    const excelBuffer = await this.diarioContabilidadRepository.exportarExcel(
      query.conjunto,
      query.usuario,
      query.fechaInicio,
      query.fechaFin,
      query.contabilidad,
      query.tipoReporte,
      query.limit
    );
    
    console.log('Query ExportarDiarioContabilidadExcelQuery ejecutada exitosamente');
    return excelBuffer;
  }
}
