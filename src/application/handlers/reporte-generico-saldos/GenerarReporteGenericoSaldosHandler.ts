import { injectable, inject } from 'inversify';
import { ICommandHandler } from '../../../domain/cqrs/ICommandHandler';
import { GenerarReporteGenericoSaldosCommand } from '../../commands/reporte-generico-saldos/GenerarReporteGenericoSaldosCommand';
import { IReporteGenericoSaldosService } from '../../../domain/services/IReporteGenericoSaldosService';
import { ReporteGenericoSaldos, ReporteGenericoSaldosResponse } from '../../../domain/entities/ReporteGenericoSaldos';

@injectable()
export class GenerarReporteGenericoSaldosHandler implements ICommandHandler<GenerarReporteGenericoSaldosCommand, ReporteGenericoSaldosResponse> {
  constructor(
    @inject('IReporteGenericoSaldosService') 
    private reporteGenericoSaldosService: IReporteGenericoSaldosService
  ) {}

  async handle(command: GenerarReporteGenericoSaldosCommand): Promise<ReporteGenericoSaldosResponse> {
    try {
      console.log(`🔍 GenerarReporteGenericoSaldosHandler - Procesando comando para conjunto: ${command.conjunto}`);
      console.log(`🔍 GenerarReporteGenericoSaldosHandler - Filtros:`, command.filtros);

      // Validar parámetros
      if (!command.conjunto) {
        throw new Error('El parámetro conjunto es requerido');
      }

      if (!command.filtros.fechaInicio || !command.filtros.fechaFin) {
        throw new Error('Las fechas de inicio y fin son requeridas');
      }

      // Generar el reporte usando el servicio
      const resultado = await this.reporteGenericoSaldosService.generarReporteGenericoSaldos(
        command.conjunto,
        command.filtros
      );

      console.log(`✅ GenerarReporteGenericoSaldosHandler - Reporte generado exitosamente. Registros: ${resultado.data.length}, Total: ${resultado.pagination.total}`);
      
      return resultado;
    } catch (error) {
      console.error('❌ Error en GenerarReporteGenericoSaldosHandler:', error);
      throw new Error(`Error al generar reporte genérico de saldos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
