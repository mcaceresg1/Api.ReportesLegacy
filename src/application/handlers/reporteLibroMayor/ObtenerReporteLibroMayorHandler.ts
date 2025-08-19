import { injectable, inject } from 'inversify';
import { IQueryHandler } from '../../../domain/cqrs/IQueryHandler';
import { ObtenerReporteLibroMayorQuery } from '../../queries/reporteLibroMayor/ObtenerReporteLibroMayorQuery';
import { IReporteLibroMayorService } from '../../../domain/services/IReporteLibroMayorService';
import { ReporteLibroMayorResponse } from '../../../domain/entities/ReporteLibroMayor';

@injectable()
export class ObtenerReporteLibroMayorHandler implements IQueryHandler<ObtenerReporteLibroMayorQuery, ReporteLibroMayorResponse> {
  constructor(
    @inject('IReporteLibroMayorService') private readonly reporteLibroMayorService: IReporteLibroMayorService
  ) {}

  async handle(query: ObtenerReporteLibroMayorQuery): Promise<ReporteLibroMayorResponse> {
    try {
      // Validar filtros
      const validacion = await this.reporteLibroMayorService.validarFiltros(query.filtros);
      if (!validacion.valido) {
        throw new Error(`Filtros inválidos: ${validacion.errores.join(', ')}`);
      }

      // Preparar filtros
      const filtrosPreparados = await this.reporteLibroMayorService.prepararFiltros(query.filtros);

      // Aplicar restricciones de seguridad
      const filtrosConRestricciones = await this.reporteLibroMayorService.aplicarRestriccionesSeguridad(
        filtrosPreparados, 
        query.filtros.usuario
      );

      // Generar reporte completo
      const reporte = await this.reporteLibroMayorService.generarReporteCompleto(filtrosConRestricciones);

      return reporte;
    } catch (error) {
      console.error('Error al generar reporte de Libro Mayor:', error);
      throw new Error(`Error al generar reporte de Libro Mayor: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
