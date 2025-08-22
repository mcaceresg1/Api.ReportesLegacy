import { IMovimientoContableAgrupadoRepository } from '../../domain/repositories/IMovimientoContableAgrupadoRepository';
import { 
  MovimientoContableAgrupadoItem,
  FiltroMovimientoContableAgrupado
} from '../../domain/entities/MovimientoContableAgrupado';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';

export class MovimientoContableAgrupadoRepository implements IMovimientoContableAgrupadoRepository {

  async generarReporte(filtros: FiltroMovimientoContableAgrupado): Promise<MovimientoContableAgrupadoItem[]> {
    try {
      const schema = filtros.conjunto;
      
      // Validaciones
      if (!filtros.fechaDesde || !filtros.fechaHasta) {
        throw new Error('Las fechas de inicio y fin son requeridas');
      }

      // Convertir fechas al formato correcto
      const fechaDesde = `${filtros.fechaDesde} 00:00:00`;
      const fechaHasta = `${filtros.fechaHasta} 00:00:00`;
      
      // Crear y limpiar tabla temporal primero
      await this.crearTablaTemp(schema);
      await this.limpiarTablaTemp(schema);

      // 1. Insertar datos desde la tabla diario
      const insertDiarioQuery = `
        INSERT INTO ${schema}.R_XML_8DDC5F23E38311C (
          sCuentaContable, sCuentaContableDesc, sNit, sNitNombre, sDimension, sDimensionDesc,
          dtFecha, sAsiento, sFuente, sReferencia, nMontoLocal, nMontoDolar, sNotas
        )
        SELECT  
          SUBSTRING(ISNULL(m.cuenta_contable, ''), 1, 254) as cuenta_contable,
          SUBSTRING(ISNULL(c.descripcion, ''), 1, 254) as descripcion,
          SUBSTRING(ISNULL(n.nit, ''), 1, 254) as nit,
          SUBSTRING(ISNULL(n.razon_social, ''), 1, 254) as razon_social,
          NULL as dimension,
          NULL as dimension_desc,
          am.fecha,
          SUBSTRING(ISNULL(m.asiento, ''), 1, 254) as asiento,
          SUBSTRING(ISNULL(m.fuente, ''), 1, 254) as fuente,
          SUBSTRING(ISNULL(m.referencia, ''), 1, 254) as referencia,
          ISNULL(m.debito_local, m.credito_local * -1) as monto_local,
          ISNULL(m.debito_dolar, m.credito_dolar * -1) as monto_dolar,
          SUBSTRING(ISNULL(am.notas, ''), 1, 254) as notas
        FROM ${schema}.diario m
        INNER JOIN ${schema}.asiento_de_diario am ON m.asiento = am.asiento
        INNER JOIN ${schema}.cuenta_contable c ON m.cuenta_contable = c.cuenta_contable
        INNER JOIN ${schema}.nit n ON m.nit = n.nit
        WHERE 1=1
          AND am.contabilidad IN ('F', 'A')
          AND am.fecha >= :fechaDesde
          AND am.fecha <= :fechaHasta
          ${filtros.cuentaContable ? 'AND m.cuenta_contable LIKE :cuentaContable' : ''}
          ${filtros.nit ? 'AND m.nit LIKE :nit' : ''}
          ${filtros.asiento ? 'AND m.asiento LIKE :asiento' : ''}
          ${filtros.fuente ? 'AND m.fuente LIKE :fuente' : ''}
      `;

      // 2. Insertar datos desde la tabla mayor
      const insertMayorQuery = `
        INSERT INTO ${schema}.R_XML_8DDC5F23E38311C (
          sCuentaContable, sCuentaContableDesc, sNit, sNitNombre, sDimension, sDimensionDesc,
          dtFecha, sAsiento, sFuente, sReferencia, nMontoLocal, nMontoDolar, sNotas
        )
        SELECT  
          SUBSTRING(ISNULL(m.cuenta_contable, ''), 1, 254) as cuenta_contable,
          SUBSTRING(ISNULL(c.descripcion, ''), 1, 254) as descripcion,
          SUBSTRING(ISNULL(n.nit, ''), 1, 254) as nit,
          SUBSTRING(ISNULL(n.razon_social, ''), 1, 254) as razon_social,
          NULL as dimension,
          NULL as dimension_desc,
          am.fecha,
          SUBSTRING(ISNULL(m.asiento, ''), 1, 254) as asiento,
          SUBSTRING(ISNULL(m.fuente, ''), 1, 254) as fuente,
          SUBSTRING(ISNULL(m.referencia, ''), 1, 254) as referencia,
          ISNULL(m.debito_local, m.credito_local * -1) as monto_local,
          ISNULL(m.debito_dolar, m.credito_dolar * -1) as monto_dolar,
          SUBSTRING(ISNULL(am.notas, ''), 1, 254) as notas
        FROM ${schema}.mayor m
        INNER JOIN ${schema}.asiento_mayorizado am ON m.asiento = am.asiento
        INNER JOIN ${schema}.cuenta_contable c ON m.cuenta_contable = c.cuenta_contable
        INNER JOIN ${schema}.nit n ON m.nit = n.nit
        WHERE 1=1
          AND am.contabilidad IN ('F', 'A')
          AND am.fecha >= :fechaDesde
          AND am.fecha <= :fechaHasta
          ${filtros.cuentaContable ? 'AND m.cuenta_contable LIKE :cuentaContable' : ''}
          ${filtros.nit ? 'AND m.nit LIKE :nit' : ''}
          ${filtros.asiento ? 'AND m.asiento LIKE :asiento' : ''}
          ${filtros.fuente ? 'AND m.fuente LIKE :fuente' : ''}
      `;

      // Preparar parámetros
      const replacements: any = {
        fechaDesde,
        fechaHasta
      };

      if (filtros.cuentaContable) {
        replacements.cuentaContable = `%${filtros.cuentaContable}%`;
      }
      if (filtros.nit) {
        replacements.nit = `%${filtros.nit}%`;
      }
      if (filtros.asiento) {
        replacements.asiento = `%${filtros.asiento}%`;
      }
      if (filtros.fuente) {
        replacements.fuente = `%${filtros.fuente}%`;
      }

      // Ejecutar inserts
      await exactusSequelize.query(insertDiarioQuery, {
        type: QueryTypes.INSERT,
        replacements
      });

      await exactusSequelize.query(insertMayorQuery, {
        type: QueryTypes.INSERT,
        replacements
      });

      // 3. Ejecutar el procedimiento almacenado para obtener resultados
      const resultQuery = `
        SELECT 
          ISNULL(sNombreMonLocal, '') as sNombreMonLocal,
          ISNULL(sNombreMonDolar, '') as sNombreMonDolar,
          ISNULL(sTituloCuenta, '') as sTituloCuenta,
          ISNULL(sCuentaContableDesc, '') as sCuentaContableDesc,
          ISNULL(sTituloNit, '') as sTituloNit,
          ISNULL(sNitNombre, '') as sNitNombre,
          ISNULL(sReferencia, '') as sReferencia,
          ISNULL(nMontoLocal, 0) as nMontoLocal,
          ISNULL(nMontoDolar, 0) as nMontoDolar,
          ISNULL(sAsiento, '') as sAsiento,
          ISNULL(sCuentaContable, '') as sCuentaContable,
          ISNULL(sNit, '') as sNit,
          dtFecha,
          ISNULL(sFuente, '') as sFuente,
          ISNULL(sNotas, '') as sNotas,
          ISNULL(sDimension, '') as sDimension,
          ISNULL(sDimensionDesc, '') as sDimensionDesc,
          ISNULL(sQuiebre1, '') as sQuiebre1,
          ISNULL(sQuiebre2, '') as sQuiebre2,
          ISNULL(sQuiebre3, '') as sQuiebre3,
          ISNULL(sQuiebreDesc1, '') as sQuiebreDesc1,
          ISNULL(sQuiebreDesc2, '') as sQuiebreDesc2,
          ISNULL(sQuiebreDesc3, '') as sQuiebreDesc3,
          ISNULL(ORDEN, 0) as ORDEN
        FROM ${schema}.R_XML_8DDC5F23E38311C 
        ORDER BY sCuentaContable, sNit, orden, sFuente
      `;

      const results = await exactusSequelize.query(resultQuery, {
        type: QueryTypes.SELECT
      }) as MovimientoContableAgrupadoItem[];

      return results;

    } catch (error) {
      console.error('Error al generar reporte de movimientos contables agrupados:', error);
      throw new Error('Error al generar el reporte de movimientos contables agrupados');
    }
  }

