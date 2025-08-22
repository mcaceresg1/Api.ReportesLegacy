import { inject } from 'inversify';
import { TYPES } from '../../infrastructure/container/container';
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

  async generarReporte(filtros: FiltroSaldoPromedios): Promise<SaldoPromediosItem[]> {
    try {
      return await this.saldoPromediosRepository.generarReporte(filtros);
    } catch (error) {
      console.error('Error en servicio al generar reporte:', error);
      throw error;
    }
  }

  async obtenerReporte(filtros: FiltroSaldoPromedios, pagina?: number, limite?: number): Promise<{ data: SaldoPromediosItem[], total: number }> {
    try {
      return await this.saldoPromediosRepository.obtenerReporte(filtros, pagina, limite);
    } catch (error) {
      console.error('Error en servicio al obtener reporte:', error);
      throw error;
    }
  }

  async limpiarDatos(): Promise<boolean> {
    try {
      return await this.saldoPromediosRepository.limpiarDatos();
    } catch (error) {
      console.error('Error en servicio al limpiar datos:', error);
      return false;
    }
  }
}
