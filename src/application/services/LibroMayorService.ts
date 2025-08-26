import { injectable, inject } from 'inversify';
import { ILibroMayorService } from '../../domain/services/ILibroMayorService';
import { ILibroMayorRepository } from '../../domain/repositories/ILibroMayorRepository';
import { LibroMayor, LibroMayorFiltros, LibroMayorResponse } from '../../domain/entities/LibroMayor';

@injectable()
export class LibroMayorService implements ILibroMayorService {
  
  constructor(
    @inject('ILibroMayorRepository') private readonly libroMayorRepository: ILibroMayorRepository
  ) {}

  async generarReporte(filtros: LibroMayorFiltros): Promise<LibroMayorResponse> {
    try {
      return await this.libroMayorRepository.generarReporte(filtros);
    } catch (error) {
      console.error('Error en LibroMayorService.generarReporte:', error);
      throw error;
    }
  }

  async obtenerLibroMayor(filtros: LibroMayorFiltros): Promise<LibroMayorResponse> {
    try {
      return await this.libroMayorRepository.obtenerLibroMayor(filtros);
    } catch (error) {
      console.error('Error en LibroMayorService.obtenerLibroMayor:', error);
      throw error;
    }
  }

  async exportarExcel(filtros: LibroMayorFiltros): Promise<Buffer> {
    try {
      return await this.libroMayorRepository.exportarExcel(filtros);
    } catch (error) {
      console.error('Error en LibroMayorService.exportarExcel:', error);
      throw error;
    }
  }

  async exportarPDF(filtros: LibroMayorFiltros): Promise<Buffer> {
    try {
      return await this.libroMayorRepository.exportarPDF(filtros);
    } catch (error) {
      console.error('Error en LibroMayorService.exportarPDF:', error);
      throw error;
    }
  }
}
