import { ICommandHandler } from '../../../domain/cqrs/ICommandHandler';
import { LimpiarReporteLibroMayorCommand } from '../../commands/libroMayorContabilidad/LimpiarReporteLibroMayorCommand';
import { ILibroMayorContabilidadService } from '../../../domain/services/ILibroMayorContabilidadService';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/container/types';

@injectable()
export class LimpiarReporteLibroMayorHandler implements ICommandHandler<LimpiarReporteLibroMayorCommand> {
  constructor(
    @inject(TYPES.LibroMayorContabilidadService)
    private readonly libroMayorContabilidadService: ILibroMayorContabilidadService
  ) {}

  async execute(command: LimpiarReporteLibroMayorCommand): Promise<{
    registrosEliminados: number;
    fechaLimpieza: Date;
    usuario: string;
  }> {
    try {
      // Limpiar el reporte
      const resultado = await this.libroMayorContabilidadService.limpiarReporteLibroMayor(
        command.usuario
      );

      return resultado;
    } catch (error) {
      console.error('Error en LimpiarReporteLibroMayorHandler:', error);
      throw error;
    }
  }
}
