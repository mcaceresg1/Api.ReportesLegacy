import { ReporteResumenAsientos, FiltrosResumenAsientos } from '../entities/ReporteResumenAsientos';

export interface IResumenAsientosService {
  generarReporteResumenAsientos(
    conjunto: string,
    filtros: FiltrosResumenAsientos
  ): Promise<ReporteResumenAsientos[]>;
  
  exportarExcel(
    conjunto: string,
    filtros: FiltrosResumenAsientos
  ): Promise<Buffer>;
}

