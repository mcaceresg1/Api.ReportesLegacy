import { 
  LibroMayorContabilidad, 
  FiltrosLibroMayorContabilidad, 
  CuentaContableInfo, 
  PeriodoContableInfo,
  TipoAsientoInfo,
  CentroCostoInfo,
  PaqueteInfo
} from '../entities/LibroMayorContabilidad';

export interface ILibroMayorContabilidadService {
  obtenerCuentasContables(conjunto: string): Promise<CuentaContableInfo[]>;
  obtenerPeriodosContables(conjunto: string): Promise<PeriodoContableInfo[]>;
  obtenerTiposAsiento(conjunto: string): Promise<TipoAsientoInfo[]>;
  obtenerCentrosCosto(conjunto: string): Promise<CentroCostoInfo[]>;
  obtenerPaquetes(conjunto: string): Promise<PaqueteInfo[]>;
  generarReporte(filtros: FiltrosLibroMayorContabilidad): Promise<LibroMayorContabilidad[]>;
  obtenerLibroMayorContabilidad(filtros: FiltrosLibroMayorContabilidad): Promise<{
    data: LibroMayorContabilidad[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>;
  exportarExcel(filtros: FiltrosLibroMayorContabilidad): Promise<Buffer>;
  exportarPDF(filtros: FiltrosLibroMayorContabilidad): Promise<Buffer>;
}
