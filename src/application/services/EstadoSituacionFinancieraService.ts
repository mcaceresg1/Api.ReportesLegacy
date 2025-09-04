import { injectable, inject } from 'inversify';
import { IEstadoSituacionFinancieraService } from '../../domain/services/IEstadoSituacionFinancieraService';
import { EstadoSituacionFinancieraRepository } from '../../infrastructure/repositories/EstadoSituacionFinancieraRepository';
import { 
  EstadoSituacionFinanciera, 
  FiltrosEstadoSituacionFinanciera, 
  EstadoSituacionFinancieraRequest,
  EstadoSituacionFinancieraResponse,
  TipoBalanceInfo,
  PeriodoContableInfo,
  TiposBalanceResponse,
  PeriodosContablesResponse,
  GenerarEstadoSituacionFinancieraParams,
  ExportarEstadoSituacionFinancieraExcelParams,
  ExportarEstadoSituacionFinancieraPDFParams
} from '../../domain/entities/EstadoSituacionFinanciera';
import { TYPES } from '../../infrastructure/container/types';

@injectable()
export class EstadoSituacionFinancieraService implements IEstadoSituacionFinancieraService {
  constructor(
    @inject(TYPES.EstadoSituacionFinancieraRepository) 
    private repository: EstadoSituacionFinancieraRepository
  ) {}

  /**
   * Obtiene los tipos de balance disponibles
   */
  async obtenerTiposBalance(conjunto: string, usuario: string = 'ADMPQUES'): Promise<TiposBalanceResponse> {
    try {
      console.log(`🔍 Obteniendo tipos de balance para conjunto: ${conjunto}, usuario: ${usuario}`);
      
      const result = await this.repository.obtenerTiposBalance(conjunto, usuario);
      
      console.log(`✅ Tipos de balance obtenidos: ${result.data.length} registros`);
      return result;
    } catch (error) {
      console.error('❌ Error en servicio al obtener tipos de balance:', error);
      return {
        success: false,
        data: [],
        message: 'Error al obtener tipos de balance'
      };
    }
  }

  /**
   * Obtiene los períodos contables disponibles
   */
  async obtenerPeriodosContables(conjunto: string, fecha: string): Promise<PeriodosContablesResponse> {
    try {
      console.log(`🔍 Obteniendo períodos contables para conjunto: ${conjunto}, fecha: ${fecha}`);
      
      const result = await this.repository.obtenerPeriodosContables(conjunto, fecha);
      
      console.log(`✅ Períodos contables obtenidos: ${result.data.length} registros`);
      return result;
    } catch (error) {
      console.error('❌ Error en servicio al obtener períodos contables:', error);
      return {
        success: false,
        data: [],
        message: 'Error al obtener períodos contables'
      };
    }
  }

  /**
   * Genera el reporte de Estado de Situación Financiera
   */
  async generarReporte(params: GenerarEstadoSituacionFinancieraParams): Promise<boolean> {
    try {
      console.log('🚀 Generando reporte de Estado de Situación Financiera:', params);
      
      const result = await this.repository.generarReporte(params);
      
      console.log('✅ Reporte generado exitosamente');
      return result;
    } catch (error) {
      console.error('❌ Error en servicio al generar reporte:', error);
      throw error;
    }
  }

  /**
   * Obtiene los datos del Estado de Situación Financiera
   */
  async obtenerEstadoSituacionFinanciera(request: EstadoSituacionFinancieraRequest): Promise<EstadoSituacionFinancieraResponse> {
    try {
      console.log('📊 Obteniendo datos del Estado de Situación Financiera:', request);
      
      const result = await this.repository.obtenerEstadoSituacionFinanciera(request);
      
      console.log(`✅ Datos obtenidos: ${result.data.length} registros`);
      return result;
    } catch (error) {
      console.error('❌ Error en servicio al obtener datos:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 25,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: 'Error al obtener datos'
      };
    }
  }

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(params: ExportarEstadoSituacionFinancieraExcelParams): Promise<Buffer> {
    try {
      console.log('📊 Exportando Estado de Situación Financiera a Excel:', params);
      
      const result = await this.repository.exportarExcel(params);
      
      console.log('✅ Archivo Excel generado exitosamente');
      return result;
    } catch (error) {
      console.error('❌ Error en servicio al exportar Excel:', error);
      throw error;
    }
  }

  /**
   * Exporta el reporte a PDF
   */
  async exportarPDF(params: ExportarEstadoSituacionFinancieraPDFParams): Promise<Buffer> {
    try {
      console.log('📊 Exportando Estado de Situación Financiera a PDF:', params);
      
      const result = await this.repository.exportarPDF(params);
      
      console.log('✅ Archivo PDF generado exitosamente');
      return result;
    } catch (error) {
      console.error('❌ Error en servicio al exportar PDF:', error);
      throw error;
    }
  }
}
