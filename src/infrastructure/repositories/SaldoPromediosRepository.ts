import { QueryTypes } from 'sequelize';
import { exactusSequelize } from '../database/config/exactus-database';
import { ISaldoPromediosRepository } from '../../domain/repositories/ISaldoPromediosRepository';
import { CuentaContableOption, FiltroSaldoPromedios, SaldoPromediosItem } from '../../domain/entities/SaldoPromedios';

export class SaldoPromediosRepository implements ISaldoPromediosRepository {
  
  async obtenerCuentasContables(conjunto: string): Promise<CuentaContableOption[]> {
    try {
      const query = `
        SELECT 
          A.cuenta_contable,
          A.descripcion,
          A.descripcion_ifrs,
          A.Uso_restringido  
        FROM ${conjunto}.cuenta_contable A(NOLOCK)    
        ORDER BY 1 ASC
      `;
      
      const results = await exactusSequelize.query(query, { type: QueryTypes.SELECT });
      return results as CuentaContableOption[];
    } catch (error) {
      console.error('Error obteniendo cuentas contables:', error);
      throw error;
    }
  }

  async generarReportePaginado(filtros: FiltroSaldoPromedios, page: number, limit: number): Promise<SaldoPromediosItem[]> {
    try {
      const { conjunto, cuenta_contable_desde, cuenta_contable_hasta, fecha_desde, fecha_hasta } = filtros;
      
      // Convertir fechas al formato requerido por SQL Server
      const fechaDesde = new Date(fecha_desde).toISOString().slice(0, 10).replace(/-/g, '-');
      const fechaHasta = new Date(fecha_hasta).toISOString().slice(0, 10).replace(/-/g, '-');
      
      // Calcular offset para paginación
      const offset = (page - 1) * limit;
      
      // Query principal con paginación aplicada correctamente
      // Incluye todas las cuentas contables, incluso las que no tienen movimientos
      const query = `
        SELECT * FROM (
          SELECT 
            COALESCE(s.CENTRO_COSTO, '00.00.00.00.00') AS centro_costo,
            COALESCE(s.CUENTA_CONTABLE, c.cuenta_contable) AS cuenta_contable,
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_inicial_local, 
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_inicial_dolar,  
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_inicial_corp_local, 
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_inicial_corp_dolar,  
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_inicial_fisc_und, 
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_inicial_corp_und,  
            COALESCE(SUM(s.DEBITO_FISC_LOCAL), 0) AS debito_fisc_local, 
            COALESCE(SUM(s.CREDITO_FISC_LOCAL), 0) AS credito_fisc_local, 
            COALESCE(SUM(s.DEBITO_FISC_DOLAR), 0) AS debito_fisc_dolar, 
            COALESCE(SUM(s.CREDITO_FISC_DOLAR), 0) AS credito_fisc_dolar,  
            COALESCE(SUM(s.DEBITO_CORP_LOCAL), 0) AS debito_corp_local, 
            COALESCE(SUM(s.CREDITO_CORP_LOCAL), 0) AS credito_corp_local, 
            COALESCE(SUM(s.DEBITO_CORP_DOLAR), 0) AS debito_corp_dolar, 
            COALESCE(SUM(s.CREDITO_CORP_DOLAR), 0) AS credito_corp_dolar,  
            COALESCE(SUM(s.DEBITO_FISC_UND), 0) AS debito_fisc_und, 
            COALESCE(SUM(s.CREDITO_FISC_UND), 0) AS credito_fisc_und, 
            COALESCE(SUM(s.DEBITO_CORP_UND), 0) AS debito_corp_und, 
            COALESCE(SUM(s.CREDITO_CORP_UND), 0) AS credito_corp_und,  
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_final_local,  
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_final_dolar,  
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_final_corp_local,  
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_final_corp_dolar,  
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_final_fisc_und,  
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_final_corp_und,
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_promedio_local,  
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_promedio_dolar, 
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_promedio_corp_local,  
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_promedio_corp_dolar,  
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_promedio_fisc_und,  
            COALESCE(SUM(s.SALDO_FISC_LOCAL - s.SALDO_FISC_LOCAL), 0) AS saldo_promedio_corp_und  
          FROM ${conjunto}.cuenta_contable c
          LEFT JOIN ${conjunto}.SALDO s ON c.cuenta_contable = s.cuenta_contable  
          WHERE c.cuenta_contable >= '${cuenta_contable_desde || '00.0.0.0.000'}'
          AND c.cuenta_contable <= '${cuenta_contable_hasta || 'ZZ.Z.Z.Z.ZZZ'}'  
          AND (s.FECHA IS NULL OR (s.FECHA >= '${fechaDesde}' AND s.FECHA < '${fechaHasta}'))
          GROUP BY c.cuenta_contable, s.CENTRO_COSTO
          
          UNION ALL  
          
          SELECT  
            COALESCE(s.CENTRO_COSTO, '00.00.00.00.00') AS centro_costo,
            COALESCE(s.CUENTA_CONTABLE, c.cuenta_contable) AS cuenta_contable,
            COALESCE(SUM(s.saldo_fisc_local), 0) AS saldo_inicial_local, 
            COALESCE(SUM(s.saldo_fisc_dolar), 0) AS saldo_inicial_dolar,
            COALESCE(SUM(s.saldo_corp_local), 0) AS saldo_inicial_corp_local, 
            COALESCE(SUM(s.saldo_corp_dolar), 0) AS saldo_inicial_corp_dolar, 
            COALESCE(SUM(s.saldo_fisc_und), 0) AS saldo_inicial_fisc_und, 
            COALESCE(SUM(s.saldo_corp_und), 0) AS saldo_inicial_corp_und,  
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
          FROM ${conjunto}.cuenta_contable c
          LEFT JOIN ${conjunto}.SALDO_PROMEDIO s ON c.cuenta_contable = s.cuenta_contable
          WHERE c.cuenta_contable >= '${cuenta_contable_desde || '00.0.0.0.000'}'
          AND c.cuenta_contable <= '${cuenta_contable_hasta || 'ZZ.Z.Z.Z.ZZZ'}'
          AND (s.FECHA IS NULL OR s.FECHA = (
            SELECT MAX(FECHA) 
            FROM ${conjunto}.SALDO_PROMEDIO S1 
            WHERE s1.cuenta_contable = c.cuenta_contable 
            AND s1.fecha <= '${fechaHasta}'
          ))
          GROUP BY c.cuenta_contable, s.CENTRO_COSTO
          
          UNION ALL  
          
          SELECT 
            COALESCE(m.CENTRO_COSTO, '00.00.00.00.00') AS centro_costo,
            COALESCE(m.CUENTA_CONTABLE, c.cuenta_contable) AS cuenta_contable,
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
            COALESCE(SUM(ISNULL(CASE m.CONTABILIDAD WHEN 'A'THEN m.DEBITO_LOCAL WHEN 'F' THEN m.DEBITO_LOCAL ELSE 0 END, 0)), 0) AS saldo_final_local, 
            COALESCE(SUM(ISNULL(CASE m.CONTABILIDAD WHEN 'A'  THEN m.CREDITO_LOCAL WHEN 'F' THEN m.CREDITO_LOCAL ELSE 0 END, 0)), 0) AS saldo_final_dolar,  
            COALESCE(SUM(ISNULL(CASE m.CONTABILIDAD WHEN 'A' THEN m.DEBITO_DOLAR WHEN 'F' THEN m.DEBITO_DOLAR ELSE 0 END, 0)), 0) AS saldo_final_corp_local, 
            COALESCE(SUM(ISNULL(CASE m.CONTABILIDAD WHEN 'A' THEN m.CREDITO_DOLAR WHEN 'F' THEN m.CREDITO_DOLAR ELSE 0 END, 0)), 0) AS saldo_final_corp_dolar,  
            COALESCE(SUM(ISNULL(CASE m.CONTABILIDAD WHEN 'A' THEN m.DEBITO_LOCAL WHEN  'C'  THEN m.DEBITO_LOCAL ELSE 0 END, 0)), 0) AS saldo_final_fisc_und, 
            COALESCE(SUM(ISNULL(CASE m.CONTABILIDAD WHEN 'A' THEN m.CREDITO_LOCAL WHEN  'C' THEN m.CREDITO_LOCAL ELSE 0 END, 0)), 0) AS saldo_final_corp_und,  
            COALESCE(SUM(ISNULL(CASE m.CONTABILIDAD WHEN 'A' THEN m.DEBITO_DOLAR WHEN  'C' THEN m.DEBITO_DOLAR ELSE 0 END, 0)), 0) AS saldo_promedio_local, 
            COALESCE(SUM(ISNULL(CASE m.CONTABILIDAD WHEN 'A' THEN m.CREDITO_DOLAR WHEN  'C' THEN m.CREDITO_DOLAR ELSE 0 END, 0)), 0) AS saldo_promedio_dolar,  
            COALESCE(SUM(ISNULL(CASE m.CONTABILIDAD WHEN 'A' THEN m.DEBITO_UNIDADES WHEN 'F' THEN m.DEBITO_UNIDADES ELSE 0 END, 0)), 0) AS saldo_promedio_corp_local, 
            COALESCE(SUM(ISNULL(CASE m.CONTABILIDAD WHEN 'A' THEN m.CREDITO_UNIDADES  WHEN 'F' THEN m.CREDITO_UNIDADES ELSE 0 END, 0)), 0) AS saldo_promedio_corp_dolar,  
            COALESCE(SUM(ISNULL(CASE m.CONTABILIDAD WHEN 'A' THEN m.DEBITO_UNIDADES  WHEN  'C' THEN m.DEBITO_UNIDADES ELSE 0 END, 0)), 0) AS saldo_promedio_fisc_und, 
            COALESCE(SUM(ISNULL(CASE m.CONTABILIDAD WHEN 'A' THEN m.CREDITO_UNIDADES WHEN  'C' THEN m.CREDITO_UNIDADES ELSE 0 END, 0)), 0) AS saldo_promedio_corp_und  
          FROM ${conjunto}.cuenta_contable c
          LEFT JOIN ${conjunto}.MAYOR m ON c.cuenta_contable = m.cuenta_contable
          WHERE c.cuenta_contable >= '${cuenta_contable_desde || '00.0.0.0.000'}'
          AND c.cuenta_contable <= '${cuenta_contable_hasta || 'ZZ.Z.Z.Z.ZZZ'}'
          AND (m.FECHA IS NULL OR (m.FECHA >= '${fechaDesde}' AND m.FECHA < '${fechaHasta}'))
          GROUP BY c.cuenta_contable, m.CENTRO_COSTO
        ) AS combined_data
        ORDER BY centro_costo, cuenta_contable  
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY
      `;

      console.log('📊 Query SQL con paginación CORREGIDA e incluyendo registros con 0:', { page, limit, offset });
      console.log('🔍 Filtros aplicados:', { conjunto, cuenta_contable_desde, cuenta_contable_hasta, fechaDesde, fechaHasta });
      
      const results = await exactusSequelize.query(query, { type: QueryTypes.SELECT });
      
      console.log('📊 Resultados obtenidos del repositorio PAGINADO:', {
        totalResultados: results.length,
        pagina: page,
        limite: limit,
        offset: offset
      });
      
      return results as SaldoPromediosItem[];
    } catch (error) {
      console.error('Error generando reporte paginado:', error);
      throw error;
    }
  }