  async obtenerMovimientos(
    filtros: FiltroMovimientoContableAgrupado, 
    limit: number = 100, 
    offset: number = 0
  ): Promise<{ data: MovimientoContableAgrupadoItem[]; total: number }> {
    try {
      // Primero generar el reporte completo
      await this.generarReporte(filtros);

      const schema = filtros.conjunto;

      // Obtener total de registros
      const countQuery = `SELECT COUNT(*) as total FROM ${schema}.R_XML_8DDC5F23E38311C`;
      const countResult = await exactusSequelize.query(countQuery, {
        type: QueryTypes.SELECT
      }) as [{ total: number }];

      const total = countResult[0]?.total || 0;

      // Obtener datos paginados
      const dataQuery = `
        SELECT 
          ISNULL(sNombreMonLocal, '') as sNombreMonLocal,
          ISNULL(sNombreMonDolar, '') as sNombreMonDolar,
          ISNULL(sTituloCuenta, '') as sTituloCuenta,
          ISNULL(sCuentaContableDesc, '') as sCuentaContableDesc,
          ISNULL(sTituloNit, '') as sTituloNit,
          ISNULL(sNitNombre, '') as sNitNombre,
          ISNULL(sReferencia, '') as sReferencia,
          ISNULL(nMontoLocal, 0) as nMontoLocal,
          ISNULL(nMontoDolar, 0) as nMontoDolar,
          ISNULL(sAsiento, '') as sAsiento,
          ISNULL(sCuentaContable, '') as sCuentaContable,
          ISNULL(sNit, '') as sNit,
          dtFecha,
          ISNULL(sFuente, '') as sFuente,
          ISNULL(sNotas, '') as sNotas,
          ISNULL(sDimension, '') as sDimension,
          ISNULL(sDimensionDesc, '') as sDimensionDesc,
          ISNULL(sQuiebre1, '') as sQuiebre1,
          ISNULL(sQuiebre2, '') as sQuiebre2,
          ISNULL(sQuiebre3, '') as sQuiebre3,
          ISNULL(sQuiebreDesc1, '') as sQuiebreDesc1,
          ISNULL(sQuiebreDesc2, '') as sQuiebreDesc2,
          ISNULL(sQuiebreDesc3, '') as sQuiebreDesc3,
          ISNULL(ORDEN, 0) as ORDEN
        FROM ${schema}.R_XML_8DDC5F23E38311C 
        ORDER BY sCuentaContable, sNit, orden, sFuente
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY
      `;

      const data = await exactusSequelize.query(dataQuery, {
        type: QueryTypes.SELECT
      }) as MovimientoContableAgrupadoItem[];

      return { data, total };

    } catch (error) {
      console.error('Error al obtener movimientos contables agrupados:', error);
      throw new Error('Error al obtener los movimientos contables agrupados');
    }
  }

