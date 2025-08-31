import { LibroMayorContabilidad, FiltrosLibroMayorContabilidad } from '../entities/LibroMayorContabilidad';

export interface ILibroMayorContabilidadRepository {
  // Métodos básicos CRUD
  getAll(): Promise<LibroMayorContabilidad[]>;
  getById(id: number): Promise<LibroMayorContabilidad | null>;
  create(entity: LibroMayorContabilidad): Promise<LibroMayorContabilidad>;
  update(id: number, entity: Partial<LibroMayorContabilidad>): Promise<LibroMayorContabilidad>;
  delete(id: number): Promise<boolean>;
  
  // Métodos específicos del negocio
  generarReporte(usuario: string, filtros: FiltrosLibroMayorContabilidad, fechaInicial: string, fechaFinal: string): Promise<number>;
  limpiarReporte(usuario: string): Promise<number>;
  obtenerReporteGenerado(usuario: string): Promise<LibroMayorContabilidad[]>;
  
  // Métodos de consulta con filtros
  getByFiltros(filtros: FiltrosLibroMayorContabilidad, page?: number, limit?: number): Promise<{
    data: LibroMayorContabilidad[];
    total: number;
    page: number;
    limit: number;
  }>;
  
  // Métodos de consulta específicos
  getByCuentaContable(cuentaContable: string): Promise<LibroMayorContabilidad[]>;
  getByCentroCosto(centroCosto: string): Promise<LibroMayorContabilidad[]>;
  getByFechaRange(fechaInicial: Date, fechaFinal: Date): Promise<LibroMayorContabilidad[]>;
  getByAsiento(asiento: string): Promise<LibroMayorContabilidad[]>;
  getByNIT(nit: string): Promise<LibroMayorContabilidad[]>;
  
  // Métodos de agregación
  getSaldosPorCuenta(fechaInicial: Date, fechaFinal: Date): Promise<any[]>;
  getSaldosPorCentroCosto(fechaInicial: Date, fechaFinal: Date): Promise<any[]>;
  getResumenPorPeriodo(fechaInicial: Date, fechaFinal: Date): Promise<any[]>;
  
  // Métodos de exportación
  exportarReporte(filtros: FiltrosLibroMayorContabilidad, formato: string): Promise<Buffer>;
}
