import { injectable } from 'inversify';
import { IReporteGastosDestinoRepository } from '../../domain/repositories/IReporteGastosDestinoRepository';
import { QueryTypes } from 'sequelize';
import { exactusSequelize } from '../database/config/exactus-database';
import { DynamicModelFactory } from '../database/models/DynamicModel';
import { ReporteGastosDestinoItem, ReporteGastosDestinoResult } from '../../domain/entities/ReporteGastosDestino';

@injectable()
export class ReporteGastosDestinoRepository implements IReporteGastosDestinoRepository {
  async generar(conjunto: string, fechaInicio: Date, fechaFin: Date): Promise<void> {
    const fechaIniStr = fechaInicio.toISOString().slice(0, 19).replace('T', ' ');
    const fechaFinStr = fechaFin.toISOString().slice(0, 19).replace('T', ' ');

    const insertSql = `
      INSERT INTO ${conjunto}.R_XML_8DDC5FC376ABAD0 (
        CUENTADESTINO, CUENTADESTINODES, CENTRODESTINO, CENTRODESTINODES, FECHA, ASIENTO,
        CUENTAGASTO, CUENTAGASTODES, CENTROGASTO, CENTROGASTODES, TIPOASIENTO, TIPOASIENTODES,
        FUENTE, REFERENCIA, NIT, RAZONSOCIAL, DEBITOLOCAL, CREDITOLOCAL, DEBITODOLAR, CREDITODOLAR
      )
      SELECT
        SUBSTRING(CTOCTA.CUENTA_GASTO, 1, 2),
        CTA1.DESCRIPCION,
        CTOCTA.CENTRO_GASTO,
        CTO1.DESCRIPCION,
        MAY.FECHA,
        MAY.ASIENTO,
        SUBSTRING(MAY.CUENTA_CONTABLE, 1, 2),
        CTA2.DESCRIPCION,
        MAY.CENTRO_COSTO,
        CTO2.DESCRIPCION,
        MAY.TIPO_ASIENTO,
        TAS.DESCRIPCION,
        MAY.FUENTE,
        MAY.REFERENCIA,
        MAY.NIT,
        N.RAZON_SOCIAL,
        MAY.DEBITO_LOCAL,
        MAY.CREDITO_LOCAL,
        MAY.DEBITO_DOLAR,
        MAY.CREDITO_DOLAR
      FROM ${conjunto}.MAYOR MAY
      INNER JOIN ${conjunto}.CENTRO_CUENTA CTOCTA
        ON MAY.CUENTA_CONTABLE = CTOCTA.CUENTA_CONTABLE AND MAY.CENTRO_COSTO = CTOCTA.CENTRO_COSTO
      INNER JOIN ${conjunto}.TIPO_ASIENTO TAS
        ON TAS.TIPO_ASIENTO = MAY.TIPO_ASIENTO
      INNER JOIN ${conjunto}.NIT N
        ON MAY.NIT = N.NIT
      INNER JOIN ${conjunto}.CUENTA_CONTABLE CTA1
        ON CTA1.CUENTA_CONTABLE = SUBSTRING(CTOCTA.CUENTA_GASTO, 1, 2) + '.0.0.0.000'
      INNER JOIN ${conjunto}.CENTRO_COSTO CTO1
        ON CTOCTA.CENTRO_GASTO = CTO1.CENTRO_COSTO
      INNER JOIN ${conjunto}.CUENTA_CONTABLE CTA2
        ON CTA2.CUENTA_CONTABLE = SUBSTRING(MAY.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'
      INNER JOIN ${conjunto}.CENTRO_COSTO CTO2
        ON MAY.CENTRO_COSTO = CTO2.CENTRO_COSTO
      WHERE MAY.FECHA >= '${fechaIniStr}'
        AND MAY.FECHA <= '${fechaFinStr}'
        AND MAY.CONTABILIDAD IN ('F','A')
    `;

    await exactusSequelize.query(insertSql, { type: QueryTypes.INSERT });
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
    const whereFecha = fechaInicio && fechaFin
      ? `WHERE FECHA BETWEEN :fi AND :ff`
      : '';

    const sql = `
      WITH BASE AS (
        SELECT
          CONVERT(date, FECHA) AS FECHA,
          CUENTAGASTO        AS CTA_CONTABLE,
          CENTROGASTO        AS C_COSTO,
          ASIENTO,
          TIPOASIENTO        AS TIPO,
          TIPOASIENTODES     AS CLASE,
          REFERENCIA,
          NIT,
          RAZONSOCIAL,
          CAST(DEBITOLOCAL  AS decimal(18,2)) AS DEBE_S,
          CAST(CREDITOLOCAL AS decimal(18,2)) AS HABER_S,
          CAST(DEBITODOLAR  AS decimal(18,2)) AS DEBE_US,
          CAST(CREDITODOLAR AS decimal(18,2)) AS HABER_US
        FROM ${conjunto}.R_XML_8DDC5FC376ABAD0 WITH (NOLOCK)
        ${whereFecha}
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
        NULL, 'TOTAL GENERAL', NULL, NULL,
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
    if (whereFecha) {
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


