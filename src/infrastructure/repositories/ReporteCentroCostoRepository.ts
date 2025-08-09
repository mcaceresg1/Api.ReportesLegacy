import { injectable } from 'inversify';
import { exactusSequelize } from '../database/config/exactus-database';
import { FiltroCuentaContable, ReporteCentroCosto, DetalleCuentaContable } from '../../domain/entities/ReporteCentroCosto';
import { IReporteCentroCostoRepository } from '../../domain/repositories/IReporteCentroCostoRepository';

@injectable()
export class ReporteCentroCostoRepository implements IReporteCentroCostoRepository {
  /**
   * Obtiene el filtro de cuentas contables
   */
  async obtenerFiltroCuentasContables(conjunto: string): Promise<FiltroCuentaContable[]> {
    try {
      const query = `
        SELECT 
          A.cuenta_contable,
          A.descripcion,
          A.Uso_restringido
        FROM ${conjunto}.cuenta_contable A(NOLOCK)
        ORDER BY 1 ASC
      `;

      const [results] = await exactusSequelize.query(query);
      return results as FiltroCuentaContable[];
    } catch (error) {
      console.error('Error obteniendo filtro de cuentas contables:', error);
      throw new Error(`Error al obtener filtro de cuentas contables: ${error}`);
    }
  }

  /**
   * Obtiene el detalle de una cuenta contable específica
   */
  async obtenerDetalleCuentaContable(conjunto: string, cuentaContable: string): Promise<DetalleCuentaContable | null> {
    try {
      const query = `
        SELECT 
          descripcion,
          descripcion_ifrs,
          origen_conversion,
          conversion,
          acepta_datos,
          usa_centro_costo,
          tipo_cambio,
          acepta_unidades,
          unidad,
          uso_restringido,
          maneja_tercero
        FROM ${conjunto}.cuenta_contable (NOLOCK)
        WHERE cuenta_contable = :cuentaContable
      `;

      const [results] = await exactusSequelize.query(query, {
        replacements: { cuentaContable }
      });

      const result = results as DetalleCuentaContable[];
      return result.length > 0 ? result[0] || null : null;
    } catch (error) {
      console.error('Error obteniendo detalle de cuenta contable:', error);
      throw new Error(`Error al obtener detalle de cuenta contable: ${error}`);
    }
  }

  /**
   * Obtiene los centros de costo asociados a una cuenta contable
   */
  async obtenerCentrosCostoPorCuentaContable(
    conjunto: string, 
    cuentaContable: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: ReporteCentroCosto[], pagination: any }> {
    try {
      const offset = (page - 1) * limit;

      // Query para obtener el total de registros
      const countQuery = `
        SELECT COUNT(DISTINCT CC.centro_costo) as total
        FROM ${conjunto}.centro_costo CC(NOLOCK), ${conjunto}.centro_cuenta CNTCTA(NOLOCK)
        WHERE CNTCTA.centro_costo = CC.centro_costo 
        AND CNTCTA.cuenta_contable = :cuentaContable
      `;

      const [countResults] = await exactusSequelize.query(countQuery, {
        replacements: { cuentaContable }
      });

      const totalRecords = (countResults as any[])[0]?.total || 0;

      // Query para obtener los datos paginados
      const dataQuery = `
        SELECT DISTINCT 
          CC.centro_costo,
          CC.descripcion,
          CC.acepta_datos
        FROM ${conjunto}.centro_costo AS CC WITH (NOLOCK)
        INNER JOIN ${conjunto}.centro_cuenta AS CNTCTA WITH (NOLOCK)
          ON CNTCTA.centro_costo = CC.centro_costo
        WHERE CNTCTA.cuenta_contable = :cuentaContable
        ORDER BY CC.centro_costo ASC
        OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
      `;

      const [dataResults] = await exactusSequelize.query(dataQuery, {
        replacements: { 
          cuentaContable,
          offset,
          limit
        }
      });

      const totalPages = Math.ceil(totalRecords / limit);

      return {
        data: dataResults as ReporteCentroCosto[],
        pagination: {
          page,
          limit,
          totalRecords,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      console.error('Error obteniendo centros de costo por cuenta contable:', error);
      throw new Error(`Error al obtener centros de costo por cuenta contable: ${error}`);
    }
  }

  /**
   * Obtiene el conteo total de centros de costo para una cuenta contable
   */
  async obtenerCentrosCostoCount(conjunto: string, cuentaContable: string): Promise<number> {
    try {
      const query = `
        SELECT COUNT(DISTINCT CC.centro_costo) as total
        FROM ${conjunto}.centro_costo CC(NOLOCK), ${conjunto}.centro_cuenta CNTCTA(NOLOCK)
        WHERE CNTCTA.centro_costo = CC.centro_costo 
        AND CNTCTA.cuenta_contable = :cuentaContable
      `;

      const [results] = await exactusSequelize.query(query, {
        replacements: { cuentaContable }
      });

      return (results as any[])[0]?.total || 0;
    } catch (error) {
      console.error('Error obteniendo conteo de centros de costo:', error);
      throw new Error(`Error al obtener conteo de centros de costo: ${error}`);
    }
  }
}
