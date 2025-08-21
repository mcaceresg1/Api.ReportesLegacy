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
        SELECT CENTRO_COSTO, DESCRIPCION 
        FROM ${schema}.centro_costo (NOLOCK)
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
      const fechaDesde = filtros.fechaDesde.replace(/-/g, '');
      const fechaHasta = filtros.fechaHasta.replace(/-/g, '');
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
        // Query para saldos antes del cierre
        query = `
          SELECT 
            centro_costo, cuenta_contable, fecha, saldo_normal, descripcion, 
            SUM(SaldoIniciaLoc) as saldo_inicial_local, 
            SUM(debito_fisc_local) as debito_fisc_local, 
            SUM(credito_fisc_local) as credito_fisc_local, 
            SUM(saldo_fisc_local) as saldo_fisc_local, 
            SUM(SaldoIniciaDol) as saldo_inicial_dolar, 
            SUM(debito_fisc_dolar) as debito_fisc_dolar, 
            SUM(credito_fisc_dolar) as credito_fisc_dolar, 
            SUM(saldo_fisc_dolar) as saldo_fisc_dolar, 
            SUM(SaldoIniciaUnd) as saldo_inicial_und, 
            SUM(debito_fisc_und) as debito_fisc_und, 
            SUM(credito_fisc_und) as credito_fisc_und, 
            SUM(saldo_fisc_und) as saldo_fisc_und  
          FROM (
            SELECT 
              B.centro_costo, A.cuenta_contable, fecha, saldo_normal, descripcion, 
              saldo_fisc_local-debito_fisc_local+credito_fisc_local SaldoIniciaLoc, 
              debito_fisc_local, credito_fisc_local, saldo_fisc_local,  
              saldo_fisc_dolar-debito_fisc_dolar+credito_fisc_dolar SaldoIniciaDol, 
              debito_fisc_dolar, credito_fisc_dolar, saldo_fisc_dolar,  
              saldo_fisc_und-debito_fisc_und+credito_fisc_und SaldoIniciaUnd, 
              debito_fisc_und, credito_fisc_und, saldo_fisc_und  
            FROM ${schema}.cuenta_contable A, ${schema}.saldo B (NOLOCK)  
            WHERE A.cuenta_contable = B.cuenta_contable 
              AND B.centro_costo = '${centroCosto}'
              AND fecha >= '${fechaDesde}' AND fecha <= '${fechaHasta}'
          ) Consulta  
          GROUP BY centro_costo, cuenta_contable, fecha, saldo_normal, descripcion         
          ORDER BY 1 ASC
        `;
      } else {
        // Query estándar para cuentas con movimiento
        query = `
          SELECT 
            centro_costo, cuenta_contable, fecha, saldo_normal, descripcion, 
            SUM(SaldoIniciaLoc) as saldo_inicial_local, 
            SUM(debito_fisc_local) as debito_fisc_local, 
            SUM(credito_fisc_local) as credito_fisc_local, 
            SUM(saldo_fisc_local) as saldo_fisc_local, 
            SUM(SaldoIniciaDol) as saldo_inicial_dolar, 
            SUM(debito_fisc_dolar) as debito_fisc_dolar, 
            SUM(credito_fisc_dolar) as credito_fisc_dolar, 
            SUM(saldo_fisc_dolar) as saldo_fisc_dolar, 
            SUM(SaldoIniciaUnd) as saldo_inicial_und, 
            SUM(debito_fisc_und) as debito_fisc_und, 
            SUM(credito_fisc_und) as credito_fisc_und, 
            SUM(saldo_fisc_und) as saldo_fisc_und  
          FROM (
            SELECT 
              B.centro_costo, A.cuenta_contable, fecha, saldo_normal, descripcion, 
              saldo_fisc_local-debito_fisc_local+credito_fisc_local SaldoIniciaLoc, 
              debito_fisc_local, credito_fisc_local, saldo_fisc_local,  
              saldo_fisc_dolar-debito_fisc_dolar+credito_fisc_dolar SaldoIniciaDol, 
              debito_fisc_dolar, credito_fisc_dolar, saldo_fisc_dolar,
              saldo_fisc_und-debito_fisc_und+credito_fisc_und SaldoIniciaUnd, 
              debito_fisc_und, credito_fisc_und, saldo_fisc_und  
            FROM ${schema}.cuenta_contable A, ${schema}.saldo B (NOLOCK)  
            WHERE A.cuenta_contable = B.cuenta_contable 
              AND B.centro_costo = '${centroCosto}'
              AND fecha >= '${fechaDesde}' AND fecha <= '${fechaHasta}'
          ) Consulta  
          GROUP BY centro_costo, cuenta_contable, fecha, saldo_normal, descripcion         
          ORDER BY 1 ASC
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
