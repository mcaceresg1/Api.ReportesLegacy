import { inject } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';
import { ISaldoPromediosService } from '../../domain/services/ISaldoPromediosService';
import { ISaldoPromediosRepository } from '../../domain/repositories/ISaldoPromediosRepository';
import { SaldoPromediosItem, FiltroSaldoPromedios, CuentaContableOption } from '../../domain/entities/SaldoPromedios';

export class SaldoPromediosService implements ISaldoPromediosService {
  constructor(
    @inject(TYPES.ISaldoPromediosRepository) private saldoPromediosRepository: ISaldoPromediosRepository
  ) {}

  async obtenerCuentasContables(conjunto: string): Promise<CuentaContableOption[]> {
    try {
      return await this.saldoPromediosRepository.obtenerCuentasContables(conjunto);
    } catch (error) {
      console.error('Error en servicio al obtener cuentas contables:', error);
      throw error;
    }
  }

  async generarReportePaginado(filtros: FiltroSaldoPromedios, page: number, limit: number): Promise<{
    success: boolean;
    data: SaldoPromediosItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    message: string;
  }> {
    try {
      console.log('📊 Service: Generando reporte paginado:', { page, limit });
      
      // Obtener datos paginados con formato estandarizado
      const resultado = await this.saldoPromediosRepository.generarReportePaginado(filtros, page, limit);
      
      console.log('📊 Service: Reporte generado exitosamente:', {
        registrosEnPagina: resultado.data.length,
        totalRegistros: resultado.pagination.total,
        pagina: resultado.pagination.page,
        totalPaginas: resultado.pagination.totalPages
      });
      
      return resultado;
    } catch (error) {
      console.error('Error en servicio al generar reporte paginado:', error);
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
        message: `Error al generar el reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
}
