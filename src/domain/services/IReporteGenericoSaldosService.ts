import { 
  FiltrosReporteGenericoSaldos, 
  ReporteGenericoSaldos, 
  FiltroCuentaContable, 
  DetalleCuentaContable,
  FiltroTipoDocumento,
  FiltroTipoAsiento,
  FiltroClaseAsiento
} from '../entities/ReporteGenericoSaldos';

export interface IReporteGenericoSaldosService {
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
  ): Promise<ReporteGenericoSaldos[]>;
  
  // Métodos de exportación
  exportarExcel(conjunto: string, filtros: FiltrosReporteGenericoSaldos): Promise<Buffer>;
  exportarPDF(conjunto: string, filtros: FiltrosReporteGenericoSaldos): Promise<Buffer>;
}
