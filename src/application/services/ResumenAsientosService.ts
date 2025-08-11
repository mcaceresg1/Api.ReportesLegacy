import { injectable, inject } from 'inversify';
import { IResumenAsientosService } from '../../domain/services/IResumenAsientosService';
import { IResumenAsientosRepository } from '../../domain/repositories/IResumenAsientosRepository';
import { ReporteResumenAsientos, FiltrosResumenAsientos } from '../../domain/entities/ReporteResumenAsientos';

@injectable()
export class ResumenAsientosService implements IResumenAsientosService {
  constructor(
    @inject('IResumenAsientosRepository') 
    private resumenAsientosRepository: IResumenAsientosRepository
  ) {}

  async generarReporteResumenAsientos(
    conjunto: string,
    filtros: FiltrosResumenAsientos
  ): Promise<ReporteResumenAsientos[]> {
    try {
      console.log(`🔍 Generando reporte de resumen de asientos para conjunto: ${conjunto}`);
      console.log('📋 Filtros aplicados:', filtros);

      // Validar conjunto
      if (!conjunto || conjunto.trim() === '') {
        throw new Error('El conjunto es requerido');
      }

      // Validar fechas
      if (filtros.fechaInicio && filtros.fechaFin) {
        if (filtros.fechaInicio > filtros.fechaFin) {
          throw new Error('La fecha de inicio no puede ser mayor a la fecha final');
        }
      }

      // Generar reporte
      const resultado = await this.resumenAsientosRepository.obtenerResumenAsientos(conjunto, filtros);
      
      console.log(`✅ Reporte generado exitosamente con ${resultado.length} registros`);
      
      return resultado;

    } catch (error) {
      console.error('❌ Error en ResumenAsientosService.generarReporteResumenAsientos:', error);
      throw new Error(`Error al generar reporte de resumen de asientos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
