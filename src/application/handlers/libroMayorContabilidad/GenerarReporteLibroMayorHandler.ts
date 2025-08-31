import { ICommandHandler } from '../../../domain/cqrs/ICommandHandler';
import { GenerarReporteLibroMayorCommand } from '../../commands/libroMayorContabilidad/GenerarReporteLibroMayorCommand';
import { ILibroMayorContabilidadService } from '../../../domain/services/ILibroMayorContabilidadService';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/container/types';

@injectable()
export class GenerarReporteLibroMayorHandler implements ICommandHandler<GenerarReporteLibroMayorCommand> {
  constructor(
    @inject(TYPES.LibroMayorContabilidadService)
    private readonly libroMayorContabilidadService: ILibroMayorContabilidadService
  ) {}

  async execute(command: GenerarReporteLibroMayorCommand): Promise<{
    registrosGenerados: number;
    fechaGeneracion: Date;
    usuario: string;
    filtros: any;
  }> {
    try {
      // Validar fechas
      const fechasValidas = await this.libroMayorContabilidadService.validarFechas(
        command.fechaInicial,
        command.fechaFinal
      );
      
      if (!fechasValidas) {
        throw new Error('Las fechas proporcionadas no son válidas');
      }

      // Validar filtros
      const filtrosValidos = await this.libroMayorContabilidadService.validarFiltros(
        command.filtros
      );
      
      if (!filtrosValidos) {
        throw new Error('Los filtros proporcionados no son válidos');
      }

      // Generar el reporte
      const resultado = await this.libroMayorContabilidadService.generarReporteLibroMayor(
        command.usuario,
        command.filtros,
        command.fechaInicial,
        command.fechaFinal
      );

      return resultado;
    } catch (error) {
      console.error('Error en GenerarReporteLibroMayorHandler:', error);
      throw error;
    }
  }
}
