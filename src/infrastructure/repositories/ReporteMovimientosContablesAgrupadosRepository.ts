import { injectable, inject } from 'inversify';
import { exactusSequelize } from '../database/config/exactus-database';
import { 
  FiltrosReporteMovimientosContablesAgrupados, 
  RespuestaReporteMovimientosContablesAgrupados,
  ReporteMovimientoContableAgrupadoItem 
} from '../../domain/entities/ReporteMovimientosContablesAgrupados';
import { IReporteMovimientosContablesAgrupadosRepository } from '../../domain/repositories/IReporteMovimientosContablesAgrupadosRepository';
import * as XLSX from 'xlsx';

@injectable()
export class ReporteMovimientosContablesAgrupadosRepository implements IReporteMovimientosContablesAgrupadosRepository {

  async obtenerReporte(filtros: FiltrosReporteMovimientosContablesAgrupados): Promise<RespuestaReporteMovimientosContablesAgrupados> {
    const startTime = Date.now();
    
    try {
      // Construir la consulta SQL basada en el query original
      const sql = this.construirConsultaSQL(filtros);
      
      // Preparar los parámetros para la consulta
      const replacements: any = {
        conjunto: filtros.conjunto,
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin,
        contabilidad: filtros.contabilidad === 'T' ? ['F', 'A'] : [filtros.contabilidad]
      };

      // Agregar parámetros opcionales si existen
      if (filtros.cuentaContableDesde) replacements.cuentaContableDesde = filtros.cuentaContableDesde;
      if (filtros.cuentaContableHasta) replacements.cuentaContableHasta = filtros.cuentaContableHasta;
      if (filtros.nitDesde) replacements.nitDesde = filtros.nitDesde;
      if (filtros.nitHasta) replacements.nitHasta = filtros.nitHasta;
      if (filtros.asientoDesde) replacements.asientoDesde = filtros.asientoDesde;
      if (filtros.asientoHasta) replacements.asientoHasta = filtros.asientoHasta;
      
      console.log('SQL Query:', sql);
      console.log('Replacements:', replacements);
      
      // Ejecutar la consulta
      const result = await exactusSequelize.query(sql, {
        replacements,
        type: 'SELECT'
      });

      console.log('Result type:', typeof result);
      console.log('Result is array:', Array.isArray(result));
      console.log('Result length:', Array.isArray(result) ? result.length : 'N/A');
      console.log('Result[0] type:', typeof result[0]);
      console.log('Result[0] is array:', Array.isArray(result[0]));
      if (Array.isArray(result) && result[0]) {
        console.log('Result[0] length:', result[0].length);
        console.log('First record sample:', result[0][0]);
      }

      // Procesar resultados
      const data = this.procesarResultados(result);
      
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

    if (filtros.incluirDiario !== false) {
      sql += `
        SELECT
          'PESOS' as sNombreMonLocal,
          'DOLARES' as sNombreMonDolar,
          'CUENTA CONTABLE' as sTituloCuenta,
          ISNULL(c.descripcion, '') as sCuentaContableDesc,
          'NIT' as sTituloNit,
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
          '' as sDimension,
          '' as sDimensionDesc,
          '' as sQuiebre1,
          '' as sQuiebre2,
          '' as sQuiebre3,
          '' as sQuiebreDesc1,
          '' as sQuiebreDesc2,
          '' as sQuiebreDesc3,
          1 as ORDEN
        FROM ${filtros.conjunto}.diario m
        INNER JOIN ${filtros.conjunto}.asiento_de_diario am ON m.asiento = am.asiento
        INNER JOIN ${filtros.conjunto}.cuenta_contable c ON m.cuenta_contable = c.cuenta_contable
        INNER JOIN ${filtros.conjunto}.nit n ON m.nit = n.nit
        WHERE 1=1
          AND am.contabilidad IN (:contabilidad)
          AND am.fecha >= :fechaInicio
          AND am.fecha <= :fechaFin
      `;

      if (filtros.cuentaContableDesde) { sql += ` AND m.cuenta_contable >= :cuentaContableDesde`; }
      if (filtros.cuentaContableHasta) { sql += ` AND m.cuenta_contable <= :cuentaContableHasta`; }
      if (filtros.nitDesde) { sql += ` AND n.nit >= :nitDesde`; }
      if (filtros.nitHasta) { sql += ` AND n.nit <= :nitHasta`; }
      if (filtros.asientoDesde) { sql += ` AND m.asiento >= :asientoDesde`; }
      if (filtros.asientoHasta) { sql += ` AND m.asiento <= :asientoHasta`; }
      if (filtros.fuentes && filtros.fuentes.length > 0) { sql += ` AND m.fuente IN (${filtros.fuentes.map(f => `'${f}'`).join(',')})`; }
    }

    if ((filtros.incluirDiario !== false) && (filtros.incluirMayor !== false)) { sql += ' UNION ALL '; }

    if (filtros.incluirMayor !== false) {
      sql += `
        SELECT
          'PESOS' as sNombreMonLocal,
          'DOLARES' as sNombreMonDolar,
          'CUENTA CONTABLE' as sTituloCuenta,
          ISNULL(c.descripcion, '') as sCuentaContableDesc,
          'NIT' as sTituloNit,
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
          '' as sDimension,
          '' as sDimensionDesc,
          '' as sQuiebre1,
          '' as sQuiebre2,
          '' as sQuiebre3,
          '' as sQuiebreDesc1,
          '' as sQuiebreDesc2,
          '' as sQuiebreDesc3,
          2 as ORDEN
        FROM ${filtros.conjunto}.mayor m
        INNER JOIN ${filtros.conjunto}.asiento_mayorizado am ON m.asiento = am.asiento
        INNER JOIN ${filtros.conjunto}.cuenta_contable c ON m.cuenta_contable = c.cuenta_contable
        INNER JOIN ${filtros.conjunto}.nit n ON m.nit = n.nit
        WHERE 1=1
          AND am.contabilidad IN (:contabilidad)
          AND am.fecha >= :fechaInicio
          AND am.fecha <= :fechaFin
      `;

      if (filtros.cuentaContableDesde) { sql += ` AND m.cuenta_contable >= :cuentaContableDesde`; }
      if (filtros.cuentaContableHasta) { sql += ` AND m.cuenta_contable <= :cuentaContableHasta`; }
      if (filtros.nitDesde) { sql += ` AND n.nit >= :nitDesde`; }
      if (filtros.nitHasta) { sql += ` AND n.nit <= :nitHasta`; }
      if (filtros.asientoDesde) { sql += ` AND m.asiento >= :asientoDesde`; }
      if (filtros.asientoHasta) { sql += ` AND m.asiento <= :asientoHasta`; }
      if (filtros.fuentes && filtros.fuentes.length > 0) { sql += ` AND m.fuente IN (${filtros.fuentes.map(f => `'${f}'`).join(',')})`; }
    }

    sql += ' ORDER BY sCuentaContable, sNit, ORDEN, sFuente';
    return sql;
  }

  private procesarResultados(recordset: any): ReporteMovimientoContableAgrupadoItem[] {
    // Sequelize devuelve un array con dos elementos: [data, metadata]
    // El primer elemento es el array de registros
    const records = Array.isArray(recordset) ? recordset : [recordset];
    
    // Si es un array de arrays, tomar el primer elemento
    const data = Array.isArray(records[0]) ? records[0] : records;
    
    // Asegurar que sea un array
    if (!Array.isArray(data)) {
      console.error('Formato de respuesta inesperado:', recordset);
      return [];
    }
    
    return data.map(record => ({
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
    try {
      console.log(`Generando Excel con ${data.length} registros...`);
      
      // Preparar los datos para Excel
      const excelData = data.map(item => ({
        'Fecha': item.dtFecha ? new Date(item.dtFecha).toLocaleDateString('es-ES') : '',
        'Número Voucher': item.sAsiento || '',
        'Fuente': item.sFuente || '',
        'Referencia': item.sReferencia || '',
        'Cuenta Contable': item.sCuentaContable || '',
        'Descripción Cuenta': item.sCuentaContableDesc || '',
        'NIT': item.sNit || '',
        'Nombre NIT': item.sNitNombre || '',
        'Dimensión': item.sDimension || '',
        'Descripción Dimensión': item.sDimensionDesc || '',
        'Monto Local': Number(item.nMontoLocal || 0),
        'Monto Dólar': Number(item.nMontoDolar || 0),
        'Notas': item.sNotas || ''
      }));

      // Calcular totales
      const totalLocal = data.reduce((sum, item) => sum + (item.nMontoLocal || 0), 0);
      const totalDolar = data.reduce((sum, item) => sum + (item.nMontoDolar || 0), 0);

      // Agregar fila de totales
      const totalRow = {
        'Fecha': '',
        'Número Voucher': '',
        'Fuente': '',
        'Referencia': '',
        'Cuenta Contable': '',
        'Descripción Cuenta': '',
        'NIT': '',
        'Nombre NIT': '',
        'Dimensión': '',
        'Descripción Dimensión': '',
        'Monto Local': totalLocal,
        'Monto Dólar': totalDolar,
        'Notas': 'TOTAL GENERAL'
      };

      // Agregar fila vacía antes del total
      const emptyRow = {
        'Fecha': '',
        'Número Voucher': '',
        'Fuente': '',
        'Referencia': '',
        'Cuenta Contable': '',
        'Descripción Cuenta': '',
        'NIT': '',
        'Nombre NIT': '',
        'Dimensión': '',
        'Descripción Dimensión': '',
        'Monto Local': '',
        'Monto Dólar': '',
        'Notas': ''
      };

      // Combinar datos con totales
      const finalData = [...excelData, emptyRow, totalRow];

      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Crear la hoja principal con los datos
      const worksheet = XLSX.utils.json_to_sheet(finalData);
      
      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 12 }, // Fecha
        { wch: 15 }, // Número Voucher
        { wch: 15 }, // Fuente
        { wch: 30 }, // Referencia
        { wch: 20 }, // Cuenta Contable
        { wch: 15 }, // NIT
        { wch: 30 }, // Nombre NIT
        { wch: 15 }, // Dimensión
        { wch: 30 }, // Descripción Dimensión
        { wch: 15 }, // Monto Local
        { wch: 15 }, // Monto Dólar
        { wch: 40 }  // Notas
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimientos Contables');
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log('Archivo Excel generado exitosamente');
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private exportarPDF(reporte: RespuestaReporteMovimientosContablesAgrupados): Buffer {
    try {
      console.log(`Generando PDF con ${reporte.data.length} registros...`);
      
      // Por ahora, vamos a generar un PDF básico usando una librería simple
      // En el futuro se puede mejorar con una librería más robusta como puppeteer
      
      // Crear contenido HTML básico para el PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reporte Movimientos Contables Agrupados</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .total { font-weight: bold; background-color: #e6f3ff; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Reporte de Movimientos Contables Agrupados</h1>
            <p>Total de registros: ${reporte.totalRegistros}</p>
            <p>Fecha de generación: ${new Date().toLocaleDateString('es-ES')}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Voucher</th>
                <th>Fuente</th>
                <th>Cuenta</th>
                <th>NIT</th>
                <th>Monto Local</th>
                <th>Monto Dólar</th>
              </tr>
            </thead>
            <tbody>
              ${reporte.data.map(item => `
                <tr>
                  <td>${item.dtFecha ? new Date(item.dtFecha).toLocaleDateString('es-ES') : ''}</td>
                  <td>${item.sAsiento || ''}</td>
                  <td>${item.sFuente || ''}</td>
                  <td>${item.sCuentaContable || ''}</td>
                  <td>${item.sNit || ''}</td>
                  <td>${item.nMontoLocal?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}</td>
                  <td>${item.nMontoDolar?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
      
      // Por ahora, retornamos el HTML como Buffer
      // En el futuro se puede usar puppeteer para convertir HTML a PDF
      const buffer = Buffer.from(htmlContent, 'utf-8');
      
      console.log('Archivo PDF (HTML) generado exitosamente');
      return buffer;
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      throw new Error(`Error al generar archivo PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private exportarCSV(data: ReporteMovimientoContableAgrupadoItem[]): Buffer {
    try {
      console.log(`Generando CSV con ${data.length} registros...`);
      
      // Definir los headers del CSV
      const headers = [
        'Fecha',
        'Número Voucher',
        'Fuente',
        'Referencia',
        'Cuenta Contable',
        'Descripción Cuenta',
        'NIT',
        'Nombre NIT',
        'Dimensión',
        'Descripción Dimensión',
        'Monto Local',
        'Monto Dólar',
        'Notas'
      ];
      
      // Crear las filas de datos
      const rows = data.map(item => [
        item.dtFecha ? new Date(item.dtFecha).toLocaleDateString('es-ES') : '',
        item.sAsiento || '',
        item.sFuente || '',
        item.sReferencia || '',
        item.sCuentaContable || '',
        item.sCuentaContableDesc || '',
        item.sNit || '',
        item.sNitNombre || '',
        item.sDimension || '',
        item.sDimensionDesc || '',
        item.nMontoLocal || 0,
        item.nMontoDolar || 0,
        item.sNotas || ''
      ]);
      
      // Combinar headers y datos
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      
      // Convertir a Buffer con encoding UTF-8
      const buffer = Buffer.from(csvContent, 'utf-8');
      
      console.log('Archivo CSV generado exitosamente');
      return buffer;
      
    } catch (error) {
      console.error('Error al generar CSV:', error);
      throw new Error(`Error al generar archivo CSV: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