  async obtenerTotalRegistros(filtros: FiltroSaldoPromedios): Promise<number> {
    try {
      const { conjunto, cuenta_contable_desde, cuenta_contable_hasta, fecha_desde, fecha_hasta } = filtros;
      
      // Convertir fechas al formato requerido por SQL Server
      const fechaDesde = new Date(fecha_desde).toISOString().slice(0, 10).replace(/-/g, '-');
      const fechaHasta = new Date(fecha_hasta).toISOString().slice(0, 10).replace(/-/g, '-');
      
      // Query para contar el total de registros (sin paginación)
      // Incluye todas las cuentas contables para el conteo correcto
      const countQuery = `
        SELECT COUNT(DISTINCT c.cuenta_contable) as total 
        FROM ${conjunto}.cuenta_contable c
        WHERE c.cuenta_contable >= '${cuenta_contable_desde || '00.0.0.0.000'}'
        AND c.cuenta_contable <= '${cuenta_contable_hasta || 'ZZ.Z.Z.Z.ZZZ'}'
      `;

      console.log('🔢 Query para contar total de registros');
      
      const countResult = await exactusSequelize.query(countQuery, { type: QueryTypes.SELECT });
      const total = (countResult[0] as any)?.total || 0;
      
      console.log('📊 Total de registros disponibles:', total);
      
      return total;
    } catch (error) {
      console.error('Error contando total de registros:', error);
      throw error;
    }
  }
}