  async crearTablaTemp(conjunto: string): Promise<void> {
    try {
      const createTableQuery = `
        IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'${conjunto}.R_XML_8DDC5F23E38311C') AND type in (N'U'))
        BEGIN
          CREATE TABLE ${conjunto}.R_XML_8DDC5F23E38311C (
            sNombreMonLocal VARCHAR(254),
            sNombreMonDolar VARCHAR(254),
            sTituloCuenta VARCHAR(254),
            sCuentaContableDesc VARCHAR(254),
            sTituloNit VARCHAR(254),
            sNitNombre VARCHAR(254),
            sReferencia VARCHAR(254),
            nMontoLocal DECIMAL(18,2),
            nMontoDolar DECIMAL(18,2),
            sAsiento VARCHAR(254),
            sCuentaContable VARCHAR(254),
            sNit VARCHAR(254),
            dtFecha DATETIME,
            sFuente VARCHAR(254),
            sNotas VARCHAR(254),
            sDimension VARCHAR(254),
            sDimensionDesc VARCHAR(254),
            sQuiebre1 VARCHAR(254),
            sQuiebre2 VARCHAR(254),
            sQuiebre3 VARCHAR(254),
            sQuiebreDesc1 VARCHAR(254),
            sQuiebreDesc2 VARCHAR(254),
            sQuiebreDesc3 VARCHAR(254),
            ORDEN INT NOT NULL IDENTITY PRIMARY KEY
          )
        END
      `;
      
      await exactusSequelize.query(createTableQuery, {
        type: QueryTypes.RAW
      });
    } catch (error) {
      console.error('Error al crear tabla temporal:', error);
      throw new Error('Error al crear la tabla temporal');
    }
  }

