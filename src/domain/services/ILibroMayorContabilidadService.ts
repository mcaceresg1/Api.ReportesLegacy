import { LibroMayorContabilidad, FiltrosLibroMayorContabilidad } from '../entities/LibroMayorContabilidad';

export interface ILibroMayorContabilidadService {
  // Métodos básicos CRUD
  getAllLibrosMayor(): Promise<LibroMayorContabilidad[]>;
  getLibroMayorById(id: number): Promise<LibroMayorContabilidad | null>;
  createLibroMayor(entity: LibroMayorContabilidad): Promise<LibroMayorContabilidad>;
  updateLibroMayor(id: number, entity: Partial<LibroMayorContabilidad>): Promise<LibroMayorContabilidad>;
  deleteLibroMayor(id: number): Promise<boolean>;
  
  // Métodos específicos del negocio
  generarReporteLibroMayor(usuario: string, filtros: FiltrosLibroMayorContabilidad, fechaInicial: string, fechaFinal: string): Promise<{
    registrosGenerados: number;
    fechaGeneracion: Date;
    usuario: string;
    filtros: FiltrosLibroMayorContabilidad;
  }>;
  
  limpiarReporteLibroMayor(usuario: string): Promise<{
    registrosEliminados: number;
    fechaLimpieza: Date;
    usuario: string;
  }>;
  
  obtenerReporteGenerado(usuario: string): Promise<LibroMayorContabilidad[]>;
  
  // Métodos de consulta con filtros
  getLibrosMayorByFiltros(filtros: FiltrosLibroMayorContabilidad, page?: number, limit?: number): Promise<{
    data: LibroMayorContabilidad[];
    total: number;
    page: number;
    limit: number;
  }>;
  
  // Métodos de consulta específicos
  getLibrosMayorByCuentaContable(cuentaContable: string): Promise<LibroMayorContabilidad[]>;
  getLibrosMayorByCentroCosto(centroCosto: string): Promise<LibroMayorContabilidad[]>;
  getLibrosMayorByFechaRange(fechaInicial: Date, fechaFinal: Date): Promise<LibroMayorContabilidad[]>;
  getLibrosMayorByAsiento(asiento: string): Promise<LibroMayorContabilidad[]>;
  getLibrosMayorByNIT(nit: string): Promise<LibroMayorContabilidad[]>;
  
  // Métodos de agregación
  getSaldosPorCuenta(fechaInicial: Date, fechaFinal: Date): Promise<any[]>;
  getSaldosPorCentroCosto(fechaInicial: Date, fechaFinal: Date): Promise<any[]>;
  getResumenPorPeriodo(fechaInicial: Date, fechaFinal: Date): Promise<any[]>;
  
  // Métodos de exportación
  exportarReporteLibroMayor(filtros: FiltrosLibroMayorContabilidad, formato: string): Promise<Buffer>;
  
  // Métodos de validación
  validarFiltros(filtros: FiltrosLibroMayorContabilidad): Promise<boolean>;
  validarFechas(fechaInicial: string, fechaFinal: string): Promise<boolean>;
}
