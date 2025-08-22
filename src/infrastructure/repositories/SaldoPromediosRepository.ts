import { inject } from 'inversify';
import { TYPES } from '../container/types';
import { Sequelize, QueryTypes } from 'sequelize';
import { ISaldoPromediosRepository } from '../../domain/repositories/ISaldoPromediosRepository';
import { SaldoPromediosItem, FiltroSaldoPromedios, CuentaContableOption } from '../../domain/entities/SaldoPromedios';
import { exactusSequelize } from '../database/config/exactus-database';

export class SaldoPromediosRepository implements ISaldoPromediosRepository {
  constructor(
    @inject(TYPES.Sequelize) private sequelize: Sequelize
  ) {}

  async obtenerCuentasContables(conjunto: string): Promise<CuentaContableOption[]> {
    try {
      const query = `
        SELECT 
          A.cuenta_contable,
          A.descripcion,
          A.descripcion_ifrs,
          A.Uso_restringido
        FROM ${conjunto}.cuenta_contable A WITH(NOLOCK)
        ORDER BY 1 ASC
      `;

      const results = await exactusSequelize.query(query, { type: QueryTypes.SELECT });
      return results as CuentaContableOption[];
    } catch (error) {
      console.error('Error obteniendo cuentas contables:', error);
      throw error;
    }
  }

