import { injectable } from 'inversify';
import { exactusSequelize } from '../database/config/exactus-database';
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

// Cache para tablas temporales
interface CachedTable {
  tableName: string;
  conjunto: string;
  filtros: string; // Hash de los filtros
  createdAt: Date;
  lastAccessed: Date;
}

// Cache global para tablas temporales
const tableCache = new Map<string, CachedTable>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutos

@injectable()
export class LibroMayorContabilidadRepository implements ILibroMayorContabilidadRepository {
  
  constructor() {
    // Iniciar limpieza automática de caché
    this.startCacheCleanup();
  }

  /**
   * Genera un hash único para los filtros
   */
  private generateFiltersHash(conjunto: string, filtros: FiltrosLibroMayorContabilidad): string {
    const filterString = JSON.stringify({
      conjunto,
      fechaDesde: filtros.fechaDesde,
      fechaHasta: filtros.fechaHasta,
      usuario: filtros.usuario
    });
    
    // Generar hash simple
    let hash = 0;
    for (let i = 0; i < filterString.length; i++) {
      const char = filterString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Busca una tabla temporal existente en el caché
   */
  private findCachedTable(conjunto: string, filtros: FiltrosLibroMayorContabilidad): string | null {
    const filtersHash = this.generateFiltersHash(conjunto, filtros);
    
    for (const [key, cachedTable] of tableCache.entries()) {
      if (cachedTable.conjunto === conjunto && 
          cachedTable.filtros === filtersHash &&
          (Date.now() - cachedTable.createdAt.getTime()) < CACHE_TTL) {
        
        // Actualizar último acceso
        cachedTable.lastAccessed = new Date();
        console.log(`✅ Reutilizando tabla temporal existente: ${cachedTable.tableName}`);
        return cachedTable.tableName;
      }
    }
    
    return null;
  }

  /**
   * Registra una nueva tabla temporal en el caché
   */
  private registerCachedTable(conjunto: string, filtros: FiltrosLibroMayorContabilidad, tableName: string): void {
    const filtersHash = this.generateFiltersHash(conjunto, filtros);
    const now = new Date();
    
    tableCache.set(tableName, {
      tableName,
      conjunto,
      filtros: filtersHash,
      createdAt: now,
      lastAccessed: now
    });
    
    console.log(`📝 Registrada nueva tabla temporal en caché: ${tableName}`);
  }

  /**
   * Limpia tablas temporales expiradas
   */
  private async cleanupExpiredTables(): Promise<void> {
    const now = Date.now();
    const expiredTables: string[] = [];
    
    for (const [key, cachedTable] of tableCache.entries()) {
      if ((now - cachedTable.createdAt.getTime()) > CACHE_TTL) {
        expiredTables.push(key);
      }
    }
    
    for (const tableName of expiredTables) {
      try {
        await exactusSequelize.query(`DROP TABLE IF EXISTS ${tableName}`);
        tableCache.delete(tableName);
        console.log(`🗑️ Limpiada tabla temporal expirada: ${tableName}`);
      } catch (error) {
        console.error(`Error limpiando tabla ${tableName}:`, error);
        tableCache.delete(tableName);
      }
    }
  }

  /**
   * Inicia el proceso de limpieza automática del caché
   */
  private startCacheCleanup(): void {
    setInterval(() => {
      this.cleanupExpiredTables();
    }, CLEANUP_INTERVAL);
  }

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

      const [results] = await exactusSequelize.query(query);
      return results as CuentaContableInfo[];
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

      const [results] = await exactusSequelize.query(query);
      return results as PeriodoContableInfo[];
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

      const [results] = await exactusSequelize.query(query);
      return results as TipoAsientoInfo[];
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

      const [results] = await exactusSequelize.query(query);
      return results as CentroCostoInfo[];
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

      const [results] = await exactusSequelize.query(query);
      return results as PaqueteInfo[];
    } catch (error) {
      console.error('Error al obtener paquetes:', error);
      throw error;
    }
  }

