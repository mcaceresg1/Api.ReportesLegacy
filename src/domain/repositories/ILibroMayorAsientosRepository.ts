import { LibroMayorAsientos, FiltrosLibroMayorAsientos, LibroMayorAsientosResponse, FiltroAsientosResponse } from '../entities/LibroMayorAsientos';

export interface ILibroMayorAsientosRepository {
  obtener(conjunto: string, filtros: FiltrosLibroMayorAsientos): Promise<LibroMayorAsientos[]>;
  obtenerFiltros(conjunto: string): Promise<FiltroAsientosResponse>;
  exportarExcel(conjunto: string, filtros: FiltrosLibroMayorAsientos): Promise<Buffer>;
  exportarPDF(conjunto: string, filtros: FiltrosLibroMayorAsientos): Promise<Buffer>;
}
