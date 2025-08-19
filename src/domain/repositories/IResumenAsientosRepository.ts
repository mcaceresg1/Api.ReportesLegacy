import { ReporteResumenAsientos, FiltrosResumenAsientos } from '../entities/ReporteResumenAsientos';

export interface IResumenAsientosRepository {
  obtenerResumenAsientos(
    conjunto: string,
    filtros: FiltrosResumenAsientos
  ): Promise<ReporteResumenAsientos[]>;
  
  exportarExcel(
    conjunto: string,
    filtros: FiltrosResumenAsientos
  ): Promise<Buffer>;
}

