import { injectable, inject } from 'inversify';
import { QueryTypes } from 'sequelize';
import { IDatabaseService } from '../../domain/services/IDatabaseService';
import { ILibroMayorContabilidadRepository } from '../../domain/repositories/ILibroMayorContabilidadRepository';
import { 
  LibroMayorContabilidad, 
  FiltrosLibroMayorContabilidad, 
  CuentaContableInfo, 
  PeriodoContableInfo,
  TipoAsientoInfo,
  CentroCostoInfo,
  PaqueteInfo
} from '../../domain/entities/LibroMayorContabilidad';

@injectable()
export class LibroMayorContabilidadRepository implements ILibroMayorContabilidadRepository {
  constructor(
    @inject('IDatabaseService') private databaseService: IDatabaseService
  ) {}

  async obtenerCuentasContables(conjunto: string): Promise<CuentaContableInfo[]> {
    try {
      const query = `
        SELECT DISTINCT 
          SUBSTRING(C.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000' as cuentaContable,
          C.DESCRIPCION as descripcion,
          C.SALDO_NORMAL as saldoNormal,
          C.ACEPTA_DATOS as aceptaDatos
        FROM ${conjunto}.CUENTA_CONTABLE C
        WHERE C.CUENTA_CONTABLE LIKE '__.0.0.0.000'
        ORDER BY C.CUENTA_CONTABLE
      `;

      const result = await this.databaseService.ejecutarQuery(query, []);
      return result as CuentaContableInfo[];
    } catch (error) {
      console.error('Error al obtener cuentas contables:', error);
      throw error;
    }
  }

  async obtenerPeriodosContables(conjunto: string): Promise<PeriodoContableInfo[]> {
    try {
      const query = `
        SELECT 
          P.FECHA_FINAL as fechaFinal,
          P.DESCRIPCION as descripcion,
          P.CONTABILIDAD as contabilidad,
          P.ESTADO as estado
        FROM ${conjunto}.PERIODO_CONTABLE P
        WHERE P.CONTABILIDAD = 'F'
        ORDER BY P.FECHA_FINAL DESC
      `;

      const result = await this.databaseService.ejecutarQuery(query, []);
      return result as PeriodoContableInfo[];
    } catch (error) {
      console.error('Error al obtener períodos contables:', error);
      throw error;
    }
  }

  async obtenerTiposAsiento(conjunto: string): Promise<TipoAsientoInfo[]> {
    try {
      const query = `
        SELECT DISTINCT
          T.CODIGO as codigo,
          T.DESCRIPCION as descripcion
        FROM ${conjunto}.TIPO_ASIENTO T
        ORDER BY T.CODIGO
      `;

      const result = await this.databaseService.ejecutarQuery(query, []);
      return result as TipoAsientoInfo[];
    } catch (error) {
      console.error('Error al obtener tipos de asiento:', error);
      throw error;
    }
  }

  async obtenerCentrosCosto(conjunto: string): Promise<CentroCostoInfo[]> {
    try {
      const query = `
        SELECT DISTINCT
          CC.CODIGO as codigo,
          CC.DESCRIPCION as descripcion
        FROM ${conjunto}.CENTRO_COSTO CC
        ORDER BY CC.CODIGO
      `;

      const result = await this.databaseService.ejecutarQuery(query, []);
      return result as CentroCostoInfo[];
    } catch (error) {
      console.error('Error al obtener centros de costo:', error);
      throw error;
    }
  }

  async obtenerPaquetes(conjunto: string): Promise<PaqueteInfo[]> {
    try {
      const query = `
        SELECT DISTINCT
          P.CODIGO as codigo,
          P.DESCRIPCION as descripcion
        FROM ${conjunto}.PAQUETE P
        ORDER BY P.CODIGO
      `;

      const result = await this.databaseService.ejecutarQuery(query, []);
      return result as PaqueteInfo[];
    } catch (error) {
      console.error('Error al obtener paquetes:', error);
      throw error;
    }
  }

