import { ReporteMensualCuentaCentroItem } from '../entities/ReporteMensualCuentaCentro';

export interface IReporteMensualCuentaCentroRepository {
  obtenerPorAnio(
    conjunto: string,
    anio: number,
    contabilidad?: 'F' | 'A'
  ): Promise<ReporteMensualCuentaCentroItem[]>;
  
  exportarExcel(
    conjunto: string,
    anio: number,
    contabilidad: 'F' | 'A'
  ): Promise<Buffer>;
}
