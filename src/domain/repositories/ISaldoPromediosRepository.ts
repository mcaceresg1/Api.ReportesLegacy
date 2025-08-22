import { SaldoPromediosItem, FiltroSaldoPromedios, CuentaContableOption } from '../entities/SaldoPromedios';

export interface ISaldoPromediosRepository {
  obtenerCuentasContables(conjunto: string): Promise<CuentaContableOption[]>;
  generarReporte(filtros: FiltroSaldoPromedios): Promise<SaldoPromediosItem[]>;
  obtenerReporte(filtros: FiltroSaldoPromedios, pagina?: number, limite?: number): Promise<{ data: SaldoPromediosItem[], total: number }>;
  limpiarDatos(): Promise<boolean>;
}
