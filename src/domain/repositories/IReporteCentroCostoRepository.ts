import { FiltroCuentaContable, ReporteCentroCosto, DetalleCuentaContable } from '../entities/ReporteCentroCosto';

export interface IReporteCentroCostoRepository {
  obtenerFiltroCuentasContables(conjunto: string): Promise<FiltroCuentaContable[]>;
  obtenerDetalleCuentaContable(conjunto: string, cuentaContable: string): Promise<DetalleCuentaContable | null>;
  obtenerCentrosCostoPorCuentaContable(
    conjunto: string, 
    cuentaContable: string,
    page?: number,
    limit?: number
  ): Promise<{
    success: boolean;
    data: ReporteCentroCosto[];
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
  obtenerCentrosCostoCount(conjunto: string, cuentaContable: string): Promise<number>;
  exportarExcel(conjunto: string, cuentaContable: string): Promise<Buffer>;
}
