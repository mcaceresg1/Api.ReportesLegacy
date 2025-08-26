import { injectable, inject } from 'inversify';
import { ICommandHandler } from '../../../domain/cqrs/ICommandHandler';
import { GenerarReporteLibroMayorCommand } from '../../commands/libro-mayor/GenerarReporteLibroMayorCommand';
import { ILibroMayorRepository } from '../../../domain/repositories/ILibroMayorRepository';

@injectable()
export class GenerarReporteLibroMayorHandler implements ICommandHandler<GenerarReporteLibroMayorCommand> {
  constructor(
    @inject('ILibroMayorRepository') private libroMayorRepository: ILibroMayorRepository
  ) {}

  async handle(command: GenerarReporteLibroMayorCommand): Promise<void> {
    await this.libroMayorRepository.generarReporteLibroMayor(
      command.conjunto,
      command.usuario,
      command.fechaInicio,
      command.fechaFin
    );
  }
}
