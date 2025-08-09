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


