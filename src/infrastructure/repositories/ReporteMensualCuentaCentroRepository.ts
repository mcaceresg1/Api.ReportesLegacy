import { injectable } from 'inversify';
import { exactusSequelize } from '../database/config/exactus-database';
import { IReporteMensualCuentaCentroRepository } from '../../domain/repositories/IReporteMensualCuentaCentroRepository';
import { ReporteMensualCuentaCentroItem } from '../../domain/entities/ReporteMensualCuentaCentro';

function endOfMonthISO(anio: number, mesIndex0: number): string {
  const d = new Date(Date.UTC(anio, mesIndex0 + 1, 0, 0, 0, 0));
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

@injectable()
export class ReporteMensualCuentaCentroRepository implements IReporteMensualCuentaCentroRepository {
  async obtenerPorAnio(
    conjunto: string,
    anio: number,
    contabilidad: 'F' | 'A' = 'F'
  ): Promise<ReporteMensualCuentaCentroItem[]> {
    // Calcular fin de mes para 12 meses del año
    const meses = Array.from({ length: 12 }, (_, i) => endOfMonthISO(anio, i));
    const [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12] = meses as [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string
    ];

    // Construimos SQL siguiendo la lógica del query legado, devolviendo columnas por mes
    const sql = `
      WITH Movs AS (
        SELECT
          cta.cuenta_contable AS cuenta_contable,
          cta.descripcion AS desc_cuenta_contable,
          ctr.centro_costo AS centro_costo,
          ctr.descripcion AS desc_centro_costo,
          d.debito_LOCAL AS debito_local,
          d.credito_LOCAL AS credito_local,
          m.fecha AS fecha
        FROM ${conjunto}.asiento_de_diario m WITH (NOLOCK)
        INNER JOIN ${conjunto}.diario d WITH (NOLOCK) ON m.asiento = d.asiento
        INNER JOIN ${conjunto}.cuenta_contable cta WITH (NOLOCK) ON d.cuenta_contable = cta.cuenta_contable
        INNER JOIN ${conjunto}.centro_costo ctr WITH (NOLOCK) ON ctr.centro_costo = SUBSTRING(d.centro_costo, 1, 2) + '.00.00.00.00'
        WHERE m.fecha > '${anio - 1}-12-31 00:00:00' AND m.fecha <= '${anio}-12-31 23:59:59' AND m.contabilidad IN ('F','A')
        AND NOT EXISTS (SELECT 1 FROM ${conjunto}.proceso_cierre_cg pc WITH (NOLOCK) WHERE pc.asiento_apertura = m.asiento)
        UNION ALL
        SELECT
          cta.cuenta_contable,
          cta.descripcion,
          ctr.centro_costo,
          ctr.descripcion,
          0 AS debito_local,
          (m.debito_FISC_LOCAL - m.credito_FISC_LOCAL) AS credito_local, -- saldo fiscal neto
          m.fecha
        FROM ${conjunto}.SALDO m WITH (NOLOCK)
        INNER JOIN ${conjunto}.cuenta_contable cta WITH (NOLOCK) ON m.cuenta_contable = cta.cuenta_contable
        INNER JOIN ${conjunto}.centro_costo ctr WITH (NOLOCK) ON ctr.centro_costo = SUBSTRING(m.centro_costo, 1, 2) + '.00.00.00.00'
        WHERE m.fecha > '${anio - 1}-12-31 00:00:00' AND m.fecha <= '${anio}-12-31 23:59:59'
        UNION ALL
        SELECT
          cta.cuenta_contable,
          cta.descripcion,
          ctr.centro_costo,
          ctr.descripcion,
          m.debito_LOCAL,
          m.credito_LOCAL,
          m.fecha
        FROM ${conjunto}.mayor m WITH (NOLOCK)
        INNER JOIN ${conjunto}.cuenta_contable cta WITH (NOLOCK) ON m.cuenta_contable = cta.cuenta_contable
        INNER JOIN ${conjunto}.centro_costo ctr WITH (NOLOCK) ON ctr.centro_costo = SUBSTRING(m.centro_costo, 1, 2) + '.00.00.00.00'
        WHERE m.fecha > '${anio - 1}-12-31 00:00:00' AND m.fecha <= '${anio}-12-31 23:59:59' AND m.contabilidad IN ('F','A')
        AND EXISTS (SELECT 1 FROM ${conjunto}.proceso_cierre_cg pc WITH (NOLOCK) WHERE pc.asiento_apertura = m.asiento)
      )
      SELECT
        cuenta_contable,
        MAX(desc_cuenta_contable) AS desc_cuenta_contable,
        centro_costo,
        MAX(desc_centro_costo) AS desc_centro_costo,
        SUM(CASE WHEN fecha <= '${m1}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS enero,
        SUM(CASE WHEN fecha > '${m1}' AND fecha <= '${m2}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS febrero,
        SUM(CASE WHEN fecha > '${m2}' AND fecha <= '${m3}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS marzo,
        SUM(CASE WHEN fecha > '${m3}' AND fecha <= '${m4}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS abril,
        SUM(CASE WHEN fecha > '${m4}' AND fecha <= '${m5}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS mayo,
        SUM(CASE WHEN fecha > '${m5}' AND fecha <= '${m6}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS junio,
        SUM(CASE WHEN fecha > '${m6}' AND fecha <= '${m7}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS julio,
        SUM(CASE WHEN fecha > '${m7}' AND fecha <= '${m8}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS agosto,
        SUM(CASE WHEN fecha > '${m8}' AND fecha <= '${m9}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS setiembre,
        SUM(CASE WHEN fecha > '${m9}' AND fecha <= '${m10}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS octubre,
        SUM(CASE WHEN fecha > '${m10}' AND fecha <= '${m11}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS noviembre,
        SUM(CASE WHEN fecha > '${m11}' AND fecha <= '${m12}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS diciembre
      FROM Movs
      GROUP BY cuenta_contable, centro_costo
      ORDER BY cuenta_contable, centro_costo
    `;

    const [rows] = await exactusSequelize.query(sql);

    const data = (rows as any[]).map((r) => ({
      cuentaContable: r['cuenta_contable'] || '',
      descCuentaContable: r['desc_cuenta_contable'] || '',
      centroCosto: r['centro_costo'] || '',
      descCentroCosto: r['desc_centro_costo'] || '',
      enero: Number(r['enero'] || 0),
      febrero: Number(r['febrero'] || 0),
      marzo: Number(r['marzo'] || 0),
      abril: Number(r['abril'] || 0),
      mayo: Number(r['mayo'] || 0),
      junio: Number(r['junio'] || 0),
      julio: Number(r['julio'] || 0),
      agosto: Number(r['agosto'] || 0),
      setiembre: Number(r['setiembre'] || 0),
      octubre: Number(r['octubre'] || 0),
      noviembre: Number(r['noviembre'] || 0),
      diciembre: Number(r['diciembre'] || 0),
      mes1: m1.slice(0, 10),
      mes2: m2.slice(0, 10),
      mes3: m3.slice(0, 10),
      mes4: m4.slice(0, 10),
      mes5: m5.slice(0, 10),
      mes6: m6.slice(0, 10),
      mes7: m7.slice(0, 10),
      mes8: m8.slice(0, 10),
      mes9: m9.slice(0, 10),
      mes10: m10.slice(0, 10),
      mes11: m11.slice(0, 10),
      mes12: m12.slice(0, 10)
    })) as ReporteMensualCuentaCentroItem[];

    return data;
  }
}
