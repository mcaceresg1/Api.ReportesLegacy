import { injectable } from 'inversify';
import { QueryTypes } from 'sequelize';
import { exactusSequelize } from '../database/config/exactus-database';
import { IPeriodoContableRepository } from '../../domain/repositories/IPeriodoContableRepository';
import { PeriodoContable, FiltroPeriodoContable, CentroCosto, PeriodoContableInfo } from '../../domain/entities/PeriodoContable';

@injectable()
export class PeriodoContableRepository implements IPeriodoContableRepository {

  async obtenerCentrosCosto(conjunto: string): Promise<CentroCosto[]> {
    try {
      const schema = conjunto;
      
      // Verificar que la tabla existe
      const tableExists = await exactusSequelize.query(
        `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${schema}' AND TABLE_NAME = 'centro_costo'`,
        { type: QueryTypes.SELECT }
      );

      if (!tableExists || (tableExists[0] as any).count === 0) {
        console.warn(`Tabla ${schema}.centro_costo no existe`);
        return [];
      }

      const query = `
        SELECT 
            CENTRO_COSTO,
            DESCRIPCION 
        FROM ${schema}.centro_costo WITH(NOLOCK)
      `;

      const results = await exactusSequelize.query(query, { type: QueryTypes.SELECT });
      
      return results as CentroCosto[];
    } catch (error) {
      console.error('Error al obtener centros de costo:', error);
      throw new Error('Error al obtener centros de costo');
    }
  }

  async obtenerPeriodosContables(conjunto: string): Promise<PeriodoContableInfo[]> {
    try {
      const schema = conjunto;
      
      // Verificar que la tabla existe
      const tableExists = await exactusSequelize.query(
        `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${schema}' AND TABLE_NAME = 'PERIODO_CONTABLE'`,
        { type: QueryTypes.SELECT }
      );

      if (!tableExists || (tableExists[0] as any).count === 0) {
        console.warn(`Tabla ${schema}.PERIODO_CONTABLE no existe`);
        return [];
      }

      const query = `
        SELECT TOP (1000) 
          [FECHA_FINAL],
          [DESCRIPCION],
          [CONTABILIDAD],
          [FIN_PERIODO_ANUAL],
          [ESTADO],
          [NoteExistsFlag],
          [RecordDate],
          [RowPointer],
          [CreatedBy],
          [UpdatedBy],
          [CreateDate]
        FROM [EXACTUS].[${schema}].[PERIODO_CONTABLE]
        WHERE [CONTABILIDAD] = 'S'
        ORDER BY [FECHA_FINAL] DESC
      `;

      const results = await exactusSequelize.query(query, { type: QueryTypes.SELECT });
      
      return results as PeriodoContableInfo[];
    } catch (error) {
      console.error('Error al obtener periodos contables:', error);
      throw new Error('Error al obtener periodos contables');
    }
  }

