import { injectable } from 'inversify';
import { IReporteCuentaContableRepository } from '../../domain/repositories/IReporteCuentaContableRepository';
import { ReporteCuentaContable, FiltroCentroCosto } from '../../domain/entities/ReporteCuentaContable';
import { QueryTypes } from 'sequelize';
import { exactusSequelize } from '../database/config/exactus-database';

@injectable()
export class ReporteCuentaContableRepository implements IReporteCuentaContableRepository {
  
  async obtenerFiltroCentrosCosto(conjunto: string): Promise<FiltroCentroCosto[]> {
    try {
      const query = `
        SELECT A.centro_costo, A.descripcion 
        FROM ${conjunto}.centro_costo A(NOLOCK)         
        ORDER BY 1 ASC
      `;
      
      const resultados = await exactusSequelize.query(query, { 
        type: QueryTypes.SELECT 
      });
      
      return resultados as FiltroCentroCosto[];
    } catch (error) {
      console.error('Error al obtener filtro de centros de costo:', error);
      throw new Error('Error al obtener filtro de centros de costo');
    }
  }

  async obtenerCentroCostoPorCodigo(conjunto: string, centroCosto: string): Promise<FiltroCentroCosto | null> {
    try {
      const query = `
        SELECT descripcion, acepta_datos, tipo 
        FROM ${conjunto}.centro_costo(NOLOCK)    
        WHERE centro_costo = '${centroCosto}'
      `;
      
      const resultados = await exactusSequelize.query(query, { 
        type: QueryTypes.SELECT 
      });
      
      if (resultados.length === 0) {
        return null;
      }
      
      const resultado = resultados[0] as any;
      return {
        CENTRO_COSTO: centroCosto,
        DESCRIPCION: resultado.descripcion
      };
    } catch (error) {
      console.error('Error al obtener centro de costo por código:', error);
      throw new Error('Error al obtener centro de costo por código');
    }
  }

  async obtenerCuentasContablesPorCentroCosto(
    conjunto: string, 
    centroCosto: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<ReporteCuentaContable[]> {
    try {
      const query = `
        SELECT DISTINCT cta.cuenta_contable, cta.descripcion, cta.tipo  
        FROM ${conjunto}.cuenta_contable CTA(NOLOCK), ${conjunto}.centro_cuenta CTR(NOLOCK)  
        WHERE CTA.cuenta_contable = CTR.cuenta_contable 
        AND centro_costo LIKE '${centroCosto}%'
        ORDER BY 1 ASC
        OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
      `;
      
      const resultados = await exactusSequelize.query(query, { 
        type: QueryTypes.SELECT 
      });
      
      return resultados as ReporteCuentaContable[];
    } catch (error) {
      console.error('Error al obtener cuentas contables por centro de costo:', error);
      throw new Error('Error al obtener cuentas contables por centro de costo');
    }
  }

  async obtenerCuentasContablesCount(conjunto: string, centroCosto: string): Promise<number> {
    try {
      const query = `
        SELECT COUNT(DISTINCT cta.cuenta_contable) as total
        FROM ${conjunto}.cuenta_contable CTA(NOLOCK), ${conjunto}.centro_cuenta CTR(NOLOCK)  
        WHERE CTA.cuenta_contable = CTR.cuenta_contable 
        AND centro_costo LIKE '${centroCosto}%'
      `;
      
      const resultados = await exactusSequelize.query(query, { 
        type: QueryTypes.SELECT 
      });
      
      return (resultados[0] as any).total;
    } catch (error) {
      console.error('Error al obtener conteo de cuentas contables:', error);
      throw new Error('Error al obtener conteo de cuentas contables');
    }
  }
}
