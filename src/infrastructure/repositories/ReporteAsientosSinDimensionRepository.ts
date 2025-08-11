import { injectable } from 'inversify';
import { IReporteAsientosSinDimensionRepository } from '../../domain/repositories/IReporteAsientosSinDimensionRepository';
import { ReporteAsientosSinDimension, ReporteAsientosSinDimensionCreate, ReporteAsientosSinDimensionUpdate } from '../../domain/entities/ReporteAsientosSinDimension';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';

interface RawQueryResult {
  ASIENTO: string;
  CONSECUTIVO: string | number;
  FECHA_ASIENTO: string | Date;
  ORIGEN: string;
  USUARIO_CREACION: string;
  FUENTE: string;
  REFERENCIA: string;
  MONTO_LOCAL: string | number;
  MONTO_DOLAR: string | number;
  CUENTA_CONTABLE: string;
  CENTRO_COSTO: string;
  ROW_ORDER_BY?: number;
}

@injectable()
export class ReporteAsientosSinDimensionRepository implements IReporteAsientosSinDimensionRepository {
  
  async generar(conjunto: string, fechaDesde: string, fechaHasta: string): Promise<boolean> {
    try {
      // Como la conexión es readOnly, no podemos hacer INSERT
      // Este método se mantiene por compatibilidad pero no ejecuta la operación
      console.log(`Generando reporte de asientos sin dimensión para conjunto ${conjunto} desde ${fechaDesde} hasta ${fechaHasta}`);
      return true;
    } catch (error) {
      console.error('Error al generar reporte de asientos sin dimensión:', error);
      throw error;
    }
  }

  async listar(conjunto: string, limit: number = 100, offset: number = 0): Promise<ReporteAsientosSinDimension[]> {
    try {
      const query = `
        SELECT TOP (${limit}) 
          ASIENTO, CONSECUTIVO, FECHA_ASIENTO, ORIGEN, USUARIO_CREACION, 
          FUENTE, REFERENCIA, MONTO_LOCAL, MONTO_DOLAR, CUENTA_CONTABLE, CENTRO_COSTO
        FROM ${conjunto}.R_XML_8DDC6068F9B43BF
        ORDER BY ROW_ORDER_BY
        OFFSET ${offset} ROWS
      `;

      const result = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        raw: true
      });

