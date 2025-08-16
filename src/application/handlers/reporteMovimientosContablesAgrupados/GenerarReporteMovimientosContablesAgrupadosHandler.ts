import { ICommandHandler } from '../../../domain/cqrs/ICommandHandler';
import { GenerarReporteMovimientosContablesAgrupadosCommand } from '../../commands/reporteMovimientosContablesAgrupados/GenerarReporteMovimientosContablesAgrupadosCommand';
import { IReporteMovimientosContablesAgrupadosService } from '../../../domain/services/IReporteMovimientosContablesAgrupadosService';
import { RespuestaReporteMovimientosContablesAgrupados } from '../../../domain/entities/ReporteMovimientosContablesAgrupados';

export class GenerarReporteMovimientosContablesAgrupadosHandler implements ICommandHandler<GenerarReporteMovimientosContablesAgrupadosCommand, RespuestaReporteMovimientosContablesAgrupados> {
  constructor(
    private readonly reporteService: IReporteMovimientosContablesAgrupadosService
  ) {}

  async handle(command: GenerarReporteMovimientosContablesAgrupadosCommand): Promise<RespuestaReporteMovimientosContablesAgrupados> {
    // Validar filtros
    const errores = this.reporteService.validarFiltros(command.filtros);
    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(', ')}`);
    }

    // Generar reporte
    return await this.reporteService.generarReporte(command.filtros);
  }
}
