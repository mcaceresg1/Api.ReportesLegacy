import { CuentaContableOption, FiltroSaldoPromedios, SaldoPromediosItem } from '../entities/SaldoPromedios';

export interface ISaldoPromediosRepository {
  obtenerCuentasContables(conjunto: string): Promise<CuentaContableOption[]>;
  generarReportePaginado(filtros: FiltroSaldoPromedios, page: number, limit: number): Promise<SaldoPromediosItem[]>;
  obtenerTotalRegistros(filtros: FiltroSaldoPromedios): Promise<number>;
}
