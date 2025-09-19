import { injectable } from 'inversify';
import { IReporteGastosDestinoRepository } from '../../domain/repositories/IReporteGastosDestinoRepository';
import { QueryTypes } from 'sequelize';
import { exactusSequelize } from '../database/config/exactus-database';
import { DynamicModelFactory } from '../database/models/DynamicModel';
import { ReporteGastosDestinoItem, ReporteGastosDestinoResult } from '../../domain/entities/ReporteGastosDestino';
import * as XLSX from 'xlsx';

@injectable()
export class ReporteGastosDestinoRepository implements IReporteGastosDestinoRepository {
  async generar(conjunto: string, fechaInicio: Date, fechaFin: Date): Promise<void> {
    // Conexión a EXACTUS está configurada con readOnlyIntent; no realizamos INSERT.
    // Dejamos este método como no-op para compatibilidad con el frontend.
    return;
  }

  async listar(conjunto: string, limit?: number, offset: number = 0): Promise<ReporteGastosDestinoResult> {
    const GastosDestinoModel = DynamicModelFactory.createGastosDestinoModel(conjunto);
    const totalRecords = await this.count(conjunto);

    const queryOptions: any = {
      raw: true,
      offset,
      order: [['FECHA', 'ASC'], ['ASIENTO', 'ASC']],
    };

    // Solo aplicar límite si se especifica
    if (limit && limit > 0) {
      queryOptions.limit = limit;
    }

    const rows = await (GastosDestinoModel as any).findAll(queryOptions);

    return {
      data: rows as ReporteGastosDestinoItem[],
      pagination: {
        limit: limit || totalRecords,
        offset,
        totalRecords,
        hasNextPage: limit ? offset + limit < totalRecords : false,
      },
    };
  }

  // Detalle con subtotal por ASIENTO
  async listarDetalle(
    conjunto: string,
    fechaInicio?: string,
    fechaFin?: string,
    contabilidad?: string,
    limit?: number,
    offset: number = 0
  ): Promise<any[]> {
    const whereFecha = fechaInicio && fechaFin ? `
        WHERE MAY.FECHA BETWEEN :fi AND :ff
      ` : '';
    
    const whereContabilidad = contabilidad ? 
      (whereFecha ? ' AND ' : ' WHERE ') + `MAY.CONTABILIDAD = :contabilidad` : 
      (whereFecha ? ' AND ' : ' WHERE ') + `MAY.CONTABILIDAD IN ('F','A')`;

    const sql = `
      WITH BASE AS (
        SELECT
          CONVERT(date, MAY.FECHA) AS FECHA,
          SUBSTRING(MAY.CUENTA_CONTABLE,1,15) AS CTA_CONTABLE,
          MAY.CENTRO_COSTO        AS C_COSTO,
          MAY.ASIENTO,
          MAY.TIPO_ASIENTO        AS TIPO,
          TAS.DESCRIPCION         AS CLASE,
          MAY.REFERENCIA,
          MAY.NIT,
          N.RAZON_SOCIAL          AS RAZONSOCIAL,
          CAST(MAY.DEBITO_LOCAL  AS decimal(18,2)) AS DEBE_S,
          CAST(MAY.CREDITO_LOCAL AS decimal(18,2)) AS HABER_S,
          CAST(MAY.DEBITO_DOLAR  AS decimal(18,2)) AS DEBE_US,
          CAST(MAY.CREDITO_DOLAR AS decimal(18,2)) AS HABER_US
        FROM ${conjunto}.MAYOR MAY WITH (NOLOCK)
        INNER JOIN ${conjunto}.CENTRO_CUENTA CTOCTA
          ON MAY.CUENTA_CONTABLE = CTOCTA.CUENTA_CONTABLE AND MAY.CENTRO_COSTO = CTOCTA.CENTRO_COSTO
        INNER JOIN ${conjunto}.TIPO_ASIENTO TAS ON TAS.TIPO_ASIENTO = MAY.TIPO_ASIENTO
        INNER JOIN ${conjunto}.NIT N ON MAY.NIT = N.NIT
        ${whereFecha}${whereContabilidad}
      )
      SELECT * FROM (
        SELECT * FROM (
          -- Detalle
          SELECT 
            0                          AS ROW_ORDER,
            'DATA'                     AS ROW_TYPE,
            FECHA, CTA_CONTABLE, C_COSTO, ASIENTO, TIPO, CLASE, REFERENCIA, NIT, RAZONSOCIAL,
            DEBE_S, HABER_S, DEBE_US, HABER_US
          FROM BASE

          UNION ALL

          -- Subtotal por asiento
          SELECT 
            1                          AS ROW_ORDER,
            'SUBTOTAL'                 AS ROW_TYPE,
            NULL as FECHA,
            NULL as CTA_CONTABLE,
            NULL as C_COSTO,
            ASIENTO,
            NULL as TIPO,
            'SUBTOTAL ' + CAST(ASIENTO AS VARCHAR(50)) as CLASE,
            NULL as REFERENCIA,
            NULL as NIT,
            NULL as RAZONSOCIAL,
            SUM(DEBE_S)  AS DEBE_S,
            SUM(HABER_S) AS HABER_S,
            SUM(DEBE_US) AS DEBE_US,
            SUM(HABER_US) AS HABER_US
          FROM BASE
          GROUP BY ASIENTO
        ) X
        UNION ALL
        -- Total general
        SELECT 
          2            AS ROW_ORDER,
          'TOTAL'      AS ROW_TYPE,
          NULL, NULL, NULL,
          NULL        AS ASIENTO,
          NULL, 'TOTAL GENERAL', NULL, NULL, NULL,
          SUM(DEBE_S), SUM(HABER_S), SUM(DEBE_US), SUM(HABER_US)
        FROM BASE
      ) U

      ORDER BY 
        ASIENTO,
        ROW_ORDER,
        FECHA,
        CTA_CONTABLE
      ${limit && limit > 0 ? 'OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY' : ''}
    `;

    const replacements: any = { offset };
    if (limit && limit > 0) {
      replacements.limit = limit;
    }
    if (fechaInicio && fechaFin) {
      replacements.fi = fechaInicio;
      replacements.ff = fechaFin;
    }
    if (contabilidad) {
      replacements.contabilidad = contabilidad;
    }

    const [rows] = await exactusSequelize.query(sql, { replacements });
    return rows as any[];
  }