  async generarReporte(filtros: FiltrosLibroMayorContabilidad): Promise<LibroMayorContabilidad[]> {
    try {
      const { conjunto, fechaDesde, fechaHasta, limit } = filtros;

      // Buscar tabla temporal existente en caché
      let tableName = this.findCachedTable(conjunto, filtros);
      let isNewTable = false;

      if (!tableName) {
        // Crear nueva tabla temporal con nombre único
        tableName = `R_XML_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        isNewTable = true;
        
        console.log(`🆕 Creando nueva tabla temporal: ${tableName}`);
      } else {
        console.log(`♻️ Reutilizando tabla temporal existente: ${tableName}`);
      }

      // Solo crear tabla si es nueva
      if (isNewTable) {
        // Eliminar tabla temporal si existe y crearla nuevamente
        await exactusSequelize.query(`DROP TABLE IF EXISTS ${conjunto}.${tableName}`);

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
        
        await exactusSequelize.query(createTableQuery);
      }

      // Solo insertar datos si es una tabla nueva
      if (isNewTable) {
        console.log(`📊 Insertando datos en tabla temporal: ${tableName}`);
        
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
        
        await exactusSequelize.query(createRepcgTableQuery);

      // Limpiar registros previos del usuario
      await exactusSequelize.query(`DELETE FROM ${conjunto}.REPCG_MAYOR WHERE USUARIO = 'ADMPQUES'`);

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

      await exactusSequelize.query(insertSaldosIniciales);

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

      await exactusSequelize.query(insertMovimientosMayor);

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

      await exactusSequelize.query(insertMovimientosDiario);

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

      await exactusSequelize.query(updatePeriodoContable);

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

        await exactusSequelize.query(insertResultados);
        
        // Registrar la tabla en el caché
        this.registerCachedTable(conjunto, filtros, tableName);
      }

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
        ${limit && limit > 0 ? `OFFSET 0 ROWS FETCH NEXT ${limit} ROWS ONLY` : ''}
      `;

      const [results] = await exactusSequelize.query(selectResultados);
      
      // Solo limpiar tabla temporal si no está en caché
      if (!this.findCachedTable(conjunto, filtros)) {
        await exactusSequelize.query(`DROP TABLE ${conjunto}.${tableName}`);
        console.log(`🗑️ Eliminada tabla temporal: ${tableName}`);
      } else {
        console.log(`💾 Manteniendo tabla temporal en caché: ${tableName}`);
      }
      
      return results as LibroMayorContabilidad[];
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
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    try {
      const { conjunto, page = 1, pageSize = 25 } = filtros;
      const offset = (page - 1) * pageSize;

      // Buscar tabla temporal existente en caché
      let tableName = this.findCachedTable(conjunto, filtros);
      let isNewTable = false;

      if (!tableName) {
        // Crear nueva tabla temporal con nombre único
        tableName = `R_XML_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        isNewTable = true;
        
        console.log(`🆕 Creando nueva tabla temporal: ${tableName}`);
        
        // Crear tabla temporal simple
        const createTableQuery = `
          IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES
                        WHERE TABLE_SCHEMA = '${conjunto}'
                        AND TABLE_NAME = '${tableName}')
          BEGIN
              CREATE TABLE ${conjunto}.${tableName} (
                  FECHA DATETIME,
                  CONSECUTIVO INT,
                  DESCRIPCION NVARCHAR(255),
                  SALDO_DEUDOR DECIMAL(18,2),
                  SALDO_ACREEDOR DECIMAL(18,2),
                  DEBITO_LOCAL DECIMAL(18,2),
                  CREDITO_LOCAL DECIMAL(18,2)
              )
          END
        `;

        await exactusSequelize.query(createTableQuery);
      } else {
        console.log(`♻️ Reutilizando tabla temporal existente: ${tableName}`);
      }

      // Solo insertar datos si es una tabla nueva
      if (isNewTable) {
        console.log(`📊 Insertando datos en tabla temporal: ${tableName}`);
        
        // Query simplificado para insertar datos
        const insertQuery = `
          INSERT INTO ${conjunto}.${tableName} (
              FECHA, CONSECUTIVO, DESCRIPCION, SALDO_DEUDOR, 
              SALDO_ACREEDOR, DEBITO_LOCAL, CREDITO_LOCAL
          )
          SELECT 
              M.FECHA,
              M.CONSECUTIVO,
              CC.DESCRIPCION,
              CASE CC.SALDO_NORMAL 
                  WHEN 'D' THEN ABS(COALESCE(M.DEBITO_LOCAL, 0) - COALESCE(M.CREDITO_LOCAL, 0))
                  ELSE 0 
              END AS SALDO_DEUDOR,
              CASE CC.SALDO_NORMAL 
                  WHEN 'A' THEN ABS(COALESCE(M.CREDITO_LOCAL, 0) - COALESCE(M.DEBITO_LOCAL, 0))
                  ELSE 0 
              END AS SALDO_ACREEDOR,
              COALESCE(M.DEBITO_LOCAL, 0) AS DEBITO_LOCAL,
              COALESCE(M.CREDITO_LOCAL, 0) AS CREDITO_LOCAL
          FROM ${conjunto}.MAYOR M
          INNER JOIN ${conjunto}.CUENTA_CONTABLE CC ON 
              CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'
          WHERE M.CONTABILIDAD IN ('A', 'F') 
            AND M.FECHA >= '${filtros.fechaDesde}'                        
            AND M.FECHA <= '${filtros.fechaHasta}'                      
            AND M.CLASE_ASIENTO != 'C'
          ORDER BY M.FECHA, M.CONSECUTIVO
        `;

        await exactusSequelize.query(insertQuery);
        
        // Registrar la tabla en el caché
        this.registerCachedTable(conjunto, filtros, tableName);
      }

      // Obtener el total de registros
      const countQuery = `
        SELECT COUNT(*) as total
        FROM ${conjunto}.${tableName}
      `;

      const [countResults] = await exactusSequelize.query(countQuery);
      const total = (countResults as any[])[0]?.total || 0;
      const totalPages = Math.ceil(total / pageSize);

      // Obtener los resultados paginados
      const selectQuery = `
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
        OFFSET ${offset} ROWS
        FETCH NEXT ${pageSize} ROWS ONLY
      `;

      const [results] = await exactusSequelize.query(selectQuery);

      return {
        data: results as LibroMayorContabilidad[],
        total,
        page,
        pageSize,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
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


  /**
   * Limpia manualmente el caché de tablas temporales
   */
  async limpiarCache(): Promise<void> {
    console.log('🧹 Limpiando caché de tablas temporales...');
    await this.cleanupExpiredTables();
    console.log(`✅ Caché limpiado. Tablas restantes: ${tableCache.size}`);
  }

  /**
   * Obtiene estadísticas del caché
   */
  obtenerEstadisticasCache(): { totalTablas: number; tablas: CachedTable[] } {
    return {
      totalTablas: tableCache.size,
      tablas: Array.from(tableCache.values())
    };
  }
}
