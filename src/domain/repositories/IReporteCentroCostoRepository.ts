import { FiltroCuentaContable, ReporteCentroCosto, DetalleCuentaContable } from '../entities/ReporteCentroCosto';

export interface IReporteCentroCostoRepository {
  obtenerFiltroCuentasContables(conjunto: string): Promise<FiltroCuentaContable[]>;
  obtenerDetalleCuentaContable(conjunto: string, cuentaContable: string): Promise<DetalleCuentaContable | null>;
  obtenerCentrosCostoPorCuentaContable(
    conjunto: string, 
    cuentaContable: string,
    page?: number,
    limit?: number
  ): Promise<{ data: ReporteCentroCosto[], pagination: any }>;
  obtenerCentrosCostoCount(conjunto: string, cuentaContable: string): Promise<number>;
}
