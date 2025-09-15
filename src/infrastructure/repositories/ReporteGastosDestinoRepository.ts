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
    limit?: number,
    offset: number = 0
  ): Promise<any[]> {
    const whereFecha = fechaInicio && fechaFin ? `
        WHERE MAY.FECHA BETWEEN :fi AND :ff
      ` : '';

    const sql = `
      WITH BASE AS (
        SELECT
          CONVERT(date, MAY.FECHA) AS FECHA,
          SUBSTRING(MAY.CUENTA_CONTABLE,1,2) AS CTA_CONTABLE,
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
        ${whereFecha}
        AND MAY.CONTABILIDAD IN ('F','A')
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
    try {
      console.log(`Generando Excel de gastos por destino para conjunto ${conjunto}`);
      
      // Extraer fechas de los filtros
      const fechaInicio = filtros?.asientos?.fechaInicio;
      const fechaFin = filtros?.asientos?.fechaFin;
      
      // Obtener todos los datos para el Excel (sin límite para exportación completa)
      const resultado = await this.listarDetalle(conjunto, fechaInicio, fechaFin, undefined, 0);
      
      // Preparar los datos para Excel
      const excelData = resultado.map(item => ({
        'Fecha': item.FECHA ? new Date(item.FECHA).toLocaleDateString('es-ES') : '',
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
      }));

      // Calcular totales
      const totalDebeS = resultado
        .filter(item => item.ROW_TYPE === 'DATA')
        .reduce((sum, item) => sum + (item.DEBE_S || 0), 0);
      const totalHaberS = resultado
        .filter(item => item.ROW_TYPE === 'DATA')
        .reduce((sum, item) => sum + (item.HABER_S || 0), 0);
      const totalDebeUS = resultado
        .filter(item => item.ROW_TYPE === 'DATA')
        .reduce((sum, item) => sum + (item.DEBE_US || 0), 0);
      const totalHaberUS = resultado
        .filter(item => item.ROW_TYPE === 'DATA')
        .reduce((sum, item) => sum + (item.HABER_US || 0), 0);

      // Agregar fila de totales
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

      // Agregar fila vacía antes del total
      const emptyRow = {
        'Fecha': '',
        'Cuenta Contable': '',
        'Centro Costo': '',
        'Asiento': '',
        'Tipo': '',
        'Clase': '',
        'Referencia': '',
        'NIT': '',
        'Razón Social': '',
        'Débito Soles': '',
        'Haber Soles': '',
        'Débito Dólares': '',
        'Haber Dólares': '',
        'Tipo Fila': ''
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
        { wch: 20 }, // Cuenta Contable
        { wch: 20 }, // Centro Costo
        { wch: 15 }, // Asiento
        { wch: 15 }, // Tipo
        { wch: 25 }, // Clase
        { wch: 30 }, // Referencia
        { wch: 15 }, // NIT
        { wch: 30 }, // Razón Social
        { wch: 15 }, // Débito Soles
        { wch: 15 }, // Haber Soles
        { wch: 15 }, // Débito Dólares
        { wch: 15 }, // Haber Dólares
        { wch: 15 }  // Tipo Fila
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Gastos por Destino');
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log('Archivo Excel de gastos por destino generado exitosamente');
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel de gastos por destino:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}