  async limpiarTablaTemp(conjunto: string): Promise<void> {
    try {
      const deleteQuery = `DELETE FROM ${conjunto}.R_XML_8DDC5F23E38311C`;
      await exactusSequelize.query(deleteQuery, {
        type: QueryTypes.DELETE
      });
    } catch (error) {
      console.error('Error al limpiar tabla temporal:', error);
      // No lanzar error si la tabla no existe o está vacía
    }
  }

  async obtenerCuentasContables(conjunto: string): Promise<Array<{ cuenta_contable: string; descripcion: string }>> {
    try {
      const query = `
        SELECT DISTINCT cuenta_contable, descripcion 
        FROM ${conjunto}.cuenta_contable 
        ORDER BY cuenta_contable
      `;

      const results = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT
      }) as Array<{ cuenta_contable: string; descripcion: string }>;

      return results;

    } catch (error) {
      console.error('Error al obtener cuentas contables:', error);
      return [];
    }
  }

  async obtenerNits(conjunto: string): Promise<Array<{ nit: string; razon_social: string }>> {
    try {
      const query = `
        SELECT DISTINCT nit, razon_social 
        FROM ${conjunto}.nit 
        ORDER BY razon_social
      `;

      const results = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT
      }) as Array<{ nit: string; razon_social: string }>;

      return results;

    } catch (error) {
      console.error('Error al obtener NITs:', error);
      return [];
    }
  }

  async obtenerDimensiones(conjunto: string): Promise<Array<{ dimension: string; dimension_desc: string }>> {
    try {
      // Como en el query original las dimensiones son NULL, retornamos un array vacío
      // En una implementación real, aquí iría la consulta a la tabla de dimensiones
      const query = `
        SELECT DISTINCT 
          dimension, 
          dimension_desc 
        FROM ${conjunto}.dimension_contable 
        WHERE dimension IS NOT NULL
        ORDER BY dimension
      `;

      const results = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT
      }) as Array<{ dimension: string; dimension_desc: string }>;

      return results;

    } catch (error) {
      console.error('Error al obtener dimensiones:', error);
      return [];
    }
  }

  async obtenerFuentes(conjunto: string): Promise<Array<{ fuente: string }>> {
    try {
      const query = `
        SELECT DISTINCT fuente 
        FROM ${conjunto}.diario 
        WHERE fuente IS NOT NULL AND fuente != ''
        UNION
        SELECT DISTINCT fuente 
        FROM ${conjunto}.mayor 
        WHERE fuente IS NOT NULL AND fuente != ''
        ORDER BY fuente
      `;

      const results = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT
      }) as Array<{ fuente: string }>;

      return results;

    } catch (error) {
      console.error('Error al obtener fuentes:', error);
      return [];
    }
  }



  async health(): Promise<boolean> {
    try {
      await exactusSequelize.authenticate();
      return true;
    } catch (error) {
      console.error('Error en health check del repositorio MovimientoContableAgrupado:', error);
      return false;
    }
  }
}
