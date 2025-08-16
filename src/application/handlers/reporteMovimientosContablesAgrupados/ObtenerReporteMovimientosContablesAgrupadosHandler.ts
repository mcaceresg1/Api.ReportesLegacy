import { IQueryHandler } from '../../../domain/cqrs/IQueryHandler';
import { ObtenerReporteMovimientosContablesAgrupadosQuery } from '../../queries/reporteMovimientosContablesAgrupados/ObtenerReporteMovimientosContablesAgrupadosQuery';
import { IReporteMovimientosContablesAgrupadosService } from '../../../domain/services/IReporteMovimientosContablesAgrupadosService';
import { RespuestaReporteMovimientosContablesAgrupados } from '../../../domain/entities/ReporteMovimientosContablesAgrupados';

export class ObtenerReporteMovimientosContablesAgrupadosHandler implements IQueryHandler<ObtenerReporteMovimientosContablesAgrupadosQuery, RespuestaReporteMovimientosContablesAgrupados> {
  constructor(
    private readonly reporteService: IReporteMovimientosContablesAgrupadosService
  ) {}

  async handle(query: ObtenerReporteMovimientosContablesAgrupadosQuery): Promise<RespuestaReporteMovimientosContablesAgrupados> {
    // Validar filtros
    const errores = this.reporteService.validarFiltros(query.filtros);
    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(', ')}`);
    }

    // Obtener reporte
    return await this.reporteService.generarReporte(query.filtros);
  }
}
