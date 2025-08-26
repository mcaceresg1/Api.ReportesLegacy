import { CuentaContableOption, FiltroSaldoPromedios, SaldoPromediosItem } from '../entities/SaldoPromedios';

export interface ISaldoPromediosService {
  obtenerCuentasContables(conjunto: string): Promise<CuentaContableOption[]>;
  generarReportePaginado(filtros: FiltroSaldoPromedios, page: number, limit: number): Promise<{
    data: SaldoPromediosItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}
