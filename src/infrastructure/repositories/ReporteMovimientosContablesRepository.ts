import { injectable } from 'inversify';
import { exactusSequelize } from '../database/config/exactus-database';
import { IReporteMovimientosContablesRepository } from '../../domain/repositories/IReporteMovimientosContablesRepository';
import { FiltrosReporteMovimientosContables, ReporteMovimientoContableItem } from '../../domain/entities/ReporteMovimientosContables';

@injectable()
export class ReporteMovimientosContablesRepository implements IReporteMovimientosContablesRepository {
  async obtener(conjunto: string, filtros: FiltrosReporteMovimientosContables): Promise<ReporteMovimientoContableItem[]> {
    const { usuario, fechaInicio, fechaFin, contabilidad } = filtros;
    const fechaIniStr = new Date(fechaInicio).toISOString().slice(0, 19).replace('T', ' ');
    const fechaFinStr = new Date(fechaFin).toISOString().slice(0, 19).replace('T', ' ');

    const contabs = contabilidad === 'T' ? "('F','A')" : contabilidad === 'F' ? "('F')" : "('A')";

    const sql = `
      SELECT 
        M.CENTRO_COSTO AS centroCosto,
        M.REFERENCIA AS referencia,
        CASE WHEN A.ORIGEN = 'FA' THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 5, 20)
             WHEN A.ORIGEN IN ('CP','CB','CC','CJ','IC') THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 4, 20)
             ELSE '' END AS documento,
        M.ASIENTO AS asiento,
        N.RAZON_SOCIAL AS razonSocial,
        A.FECHA AS fecha,
        CASE WHEN A.ORIGEN IN ('CP','CB','CC','CJ','IC','FA') THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 1, 3) ELSE '' END AS tipo,
        M.NIT AS nit,
        M.CREDITO_DOLAR AS creditoDolar,
        M.CREDITO_LOCAL AS creditoLocal,
        M.DEBITO_DOLAR AS debitoDolar,
        M.DEBITO_LOCAL AS debitoLocal,
        SUBSTRING(M.CUENTA_CONTABLE, 1, 2) AS cuentaContable,
        CC.DESCRIPCION AS descripcionCuentaContable,
        C.DESCRIPCION AS descripcionCentroCosto,
        :usuario AS usuario
      FROM ${conjunto}.DIARIO AS M WITH (NOLOCK)
      INNER JOIN ${conjunto}.ASIENTO_DE_DIARIO AS A WITH (NOLOCK) ON M.ASIENTO = A.ASIENTO
      INNER JOIN ${conjunto}.NIT AS N WITH (NOLOCK) ON M.NIT = N.NIT
      INNER JOIN ${conjunto}.CUENTA_CONTABLE AS CC WITH (NOLOCK) ON CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'
      INNER JOIN ${conjunto}.CENTRO_COSTO AS C WITH (NOLOCK) ON C.CENTRO_COSTO = M.CENTRO_COSTO
      WHERE A.CONTABILIDAD IN ${contabs}
        AND A.FECHA BETWEEN '${fechaIniStr}' AND '${fechaFinStr}'
      ORDER BY A.FECHA, M.ASIENTO
    `;

    const [rows] = await exactusSequelize.query(sql, { replacements: { usuario } });
    return (rows as any[]).map(r => ({
      centroCosto: r['centroCosto'] || '',
      referencia: r['referencia'] || '',
      documento: r['documento'] || '',
      asiento: Number(r['asiento'] || 0),
      razonSocial: r['razonSocial'] || '',
      fecha: r['fecha'] ? new Date(r['fecha']).toISOString() : new Date().toISOString(),
      tipo: r['tipo'] || '',
      nit: r['nit'] || '',
      creditoDolar: Number(r['creditoDolar'] || 0),
      creditoLocal: Number(r['creditoLocal'] || 0),
      debitoDolar: Number(r['debitoDolar'] || 0),
      debitoLocal: Number(r['debitoLocal'] || 0),
      cuentaContable: r['cuentaContable'] || '',
      descripcionCuentaContable: r['descripcionCuentaContable'] || '',
      descripcionCentroCosto: r['descripcionCentroCosto'] || '',
      usuario: r['usuario'] || usuario
    }));
  }
}
