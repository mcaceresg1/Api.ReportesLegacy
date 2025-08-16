import { injectable } from 'inversify';
import { IReporteMovimientosContablesAgrupadosService } from '../../domain/services/IReporteMovimientosContablesAgrupadosService';
import { 
  FiltrosReporteMovimientosContablesAgrupados, 
  RespuestaReporteMovimientosContablesAgrupados 
} from '../../domain/entities/ReporteMovimientosContablesAgrupados';
import { IReporteMovimientosContablesAgrupadosRepository } from '../../domain/repositories/IReporteMovimientosContablesAgrupadosRepository';

@injectable()
export class ReporteMovimientosContablesAgrupadosService implements IReporteMovimientosContablesAgrupadosService {
  constructor(
    private readonly reporteRepository: IReporteMovimientosContablesAgrupadosRepository
  ) {}

  async generarReporte(filtros: FiltrosReporteMovimientosContablesAgrupados): Promise<RespuestaReporteMovimientosContablesAgrupados> {
    return await this.reporteRepository.obtenerReporte(filtros);
  }

  async exportarReporte(
    filtros: FiltrosReporteMovimientosContablesAgrupados, 
    formato: 'EXCEL' | 'PDF' | 'CSV'
  ): Promise<Buffer> {
    return await this.reporteRepository.exportarReporte(filtros, formato);
  }

  async obtenerEstadisticas(filtros: FiltrosReporteMovimientosContablesAgrupados): Promise<{
    totalLocal: number;
    totalDolar: number;
    totalRegistros: number;
    subtotales: Array<{
      grupo: string;
      valor: string;
      totalLocal: number;
      totalDolar: number;
      cantidadRegistros: number;
    }>;
  }> {
    return await this.reporteRepository.obtenerEstadisticas(filtros);
  }

  validarFiltros(filtros: FiltrosReporteMovimientosContablesAgrupados): string[] {
    const errores: string[] = [];

    // Validar campos obligatorios
    if (!filtros.conjunto) {
      errores.push('El conjunto es obligatorio');
    }

    if (!filtros.fechaInicio) {
      errores.push('La fecha de inicio es obligatoria');
    }

    if (!filtros.fechaFin) {
      errores.push('La fecha de fin es obligatoria');
    }

    if (!filtros.contabilidad) {
      errores.push('El tipo de contabilidad es obligatorio');
    }

    // Validar fechas
    if (filtros.fechaInicio && filtros.fechaFin) {
      const fechaInicio = new Date(filtros.fechaInicio);
      const fechaFin = new Date(filtros.fechaFin);
      
      if (isNaN(fechaInicio.getTime())) {
        errores.push('La fecha de inicio no es válida');
      }
      
      if (isNaN(fechaFin.getTime())) {
        errores.push('La fecha de fin no es válida');
      }
      
      if (fechaInicio > fechaFin) {
        errores.push('La fecha de inicio no puede ser mayor a la fecha de fin');
      }
    }

    // Validar contabilidad
    if (filtros.contabilidad && !['F', 'A', 'T'].includes(filtros.contabilidad)) {
      errores.push('El tipo de contabilidad debe ser F, A o T');
    }

    // Validar paginación
    if (filtros.pagina && filtros.pagina < 1) {
      errores.push('La página debe ser mayor a 0');
    }

    if (filtros.registrosPorPagina && (filtros.registrosPorPagina < 1 || filtros.registrosPorPagina > 10000)) {
      errores.push('Los registros por página deben estar entre 1 y 10000');
    }

    // Validar que al menos una fuente esté habilitada
    if (!filtros.incluirDiario && !filtros.incluirMayor) {
      errores.push('Debe incluir al menos una fuente (diario o mayor)');
    }

    return errores;
  }
}
