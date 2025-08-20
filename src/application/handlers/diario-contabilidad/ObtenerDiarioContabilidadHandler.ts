import { injectable, inject } from 'inversify';
import { IQueryHandler } from '../../../domain/cqrs/IQueryHandler';
import { ObtenerDiarioContabilidadQuery } from '../../queries/diario-contabilidad/ObtenerDiarioContabilidadQuery';
import { IDiarioContabilidadRepository } from '../../../domain/repositories/IDiarioContabilidadRepository';
import { DiarioContabilidadResponse } from '../../../domain/entities/DiarioContabilidad';

@injectable()
export class ObtenerDiarioContabilidadHandler implements IQueryHandler<ObtenerDiarioContabilidadQuery, DiarioContabilidadResponse> {
  constructor(
    @inject('IDiarioContabilidadRepository') private diarioContabilidadRepository: IDiarioContabilidadRepository
  ) {}

  async handle(query: ObtenerDiarioContabilidadQuery): Promise<DiarioContabilidadResponse> {
    console.log('Ejecutando query ObtenerDiarioContabilidadQuery');
    
    const resultado = await this.diarioContabilidadRepository.obtenerDiarioContabilidad(query.filtros);
    
    console.log('Query ObtenerDiarioContabilidadQuery ejecutada exitosamente');
    return resultado;
  }
}
