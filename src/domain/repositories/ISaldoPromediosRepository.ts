import { CuentaContableOption, FiltroSaldoPromedios, SaldoPromediosItem } from '../entities/SaldoPromedios';

export interface ISaldoPromediosRepository {
  obtenerCuentasContables(conjunto: string): Promise<CuentaContableOption[]>;
  generarReportePaginado(filtros: FiltroSaldoPromedios, page: number, limit: number): Promise<{
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
  }>;
  obtenerTotalRegistros(filtros: FiltroSaldoPromedios): Promise<number>;
}
