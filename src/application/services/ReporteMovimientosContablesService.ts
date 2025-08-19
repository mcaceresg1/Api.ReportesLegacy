import { injectable, inject } from 'inversify';
import { IReporteMovimientosContablesService } from '../../domain/services/IReporteMovimientosContablesService';
import { IReporteMovimientosContablesRepository } from '../../domain/repositories/IReporteMovimientosContablesRepository';
import { FiltrosReporteMovimientosContables, ReporteMovimientoContableItem } from '../../domain/entities/ReporteMovimientosContables';

@injectable()
export class ReporteMovimientosContablesService implements IReporteMovimientosContablesService {
  constructor(
    @inject('IReporteMovimientosContablesRepository')
    private readonly reporteMovimientosContablesRepository: IReporteMovimientosContablesRepository
  ) {}

  async obtener(conjunto: string, filtros: FiltrosReporteMovimientosContables): Promise<ReporteMovimientoContableItem[]> {
    return this.obtenerReporteMovimientosContables(conjunto, filtros);
  }

  async obtenerReporteMovimientosContables(conjunto: string, filtros: FiltrosReporteMovimientosContables): Promise<ReporteMovimientoContableItem[]> {
    try {
      // Validar parámetros obligatorios
      if (!conjunto || conjunto.trim() === '') {
        throw new Error('El parámetro conjunto es obligatorio');
      }

      if (!filtros.usuario || filtros.usuario.trim() === '') {
        throw new Error('El usuario es obligatorio');
      }

      if (!filtros.fechaInicio || !filtros.fechaFin) {
        throw new Error('Las fechas de inicio y fin son obligatorias');
      }

      if (filtros.fechaInicio > filtros.fechaFin) {
        throw new Error('La fecha de inicio no puede ser mayor que la fecha de fin');
      }

      // Validar y limpiar filtros de asientos
      if (filtros.asientos) {
        filtros.asientos = filtros.asientos.filter(a => a > 0);
      }
      if (filtros.asientosExcluir) {
        filtros.asientosExcluir = filtros.asientosExcluir.filter(a => a > 0);
      }
      if (filtros.rangoAsientos) {
        if (filtros.rangoAsientos.desde && filtros.rangoAsientos.hasta) {
          if (filtros.rangoAsientos.desde > filtros.rangoAsientos.hasta) {
            throw new Error('El rango de asientos es inválido');
          }
        }
      }

      // Validar y limpiar filtros de tipos de asiento
      if (filtros.tiposAsiento) {
        filtros.tiposAsiento = filtros.tiposAsiento.filter(t => t && t.trim() !== '');
      }
      if (filtros.tiposAsientoExcluir) {
        filtros.tiposAsientoExcluir = filtros.tiposAsientoExcluir.filter(t => t && t.trim() !== '');
      }

      // Validar y limpiar filtros de clase asiento
      if (filtros.clasesAsiento) {
        filtros.clasesAsiento = filtros.clasesAsiento.filter(c => c && c.trim() !== '');
      }
      if (filtros.clasesAsientoExcluir) {
        filtros.clasesAsientoExcluir = filtros.clasesAsientoExcluir.filter(c => c && c.trim() !== '');
      }

      // Validar y limpiar filtros de NITs
      if (filtros.nits) {
        filtros.nits = filtros.nits.filter(n => n && n.trim() !== '');
      }
      if (filtros.nitsExcluir) {
        filtros.nitsExcluir = filtros.nitsExcluir.filter(n => n && n.trim() !== '');
      }

      // Validar y limpiar filtros de centros de costo
      if (filtros.centrosCosto) {
        filtros.centrosCosto = filtros.centrosCosto.filter(c => c && c.trim() !== '');
      }
      if (filtros.centrosCostoExcluir) {
        filtros.centrosCostoExcluir = filtros.centrosCostoExcluir.filter(c => c && c.trim() !== '');
      }

      // Validar y limpiar filtros de referencias
      if (filtros.referencias) {
        filtros.referencias = filtros.referencias.filter(r => r && r.trim() !== '');
      }
      if (filtros.referenciasExcluir) {
        filtros.referenciasExcluir = filtros.referenciasExcluir.filter(r => r && r.trim() !== '');
      }

      // Validar y limpiar filtros de documentos
      if (filtros.documentos) {
        filtros.documentos = filtros.documentos.filter(d => d && d.trim() !== '');
      }
      if (filtros.documentosExcluir) {
        filtros.documentosExcluir = filtros.documentosExcluir.filter(d => d && d.trim() !== '');
      }

      // Validar y limpiar filtros de cuentas contables
      if (filtros.cuentasContables) {
        filtros.cuentasContables = filtros.cuentasContables.filter(c => c && c.trim() !== '');
      }
      if (filtros.cuentasContablesExcluir) {
        filtros.cuentasContablesExcluir = filtros.cuentasContablesExcluir.filter(c => c && c.trim() !== '');
      }

      // Validar criterios de cuenta contable
      if (filtros.criteriosCuentaContable) {
        filtros.criteriosCuentaContable = filtros.criteriosCuentaContable.filter(c => 
          c.activo && c.cuenta && c.cuenta.trim() !== '' && c.valor && c.valor.trim() !== ''
        );
      }

      // Validar campos personalizados
      if (filtros.camposPersonalizados) {
        filtros.camposPersonalizados = filtros.camposPersonalizados.filter(c => 
          c.activo && c.nombre && c.nombre.trim() !== '' && c.valor && c.valor.trim() !== ''
        );
      }

      // Validar límite de registros
      if (filtros.maximoRegistros) {
        if (filtros.maximoRegistros < 1 || filtros.maximoRegistros > 100000) {
          filtros.maximoRegistros = 1000; // Valor por defecto
        }
      }

      // Validar formato de exportación
      if (filtros.formatoExportacion && !['EXCEL', 'PDF', 'CSV', 'HTML'].includes(filtros.formatoExportacion)) {
        filtros.formatoExportacion = 'EXCEL';
      }

      // Validar agrupamiento
      if (filtros.agruparPor && !['NINGUNO', 'CUENTA', 'CENTRO_COSTO', 'TIPO_ASIENTO', 'CLASE_ASIENTO', 'FECHA', 'USUARIO'].includes(filtros.agruparPor)) {
        filtros.agruparPor = 'NINGUNO';
      }

      // Validar ordenamiento
      if (filtros.ordenarPor && !['FECHA', 'CUENTA', 'CENTRO_COSTO', 'TIPO_ASIENTO', 'CLASE_ASIENTO', 'USUARIO', 'VALOR'].includes(filtros.ordenarPor)) {
        filtros.ordenarPor = 'FECHA';
      }

      // Validar orden
      if (filtros.orden && !['ASC', 'DESC'].includes(filtros.orden)) {
        filtros.orden = 'ASC';
      }

      console.log('Filtros validados:', filtros);

      // Obtener el reporte del repositorio
      const resultados = await this.reporteMovimientosContablesRepository.obtener(conjunto, filtros);

      console.log(`Reporte generado exitosamente. Total de registros: ${resultados.length}`);

      return resultados;
    } catch (error) {
      console.error('Error en ReporteMovimientosContablesService:', error);
      throw error;
    }
  }

  async exportarExcel(conjunto: string, filtros: FiltrosReporteMovimientosContables): Promise<Buffer> {
    try {
      // Obtener los datos del reporte
      const datos = await this.obtenerReporteMovimientosContables(conjunto, filtros);
      
      // Generar Excel usando el repositorio
      const excelBuffer = await this.reporteMovimientosContablesRepository.exportarExcel(conjunto, filtros);
      
      return excelBuffer;
    } catch (error) {
      console.error('Error en ReporteMovimientosContablesService.exportarExcel:', error);
      throw error;
    }
  }
}
