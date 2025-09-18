import { 
  FiltrosReporteGenericoSaldos, 
  ReporteGenericoSaldos, 
  ReporteGenericoSaldosResponse,
  FiltroCuentaContable, 
  DetalleCuentaContable,
  FiltroTipoDocumento,
  FiltroTipoAsiento,
  FiltroClaseAsiento
} from '../entities/ReporteGenericoSaldos';

export interface IReporteGenericoSaldosRepository {
  // Métodos para filtros
  obtenerFiltroCuentasContables(conjunto: string): Promise<FiltroCuentaContable[]>;
  obtenerDetalleCuentaContable(conjunto: string, cuentaContable: string): Promise<DetalleCuentaContable | null>;
  obtenerFiltroTiposDocumento(conjunto: string): Promise<FiltroTipoDocumento[]>;
  obtenerFiltroTiposAsiento(conjunto: string): Promise<FiltroTipoAsiento[]>;
  obtenerFiltroClasesAsiento(conjunto: string): Promise<FiltroClaseAsiento[]>;
  
  // Método principal para generar el reporte
  generarReporteGenericoSaldos(
    conjunto: string,
    filtros: FiltrosReporteGenericoSaldos
  ): Promise<ReporteGenericoSaldosResponse>;
  
  // Métodos de exportación
  exportarExcel(conjunto: string, filtros: FiltrosReporteGenericoSaldos): Promise<Buffer>;
  exportarPDF(conjunto: string, filtros: FiltrosReporteGenericoSaldos): Promise<Buffer>;
  
  // Métodos de caché
  limpiarCache(): Promise<void>;
  obtenerEstadisticasCache(): { totalTablas: number; tablas: any[] };
}