      return (result as RawQueryResult[]).map((row: RawQueryResult) => ({
        asiento: row.ASIENTO || '',
        consecutivo: typeof row.CONSECUTIVO === 'string' ? parseFloat(row.CONSECUTIVO) || 0 : (row.CONSECUTIVO as number) || 0,
        fechaAsiento: new Date(row.FECHA_ASIENTO),
        origen: row.ORIGEN || '',
        usuarioCreacion: row.USUARIO_CREACION || '',
        fuente: row.FUENTE || '',
        referencia: row.REFERENCIA || '',
        montoLocal: typeof row.MONTO_LOCAL === 'string' ? parseFloat(row.MONTO_LOCAL) || 0 : (row.MONTO_LOCAL as number) || 0,
        montoDolar: typeof row.MONTO_DOLAR === 'string' ? parseFloat(row.MONTO_DOLAR) || 0 : (row.MONTO_DOLAR as number) || 0,
        cuentaContable: row.CUENTA_CONTABLE || '',
        centroCosto: row.CENTRO_COSTO || '',
        rowOrderBy: row.ROW_ORDER_BY || undefined
      }));
    } catch (error) {
      console.error('Error al listar reporte de asientos sin dimensión:', error);
      throw error;
    }
  }

  async listarDetalle(conjunto: string, fechaDesde: string, fechaHasta: string, limit: number = 100, offset: number = 0): Promise<ReporteAsientosSinDimension[]> {
    try {
      const query = `
        SELECT TOP (${limit}) 
          U.ASIENTO, U.CONSECUTIVO, U.FECHA AS FECHA_ASIENTO, U.ORIGEN, 
          U.USUARIO_CREACION, U.FUENTE, U.REFERENCIA, U.MONTO_LOCAL, 
          U.MONTO_DOLAR, U.CUENTA_CONTABLE, U.CENTRO_COSTO
        FROM (
          SELECT D.ASIENTO, D.CONSECUTIVO, AD.FECHA, AD.ORIGEN, AD.USUARIO_CREACION, 
                 DL.DIMENSION2, D.FUENTE, D.REFERENCIA,
                 ISNULL(D.DEBITO_LOCAL,0) + ISNULL(D.CREDITO_LOCAL,0) AS MONTO_LOCAL,
                 ISNULL(D.DEBITO_DOLAR,0) + ISNULL(D.CREDITO_DOLAR,0) AS MONTO_DOLAR,
                 D.CUENTA_CONTABLE, D.CENTRO_COSTO
          FROM ${conjunto}.DIARIO D
          INNER JOIN ${conjunto}.ASIENTO_DE_DIARIO AD ON AD.ASIENTO = D.ASIENTO
          INNER JOIN ${conjunto}.DIMENSION_LINEA_ASIENTO DL ON DL.ASIENTO = D.ASIENTO AND DL.CONSECUTIVO = D.CONSECUTIVO
          WHERE DL.DIMENSION2 = 'ND'
            AND AD.FECHA >= @fechaDesde
            AND AD.FECHA <= @fechaHasta

          UNION ALL

          SELECT D.ASIENTO, D.CONSECUTIVO, AD.FECHA, AD.ORIGEN, AD.USUARIO_CREACION,
                 DL.DIMENSION2, D.FUENTE, D.REFERENCIA,
                 ISNULL(D.DEBITO_LOCAL,0) + ISNULL(D.CREDITO_LOCAL,0) AS MONTO_LOCAL,
                 ISNULL(D.DEBITO_DOLAR,0) + ISNULL(D.CREDITO_DOLAR,0) AS MONTO_DOLAR,
                 D.CUENTA_CONTABLE, D.CENTRO_COSTO
          FROM ${conjunto}.DIARIO D
          LEFT OUTER JOIN ${conjunto}.ASIENTO_DE_DIARIO AD ON AD.ASIENTO = D.ASIENTO
          LEFT OUTER JOIN ${conjunto}.DIMENSION_LINEA_ASIENTO DL ON D.ASIENTO = DL.ASIENTO AND D.CONSECUTIVO = DL.CONSECUTIVO
          WHERE AD.FECHA >= @fechaDesde
            AND AD.FECHA <= @fechaHasta
          GROUP BY D.ASIENTO, D.CONSECUTIVO, AD.FECHA, AD.ORIGEN, AD.USUARIO_CREACION,
                   DL.DIMENSION2, D.FUENTE, D.REFERENCIA,
                   ISNULL(D.DEBITO_LOCAL,0) + ISNULL(D.CREDITO_LOCAL,0),
                   ISNULL(D.DEBITO_DOLAR,0) + ISNULL(D.CREDITO_DOLAR,0),
                   D.CUENTA_CONTABLE, D.CENTRO_COSTO
          HAVING DL.DIMENSION2 IS NULL

          UNION ALL

          SELECT M.ASIENTO, M.CONSECUTIVO, AM.FECHA, AM.ORIGEN, AM.USUARIO_CREACION,
                 DL.DIMENSION2, M.FUENTE, M.REFERENCIA,
                 ISNULL(M.DEBITO_LOCAL,0) + ISNULL(M.CREDITO_LOCAL,0) AS MONTO_LOCAL,
                 ISNULL(M.DEBITO_DOLAR,0) + ISNULL(M.CREDITO_DOLAR,0) AS MONTO_DOLAR,
                 M.CUENTA_CONTABLE, M.CENTRO_COSTO
          FROM ${conjunto}.MAYOR M
          INNER JOIN ${conjunto}.ASIENTO_MAYORIZADO AM ON AM.ASIENTO = M.ASIENTO
          INNER JOIN ${conjunto}.DIMENSION_LINEA_ASIENTO DL ON DL.ASIENTO = M.ASIENTO AND DL.CONSECUTIVO = M.CONSECUTIVO
          WHERE DL.DIMENSION2 = 'ND'
            AND AM.FECHA >= @fechaDesde
            AND AM.FECHA <= @fechaHasta

          UNION ALL

          SELECT M.ASIENTO, M.CONSECUTIVO, AM.FECHA, AM.ORIGEN, AM.USUARIO_CREACION,
                 DL.DIMENSION2, M.FUENTE, M.REFERENCIA,
                 ISNULL(M.DEBITO_LOCAL,0) + ISNULL(M.CREDITO_LOCAL,0) AS MONTO_LOCAL,
                 ISNULL(M.DEBITO_DOLAR,0) + ISNULL(M.CREDITO_DOLAR,0) AS MONTO_DOLAR,
                 M.CUENTA_CONTABLE, M.CENTRO_COSTO
          FROM ${conjunto}.MAYOR M
          LEFT OUTER JOIN ${conjunto}.ASIENTO_MAYORIZADO AM ON AM.ASIENTO = M.ASIENTO
          LEFT OUTER JOIN ${conjunto}.DIMENSION_LINEA_ASIENTO DL ON M.ASIENTO = DL.ASIENTO AND M.CONSECUTIVO = DL.CONSECUTIVO
          WHERE AM.FECHA >= @fechaDesde
            AND AM.FECHA <= @fechaHasta
          GROUP BY M.ASIENTO, M.CONSECUTIVO, AM.FECHA, AM.ORIGEN, AM.USUARIO_CREACION,
                   DL.DIMENSION2, M.FUENTE, M.REFERENCIA,
                   ISNULL(M.DEBITO_LOCAL,0) + ISNULL(M.CREDITO_LOCAL,0),
                   ISNULL(M.DEBITO_DOLAR,0) + ISNULL(M.CREDITO_DOLAR,0),
                   M.CUENTA_CONTABLE, M.CENTRO_COSTO
          HAVING DL.DIMENSION2 IS NULL
        ) U
        ORDER BY U.ASIENTO, U.CONSECUTIVO
        OFFSET ${offset} ROWS
      `;

      const result = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        raw: true,
        replacements: {
          fechaDesde,
          fechaHasta
        }
      });

      return (result as RawQueryResult[]).map((row: RawQueryResult) => ({
        asiento: row.ASIENTO || '',
        consecutivo: typeof row.CONSECUTIVO === 'string' ? parseFloat(row.CONSECUTIVO) || 0 : (row.CONSECUTIVO as number) || 0,
        fechaAsiento: new Date(row.FECHA_ASIENTO),
        origen: row.ORIGEN || '',
        usuarioCreacion: row.USUARIO_CREACION || '',
        fuente: row.FUENTE || '',
        referencia: row.REFERENCIA || '',
        montoLocal: typeof row.MONTO_LOCAL === 'string' ? parseFloat(row.MONTO_LOCAL) || 0 : (row.MONTO_LOCAL as number) || 0,
        montoDolar: typeof row.MONTO_DOLAR === 'string' ? parseFloat(row.MONTO_DOLAR) || 0 : (row.MONTO_DOLAR as number) || 0,
        cuentaContable: row.CUENTA_CONTABLE || '',
        centroCosto: row.CENTRO_COSTO || '',
        rowOrderBy: undefined // This field is not present in the detail query
      }));
    } catch (error) {
      console.error('Error al listar detalle de asientos sin dimensión:', error);
      throw error;
    }
  }

  async getById(conjunto: string, id: number): Promise<ReporteAsientosSinDimension | null> {
    try {
      const query = `
        SELECT ASIENTO, CONSECUTIVO, FECHA_ASIENTO, ORIGEN, USUARIO_CREACION,
               FUENTE, REFERENCIA, MONTO_LOCAL, MONTO_DOLAR, CUENTA_CONTABLE, CENTRO_COSTO, ROW_ORDER_BY
        FROM ${conjunto}.R_XML_8DDC6068F9B43BF
        WHERE ROW_ORDER_BY = @id
      `;

      const result = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        raw: true,
        replacements: { id }
      });

      if (result.length === 0) return null;

      const row = result[0] as RawQueryResult;
      return {
        asiento: row.ASIENTO || '',
        consecutivo: typeof row.CONSECUTIVO === 'string' ? parseFloat(row.CONSECUTIVO) || 0 : (row.CONSECUTIVO as number) || 0,
        fechaAsiento: new Date(row.FECHA_ASIENTO),
        origen: row.ORIGEN || '',
        usuarioCreacion: row.USUARIO_CREACION || '',
        fuente: row.FUENTE || '',
        referencia: row.REFERENCIA || '',
        montoLocal: typeof row.MONTO_LOCAL === 'string' ? parseFloat(row.MONTO_LOCAL) || 0 : (row.MONTO_LOCAL as number) || 0,
        montoDolar: typeof row.MONTO_DOLAR === 'string' ? parseFloat(row.MONTO_DOLAR) || 0 : (row.MONTO_DOLAR as number) || 0,
        cuentaContable: row.CUENTA_CONTABLE || '',
        centroCosto: row.CENTRO_COSTO || '',
        rowOrderBy: row.ROW_ORDER_BY || undefined
      };
    } catch (error) {
      console.error('Error al obtener asiento sin dimensión por ID:', error);
      throw error;
    }
  }

  async create(conjunto: string, entity: ReporteAsientosSinDimensionCreate): Promise<ReporteAsientosSinDimension> {
    try {
      // Como la conexión es readOnly, no podemos hacer INSERT
      // Este método se mantiene por compatibilidad pero no ejecuta la operación
      console.log(`Creando asiento sin dimensión para conjunto ${conjunto}:`, entity);
      throw new Error('No se puede crear en conexión de solo lectura');
    } catch (error) {
      console.error('Error al crear asiento sin dimensión:', error);
      throw error;
    }
  }

  async update(conjunto: string, id: number, entity: ReporteAsientosSinDimensionUpdate): Promise<ReporteAsientosSinDimension> {
    try {
      // Como la conexión es readOnly, no podemos hacer UPDATE
      // Este método se mantiene por compatibilidad pero no ejecuta la operación
      console.log(`Actualizando asiento sin dimensión ${id} para conjunto ${conjunto}:`, entity);
      throw new Error('No se puede actualizar en conexión de solo lectura');
    } catch (error) {
      console.error('Error al actualizar asiento sin dimensión:', error);
      throw error;
    }
  }

  async delete(conjunto: string, id: number): Promise<boolean> {
    try {
      // Como la conexión es readOnly, no podemos hacer DELETE
      // Este método se mantiene por compatibilidad pero no ejecuta la operación
      console.log(`Eliminando asiento sin dimensión ${id} para conjunto ${conjunto}`);
      throw new Error('No se puede eliminar en conexión de solo lectura');
    } catch (error) {
      console.error('Error al eliminar asiento sin dimensión:', error);
      throw error;
    }
  }
}
