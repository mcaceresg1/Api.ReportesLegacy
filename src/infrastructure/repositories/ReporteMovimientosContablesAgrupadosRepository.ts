import { injectable } from 'inversify';
import { IReporteMovimientosContablesAgrupadosRepository } from '../../domain/repositories/IReporteMovimientosContablesAgrupadosRepository';
import { 
  FiltrosReporteMovimientosContablesAgrupados, 
  RespuestaReporteMovimientosContablesAgrupados,
  ReporteMovimientoContableAgrupadoItem
} from '../../domain/entities/ReporteMovimientosContablesAgrupados';
import { exactusSequelize } from '../database/config/exactus-database';

@injectable()
export class ReporteMovimientosContablesAgrupadosRepository implements IReporteMovimientosContablesAgrupadosRepository {
  constructor(
    private readonly dbConnection: typeof exactusSequelize
  ) {}

  async obtenerReporte(filtros: FiltrosReporteMovimientosContablesAgrupados): Promise<RespuestaReporteMovimientosContablesAgrupados> {
    const startTime = Date.now();
    
    try {
      // Construir la consulta SQL basada en el query original
      const sql = this.construirConsultaSQL(filtros);
      
      // Ejecutar la consulta
      const result = await this.dbConnection.query(sql, {
        replacements: {
          conjunto: filtros.conjunto,
          fechaInicio: filtros.fechaInicio,
          fechaFin: filtros.fechaFin,
          contabilidad: filtros.contabilidad === 'T' ? ['F', 'A'] : [filtros.contabilidad]
        },
        type: 'SELECT'
      });

      // Procesar resultados
      const data = this.procesarResultados(result[0]);
      
      // Calcular totales
      const totalRegistros = data.length;
      const totalPaginas = Math.ceil(totalRegistros / (filtros.registrosPorPagina || 1000));
      const paginaActual = filtros.pagina || 1;
      
      // Aplicar paginación si es necesario
      let datosPaginados = data;
      if (filtros.registrosPorPagina && filtros.pagina) {
        const inicio = (filtros.pagina - 1) * filtros.registrosPorPagina;
        const fin = inicio + filtros.registrosPorPagina;
        datosPaginados = data.slice(inicio, fin);
      }

      // Aplicar ordenamiento
      datosPaginados = this.aplicarOrdenamiento(datosPaginados, filtros);

      const tiempoEjecucion = Date.now() - startTime;

      return {
        success: true,
        message: 'Reporte generado exitosamente',
        data: datosPaginados,
        totalRegistros,
        totalPaginas,
        paginaActual,
        registrosPorPagina: filtros.registrosPorPagina || 1000,
        filtrosAplicados: filtros,
        metadata: {
          conjunto: filtros.conjunto,
          fechaGeneracion: new Date(),
          usuario: 'system', // Se puede pasar desde el contexto
          formatoExportacion: filtros.formatoExportacion || 'JSON',
          agrupamiento: filtros.agruparPor,
          ordenamiento: filtros.ordenarPor,
          orden: filtros.orden,
          incluyeTotales: filtros.incluirTotales || false,
          incluyeSubtotales: filtros.incluirSubtotales || false,
          tiempoEjecucion
        }
      };

    } catch (error) {
      console.error('Error al generar reporte:', error);
      throw new Error(`Error al generar el reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async exportarReporte(
    filtros: FiltrosReporteMovimientosContablesAgrupados, 
    formato: 'EXCEL' | 'PDF' | 'CSV'
  ): Promise<Buffer> {
    // Obtener datos del reporte
    const reporte = await this.obtenerReporte(filtros);
    
    // Implementar exportación según el formato
    switch (formato) {
      case 'EXCEL':
        return this.exportarExcel(reporte.data);
      case 'PDF':
        return this.exportarPDF(reporte);
      case 'CSV':
        return this.exportarCSV(reporte.data);
      default:
        throw new Error(`Formato de exportación no soportado: ${formato}`);
    }
  }

  async obtenerEstadisticas(filtros: FiltrosReporteMovimientosContablesAgrupados): Promise<{
    totalLocal: number;
    totalDolar: number;
    totalRegistros: number;
    subtotales: Array<{
      grupo: string;
      valor: string;
      totalLocal: number;
      totalDolar: number;
      cantidadRegistros: number;
    }>;
  }> {
    const reporte = await this.obtenerReporte(filtros);
    
    // Calcular totales
    const totalLocal = reporte.data.reduce((sum, item) => sum + item.nMontoLocal, 0);
    const totalDolar = reporte.data.reduce((sum, item) => sum + item.nMontoDolar, 0);
    
    // Calcular subtotales por grupo
    const subtotales = this.calcularSubtotales(reporte.data, filtros.agruparPor);
    
    return {
      totalLocal,
      totalDolar,
      totalRegistros: reporte.totalRegistros,
      subtotales
    };
  }

  private construirConsultaSQL(filtros: FiltrosReporteMovimientosContablesAgrupados): string {
    let sql = '';
    
    // Construir consulta para diario
    if (filtros.incluirDiario) {
      sql += `
        SELECT 
          ISNULL('PESOS' as sNombreMonLocal, '') as sNombreMonLocal,
          ISNULL('DOLARES' as sNombreMonDolar, '') as sNombreMonDolar,
          ISNULL('CUENTA CONTABLE' as sTituloCuenta, '') as sTituloCuenta,
          ISNULL(c.descripcion, '') as sCuentaContableDesc,
          ISNULL('NIT' as sTituloNit, '') as sTituloNit,
          ISNULL(n.razon_social, '') as sNitNombre,
          ISNULL(m.referencia, '') as sReferencia,
          ISNULL(ISNULL(m.debito_local, m.credito_local * -1), 0) as nMontoLocal,
          ISNULL(ISNULL(m.debito_dolar, m.credito_dolar * -1), 0) as nMontoDolar,
          ISNULL(m.asiento, '') as sAsiento,
          ISNULL(m.cuenta_contable, '') as sCuentaContable,
          ISNULL(n.nit, '') as sNit,
          am.fecha as dtFecha,
          ISNULL(m.fuente, '') as sFuente,
          ISNULL(am.notas, '') as sNotas,
          ISNULL(NULL, '') as sDimension,
          ISNULL(NULL, '') as sDimensionDesc,
          ISNULL('', '') as sQuiebre1,
          ISNULL('', '') as sQuiebre2,
          ISNULL('', '') as sQuiebre3,
          ISNULL('', '') as sQuiebreDesc1,
          ISNULL('', '') as sQuiebreDesc2,
          ISNULL('', '') as sQuiebreDesc3,
          ISNULL(2, 0) as ORDEN
        FROM ${filtros.conjunto}.diario m
        INNER JOIN ${filtros.conjunto}.asiento_de_diario am ON m.asiento = am.asiento
        INNER JOIN ${filtros.conjunto}.cuenta_contable c ON m.cuenta_contable = c.cuenta_contable
        INNER JOIN ${filtros.conjunto}.nit n ON m.nit = n.nit
        WHERE 1=1
          AND am.contabilidad IN (@contabilidad)
          AND am.fecha >= @fechaInicio
          AND am.fecha <= @fechaFin
      `;
      
      // Agregar filtros adicionales
      if (filtros.cuentaContableDesde) {
        sql += ` AND m.cuenta_contable >= @cuentaContableDesde`;
      }
      if (filtros.cuentaContableHasta) {
        sql += ` AND m.cuenta_contable <= @cuentaContableHasta`;
      }
      if (filtros.nitDesde) {
        sql += ` AND n.nit >= @nitDesde`;
      }
      if (filtros.nitHasta) {
        sql += ` AND n.nit <= @nitHasta`;
      }
      if (filtros.asientoDesde) {
        sql += ` AND m.asiento >= @asientoDesde`;
      }
      if (filtros.asientoHasta) {
        sql += ` AND m.asiento <= @asientoHasta`;
      }
      if (filtros.fuentes && filtros.fuentes.length > 0) {
        sql += ` AND m.fuente IN (${filtros.fuentes.map(f => `'${f}'`).join(',')})`;
      }
    }

    // Agregar UNION si se incluyen ambas fuentes
    if (filtros.incluirDiario && filtros.incluirMayor) {
      sql += ' UNION ALL ';
    }

    // Construir consulta para mayor
    if (filtros.incluirMayor) {
      sql += `
        SELECT 
          ISNULL('PESOS' as sNombreMonLocal, '') as sNombreMonLocal,
          ISNULL('DOLARES' as sNombreMonDolar, '') as sNombreMonDolar,
          ISNULL('CUENTA CONTABLE' as sTituloCuenta, '') as sTituloCuenta,
          ISNULL(c.descripcion, '') as sCuentaContableDesc,
          ISNULL('NIT' as sTituloNit, '') as sTituloNit,
          ISNULL(n.razon_social, '') as sNitNombre,
          ISNULL(m.referencia, '') as sReferencia,
          ISNULL(ISNULL(m.debito_local, m.credito_local * -1), 0) as nMontoLocal,
          ISNULL(ISNULL(m.debito_dolar, m.credito_dolar * -1), 0) as nMontoDolar,
          ISNULL(m.asiento, '') as sAsiento,
          ISNULL(m.cuenta_contable, '') as sCuentaContable,
          ISNULL(n.nit, '') as sNit,
          am.fecha as dtFecha,
          ISNULL(m.fuente, '') as sFuente,
          ISNULL(am.notas, '') as sNotas,
          ISNULL(NULL, '') as sDimension,
          ISNULL(NULL, '') as sDimensionDesc,
          ISNULL('', '') as sQuiebre1,
          ISNULL('', '') as sQuiebre2,
          ISNULL('', '') as sQuiebre3,
          ISNULL('', '') as sQuiebreDesc1,
          ISNULL('', '') as sQuiebreDesc2,
          ISNULL('', '') as sQuiebreDesc3,
          ISNULL(2, 0) as ORDEN
        FROM ${filtros.conjunto}.mayor m
        INNER JOIN ${filtros.conjunto}.asiento_mayorizado am ON m.asiento = am.asiento
        INNER JOIN ${filtros.conjunto}.cuenta_contable c ON m.cuenta_contable = c.cuenta_contable
        INNER JOIN ${filtros.conjunto}.nit n ON m.nit = n.nit
        WHERE 1=1
          AND am.contabilidad IN (@contabilidad)
          AND am.fecha >= @fechaInicio
          AND am.fecha <= @fechaFin
      `;
      
      // Agregar filtros adicionales
      if (filtros.cuentaContableDesde) {
        sql += ` AND m.cuenta_contable >= @cuentaContableDesde`;
      }
      if (filtros.cuentaContableHasta) {
        sql += ` AND m.cuenta_contable <= @cuentaContableHasta`;
      }
      if (filtros.nitDesde) {
        sql += ` AND n.nit >= @nitDesde`;
      }
      if (filtros.nitHasta) {
        sql += ` AND n.nit <= @nitHasta`;
      }
      if (filtros.asientoDesde) {
        sql += ` AND m.asiento >= @asientoDesde`;
      }
      if (filtros.asientoHasta) {
        sql += ` AND m.asiento <= @asientoHasta`;
      }
      if (filtros.fuentes && filtros.fuentes.length > 0) {
        sql += ` AND m.fuente IN (${filtros.fuentes.map(f => `'${f}'`).join(',')})`;
      }
    }

    // Agregar ORDER BY
    sql += ` ORDER BY sCuentaContable, sNit, ORDEN, sFuente`;

    return sql;
  }

  private procesarResultados(recordset: any[]): ReporteMovimientoContableAgrupadoItem[] {
    return recordset.map(record => ({
      sNombreMonLocal: record.sNombreMonLocal || '',
      sNombreMonDolar: record.sNombreMonDolar || '',
      sTituloCuenta: record.sTituloCuenta || '',
      sCuentaContableDesc: record.sCuentaContableDesc || '',
      sTituloNit: record.sTituloNit || '',
      sNitNombre: record.sNitNombre || '',
      sReferencia: record.sReferencia || '',
      nMontoLocal: record.nMontoLocal || 0,
      nMontoDolar: record.nMontoDolar || 0,
      sAsiento: record.sAsiento || '',
      sCuentaContable: record.sCuentaContable || '',
      sNit: record.sNit || '',
      dtFecha: new Date(record.dtFecha),
      sFuente: record.sFuente || '',
      sNotas: record.sNotas || '',
      sDimension: record.sDimension || '',
      sDimensionDesc: record.sDimensionDesc || '',
      sQuiebre1: record.sQuiebre1 || '',
      sQuiebre2: record.sQuiebre2 || '',
      sQuiebre3: record.sQuiebre3 || '',
      sQuiebreDesc1: record.sQuiebreDesc1 || '',
      sQuiebreDesc2: record.sQuiebreDesc2 || '',
      sQuiebreDesc3: record.sQuiebreDesc3 || '',
      ORDEN: record.ORDEN || 0
    }));
  }

  private aplicarOrdenamiento(data: ReporteMovimientoContableAgrupadoItem[], filtros: FiltrosReporteMovimientosContablesAgrupados): ReporteMovimientoContableAgrupadoItem[] {
    const orden = filtros.orden === 'DESC' ? -1 : 1;
    
    return data.sort((a, b) => {
      let valorA: any, valorB: any;
      
      switch (filtros.ordenarPor) {
        case 'CUENTA':
          valorA = a.sCuentaContable;
          valorB = b.sCuentaContable;
          break;
        case 'NIT':
          valorA = a.sNit;
          valorB = b.sNit;
          break;
        case 'DIMENSION':
          valorA = a.sDimension;
          valorB = b.sDimension;
          break;
        case 'FECHA':
          valorA = a.dtFecha;
          valorB = b.dtFecha;
          break;
        case 'MONTO':
          valorA = Math.abs(a.nMontoLocal);
          valorB = Math.abs(b.nMontoLocal);
          break;
        default:
          valorA = a.sCuentaContable;
          valorB = b.sCuentaContable;
      }
      
      if (valorA < valorB) return -1 * orden;
      if (valorA > valorB) return 1 * orden;
      return 0;
    });
  }

  private calcularSubtotales(data: ReporteMovimientoContableAgrupadoItem[], agruparPor: string): Array<{
    grupo: string;
    valor: string;
    totalLocal: number;
    totalDolar: number;
    cantidadRegistros: number;
  }> {
    if (agruparPor === 'NINGUNO') return [];
    
    const grupos = new Map<string, {
      totalLocal: number;
      totalDolar: number;
      cantidadRegistros: number;
    }>();
    
         data.forEach(item => {
       let clave = '';
       switch (agruparPor) {
         case 'CUENTA':
           clave = item.sCuentaContable || '';
           break;
         case 'NIT':
           clave = item.sNit || '';
           break;
         case 'DIMENSION':
           clave = item.sDimension || '';
           break;
         case 'FECHA':
           const fechaStr = item.dtFecha.toISOString().split('T')[0];
           clave = fechaStr || '';
           break;
         default:
           clave = item.sCuentaContable || ''; // Valor por defecto
           break;
       }
       
       // Solo procesar si tenemos una clave válida
       if (clave && clave.trim() !== '') {
         if (!grupos.has(clave)) {
           grupos.set(clave, { totalLocal: 0, totalDolar: 0, cantidadRegistros: 0 });
         }
         
         const grupo = grupos.get(clave)!;
         grupo.totalLocal += item.nMontoLocal;
         grupo.totalDolar += item.nMontoDolar;
         grupo.cantidadRegistros++;
       }
     });
    
    return Array.from(grupos.entries()).map(([valor, datos]) => ({
      grupo: agruparPor,
      valor,
      totalLocal: datos.totalLocal,
      totalDolar: datos.totalDolar,
      cantidadRegistros: datos.cantidadRegistros
    }));
  }

  private exportarExcel(data: ReporteMovimientoContableAgrupadoItem[]): Buffer {
    // Implementar exportación a Excel
    throw new Error('Exportación a Excel no implementada');
  }

  private exportarPDF(reporte: RespuestaReporteMovimientosContablesAgrupados): Buffer {
    // Implementar exportación a PDF
    throw new Error('Exportación a PDF no implementada');
  }

  private exportarCSV(data: ReporteMovimientoContableAgrupadoItem[]): Buffer {
    // Implementar exportación a CSV
    throw new Error('Exportación a CSV no implementada');
  }
}
