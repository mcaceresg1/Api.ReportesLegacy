import { injectable, inject } from 'inversify';
import { IReporteLibroMayorService } from '../../domain/services/IReporteLibroMayorService';
import { IReporteLibroMayorRepository } from '../../domain/repositories/IReporteLibroMayorRepository';
import { ReporteLibroMayorItem, FiltrosReporteLibroMayor, ReporteLibroMayorResponse, ResumenLibroMayor } from '../../domain/entities/ReporteLibroMayor';

@injectable()
export class ReporteLibroMayorService implements IReporteLibroMayorService {
  constructor(
    @inject('IReporteLibroMayorRepository') private readonly reporteLibroMayorRepository: IReporteLibroMayorRepository
  ) {}

  async validarFiltros(filtros: FiltrosReporteLibroMayor): Promise<{ valido: boolean; errores: string[] }> {
    const errores: string[] = [];

    // Validar campos requeridos
    if (!filtros.usuario || filtros.usuario.trim() === '') {
      errores.push('El usuario es requerido');
    }

    if (!filtros.fechaInicio) {
      errores.push('La fecha de inicio es requerida');
    }

    if (!filtros.fechaFin) {
      errores.push('La fecha de fin es requerida');
    }

    // Validar fechas
    if (filtros.fechaInicio && filtros.fechaFin) {
      if (filtros.fechaInicio > filtros.fechaFin) {
        errores.push('La fecha de inicio no puede ser mayor a la fecha de fin');
      }

      const diferenciaDias = Math.ceil((filtros.fechaFin.getTime() - filtros.fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      if (diferenciaDias > 365) {
        errores.push('El rango de fechas no puede exceder 1 año');
      }
    }

    // Validar contabilidad
    if (filtros.contabilidad && !['F', 'A', 'T'].includes(filtros.contabilidad)) {
      errores.push('El tipo de contabilidad debe ser F, A o T');
    }

    // Validar límites numéricos
    if (filtros.maximoRegistros && (filtros.maximoRegistros < 1 || filtros.maximoRegistros > 100000)) {
      errores.push('El máximo de registros debe estar entre 1 y 100,000');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  async prepararFiltros(filtros: FiltrosReporteLibroMayor): Promise<FiltrosReporteLibroMayor> {
    // Aplicar valores por defecto y validaciones
    const filtrosPreparados: FiltrosReporteLibroMayor = {
      ...filtros,
      fechaInicio: filtros.fechaInicio || new Date(),
      fechaFin: filtros.fechaFin || new Date(),
      contabilidad: filtros.contabilidad || 'T',
      maximoRegistros: filtros.maximoRegistros || 10000,
      incluirSaldosIniciales: filtros.incluirSaldosIniciales !== false,
      incluirMovimientos: filtros.incluirMovimientos !== false,
      incluirSaldosFinales: filtros.incluirSaldosFinales !== false,
      mostrarSoloCuentasConMovimiento: filtros.mostrarSoloCuentasConMovimiento || false,
      mostrarSoloCuentasConSaldo: filtros.mostrarSoloCuentasConSaldo || false,
      agruparPorPeriodoContable: filtros.agruparPorPeriodoContable || false,
      incluirTotalesPorCuenta: filtros.incluirTotalesPorCuenta !== false,
      incluirTotalesPorCentroCosto: filtros.incluirTotalesPorCentroCosto !== false,
      incluirTotalesPorPeriodo: filtros.incluirTotalesPorPeriodo !== false
    };

    return filtrosPreparados;
  }

  async aplicarRestriccionesSeguridad(filtros: FiltrosReporteLibroMayor, usuario: string): Promise<FiltrosReporteLibroMayor> {
    // Aquí se pueden aplicar restricciones de seguridad basadas en el usuario
    // Por ejemplo, limitar el acceso a ciertos conjuntos o períodos
    const filtrosConRestricciones: FiltrosReporteLibroMayor = {
      ...filtros,
      usuario: usuario // Asegurar que el usuario sea el correcto
    };

    return filtrosConRestricciones;
  }

  async generarReporteCompleto(filtros: FiltrosReporteLibroMayor): Promise<ReporteLibroMayorResponse> {
    try {
      // Generar datos del reporte
      const items = await this.generarDatosReporte(filtros);
      
      // Obtener resumen
      const resumen = await this.obtenerResumenReporte(filtros);

      // Crear respuesta completa
      const reporte: ReporteLibroMayorResponse = {
        items,
        resumen,
        filtrosAplicados: filtros,
        metadata: {
          totalRegistros: items.length,
          tiempoProcesamiento: 0, // Se calculará en el controlador
          fechaGeneracion: new Date(),
          version: '1.0.0'
        }
      };

      return reporte;
    } catch (error) {
      console.error('Error al generar reporte completo:', error);
      throw new Error(`Error al generar reporte completo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async generarDatosReporte(filtros: FiltrosReporteLibroMayor): Promise<ReporteLibroMayorItem[]> {
    try {
      return await this.reporteLibroMayorRepository.generarReporteLibroMayor(filtros);
    } catch (error) {
      console.error('Error al generar datos del reporte:', error);
      throw new Error(`Error al generar datos del reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async obtenerResumenReporte(filtros: FiltrosReporteLibroMayor): Promise<ResumenLibroMayor> {
    try {
      return await this.reporteLibroMayorRepository.obtenerResumenLibroMayor(filtros);
    } catch (error) {
      console.error('Error al obtener resumen del reporte:', error);
      throw new Error(`Error al obtener resumen del reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async exportarReporte(datos: ReporteLibroMayorItem[], formato: 'EXCEL' | 'PDF' | 'CSV' | 'HTML'): Promise<Buffer> {
    try {
      // Aquí se implementaría la lógica de exportación según el formato
      // Por ahora retornamos un buffer vacío
      switch (formato) {
        case 'EXCEL':
          return Buffer.from('Excel export - pendiente de implementar');
        case 'PDF':
          return Buffer.from('PDF export - pendiente de implementar');
        case 'CSV':
          return Buffer.from('CSV export - pendiente de implementar');
        case 'HTML':
          return Buffer.from('HTML export - pendiente de implementar');
        default:
          throw new Error('Formato de exportación no soportado');
      }
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      throw new Error(`Error al exportar reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async calcularTotalesYSubtotales(
    datos: ReporteLibroMayorItem[], 
    agruparPor: 'NINGUNO' | 'CUENTA' | 'CENTRO_COSTO' | 'TIPO_ASIENTO' | 'CLASE_ASIENTO' | 'FECHA' | 'USUARIO' | 'PERIODO_CONTABLE'
  ): Promise<ReporteLibroMayorItem[]> {
    try {
      if (agruparPor === 'NINGUNO') {
        return datos;
      }

      // Agrupar datos según el criterio especificado
      const grupos = new Map<string, ReporteLibroMayorItem[]>();
      
      datos.forEach(item => {
        let clave = '';
        switch (agruparPor) {
          case 'CUENTA':
            clave = item.cuentaContable;
            break;
          case 'CENTRO_COSTO':
            clave = item.centroCosto;
            break;
          case 'TIPO_ASIENTO':
            clave = item.tipoAsiento;
            break;
          case 'FECHA':
            clave = item.fecha.toISOString().split('T')[0] || '';
            break;
          case 'USUARIO':
            clave = item.usuario;
            break;
          case 'PERIODO_CONTABLE':
            clave = item.periodoContable;
            break;
          default:
            clave = 'OTRO';
        }

        if (!grupos.has(clave)) {
          grupos.set(clave, []);
        }
        grupos.get(clave)!.push(item);
      });

      // Generar totales por grupo
      const resultado: ReporteLibroMayorItem[] = [];
      
      grupos.forEach((itemsGrupo, clave) => {
        // Agregar items del grupo
        resultado.push(...itemsGrupo);
        
        // Agregar total del grupo
        const total = this.calcularTotalGrupo(itemsGrupo);
        if (total) {
          resultado.push(total);
        }
      });

      return resultado;
    } catch (error) {
      console.error('Error al calcular totales y subtotales:', error);
      return datos;
    }
  }

  async ordenarDatos(
    datos: ReporteLibroMayorItem[], 
    ordenarPor: 'FECHA' | 'CUENTA' | 'CENTRO_COSTO' | 'TIPO_ASIENTO' | 'CLASE_ASIENTO' | 'USUARIO' | 'VALOR' | 'PERIODO_CONTABLE',
    orden: 'ASC' | 'DESC'
  ): Promise<ReporteLibroMayorItem[]> {
    try {
      const datosOrdenados = [...datos];
      
      datosOrdenados.sort((a, b) => {
        let valorA: any;
        let valorB: any;

        switch (ordenarPor) {
          case 'FECHA':
            valorA = a.fecha.getTime();
            valorB = b.fecha.getTime();
            break;
          case 'CUENTA':
            valorA = a.cuentaContable;
            valorB = b.cuentaContable;
            break;
          case 'CENTRO_COSTO':
            valorA = a.centroCosto;
            valorB = b.centroCosto;
            break;
          case 'TIPO_ASIENTO':
            valorA = a.tipoAsiento;
            valorB = b.tipoAsiento;
            break;
          case 'USUARIO':
            valorA = a.usuario;
            valorB = b.usuario;
            break;
          case 'VALOR':
            valorA = (a.debitoLocal || 0) + (a.creditoLocal || 0);
            valorB = (b.debitoLocal || 0) + (b.creditoLocal || 0);
            break;
          case 'PERIODO_CONTABLE':
            valorA = a.periodoContable;
            valorB = b.periodoContable;
            break;
          default:
            return 0;
        }

        if (orden === 'ASC') {
          return valorA < valorB ? -1 : valorA > valorB ? 1 : 0;
        } else {
          return valorA > valorB ? -1 : valorA < valorB ? 1 : 0;
        }
      });

      return datosOrdenados;
    } catch (error) {
      console.error('Error al ordenar datos:', error);
      return datos;
    }
  }

  async aplicarFiltrosRango(datos: ReporteLibroMayorItem[], filtros: FiltrosReporteLibroMayor): Promise<ReporteLibroMayorItem[]> {
    try {
      return datos.filter(item => {
        // Filtros de saldo
        if (filtros.saldoMinimo > 0 && (item.saldoDeudor || 0) < filtros.saldoMinimo && (item.saldoAcreedor || 0) < filtros.saldoMinimo) {
          return false;
        }
        if (filtros.saldoMaximo > 0 && (item.saldoDeudor || 0) > filtros.saldoMaximo && (item.saldoAcreedor || 0) > filtros.saldoMaximo) {
          return false;
        }

        // Filtros de movimiento
        const movimientoTotal = (item.debitoLocal || 0) + (item.creditoLocal || 0);
        if (filtros.movimientoMinimo > 0 && movimientoTotal < filtros.movimientoMinimo) {
          return false;
        }
        if (filtros.movimientoMaximo > 0 && movimientoTotal > filtros.movimientoMaximo) {
          return false;
        }

        return true;
      });
    } catch (error) {
      console.error('Error al aplicar filtros de rango:', error);
      return datos;
    }
  }

  async limitarRegistros(datos: ReporteLibroMayorItem[], maximoRegistros: number): Promise<ReporteLibroMayorItem[]> {
    try {
      if (maximoRegistros <= 0 || maximoRegistros >= datos.length) {
        return datos;
      }
      return datos.slice(0, maximoRegistros);
    } catch (error) {
      console.error('Error al limitar registros:', error);
      return datos;
    }
  }

  async generarMetadatos(inicio: Date, datos: ReporteLibroMayorItem[]): Promise<{
    totalRegistros: number;
    tiempoProcesamiento: number;
    fechaGeneracion: Date;
    version: string;
  }> {
    try {
      const fin = new Date();
      const tiempoProcesamiento = fin.getTime() - inicio.getTime();

      return {
        totalRegistros: datos.length,
        tiempoProcesamiento,
        fechaGeneracion: fin,
        version: '1.0.0'
      };
    } catch (error) {
      console.error('Error al generar metadatos:', error);
      return {
        totalRegistros: datos.length,
        tiempoProcesamiento: 0,
        fechaGeneracion: new Date(),
        version: '1.0.0'
      };
    }
  }

  private calcularTotalGrupo(items: ReporteLibroMayorItem[]): ReporteLibroMayorItem | null {
    try {
      if (items.length === 0) return null;

      const primerItem = items[0];
      if (!primerItem) return null;

      const total: ReporteLibroMayorItem = {
        ...primerItem,
        cuentaContable: `${primerItem.cuentaContable}_TOTAL`,
        descripcion: `TOTAL ${primerItem.cuentaContable}`,
        debitoLocal: items.reduce((sum, item) => sum + (item.debitoLocal || 0), 0),
        creditoLocal: items.reduce((sum, item) => sum + (item.creditoLocal || 0), 0),
        debitoDolar: items.reduce((sum, item) => sum + (item.debitoDolar || 0), 0),
        creditoDolar: items.reduce((sum, item) => sum + (item.creditoDolar || 0), 0),
        saldoDeudor: items.reduce((sum, item) => sum + (item.saldoDeudor || 0), 0),
        saldoAcreedor: items.reduce((sum, item) => sum + (item.saldoAcreedor || 0), 0),
        saldoDeudorDolar: items.reduce((sum, item) => sum + (item.saldoDeudorDolar || 0), 0),
        saldoAcreedorDolar: items.reduce((sum, item) => sum + (item.saldoAcreedorDolar || 0), 0),
        creditoDolarMayor: items.reduce((sum, item) => sum + (item.creditoDolarMayor || 0), 0),
        tipoLinea: 3 // Indicador de línea de total
      };

      return total;
    } catch (error) {
      console.error('Error al calcular total del grupo:', error);
      return null;
    }
  }
}