  async generarReporte(filtros: FiltroPeriodoContable): Promise<PeriodoContable[]> {
    try {
      const schema = filtros.conjunto;
      
      // Convertir la fecha ISO a formato SQL Server (YYYYMMDD)
      let periodo: string;
      if (filtros.periodo) {
        const fecha = new Date(filtros.periodo);
        periodo = fecha.getFullYear().toString() + 
                 (fecha.getMonth() + 1).toString().padStart(2, '0') + 
                 fecha.getDate().toString().padStart(2, '0');
      } else {
        throw new Error('El período es requerido');
      }
      
      const centroCosto = filtros.centro_costo || '01.01.01.01.00';
      
      // Verificar que las tablas existen
      const tablesToCheck = ['cuenta_contable', 'saldo', 'mayor', 'centro_cuenta', 'hist_cierre_cg'];
      for (const table of tablesToCheck) {
        const tableExists = await exactusSequelize.query(
          `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${schema}' AND TABLE_NAME = '${table}'`,
          { type: QueryTypes.SELECT }
        );
        
        if (!tableExists || (tableExists[0] as any).count === 0) {
          console.warn(`Tabla ${schema}.${table} no existe`);
          return [];
        }
      }

      let query: string;

      if (filtros.saldosAntesCierre) {
        // Query 2: SALDO ANTES DEL CIERRE (MÁS COMPLEJO)
        query = `
          WITH saldos_maximos AS (
            -- Subconsulta para obtener la fecha máxima por cuenta y centro de costo
            SELECT 
                B.centro_costo,
                A.cuenta_contable,
                MAX(B.fecha) AS fecha_maxima
            FROM ${schema}.cuenta_contable A
            INNER JOIN ${schema}.saldo B WITH(NOLOCK) ON A.cuenta_contable = B.cuenta_contable
            WHERE B.fecha <= '${periodo}'
              AND B.centro_costo = '${centroCosto}'
              AND A.acepta_datos = 'S'
            GROUP BY B.centro_costo, A.cuenta_contable
          ),
          saldos_a_fecha AS (
            -- Saldos existentes a la fecha de corte
            SELECT 
                B.centro_costo,
                A.cuenta_contable,
                SM.fecha_maxima AS fecha,
                A.saldo_normal,
                A.descripcion,
                (B.saldo_fisc_local - B.debito_fisc_local + B.credito_fisc_local) AS saldo_inicial_local,
                B.debito_fisc_local,
                B.credito_fisc_local,
                B.saldo_fisc_local,
                (B.saldo_fisc_dolar - B.debito_fisc_dolar + B.credito_fisc_dolar) AS saldo_inicial_dolar,
                B.debito_fisc_dolar,
                B.credito_fisc_dolar,
                B.saldo_fisc_dolar,
                (B.saldo_fisc_und - B.debito_fisc_und + B.credito_fisc_und) AS saldo_inicial_unidades,
                B.debito_fisc_und,
                B.credito_fisc_und,
                B.saldo_fisc_und
            FROM ${schema}.cuenta_contable A
            INNER JOIN ${schema}.saldo B WITH(NOLOCK) ON A.cuenta_contable = B.cuenta_contable
            INNER JOIN saldos_maximos SM ON B.centro_costo = SM.centro_costo 
                                         AND B.cuenta_contable = SM.cuenta_contable
                                         AND B.fecha = SM.fecha_maxima
            WHERE A.acepta_datos = 'S'
              AND NOT EXISTS (
                  SELECT 1 
                  FROM ${schema}.centro_cuenta E
                  WHERE E.centro_costo = B.centro_costo
                    AND E.cuenta_contable = B.cuenta_contable
                    AND E.estado = 'I'
              )
            
            UNION ALL
            
            -- Cuentas sin movimientos previos
            SELECT 
                CC.centro_costo,
                CTA.cuenta_contable,
                GETDATE() AS fecha,
                CTA.saldo_normal,
                CTA.descripcion,
                0 AS saldo_inicial_local, 0, 0, 0,  -- Valores en cero para moneda local
                0 AS saldo_inicial_dolar, 0, 0, 0,  -- Valores en cero para dólares
                0 AS saldo_inicial_unidades, 0, 0, 0 -- Valores en cero para unidades
            FROM ${schema}.cuenta_contable CTA
            INNER JOIN ${schema}.centro_cuenta CC ON CTA.cuenta_contable = CC.cuenta_contable
            WHERE CTA.acepta_datos = 'S'
              AND CC.centro_costo = '${centroCosto}'
              AND CC.estado <> 'I'
              AND NOT EXISTS (
                  SELECT 1 
                  FROM ${schema}.saldo S
                  WHERE S.cuenta_contable = CTA.cuenta_contable
              )
            
            UNION ALL
            
            -- Movimientos de cierre
            SELECT 
                M.centro_costo,
                CTA.cuenta_contable,
                M.fecha,
                CTA.saldo_normal,
                CTA.descripcion,
                0 AS saldo_inicial_local,
                M.debito_local * -1 AS debito_fisc_local,
                M.credito_local * -1 AS credito_fisc_local,
                ISNULL(M.credito_local, 0) - ISNULL(M.debito_local, 0) AS saldo_fisc_local,
                0 AS saldo_inicial_dolar,
                M.debito_dolar * -1 AS debito_fisc_dolar,
                M.credito_dolar * -1 AS credito_fisc_dolar,
                ISNULL(M.credito_dolar, 0) - ISNULL(M.debito_dolar, 0) AS saldo_fisc_dolar,
                0 AS saldo_inicial_unidades,
                M.debito_unidades * -1 AS debito_fisc_und,
                M.credito_unidades * -1 AS credito_fisc_und,
                ISNULL(M.credito_unidades, 0) - ISNULL(M.debito_unidades, 0) AS saldo_fisc_und
            FROM ${schema}.cuenta_contable CTA
            INNER JOIN ${schema}.mayor M ON CTA.cuenta_contable = M.cuenta_contable
            WHERE M.asiento IN (
                SELECT asiento 
                FROM ${schema}.hist_cierre_cg
                WHERE fecha_cierre = '${periodo}'
                  AND contabilidad IN ('F', 'A')
            )
          )
          SELECT 
              centro_costo,
              cuenta_contable,
              fecha,
              saldo_normal,
              descripcion,
              -- Agregaciones finales
              SUM(saldo_inicial_local) AS saldo_inicial_local,
              SUM(debito_fisc_local) AS debito_fisc_local,
              SUM(credito_fisc_local) AS credito_fisc_local,
              SUM(saldo_fisc_local) AS saldo_fisc_local,
              SUM(saldo_inicial_dolar) AS saldo_inicial_dolar,
              SUM(debito_fisc_dolar) AS debito_fisc_dolar,
              SUM(credito_fisc_dolar) AS credito_fisc_dolar,
              SUM(saldo_fisc_dolar) AS saldo_fisc_dolar,
              SUM(saldo_inicial_unidades) AS saldo_inicial_und,
              SUM(debito_fisc_und) AS debito_fisc_und,
              SUM(credito_fisc_und) AS credito_fisc_und,
              SUM(saldo_fisc_und) AS saldo_fisc_und
          FROM saldos_a_fecha
          GROUP BY centro_costo, cuenta_contable, fecha, saldo_normal, descripcion
          ORDER BY centro_costo ASC
        `;
      } else {
        // Query 1: SALDO DE CUENTAS CON MOVIMIENTO (HISTÓRICO)
        query = `
          WITH saldos_historicos AS (
              SELECT 
                  B.centro_costo,
                  A.cuenta_contable,
                  B.fecha,
                  A.saldo_normal,
                  A.descripcion,
                  -- Cálculo de saldo inicial en moneda local
                  (B.saldo_fisc_local - B.debito_fisc_local + B.credito_fisc_local) AS saldo_inicial_local,
                  B.debito_fisc_local,
                  B.credito_fisc_local,
                  B.saldo_fisc_local,
                  -- Cálculo de saldo inicial en dólares
                  (B.saldo_fisc_dolar - B.debito_fisc_dolar + B.credito_fisc_dolar) AS saldo_inicial_dolar,
                  B.debito_fisc_dolar,
                  B.credito_fisc_dolar,
                  B.saldo_fisc_dolar,
                  -- Cálculo de saldo inicial en unidades
                  (B.saldo_fisc_und - B.debito_fisc_und + B.credito_fisc_und) AS saldo_inicial_unidades,
                  B.debito_fisc_und,
                  B.credito_fisc_und,
                  B.saldo_fisc_und
              FROM ${schema}.cuenta_contable A
              INNER JOIN ${schema}.saldo B WITH(NOLOCK) ON A.cuenta_contable = B.cuenta_contable
              WHERE B.centro_costo = '${centroCosto}'
                AND B.fecha = '${periodo}'
          )
          SELECT 
              centro_costo,
              cuenta_contable,
              fecha,
              saldo_normal,
              descripcion,
              -- Agregaciones en moneda local
              SUM(saldo_inicial_local) AS saldo_inicial_local,
              SUM(debito_fisc_local) AS debito_fisc_local,
              SUM(credito_fisc_local) AS credito_fisc_local,
              SUM(saldo_fisc_local) AS saldo_fisc_local,
              -- Agregaciones en dólares
              SUM(saldo_inicial_dolar) AS saldo_inicial_dolar,
              SUM(debito_fisc_dolar) AS debito_fisc_dolar,
              SUM(credito_fisc_dolar) AS credito_fisc_dolar,
              SUM(saldo_fisc_dolar) AS saldo_fisc_dolar,
              -- Agregaciones en unidades
              SUM(saldo_inicial_unidades) AS saldo_inicial_und,
              SUM(debito_fisc_und) AS debito_fisc_und,
              SUM(credito_fisc_und) AS credito_fisc_und,
              SUM(saldo_fisc_und) AS saldo_fisc_und
          FROM saldos_historicos
          GROUP BY centro_costo, cuenta_contable, fecha, saldo_normal, descripcion
          ORDER BY centro_costo ASC
        `;
      }

      const results = await exactusSequelize.query(query, { type: QueryTypes.SELECT });
      
      return results as PeriodoContable[];
    } catch (error) {
      console.error('Error al generar reporte de periodos contables:', error);
      throw new Error('Error al generar reporte de periodos contables');
    }
  }
}
