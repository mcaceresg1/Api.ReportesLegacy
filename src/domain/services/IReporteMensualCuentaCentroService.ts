import { ReporteMensualCuentaCentroItem } from '../entities/ReporteMensualCuentaCentro';

export interface IReporteMensualCuentaCentroService {
  obtenerPorAnio(
    conjunto: string,
    anio: number,
    contabilidad?: 'F' | 'A'
  ): Promise<ReporteMensualCuentaCentroItem[]>;
}
