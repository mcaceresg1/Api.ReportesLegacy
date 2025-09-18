import { injectable } from 'inversify';
import { QueryTypes } from 'sequelize';
import { exactusSequelize } from '../database/config/exactus-database';
import * as XLSX from 'xlsx';
import { 
  DiarioContabilidad, 
  DiarioContabilidadFiltros, 
  DiarioContabilidadResponse 
} from '../../domain/entities/DiarioContabilidad';
import { IDiarioContabilidadRepository } from '../../domain/repositories/IDiarioContabilidadRepository';

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
export class DiarioContabilidadRepository implements IDiarioContabilidadRepository {
  
  constructor() {
    // Iniciar limpieza automática de caché
    this.startCacheCleanup();
  }

  /**
   * Genera un hash único para los filtros
   */
  private generateFiltersHash(conjunto: string, filtros: DiarioContabilidadFiltros): string {
    const filterString = JSON.stringify({
      conjunto,
      usuario: filtros.usuario,
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
      contabilidad: filtros.contabilidad,
      tipoReporte: filtros.tipoReporte
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
  private findCachedTable(conjunto: string, filtros: DiarioContabilidadFiltros): string | null {
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
  private registerCachedTable(conjunto: string, filtros: DiarioContabilidadFiltros, tableName: string): void {
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

  private getTableName(conjunto: string): string {
    return `${conjunto}.R_XML_8DDC54CDCEBAD6C`;
  }

  async generarReporteDiarioContabilidad(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad: string = 'F,A',
    tipoReporte: string = 'Preliminar'
  ): Promise<string> {
    try {
      console.log(`Generando reporte Diario de Contabilidad para conjunto: ${conjunto}, usuario: ${usuario}`);

      // Crear filtros para el caché
      const filtros: DiarioContabilidadFiltros = {
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoReporte
      };

      // Buscar tabla temporal existente en caché
      let tableName = this.findCachedTable(conjunto, filtros);
      let isNewTable = false;

      if (!tableName) {
        // Crear nueva tabla temporal con nombre único
        tableName = `R_XML_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        isNewTable = true;
        
        console.log(`🆕 Creando nueva tabla temporal: ${tableName}`);
        
        // Crear tabla temporal
        await this.crearTablaReporte(conjunto, tableName);
      } else {
        console.log(`♻️ Reutilizando tabla temporal existente: ${tableName}`);
      }

      // Solo insertar datos si es una tabla nueva
      if (isNewTable) {
        console.log(`📊 Insertando datos en tabla temporal: ${tableName}`);
        
        // Limpiar datos anteriores
        await this.limpiarDatosTemporales(conjunto, usuario, tableName);

        // Preparar fechas en formato SQL Server
        const fechaInicioStr = fechaInicio.toISOString().split('T')[0] + ' 00:00:00';
        const fechaFinStr = fechaFin.toISOString().split('T')[0] + ' 23:59:59';

        // Preparar filtro de contabilidad
        const contabilidadArray = contabilidad.split(',').map(c => `'${c.trim()}'`).join(',');

      // 5. Insert desde tabla MAYOR
      const insertMayorQuery = `
        INSERT INTO ${tableName} (
          NOMUSUARIO, CONSECUTIVO, CUENTA_CONTABLE, FECHA, ASIENTO,
          TIPODOC, DOCUMENTO, REFERENCIA, DEBITO_LOCAL, DEBITO_DOLAR,
          CREDITO_LOCAL, CREDITO_DOLAR, CENTRO_COSTO, TIPO_ASIENTO, NOTAS,
          SDESCTIPOASIENTO, FUENTE, FINICIO, FFINAL, TIPO_REPORTE,
          NIT, NIT_NOMBRE, MODULO, CUENTA_CONTABLE_DESC
        )
        SELECT 
          '${usuario}' NOMUSUARIO,
          M.CONSECUTIVO,
          M.CUENTA_CONTABLE,
          M.FECHA,
          M.ASIENTO,
          CASE 
            WHEN M.ORIGEN IN ('CP', 'CB', 'CC', 'FEE', 'IC') THEN SUBSTRING(M.FUENTE, 1, 3)
            WHEN M.ORIGEN = 'CJ' THEN SUBSTRING(M.FUENTE, 1, 3)
            ELSE ''
          END TIPODOC,
          CASE 
            WHEN M.ORIGEN IN ('CP', 'CB', 'CC', 'FEE', 'IC') THEN SUBSTRING(M.FUENTE, 4, 20)
            WHEN M.ORIGEN = 'CJ' THEN SUBSTRING(M.FUENTE, 4, 40)
            ELSE ''
          END DOCUMENTO,
          M.REFERENCIA,
          M.DEBITO_LOCAL,
          M.DEBITO_DOLAR,
          M.CREDITO_LOCAL,
          M.CREDITO_DOLAR,
          M.CENTRO_COSTO,
          M.TIPO_ASIENTO,
          A.NOTAS,
          T.DESCRIPCION SDESCTIPOASIENTO,
          M.FUENTE,
          '${fechaInicioStr}' FINICIO,
          '${fechaFinStr}' FFINAL,
          '${tipoReporte}' TIPO_REPORTE,
          M.NIT,
          N.RAZON_SOCIAL NIT_NOMBRE,
          M.ORIGEN MODULO,
          C.DESCRIPCION CUENTA_CONTABLE_DESC
        FROM ${conjunto}.MAYOR M
        INNER JOIN ${conjunto}.NIT N ON M.NIT = N.NIT
        INNER JOIN ${conjunto}.ASIENTO_MAYORIZADO A ON A.ASIENTO = M.ASIENTO
        INNER JOIN ${conjunto}.CUENTA_CONTABLE C ON M.CUENTA_CONTABLE = C.CUENTA_CONTABLE
        INNER JOIN ${conjunto}.TIPO_ASIENTO T ON T.TIPO_ASIENTO = A.TIPO_ASIENTO
        WHERE 1 = 1
          AND M.CONTABILIDAD IN (${contabilidadArray})
          AND M.FECHA >= '${fechaInicioStr}'
          AND M.FECHA <= '${fechaFinStr}'
      `;

      await exactusSequelize.query(insertMayorQuery, { type: QueryTypes.INSERT });

      // 6. Insert desde tabla DIARIO
      const insertDiarioQuery = `
        INSERT INTO ${tableName} (
          NOMUSUARIO, CONSECUTIVO, CUENTA_CONTABLE, FECHA, ASIENTO,
          TIPODOC, DOCUMENTO, REFERENCIA, DEBITO_LOCAL, DEBITO_DOLAR,
          CREDITO_LOCAL, CREDITO_DOLAR, CENTRO_COSTO, TIPO_ASIENTO, NOTAS,
          SDESCTIPOASIENTO, FUENTE, FINICIO, FFINAL, TIPO_REPORTE,
          NIT, NIT_NOMBRE, MODULO, CUENTA_CONTABLE_DESC
        )
        SELECT 
          '${usuario}' NOMUSUARIO,
          D.CONSECUTIVO,
          D.CUENTA_CONTABLE,
          M.FECHA,
          M.ASIENTO,
          CASE 
            WHEN M.ORIGEN IN ('CP', 'CB', 'CC', 'FEE') THEN SUBSTRING(D.FUENTE, 1, 3)
            WHEN M.ORIGEN = 'CJ' THEN SUBSTRING(D.FUENTE, 1, 3)
            ELSE ''
          END TIPODOC,
          CASE 
            WHEN M.ORIGEN IN ('CP', 'CB', 'CC', 'FEE') THEN SUBSTRING(D.FUENTE, 4, 20)
            WHEN M.ORIGEN = 'CJ' THEN SUBSTRING(D.FUENTE, 4, 40)
            ELSE ''
          END DOCUMENTO,
          D.REFERENCIA,
          D.DEBITO_LOCAL,
          D.DEBITO_DOLAR,
          D.CREDITO_LOCAL,
          D.CREDITO_DOLAR,
          D.CENTRO_COSTO,
          M.TIPO_ASIENTO,
          M.NOTAS,
          T.DESCRIPCION SDESCTIPOASIENTO,
          D.FUENTE,
          '${fechaInicioStr}' FINICIO,
          '${fechaFinStr}' FFINAL,
          '${tipoReporte}' TIPO_REPORTE,
          D.NIT,
          N.RAZON_SOCIAL NIT_NOMBRE,
          M.ORIGEN MODULO,
          C.DESCRIPCION CUENTA_CONTABLE_DESC
        FROM ${conjunto}.ASIENTO_DE_DIARIO M
        INNER JOIN ${conjunto}.DIARIO D ON M.ASIENTO = D.ASIENTO
        INNER JOIN ${conjunto}.CUENTA_CONTABLE C ON D.CUENTA_CONTABLE = C.CUENTA_CONTABLE
        INNER JOIN ${conjunto}.NIT N ON D.NIT = N.NIT
        INNER JOIN ${conjunto}.TIPO_ASIENTO T ON T.TIPO_ASIENTO = M.TIPO_ASIENTO
        WHERE 1 = 1
          AND M.CONTABILIDAD IN (${contabilidadArray})
          AND M.FECHA >= '${fechaInicioStr}'
          AND M.FECHA <= '${fechaFinStr}'
      `;

        await exactusSequelize.query(insertDiarioQuery, { type: QueryTypes.INSERT });

        // Registrar la tabla en el caché
        this.registerCachedTable(conjunto, filtros, tableName);
      }

      console.log(`Reporte Diario de Contabilidad generado exitosamente para ${conjunto}`);
      return tableName;

    } catch (error) {
      console.error('Error al generar reporte Diario de Contabilidad:', error);
      throw error;
    }
  }

  async obtenerDiarioContabilidad(filtros: DiarioContabilidadFiltros): Promise<DiarioContabilidadResponse> {
    try {
      const page = filtros.page || 1;
      const limit = filtros.limit || 25;
      const offset = (page - 1) * limit;
      
      console.log('🔍 DiarioContabilidadRepository.obtenerDiarioContabilidad - Parámetros recibidos:', {
        page: filtros.page,
        limit: filtros.limit,
        offset: filtros.offset,
        calculatedPage: page,
        calculatedLimit: limit,
        calculatedOffset: offset
      });
      
      // Buscar tabla temporal existente en caché
      let tableName = this.findCachedTable(filtros.conjunto, filtros);
      
      if (!tableName) {
        // Si no existe tabla en caché, generar el reporte
        console.log('🔄 No se encontró tabla en caché, generando reporte...');
        tableName = await this.generarReporteDiarioContabilidad(
          filtros.conjunto,
          filtros.usuario,
          filtros.fechaInicio,
          filtros.fechaFin,
          filtros.contabilidad || 'F,A',
          filtros.tipoReporte || 'Preliminar'
        );
      } else {
        console.log(`♻️ Usando tabla temporal existente: ${tableName}`);
      }
      
      // Construir WHERE clause
      let whereClause = 'WHERE 1 = 1';
      
      if (filtros.usuario) {
        whereClause += ` AND NOMUSUARIO = '${filtros.usuario}'`;
      }
      
      if (filtros.cuentaContable) {
        whereClause += ` AND CUENTA_CONTABLE LIKE '%${filtros.cuentaContable}%'`;
      }
      
      if (filtros.centroCosto) {
        whereClause += ` AND CENTRO_COSTO LIKE '%${filtros.centroCosto}%'`;
      }
      
      if (filtros.nit) {
        whereClause += ` AND NIT LIKE '%${filtros.nit}%'`;
      }
      
      if (filtros.tipoAsiento) {
        whereClause += ` AND TIPO_ASIENTO LIKE '%${filtros.tipoAsiento}%'`;
      }
      
      if (filtros.asiento) {
        whereClause += ` AND ASIENTO LIKE '%${filtros.asiento}%'`;
      }

      if (filtros.origen) {
        whereClause += ` AND MODULO = '${filtros.origen}'`;
      }

      // Obtener total de registros
      const total = await this.obtenerTotalRegistros({
        conjunto: filtros.conjunto,
        usuario: filtros.usuario,
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin,
        contabilidad: filtros.contabilidad || 'F,A',
        tipoReporte: filtros.tipoReporte || 'Preliminar',
        cuentaContable: filtros.cuentaContable,
        centroCosto: filtros.centroCosto,
        nit: filtros.nit,
        tipoAsiento: filtros.tipoAsiento,
        asiento: filtros.asiento,
        origen: filtros.origen
      });

      // Query principal con paginación
      const query = `
        SELECT 
          ISNULL(cuenta_contable_desc, '') as CUENTA_CONTABLE_DESC,
          ISNULL(correlativo_asiento, '') as CORRELATIVO_ASIENTO,
          ISNULL(sDescTipoAsiento, '') as SDESC_TIPO_ASIENTO,
          ISNULL(cuenta_contable, '') as CUENTA_CONTABLE,
          ISNULL(credito_local, 0) as CREDITO_LOCAL,
          ISNULL(credito_dolar, 0) as CREDITO_DOLAR,
          ISNULL(centro_costo, '') as CENTRO_COSTO,
          ISNULL(debito_local, 0) as DEBITO_LOCAL,
          ISNULL(debito_dolar, 0) as DEBITO_DOLAR,
          ISNULL(tipo_asiento, '') as TIPO_ASIENTO,
          ISNULL(tipo_reporte, '') as TIPO_REPORTE,
          ISNULL(consecutivo, '') as CONSECUTIVO,
          ISNULL(referencia, '') as REFERENCIA,
          ISNULL(tipocambio, 0) as TIPO_CAMBIO,
          ISNULL(NomUsuario, '') as NOM_USUARIO,
          ISNULL(NIT_NOMBRE, '') as NIT_NOMBRE,
          ISNULL(documento, '') as DOCUMENTO,
          ISNULL(asiento, '') as ASIENTO,
          ISNULL(tipodoc, '') as TIPO_DOC,
          finicio as FINICIO,
          ISNULL(modulo, '') as MODULO,
          ffinal as FFINAL,
          ISNULL(FUENTE, '') as FUENTE,
          fecha as FECHA,
          ISNULL(notas, '') as NOTAS,
          ISNULL(NIT, '') as NIT,
          ROW_ORDER_BY
        FROM ${tableName}
        ${whereClause}
        ORDER BY ROW_ORDER_BY
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY
      `;

      const data = await exactusSequelize.query(query, { 
        type: QueryTypes.SELECT 
      }) as DiarioContabilidad[];

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        message: "Datos obtenidos exitosamente",
      };

    } catch (error) {
      console.error('Error al obtener Diario de Contabilidad:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 25,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        message: `Error al obtener Diario de Contabilidad: ${error}`,
      };
    }
  }

  async obtenerTotalRegistros(filtros: Omit<DiarioContabilidadFiltros, 'limit' | 'offset' | 'page'>): Promise<number> {
    try {
      const tableName = this.getTableName(filtros.conjunto);
      let whereClause = 'WHERE 1 = 1';
      
      if (filtros.usuario) {
        whereClause += ` AND NOMUSUARIO = '${filtros.usuario}'`;
      }
      
      if (filtros.cuentaContable) {
        whereClause += ` AND CUENTA_CONTABLE LIKE '%${filtros.cuentaContable}%'`;
      }
      
      if (filtros.centroCosto) {
        whereClause += ` AND CENTRO_COSTO LIKE '%${filtros.centroCosto}%'`;
      }
      
      if (filtros.nit) {
        whereClause += ` AND NIT LIKE '%${filtros.nit}%'`;
      }
      
      if (filtros.tipoAsiento) {
        whereClause += ` AND TIPO_ASIENTO LIKE '%${filtros.tipoAsiento}%'`;
      }
      
      if (filtros.asiento) {
        whereClause += ` AND ASIENTO LIKE '%${filtros.asiento}%'`;
      }

      if (filtros.origen) {
        whereClause += ` AND MODULO = '${filtros.origen}'`;
      }

      const query = `SELECT COUNT(*) as total FROM ${tableName} ${whereClause}`;
      const result = await exactusSequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      
      return Number(result[0]?.total || 0);

    } catch (error) {
      console.error('Error al obtener total de registros:', error);
      return 0;
    }
  }

  async limpiarDatosTemporales(conjunto: string, usuario: string, tableName?: string): Promise<void> {
    try {
      const targetTableName = tableName || this.getTableName(conjunto);
      const query = `DELETE FROM ${targetTableName} WHERE NOMUSUARIO = '${usuario}'`;
      await exactusSequelize.query(query, { type: QueryTypes.DELETE });
      console.log(`Datos temporales limpiados para usuario: ${usuario} en tabla: ${targetTableName}`);
    } catch (error) {
      console.error('Error al limpiar datos temporales:', error);
      // No lanzar error, solo logear
    }
  }

  async existeTablaReporte(conjunto: string, tableName?: string): Promise<boolean> {
    try {
      const targetTableName = tableName || 'R_XML_8DDC54CDCEBAD6C';
      const query = `
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = '${conjunto}' 
        AND TABLE_NAME = '${targetTableName}'
      `;
      const result = await exactusSequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      return Number(result[0]?.count || 0) > 0;
    } catch (error) {
      console.error('Error al verificar existencia de tabla:', error);
      return false;
    }
  }

  async crearTablaReporte(conjunto: string, tableName?: string): Promise<void> {
    try {
      const targetTableName = tableName || this.getTableName(conjunto);
      const existe = await this.existeTablaReporte(conjunto, targetTableName);
      if (existe) {
        return;
      }

      const createTableQuery = `
        CREATE TABLE ${targetTableName} (
          cuenta_contable_desc VARCHAR(254),
          correlativo_asiento VARCHAR(254),
          sDescTipoAsiento VARCHAR(254),
          cuenta_contable VARCHAR(254),
          credito_local DECIMAL(32,12),
          credito_dolar DECIMAL(32,12),
          centro_costo VARCHAR(254),
          debito_local DECIMAL(32,12),
          debito_dolar DECIMAL(32,12),
          tipo_asiento VARCHAR(254),
          tipo_reporte VARCHAR(254),
          consecutivo VARCHAR(254),
          referencia VARCHAR(254),
          tipocambio DECIMAL(32,12),
          NomUsuario VARCHAR(254),
          NIT_NOMBRE VARCHAR(254),
          documento VARCHAR(254),
          asiento VARCHAR(254),
          tipodoc VARCHAR(254),
          finicio DATETIME,
          modulo VARCHAR(254),
          ffinal DATETIME,
          FUENTE VARCHAR(254),
          fecha DATETIME,
          notas VARCHAR(MAX),
          NIT VARCHAR(254),
          ROW_ORDER_BY INT NOT NULL IDENTITY PRIMARY KEY
        )
      `;

      await exactusSequelize.query(createTableQuery, { type: QueryTypes.RAW });
      console.log(`Tabla de reporte Diario de Contabilidad creada exitosamente: ${targetTableName}`);

    } catch (error) {
      console.error('Error al crear tabla de reporte:', error);
      // No lanzar error si la tabla ya existe
    }
  }

  async exportarExcel(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad: string = 'F,A',
    tipoReporte: string = 'Preliminar',
    limit: number = 10000
  ): Promise<Buffer> {
    try {
      // Generar reporte si no existe
      await this.generarReporteDiarioContabilidad(conjunto, usuario, fechaInicio, fechaFin, contabilidad, tipoReporte);

      // Obtener datos para exportar
      const filtros: DiarioContabilidadFiltros = {
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoReporte,
        limit,
        offset: 0
      };

      const response = await this.obtenerDiarioContabilidad(filtros);
      
      // Crear workbook de Excel
      const workbook = XLSX.utils.book_new();
      
      // Preparar datos para Excel
      const excelData = response.data.map(row => ({
        'Cuenta Contable': row.CUENTA_CONTABLE,
        'Descripción Cuenta': row.CUENTA_CONTABLE_DESC,
        'Asiento': row.ASIENTO,
        'Fecha': row.FECHA,
        'Tipo Asiento': row.TIPO_ASIENTO,
        'Descripción Tipo': row.SDESC_TIPO_ASIENTO,
        'Consecutivo': row.CONSECUTIVO,
        'Tipo Doc': row.TIPO_DOC,
        'Documento': row.DOCUMENTO,
        'Referencia': row.REFERENCIA,
        'Débito Local': row.DEBITO_LOCAL,
        'Crédito Local': row.CREDITO_LOCAL,
        'Débito Dólar': row.DEBITO_DOLAR,
        'Crédito Dólar': row.CREDITO_DOLAR,
        'Centro Costo': row.CENTRO_COSTO,
        'NIT': row.NIT,
        'Nombre NIT': row.NIT_NOMBRE,
        'Módulo': row.MODULO,
        'Fuente': row.FUENTE,
        'Notas': row.NOTAS,
        'Usuario': row.NOM_USUARIO,
        'Tipo Reporte': row.TIPO_REPORTE
      }));
      
      // Crear worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Diario Contabilidad');
      
      // Generar buffer
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx' 
      });
      
      return excelBuffer;

    } catch (error) {
      console.error('Error al exportar Excel:', error);
      throw error;
    }
  }

  async obtenerInformacionAuditoria(conjunto: string, usuario: string): Promise<{
    fechaGeneracion?: Date;
    totalRegistros: number;
    fechaInicio?: Date;
    fechaFin?: Date;
    usuario: string;
  }> {
    try {
      const tableName = this.getTableName(conjunto);
      const query = `
        SELECT 
          COUNT(*) as totalRegistros,
          MIN(FINICIO) as fechaInicio,
          MAX(FFINAL) as fechaFin,
          MAX(FECHA) as fechaGeneracion
        FROM ${tableName}
        WHERE NOMUSUARIO = '${usuario}'
      `;

      const result = await exactusSequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      const row = result[0] || {};

      return {
        fechaGeneracion: row.fechaGeneracion || undefined,
        totalRegistros: Number(row.totalRegistros || 0),
        fechaInicio: row.fechaInicio || undefined,
        fechaFin: row.fechaFin || undefined,
        usuario
      };

    } catch (error) {
      console.error('Error al obtener información de auditoría:', error);
      return {
        totalRegistros: 0,
        usuario
      };
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