  async generarReporte(filtros: FiltrosLibroMayorContabilidad): Promise<LibroMayorContabilidad[]> {
    try {
      const { conjunto, fechaDesde, fechaHasta, limit } = filtros;

      // Generar nombre único para tabla temporal
      const tableName = `R_XML_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Eliminar tabla temporal si existe y crearla nuevamente
      await this.databaseService.ejecutarQuery(`DROP TABLE IF EXISTS ${conjunto}.${tableName}`, []);

      // Crear tabla temporal para reporte XML
      const createTableQuery = `
        CREATE TABLE ${conjunto}.${tableName} (
            SALDO_ACREEDOR_DOLAR    DECIMAL(32,12), 
            CREDITO_DOLAR_MAYOR     DECIMAL(32,12), 
            CORRELATIVO_ASIENTO     VARCHAR(254), 
            SALDO_DEUDOR_DOLAR      DECIMAL(32,12), 
            DEBITO_DOLAR_MAYOR      DECIMAL(32,12), 
            CUENTA_CONTABLE         VARCHAR(254), 
            SALDO_ACREEDOR          DECIMAL(32,12), 
            CREDITO_DOLAR           DECIMAL(32,12), 
            CREDITO_LOCAL           DECIMAL(32,12), 
            SALDO_DEUDOR            DECIMAL(32,12), 
            DEBITO_DOLAR            DECIMAL(32,12), 
            DEBITO_LOCAL            DECIMAL(32,12), 
            CENTRO_COSTO            VARCHAR(254), 
            TIPO_ASIENTO            VARCHAR(254), 
            DESCRIPCION             VARCHAR(254),
            CONSECUTIVO             DECIMAL(32,12), 
            REFERENCIA              VARCHAR(254), 
            NIT_NOMBRE              VARCHAR(254), 
            DOCUMENTO               VARCHAR(254),
            CREDITO                 DECIMAL(32,12), 
            ASIENTO                 VARCHAR(254), 
            DEBITO                  DECIMAL(32,12), 
            FECHA                   DATETIME, 
            TIPO                    VARCHAR(254), 
            NIT                     VARCHAR(254), 
            FUENTE                  VARCHAR(254),
            ROW_ORDER_BY            INT NOT NULL IDENTITY PRIMARY KEY
        )
      `;
      
      await this.databaseService.ejecutarQuery(createTableQuery, []);

      // Crear tabla REPCG_MAYOR si no existe
      const createRepcgTableQuery = `
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES 
                      WHERE TABLE_SCHEMA = '${conjunto}' 
                      AND TABLE_NAME = 'REPCG_MAYOR')
        BEGIN
          CREATE TABLE ${conjunto}.REPCG_MAYOR (
            CUENTA NVARCHAR(50),
            FECHA DATETIME,
            SALDO_DEUDOR DECIMAL(18,2),
            SALDO_DEUDOR_DOLAR DECIMAL(18,2),
            SALDO_ACREEDOR DECIMAL(18,2),
            SALDO_ACREEDOR_DOLAR DECIMAL(18,2),
            ASIENTO NVARCHAR(50),
            ORIGEN NVARCHAR(10),
            FUENTE NVARCHAR(50),
            REFERENCIA NVARCHAR(255),
            TIPO_LINEA NVARCHAR(10),
            DEBITO_LOCAL DECIMAL(18,2),
            DEBITO_DOLAR DECIMAL(18,2),
            CREDITO_LOCAL DECIMAL(18,2),
            CREDITO_DOLAR DECIMAL(18,2),
            CENTRO_COSTO NVARCHAR(50),
            DESCRIPCION NVARCHAR(255),
            ACEPTA INT,
            CONSECUTIVO INT,
            TIPO_ASIENTO NVARCHAR(10),
            NIT NVARCHAR(50),
            NIT_NOMBRE NVARCHAR(255),
            TIPO NVARCHAR(10),
            DOCUMENTO NVARCHAR(50),
            USUARIO NVARCHAR(50),
            PERIODO_CONTABLE DATETIME
          )
        END
      `;
      
      await this.databaseService.ejecutarQuery(createRepcgTableQuery, []);

      // Limpiar registros previos del usuario
      await this.databaseService.ejecutarQuery(`DELETE FROM ${conjunto}.REPCG_MAYOR WHERE USUARIO = 'ADMPQUES'`, []);

      // Insertar saldos iniciales (TIPO_LINEA = '1')
      const insertSaldosIniciales = `
        INSERT INTO ${conjunto}.REPCG_MAYOR (
            CUENTA, FECHA, SALDO_DEUDOR, SALDO_DEUDOR_DOLAR, 
            SALDO_ACREEDOR, SALDO_ACREEDOR_DOLAR, ASIENTO, ORIGEN, 
            FUENTE, REFERENCIA, TIPO_LINEA, CENTRO_COSTO, 
            DESCRIPCION, ACEPTA, CONSECUTIVO, TIPO_ASIENTO, 
            NIT, NIT_NOMBRE, USUARIO
        )
        SELECT  
            CUENTA,  
            FECHA,  
            SUM(DEBITO_LOCAL),  
            SUM(DEBITO_DOLAR),  
            SUM(CREDITO_LOCAL),  
            SUM(CREDITO_DOLAR),
            '' AS ASIENTO,  
            '' AS ORIGEN,  
            '' AS FUENTE,  
            '' AS REFERENCIA,   
            '1' AS TIPO_LINEA,  
            '' AS CENTRO_COSTO, 
            DESCRIPCION,  
            ACEPTA,  
            NULL AS CONSECUTIVO,  
            NULL AS TIPO_ASIENTO,  
            NULL AS NIT,  
            NULL AS NIT_NOMBRE,  
            'ADMPQUES' AS USUARIO    
        FROM (    
            SELECT  
                SUBSTRING(M.CUENTA_CONTABLE, 1, 2) AS CUENTA,  
                '${fechaDesde}' AS FECHA,   
                CASE CC.SALDO_NORMAL 
                    WHEN 'D' THEN ISNULL(DEBITO_LOCAL, 0) - ISNULL(CREDITO_LOCAL, 0)  
                    ELSE 0 
                END AS DEBITO_LOCAL, 
                CASE CC.SALDO_NORMAL 
                    WHEN 'D' THEN ISNULL(DEBITO_DOLAR, 0) - ISNULL(CREDITO_DOLAR, 0)   
                    ELSE 0 
                END AS DEBITO_DOLAR,  
                CASE CC.SALDO_NORMAL 
                    WHEN 'A' THEN ISNULL(CREDITO_LOCAL, 0) - ISNULL(DEBITO_LOCAL, 0)  
                    ELSE 0 
                END AS CREDITO_LOCAL,  
                CASE CC.SALDO_NORMAL 
                    WHEN 'A' THEN ISNULL(CREDITO_DOLAR, 0) - ISNULL(DEBITO_DOLAR, 0)  
                    ELSE 0 
                END AS CREDITO_DOLAR, 
                CC.DESCRIPCION,
                CASE CC.ACEPTA_DATOS 
                    WHEN 'N' THEN 0 
                    ELSE 1 
                END AS ACEPTA  
            FROM (   	
                -- Saldos fiscales
                SELECT  	
                    m.centro_costo,  	
                    m.cuenta_contable,  	
                    CASE WHEN m.saldo_fisc_local > 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS debito_local,  	
                    CASE WHEN m.saldo_fisc_local < 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS credito_local,  	
                    CASE WHEN m.saldo_fisc_dolar > 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS debito_dolar,  	
                    CASE WHEN m.saldo_fisc_dolar < 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS credito_dolar   	 
                FROM ${conjunto}.saldo m  
                INNER JOIN (
                    SELECT 
                        m.centro_costo, 
                        m.cuenta_contable, 
                        MAX(m.fecha) AS fecha  
                    FROM ${conjunto}.saldo m  	
                    WHERE m.fecha <= '${fechaHasta}'  
                    GROUP BY m.centro_costo, m.cuenta_contable  
                ) smax ON (
                    m.centro_costo = smax.centro_costo 
                    AND m.cuenta_contable = smax.cuenta_contable 
                    AND m.fecha = smax.fecha
                )  
                WHERE 1 = 1   
                
                UNION ALL    	
                
                -- Movimientos del diario
                SELECT  	
                    m.centro_costo,  	
                    m.cuenta_contable,  	
                    COALESCE(m.debito_local, 0) AS debito_local,  	
                    COALESCE(m.credito_local, 0) AS credito_local,  	
                    COALESCE(m.debito_dolar, 0) AS debito_dolar,  	
                    COALESCE(m.credito_dolar, 0) AS credito_dolar  	
                FROM ${conjunto}.asiento_de_diario am
                INNER JOIN ${conjunto}.diario m ON (am.asiento = m.asiento) 
                WHERE am.fecha <= '${fechaHasta}'                                      
                  AND contabilidad IN ('F', 'A')
            ) m  	
            INNER JOIN ${conjunto}.CUENTA_CONTABLE CC ON 
                CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'
        ) VISTA  
        GROUP BY CUENTA, FECHA, DESCRIPCION, ACEPTA
      `;

      await this.databaseService.ejecutarQuery(insertSaldosIniciales, []);

      // Insertar movimientos del mayor
      const insertMovimientosMayor = `
        INSERT INTO ${conjunto}.REPCG_MAYOR (
            CUENTA, FECHA, ASIENTO, ORIGEN, FUENTE, REFERENCIA, TIPO_LINEA, 
            DEBITO_LOCAL, DEBITO_DOLAR, CREDITO_LOCAL, CREDITO_DOLAR, 
            CENTRO_COSTO, DESCRIPCION, ACEPTA, CONSECUTIVO, TIPO_ASIENTO, 
            NIT, NIT_NOMBRE, TIPO, DOCUMENTO, USUARIO    
        )   
        SELECT  
            SUBSTRING(M.CUENTA_CONTABLE, 1, 2) AS CUENTA,  
            M.FECHA,  
            M.ASIENTO,  
            M.ORIGEN,  
            M.FUENTE,   
            M.REFERENCIA,  
            '2' AS TIPO_LINEA,  
            M.DEBITO_LOCAL,  
            M.DEBITO_DOLAR,  
            M.CREDITO_LOCAL,  
            M.CREDITO_DOLAR,  
            M.CENTRO_COSTO,  
            CC.DESCRIPCION, 
            CASE CC.ACEPTA_DATOS 
                WHEN 'N' THEN 0  
                ELSE 1 
            END AS ACEPTA,  
            M.CONSECUTIVO,  
            M.TIPO_ASIENTO,  
            M.NIT, 
            N.RAZON_SOCIAL, 
            CASE 
                WHEN M.ORIGEN IN ('CP', 'CB', 'CC', 'FEE', 'PY', 'MT', 'IC') 
                    THEN SUBSTRING(M.FUENTE, 1, 3)  
                WHEN M.ORIGEN = 'CJ' 
                    THEN SUBSTRING(M.FUENTE, 1, 3)  
                ELSE '' 
            END AS TIPO,  
            CASE 
                WHEN M.ORIGEN IN ('CP', 'CB', 'CC', 'FEE', 'IC') 
                    THEN SUBSTRING(M.FUENTE, 4, 40)	 
                WHEN M.ORIGEN = 'CJ' 
                    THEN SUBSTRING(M.FUENTE, 4, 40)  
                ELSE '' 
            END AS DOCUMENTO, 
            'ADMPQUES' AS USUARIO                
        FROM ${conjunto}.MAYOR M   
        INNER JOIN ${conjunto}.CUENTA_CONTABLE CC ON 
            CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'  	
        INNER JOIN ${conjunto}.NIT N ON M.NIT = N.NIT  	   
        WHERE M.CONTABILIDAD IN ('A', 'F') 
          AND M.FECHA >= '${fechaDesde}'                        
          AND M.FECHA <= '${fechaHasta}'                      
          AND M.CLASE_ASIENTO != 'C'
      `;

      await this.databaseService.ejecutarQuery(insertMovimientosMayor, []);

      // Insertar movimientos del diario
      const insertMovimientosDiario = `
        INSERT INTO ${conjunto}.REPCG_MAYOR (
            CUENTA, FECHA, ASIENTO, ORIGEN, FUENTE, REFERENCIA, TIPO_LINEA, 
            DEBITO_LOCAL, DEBITO_DOLAR, CREDITO_LOCAL, CREDITO_DOLAR,  
            CENTRO_COSTO, DESCRIPCION, ACEPTA, CONSECUTIVO, TIPO_ASIENTO, 
            NIT, NIT_NOMBRE, TIPO, DOCUMENTO, USUARIO    
        )    
        SELECT  
            SUBSTRING(M.CUENTA_CONTABLE, 1, 2) AS CUENTA,  
            A.FECHA,  
            M.ASIENTO,  
            A.ORIGEN,  
            M.FUENTE,   
            M.REFERENCIA,  
            '2' AS TIPO_LINEA,  
            M.DEBITO_LOCAL,  
            M.DEBITO_DOLAR,  
            M.CREDITO_LOCAL,  
            M.CREDITO_DOLAR,  
            M.CENTRO_COSTO,  
            CC.DESCRIPCION,  
            CASE CC.ACEPTA_DATOS  
                WHEN 'N' THEN 0  
                ELSE 1  
            END AS ACEPTA,  
            M.CONSECUTIVO,  
            A.TIPO_ASIENTO,  
            M.NIT, 
            N.RAZON_SOCIAL, 
            CASE 
                WHEN A.ORIGEN IN ('CP', 'CB', 'CC', 'FEE', 'PY', 'MT', 'IC') 
                    THEN SUBSTRING(M.FUENTE, 1, 3) 
                WHEN A.ORIGEN = 'CJ' 
                    THEN SUBSTRING(M.FUENTE, 1, 3)  
                ELSE '' 
            END AS TIPO,  
            CASE 
                WHEN A.ORIGEN IN ('CP', 'CB', 'CC', 'FEE', 'IC') 
                    THEN SUBSTRING(M.FUENTE, 4, 40) 
                WHEN A.ORIGEN = 'CJ' 
                    THEN SUBSTRING(M.FUENTE, 4, 40)  
                ELSE '' 
            END AS DOCUMENTO,  
            'ADMPQUES' AS USUARIO              
        FROM ${conjunto}.DIARIO M   	
        INNER JOIN ${conjunto}.ASIENTO_DE_DIARIO A ON M.ASIENTO = A.ASIENTO  	
        INNER JOIN ${conjunto}.CUENTA_CONTABLE CC ON 
            CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'	
        INNER JOIN ${conjunto}.NIT N ON M.NIT = N.NIT  	    
        WHERE A.CONTABILIDAD IN ('A', 'F') 
          AND A.FECHA >= '${fechaDesde}'                         
          AND A.FECHA <= '${fechaHasta}'                       
          AND A.CLASE_ASIENTO != 'C'
      `;

      await this.databaseService.ejecutarQuery(insertMovimientosDiario, []);

      // Actualizar período contable
      const updatePeriodoContable = `
        UPDATE ${conjunto}.REPCG_MAYOR  	
        SET PERIODO_CONTABLE = (
            SELECT MIN(FECHA_FINAL) 
            FROM ${conjunto}.PERIODO_CONTABLE P  
            WHERE P.CONTABILIDAD IN ('A', 'F')  
              AND ${conjunto}.REPCG_MAYOR.FECHA < P.FECHA_FINAL + 1
        )	  	
        WHERE USUARIO = 'ADMPQUES'
      `;

      await this.databaseService.ejecutarQuery(updatePeriodoContable, []);

      // Insertar en tabla de resultados
      const insertResultados = `
        INSERT INTO ${conjunto}.${tableName} (
            CUENTA_CONTABLE, DESCRIPCION, ASIENTO, TIPO, 
            DOCUMENTO, REFERENCIA, DEBITO_LOCAL, DEBITO_DOLAR_MAYOR, 
            CREDITO_LOCAL, CREDITO_DOLAR_MAYOR, SALDO_DEUDOR, SALDO_DEUDOR_DOLAR,  
            SALDO_ACREEDOR, SALDO_ACREEDOR_DOLAR, CENTRO_COSTO, TIPO_ASIENTO, 
            FECHA, NIT, NIT_NOMBRE, FUENTE, CONSECUTIVO, CORRELATIVO_ASIENTO
        )
        SELECT  
            CUENTA AS CUENTA_CONTABLE,  
            DESCRIPCION,  
            ISNULL(ASIENTO, '') AS ASIENTO,  
            ISNULL(TIPO, '') AS TIPO,  
            ISNULL(DOCUMENTO, '') AS DOCUMENTO,  
            ISNULL(REFERENCIA, '') AS REFERENCIA,  
            COALESCE(DEBITO_LOCAL, 0) AS DEBITO_LOCAL, 
            COALESCE(DEBITO_DOLAR, 0) AS DEBITO_DOLAR_MAYOR,  
            COALESCE(CREDITO_LOCAL, 0) AS CREDITO_LOCAL,  
            COALESCE(CREDITO_DOLAR, 0) AS CREDITO_DOLAR_MAYOR,  
            COALESCE(SALDO_DEUDOR, 0) AS SALDO_DEUDOR,  
            COALESCE(SALDO_DEUDOR_DOLAR, 0) AS SALDO_DEUDOR_DOLAR,  
            COALESCE(SALDO_ACREEDOR, 0) AS SALDO_ACREEDOR,  
            COALESCE(SALDO_ACREEDOR_DOLAR, 0) AS SALDO_ACREEDOR_DOLAR,  
            ISNULL(CENTRO_COSTO, '') AS CENTRO_COSTO,  
            ISNULL(TIPO_ASIENTO, '') AS TIPO_ASIENTO,  
            FECHA,  
            ISNULL(NIT, '') AS NIT,  
            ISNULL(NIT_NOMBRE, '') AS NIT_NOMBRE,  
            ISNULL(FUENTE, '') AS FUENTE,  
            ISNULL(CONSECUTIVO, 0) AS CONSECUTIVO,  
            ISNULL(CORRELATIVO_ASIENTO, '') AS CORRELATIVO_ASIENTO
        FROM ${conjunto}.REPCG_MAYOR  
        WHERE USUARIO = 'ADMPQUES'
      `;

      await this.databaseService.ejecutarQuery(insertResultados, []);

      // Obtener resultados finales
      const selectResultados = `
        SELECT 
          FECHA AS 'Fecha de la operación',
          ISNULL(CONSECUTIVO, 0) AS 'Número correlativo del libro diario',
          ISNULL(DESCRIPCION, '') AS 'Descripción',
          ISNULL(SALDO_DEUDOR, 0) AS 'Saldos y mov. deudor',
          ISNULL(SALDO_ACREEDOR, 0) AS 'Saldos y mov. acreedor',
          ISNULL(DEBITO_LOCAL, 0) AS 'Saldo inicial',
          ISNULL(CREDITO_LOCAL, 0) AS 'Movimientos',
          (ISNULL(DEBITO_LOCAL, 0) - ISNULL(CREDITO_LOCAL, 0)) AS 'Saldo de movimientos',
          ISNULL(SALDO_DEUDOR, 0) AS 'Total saldo inicial',
          (ISNULL(DEBITO_LOCAL, 0) + ISNULL(CREDITO_LOCAL, 0)) AS 'Total movimientos',
          (ISNULL(SALDO_DEUDOR, 0) + ISNULL(DEBITO_LOCAL, 0) - ISNULL(CREDITO_LOCAL, 0)) AS 'Total saldo final'
        FROM ${conjunto}.${tableName} 
        ORDER BY FECHA, CONSECUTIVO
        ${limit ? `OFFSET 0 ROWS FETCH NEXT ${limit} ROWS ONLY` : ''}
      `;

      const result = await this.databaseService.ejecutarQuery(selectResultados, []);
      
      // Limpiar tabla temporal
      await this.databaseService.ejecutarQuery(`DROP TABLE ${conjunto}.${tableName}`, []);
      
      return result as LibroMayorContabilidad[];
    } catch (error) {
      console.error('Error al generar reporte de Libro Mayor de Contabilidad:', error);
      throw error;
    }
  }

  async obtenerLibroMayorContabilidad(filtros: FiltrosLibroMayorContabilidad): Promise<{
    data: LibroMayorContabilidad[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    try {
      const { conjunto, limit = 1000, page = 1, pageSize = 100 } = filtros;
      const offset = (page - 1) * pageSize;

      // Primero generar el reporte
      const data = await this.generarReporte(filtros);

      // Simular paginación (en un caso real, esto se haría en la consulta SQL)
      const total = data.length;
      const paginatedData = data.slice(offset, offset + pageSize);
      const totalPages = Math.ceil(total / pageSize);

      return {
        data: paginatedData,
        total,
        page,
        pageSize,
        totalPages
      };
    } catch (error) {
      console.error('Error al obtener Libro Mayor de Contabilidad:', error);
      throw error;
    }
  }

  async exportarExcel(filtros: FiltrosLibroMayorContabilidad): Promise<Buffer> {
    try {
      // Generar el reporte primero
      const data = await this.generarReporte(filtros);
      
      // Aquí se implementaría la lógica de exportación a Excel
      // Por ahora retornamos un buffer vacío
      return Buffer.from('');
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      throw error;
    }
  }

  async exportarPDF(filtros: FiltrosLibroMayorContabilidad): Promise<Buffer> {
    try {
      // Generar el reporte primero
      const data = await this.generarReporte(filtros);
      
      // Aquí se implementaría la lógica de exportación a PDF
      // Por ahora retornamos un buffer vacío
      return Buffer.from('');
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      throw error;
    }
  }
}
