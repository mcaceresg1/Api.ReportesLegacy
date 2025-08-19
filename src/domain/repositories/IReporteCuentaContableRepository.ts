import { ReporteCuentaContable, FiltroCentroCosto } from '../entities/ReporteCuentaContable';

export interface IReporteCuentaContableRepository {
  obtenerFiltroCentrosCosto(conjunto: string): Promise<FiltroCentroCosto[]>;
  
  obtenerCentroCostoPorCodigo(conjunto: string, centroCosto: string): Promise<FiltroCentroCosto | null>;
  
  obtenerCuentasContablesPorCentroCosto(
    conjunto: string, 
    centroCosto: string,
    limit?: number,
    offset?: number
  ): Promise<ReporteCuentaContable[]>;
  
  obtenerCuentasContablesCount(conjunto: string, centroCosto: string): Promise<number>;
  exportarExcel(conjunto: string, centroCosto: string): Promise<Buffer>;
}
