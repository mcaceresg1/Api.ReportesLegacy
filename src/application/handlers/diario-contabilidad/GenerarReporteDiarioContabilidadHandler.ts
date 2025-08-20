import { injectable, inject } from 'inversify';
import { ICommandHandler } from '../../../domain/cqrs/ICommandHandler';
import { GenerarReporteDiarioContabilidadCommand } from '../../commands/diario-contabilidad/GenerarReporteDiarioContabilidadCommand';
import { IDiarioContabilidadRepository } from '../../../domain/repositories/IDiarioContabilidadRepository';

@injectable()
export class GenerarReporteDiarioContabilidadHandler implements ICommandHandler<GenerarReporteDiarioContabilidadCommand> {
  constructor(
    @inject('IDiarioContabilidadRepository') private diarioContabilidadRepository: IDiarioContabilidadRepository
  ) {}

  async handle(command: GenerarReporteDiarioContabilidadCommand): Promise<void> {
    console.log('Ejecutando comando GenerarReporteDiarioContabilidadCommand');
    
    await this.diarioContabilidadRepository.generarReporteDiarioContabilidad(
      command.conjunto,
      command.usuario,
      command.fechaInicio,
      command.fechaFin,
      command.contabilidad,
      command.tipoReporte
    );
    
    console.log('Comando GenerarReporteDiarioContabilidadCommand ejecutado exitosamente');
  }
}