  async count(conjunto: string): Promise<number> {
    const GastosDestinoModel = DynamicModelFactory.createGastosDestinoModel(conjunto);
    const total = await (GastosDestinoModel as any).count();
    return total as number;
  }

  async limpiarPorRango(conjunto: string): Promise<void> {
    // Si se requiere limpiar por usuario o rango, aquí podría implementarse.
    return;
  }

  async exportarExcel(conjunto: string, filtros: any): Promise<Buffer> {
    const startTime = Date.now();
    try {
      console.log(`🚀 Generando Excel optimizado de gastos por destino para conjunto ${conjunto}`);
      
      // Extraer fechas y contabilidad de los filtros (nueva estructura simplificada)
      const fechaInicio = filtros?.fechaDesde || filtros?.asientos?.fechaInicio;
      const fechaFin = filtros?.fechaHasta || filtros?.asientos?.fechaFin;
      const contabilidad = filtros?.contabilidad || filtros?.asientos?.contabilidad;
      
      console.log(`📊 Obteniendo datos del backend...`);
      const dataStartTime = Date.now();
      
      // Obtener todos los datos para el Excel (sin límite para exportación completa)
      const resultado = await this.listarDetalle(conjunto, fechaInicio, fechaFin, contabilidad, undefined, 0);
      
      const dataEndTime = Date.now();
      console.log(`✅ Datos obtenidos en ${dataEndTime - dataStartTime}ms (${resultado.length} registros)`);
      
      console.log(`📝 Procesando datos para Excel...`);
      const processStartTime = Date.now();
      
      // Variables para totales (optimización: calcular durante el mapeo)
      let totalDebeS = 0;
      let totalHaberS = 0;
      let totalDebeUS = 0;
      let totalHaberUS = 0;
      
      // Preparar los datos para Excel con optimizaciones
      const excelData = resultado.map(item => {
        // Calcular totales durante el mapeo para evitar múltiples iteraciones
        if (item.ROW_TYPE === 'DATA') {
          totalDebeS += Number(item.DEBE_S || 0);
          totalHaberS += Number(item.HABER_S || 0);
          totalDebeUS += Number(item.DEBE_US || 0);
          totalHaberUS += Number(item.HABER_US || 0);
        }
        
        // Optimización: evitar conversiones innecesarias de fechas
        const fecha = item.FECHA ? 
          (typeof item.FECHA === 'string' ? item.FECHA.split('T')[0] : new Date(item.FECHA).toISOString().split('T')[0]) : '';
        
        return {
          'Fecha': fecha,
          'Cuenta Contable': item.CTA_CONTABLE || '',
          'Centro Costo': item.C_COSTO || '',
          'Asiento': item.ASIENTO || '',
          'Tipo': item.TIPO || '',
          'Clase': item.CLASE || '',
          'Referencia': item.REFERENCIA || '',
          'NIT': item.NIT || '',
          'Razón Social': item.RAZONSOCIAL || '',
          'Débito Soles': Number(item.DEBE_S || 0),
          'Haber Soles': Number(item.HABER_S || 0),
          'Débito Dólares': Number(item.DEBE_US || 0),
          'Haber Dólares': Number(item.HABER_US || 0),
          'Tipo Fila': item.ROW_TYPE || ''
        };
      });

      const processEndTime = Date.now();
      console.log(`✅ Datos procesados en ${processEndTime - processStartTime}ms`);

      console.log(`📊 Creando fila de totales...`);
      const totalStartTime = Date.now();
      
      // Crear fila de totales optimizada
      const totalRow = {
        'Fecha': '',
        'Cuenta Contable': '',
        'Centro Costo': '',
        'Asiento': '',
        'Tipo': '',
        'Clase': 'TOTAL GENERAL',
        'Referencia': '',
        'NIT': '',
        'Razón Social': '',
        'Débito Soles': totalDebeS,
        'Haber Soles': totalHaberS,
        'Débito Dólares': totalDebeUS,
        'Haber Dólares': totalHaberUS,
        'Tipo Fila': 'TOTAL'
      };

      // Fila vacía optimizada (reutilizar objeto)
      const emptyRow = {
        'Fecha': '', 'Cuenta Contable': '', 'Centro Costo': '', 'Asiento': '', 'Tipo': '',
        'Clase': '', 'Referencia': '', 'NIT': '', 'Razón Social': '', 'Débito Soles': 0,
        'Haber Soles': 0, 'Débito Dólares': 0, 'Haber Dólares': 0, 'Tipo Fila': ''
      };

      // Combinar datos con totales (optimización: usar push en lugar de spread)
      const finalData = excelData;
      finalData.push(emptyRow, totalRow);

      const totalEndTime = Date.now();
      console.log(`✅ Totales calculados en ${totalEndTime - totalStartTime}ms`);

      console.log(`📋 Generando archivo Excel...`);
      const excelStartTime = Date.now();
      
      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Crear la hoja principal con los datos (optimización: usar array directamente)
      const worksheet = XLSX.utils.json_to_sheet(finalData);
      
      // Configurar el ancho de las columnas (optimización: predefinir)
      const columnWidths = [
        { wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
        { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 30 }, { wch: 15 },
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Gastos por Destino');
      
      // Generar el buffer del archivo Excel (optimización: configuraciones de rendimiento)
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true,
        cellStyles: false, // Deshabilitar estilos para mejor rendimiento
        bookSST: false,    // Deshabilitar tabla de strings compartidos
        cellDates: false   // Deshabilitar conversión automática de fechas
      });
      
      const excelEndTime = Date.now();
      const totalTime = Date.now() - startTime;
      
      console.log(`✅ Archivo Excel generado en ${excelEndTime - excelStartTime}ms`);
      console.log(`🎉 Excel completado en ${totalTime}ms total (${resultado.length} registros)`);
      
      return excelBuffer;
      
    } catch (error) {
      const totalTime = Date.now() - startTime;
      console.error(`❌ Error al generar Excel de gastos por destino después de ${totalTime}ms:`, error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}


