import { injectable } from 'inversify';
import { IReporteGastosDestinoRepository } from '../../domain/repositories/IReporteGastosDestinoRepository';
import { QueryTypes } from 'sequelize';
import { exactusSequelize } from '../database/config/exactus-database';
import { DynamicModelFactory } from '../database/models/DynamicModel';
import { ReporteGastosDestinoItem, ReporteGastosDestinoResult } from '../../domain/entities/ReporteGastosDestino';

@injectable()
export class ReporteGastosDestinoRepository implements IReporteGastosDestinoRepository {
  async generar(conjunto: string, fechaInicio: Date, fechaFin: Date): Promise<void> {
    // Conexión a EXACTUS está configurada con readOnlyIntent; no realizamos INSERT.
    // Dejamos este método como no-op para compatibilidad con el frontend.
    return;
  }

  async listar(conjunto: string, limit: number = 100, offset: number = 0): Promise<ReporteGastosDestinoResult> {
    const GastosDestinoModel = DynamicModelFactory.createGastosDestinoModel(conjunto);
    const totalRecords = await this.count(conjunto);

    const rows = await (GastosDestinoModel as any).findAll({
      raw: true,
      limit,
      offset,
      order: [['FECHA', 'ASC'], ['ASIENTO', 'ASC']],
    });

    return {
      data: rows as ReporteGastosDestinoItem[],
      pagination: {
        limit,
        offset,
        totalRecords,
        hasNextPage: offset + limit < totalRecords,
      },
    };
  }

  // Detalle con subtotal por ASIENTO
  async listarDetalle(
    conjunto: string,
    fechaInicio?: string,
    fechaFin?: string,
    limit: number = 5000,
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

      ORDER BY 
        ISNULL(ASIENTO, 'ZZZZZ'),
        ROW_ORDER,
        FECHA,
        CTA_CONTABLE
      OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
    `;

    const replacements: any = { offset, limit };
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
}


