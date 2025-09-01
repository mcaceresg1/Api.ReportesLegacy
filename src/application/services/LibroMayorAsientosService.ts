import { injectable, inject } from 'inversify';
import { ILibroMayorAsientosService } from '../../domain/services/ILibroMayorAsientosService';
import { ILibroMayorAsientosRepository } from '../../domain/repositories/ILibroMayorAsientosRepository';
import { FiltrosLibroMayorAsientos, LibroMayorAsientos, FiltroAsientosResponse } from '../../domain/entities/LibroMayorAsientos';

@injectable()
export class LibroMayorAsientosService implements ILibroMayorAsientosService {
  constructor(
    @inject('ILibroMayorAsientosRepository')
    private readonly libroMayorAsientosRepository: ILibroMayorAsientosRepository
  ) {}

  async obtener(conjunto: string, filtros: FiltrosLibroMayorAsientos): Promise<LibroMayorAsientos[]> {
    return this.obtenerReporteLibroMayorAsientos(conjunto, filtros);
  }

  async obtenerReporteLibroMayorAsientos(conjunto: string, filtros: FiltrosLibroMayorAsientos): Promise<LibroMayorAsientos[]> {
    try {
      // Validar parámetros obligatorios
      if (!conjunto || conjunto.trim() === '') {
        throw new Error('El parámetro conjunto es obligatorio');
      }

      // Validar fechas si están presentes
      if (filtros.fecha_desde && filtros.fecha_hasta) {
        const fechaDesde = new Date(filtros.fecha_desde);
        const fechaHasta = new Date(filtros.fecha_hasta);
        
        if (fechaDesde > fechaHasta) {
          throw new Error('La fecha de inicio no puede ser mayor que la fecha de fin');
        }
      }

      // Validar y limpiar filtros de asientos
      if (filtros.asiento && filtros.asiento.trim() === '') {
        delete filtros.asiento;
      }

      if (filtros.tipo_asiento && filtros.tipo_asiento.trim() === '') {
        delete filtros.tipo_asiento;
      }

      if (filtros.documento_global && filtros.documento_global.trim() === '') {
        delete filtros.documento_global;
      }

      // Validar arrays
      if (filtros.clases_asiento && filtros.clases_asiento.length === 0) {
        delete filtros.clases_asiento;
      }

      if (filtros.origen && filtros.origen.length === 0) {
        delete filtros.origen;
      }

      // Validar límite de registros
      if (filtros.limit) {
        if (filtros.limit < 1 || filtros.limit > 100000) {
          filtros.limit = 1000; // Valor por defecto
        }
      }

      console.log('Filtros validados:', filtros);

      // Obtener el reporte del repositorio
      const resultados = await this.libroMayorAsientosRepository.obtener(conjunto, filtros);

      console.log(`Reporte generado exitosamente. Total de registros: ${resultados.length}`);

      return resultados;
    } catch (error) {
      console.error('Error en LibroMayorAsientosService:', error);
      throw error;
    }
  }

  async obtenerFiltros(conjunto: string): Promise<FiltroAsientosResponse> {
    try {
      if (!conjunto || conjunto.trim() === '') {
        throw new Error('El parámetro conjunto es obligatorio');
      }

      return await this.libroMayorAsientosRepository.obtenerFiltros(conjunto);
    } catch (error) {
      console.error('Error en LibroMayorAsientosService.obtenerFiltros:', error);
      throw error;
    }
  }

  async exportarExcel(conjunto: string, filtros: FiltrosLibroMayorAsientos): Promise<Buffer> {
    try {
      // Obtener los datos del reporte
      const datos = await this.obtenerReporteLibroMayorAsientos(conjunto, filtros);
      
      // Generar Excel usando el repositorio
      const excelBuffer = await this.libroMayorAsientosRepository.exportarExcel(conjunto, filtros);
      
      return excelBuffer;
    } catch (error) {
      console.error('Error en LibroMayorAsientosService.exportarExcel:', error);
      throw error;
    }
  }

  async exportarPDF(conjunto: string, filtros: FiltrosLibroMayorAsientos): Promise<Buffer> {
    try {
      // Obtener los datos del reporte
      const datos = await this.obtenerReporteLibroMayorAsientos(conjunto, filtros);
      
      // Generar PDF usando el repositorio
      const pdfBuffer = await this.libroMayorAsientosRepository.exportarPDF(conjunto, filtros);
      
      return pdfBuffer;
    } catch (error) {
      console.error('Error en LibroMayorAsientosService.exportarPDF:', error);
      throw error;
    }
  }
}
