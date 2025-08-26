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
    data: SaldoPromediosItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      console.log('📊 Service: Generando reporte paginado:', { page, limit });
      
      // Obtener datos paginados
      const data = await this.saldoPromediosRepository.generarReportePaginado(filtros, page, limit);
      
      // Obtener total de registros
      const total = await this.saldoPromediosRepository.obtenerTotalRegistros(filtros);
      
      const totalPages = Math.ceil(total / limit);
      
      console.log('📊 Service: Reporte generado exitosamente:', {
        registrosEnPagina: data.length,
        totalRegistros: total,
        pagina: page,
        totalPaginas: totalPages
      });
      
      return {
        data,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Error en servicio al generar reporte paginado:', error);
      throw error;
    }
  }
}