  async generarReporte(filtros: FiltroSaldoPromedios): Promise<SaldoPromediosItem[]> {
    try {
      const { conjunto, cuenta_contable_desde, cuenta_contable_hasta, fecha_desde, fecha_hasta } = filtros;
      
      // Convertir fechas al formato requerido por SQL Server
      const fechaDesde = new Date(fecha_desde).toISOString().slice(0, 10).replace(/-/g, '-');
      const fechaHasta = new Date(fecha_hasta).toISOString().slice(0, 10).replace(/-/g, '-');
      
      const query = `
        SELECT 
          CENTRO_COSTO, 
          CUENTA_CONTABLE,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_inicial_local,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_inicial_dolar,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_inicial_corp_local,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_inicial_corp_dolar,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_inicial_fisc_und,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_inicial_corp_und,
          SUM(DEBITO_FISC_LOCAL) AS debito_fisc_local,
          SUM(CREDITO_FISC_LOCAL) AS credito_fisc_local,
          SUM(DEBITO_FISC_DOLAR) AS debito_fisc_dolar,
          SUM(CREDITO_FISC_DOLAR) AS credito_fisc_dolar,
          SUM(DEBITO_CORP_LOCAL) AS debito_corp_local,
          SUM(CREDITO_CORP_LOCAL) AS credito_corp_local,
          SUM(DEBITO_CORP_DOLAR) AS debito_corp_dolar,
          SUM(CREDITO_CORP_DOLAR) AS credito_corp_dolar,
          SUM(DEBITO_FISC_UND) AS debito_fisc_und,
          SUM(CREDITO_FISC_UND) AS credito_fisc_und,
          SUM(DEBITO_CORP_UND) AS debito_corp_und,
          SUM(CREDITO_CORP_UND) AS credito_corp_und,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_final_local,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_final_dolar,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_final_corp_local,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_final_corp_dolar,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_final_fisc_und,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_final_corp_und,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_promedio_local,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_promedio_dolar,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_promedio_corp_local,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_promedio_corp_dolar,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_promedio_fisc_und,
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) AS saldo_promedio_corp_und
        FROM ${conjunto}.SALDO
        WHERE cuenta_contable >= '${cuenta_contable_desde || '00.0.0.0.000'}'
        AND cuenta_contable <= '${cuenta_contable_hasta || 'ZZ.Z.Z.Z.ZZZ'}'
        AND FECHA >= '${fechaDesde}'
        AND FECHA < '${fechaHasta}'
        GROUP BY CENTRO_COSTO, CUENTA_CONTABLE
        
        UNION ALL
        
        SELECT 
          CENTRO_COSTO, 
          CUENTA_CONTABLE,
          SUM(s.saldo_fisc_local) AS saldo_inicial_local,
          SUM(s.saldo_fisc_dolar) AS saldo_inicial_dolar,
          SUM(s.saldo_corp_local) AS saldo_inicial_corp_local,
          SUM(s.saldo_corp_dolar) AS saldo_inicial_corp_dolar,
          SUM(s.saldo_fisc_und) AS saldo_inicial_fisc_und,
          SUM(s.saldo_corp_und) AS saldo_inicial_corp_und,
          0 AS debito_fisc_local,
          0 AS credito_fisc_local,
          0 AS debito_fisc_dolar,
          0 AS credito_fisc_dolar,
          0 AS debito_corp_local,
          0 AS credito_corp_local,
          0 AS debito_corp_dolar,
          0 AS credito_corp_dolar,
          0 AS debito_fisc_und,
          0 AS credito_fisc_und,
          0 AS debito_corp_und,
          0 AS credito_corp_und,
          0 AS saldo_final_local,
          0 AS saldo_final_dolar,
          0 AS saldo_final_corp_local,
          0 AS saldo_final_corp_dolar,
          0 AS saldo_final_fisc_und,
          0 AS saldo_final_corp_und,
          0 AS saldo_promedio_local,
          0 AS saldo_promedio_dolar,
          0 AS saldo_promedio_corp_local,
          0 AS saldo_promedio_corp_dolar,
          0 AS saldo_promedio_fisc_und,
          0 AS saldo_promedio_corp_und
        FROM ${conjunto}.SALDO S
        WHERE cuenta_contable >= '${cuenta_contable_desde || '00.0.0.0.000'}'
        AND cuenta_contable <= '${cuenta_contable_hasta || 'ZZ.Z.Z.Z.ZZZ'}'
        AND S.FECHA = (
          SELECT MAX(FECHA) 
          FROM ${conjunto}.SALDO S1
          WHERE s1.centro_costo = s.centro_costo
          AND s1.cuenta_contable = s.cuenta_contable
          AND s1.fecha <= '${fechaHasta}'
        )
        GROUP BY CENTRO_COSTO, CUENTA_CONTABLE
        
        UNION ALL
        
        SELECT 
          CENTRO_COSTO, 
          CUENTA_CONTABLE,
          0 AS saldo_inicial_local,
          0 AS saldo_inicial_dolar,
          0 AS saldo_inicial_corp_local,
          0 AS saldo_inicial_corp_dolar,
          0 AS saldo_inicial_fisc_und,
          0 AS saldo_inicial_corp_und,
          0 AS debito_fisc_local,
          0 AS credito_fisc_local,
          0 AS debito_fisc_dolar,
          0 AS credito_fisc_dolar,
          0 AS debito_corp_local,
          0 AS credito_corp_local,
          0 AS debito_corp_dolar,
          0 AS credito_corp_dolar,
          0 AS debito_fisc_und,
          0 AS credito_fisc_und,
          0 AS debito_corp_und,
          0 AS credito_corp_und,
          SUM(ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_LOCAL WHEN 'F' THEN DEBITO_LOCAL ELSE 0 END, 0)) AS saldo_final_local,
          SUM(ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_LOCAL WHEN 'F' THEN CREDITO_LOCAL ELSE 0 END, 0)) AS saldo_final_dolar,
          SUM(ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_DOLAR WHEN 'F' THEN DEBITO_DOLAR ELSE 0 END, 0)) AS saldo_final_corp_local,
          SUM(ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_DOLAR WHEN 'F' THEN CREDITO_DOLAR ELSE 0 END, 0)) AS saldo_final_corp_dolar,
          SUM(ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_LOCAL WHEN 'C' THEN DEBITO_LOCAL ELSE 0 END, 0)) AS saldo_final_fisc_und,
          SUM(ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_LOCAL WHEN 'C' THEN CREDITO_LOCAL ELSE 0 END, 0)) AS saldo_final_corp_und,
          SUM(ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_DOLAR WHEN 'C' THEN DEBITO_DOLAR ELSE 0 END, 0)) AS saldo_promedio_local,
          SUM(ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_DOLAR WHEN 'C' THEN CREDITO_DOLAR ELSE 0 END, 0)) AS saldo_promedio_dolar,
          SUM(ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_UNIDADES WHEN 'F' THEN DEBITO_UNIDADES ELSE 0 END, 0)) AS saldo_promedio_corp_local,
          SUM(ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_UNIDADES WHEN 'F' THEN CREDITO_UNIDADES ELSE 0 END, 0)) AS saldo_promedio_corp_dolar,
          SUM(ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_UNIDADES WHEN 'C' THEN DEBITO_UNIDADES ELSE 0 END, 0)) AS saldo_promedio_fisc_und,
          SUM(ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_UNIDADES WHEN 'C' THEN CREDITO_UNIDADES ELSE 0 END, 0)) AS saldo_promedio_corp_und
        FROM ${conjunto}.MAYOR
        WHERE cuenta_contable >= '${cuenta_contable_desde || '00.0.0.0.000'}'
        AND cuenta_contable <= '${cuenta_contable_hasta || 'ZZ.Z.Z.Z.ZZZ'}'
        AND (FECHA >= '${fechaDesde}' AND FECHA < '${fechaHasta}')
        GROUP BY CENTRO_COSTO, CUENTA_CONTABLE
        ORDER BY 1, 2
      `;

      const results = await exactusSequelize.query(query, { type: QueryTypes.SELECT });
      return results as SaldoPromediosItem[];
    } catch (error) {
      console.error('Error generando reporte de saldos promedios:', error);
      throw error;
    }
  }

  async obtenerReporte(filtros: FiltroSaldoPromedios, pagina: number = 1, limite: number = 50): Promise<{ data: SaldoPromediosItem[], total: number }> {
    try {
      const offset = (pagina - 1) * limite;
      
      const query = `
        WITH SaldosPromedios AS (
          ${await this.generarReporte(filtros)}
        )
        SELECT 
          *,
          COUNT(*) OVER() AS total_count
        FROM SaldosPromedios
        ORDER BY centro_costo, cuenta_contable
        OFFSET ${offset} ROWS
        FETCH NEXT ${limite} ROWS ONLY
      `;

      const results = await exactusSequelize.query(query, { type: QueryTypes.SELECT });
      const total = results.length > 0 ? (results[0] as any).total_count : 0;
      
      return {
        data: results as SaldoPromediosItem[],
        total: total
      };
    } catch (error) {
      console.error('Error obteniendo reporte de saldos promedios:', error);
      throw error;
    }
  }

  async limpiarDatos(): Promise<boolean> {
    try {
      // No hay tabla temporal que limpiar en este caso
      return true;
    } catch (error) {
      console.error('Error limpiando datos:', error);
      return false;
    }
  }
}
