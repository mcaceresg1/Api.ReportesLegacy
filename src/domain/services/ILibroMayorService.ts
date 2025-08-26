import { LibroMayor, LibroMayorFiltros, LibroMayorResponse } from '../entities/LibroMayor';

export interface ILibroMayorService {
  generarReporte(filtros: LibroMayorFiltros): Promise<LibroMayorResponse>;
  obtenerLibroMayor(filtros: LibroMayorFiltros): Promise<LibroMayorResponse>;
  exportarExcel(filtros: LibroMayorFiltros): Promise<Buffer>;
  exportarPDF(filtros: LibroMayorFiltros): Promise<Buffer>;
}
