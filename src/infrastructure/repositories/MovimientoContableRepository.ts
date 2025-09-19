import { injectable } from 'inversify';
import { IMovimientoContableRepository } from '../../domain/repositories/IMovimientoContableRepository';
import { MovimientoContable, MovimientoContableResponse } from '../../domain/entities/MovimientoContable';
import { DynamicModelFactory } from '../database/models/DynamicModel';
import { QueryTypes, Op } from 'sequelize';
import { exactusSequelize } from '../database/config/exactus-database';
import * as XLSX from 'xlsx';

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
export class MovimientoContableRepository implements IMovimientoContableRepository {
  
  constructor() {
    // Iniciar limpieza automática de caché
    this.startCacheCleanup();
  }

  /**
   * Genera un hash único para los filtros
   */
  private generateFiltersHash(conjunto: string, usuario: string, fechaInicio: Date, fechaFin: Date): string {
    const filterString = JSON.stringify({
      conjunto,
      usuario,
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString()
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
  private findCachedTable(conjunto: string, usuario: string, fechaInicio: Date, fechaFin: Date): string | null {
    const filtersHash = this.generateFiltersHash(conjunto, usuario, fechaInicio, fechaFin);
    
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
  private registerCachedTable(conjunto: string, usuario: string, fechaInicio: Date, fechaFin: Date, tableName: string): void {
    const filtersHash = this.generateFiltersHash(conjunto, usuario, fechaInicio, fechaFin);
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
  
  async generarReporteMovimientos(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    page: number = 1,
    limit: number = 100
  ): Promise<MovimientoContableResponse> {
    try {
      // Calcular offset basado en página
      const offset = (page - 1) * limit;
      
      // Buscar tabla temporal existente en caché
      let tableName = this.findCachedTable(conjunto, usuario, fechaInicio, fechaFin);
      let isNewTable = false;

      if (!tableName) {
        // Crear nueva tabla temporal con nombre único
        tableName = `REPCG_MOV_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        isNewTable = true;
        
        console.log(`🆕 Creando nueva tabla temporal: ${tableName}`);
      } else {
        console.log(`♻️ Reutilizando tabla temporal existente: ${tableName}`);
      }

      // Solo crear tabla si es nueva
      if (isNewTable) {
        // Eliminar tabla temporal si existe y crearla nuevamente
        await exactusSequelize.query(`DROP TABLE IF EXISTS ${conjunto}.${tableName}`);

        // Crear tabla temporal para reporte de movimientos
        const createTableQuery = `
          CREATE TABLE ${conjunto}.${tableName} (
              USUARIO VARCHAR(100),
              CUENTA_CONTABLE VARCHAR(100),
              DESCRIPCION_CUENTA_CONTABLE VARCHAR(500),
              ASIENTO VARCHAR(100),
              TIPO VARCHAR(50),
              DOCUMENTO VARCHAR(100),
              REFERENCIA VARCHAR(500),
              DEBITO_LOCAL DECIMAL(32,12),
              DEBITO_DOLAR DECIMAL(32,12),
              CREDITO_LOCAL DECIMAL(32,12),
              CREDITO_DOLAR DECIMAL(32,12),
              CENTRO_COSTO VARCHAR(100),
              DESCRIPCION_CENTRO_COSTO VARCHAR(500),
              TIPO_ASIENTO VARCHAR(50),
              FECHA DATETIME,
              ACEPTA_DATOS BIT,
              CONSECUTIVO INT,
              NIT VARCHAR(100),
              RAZON_SOCIAL VARCHAR(500),
              FUENTE VARCHAR(100),
              NOTAS VARCHAR(1000),
              U_FLUJO_EFECTIVO VARCHAR(50),
              U_PATRIMONIO_NETO VARCHAR(50),
              U_REP_REF VARCHAR(100),
              ROW_ORDER_BY INT NOT NULL IDENTITY PRIMARY KEY
          )
        `;
        
        await exactusSequelize.query(createTableQuery);
      }

      // Solo insertar datos si es una tabla nueva
      if (isNewTable) {
        console.log(`📊 Insertando datos en tabla temporal: ${tableName}`);
        
        // Primero limpiar datos anteriores del usuario
        await exactusSequelize.query(
          `DELETE FROM ${conjunto}.${tableName} WHERE USUARIO = '${usuario}'`,
          { type: QueryTypes.DELETE }
        );

        // Query para generar el reporte basado en los queries proporcionados
        const query = `
          INSERT INTO ${conjunto}.${tableName} (
            USUARIO, CUENTA_CONTABLE, DESCRIPCION_CUENTA_CONTABLE, ASIENTO, TIPO, 
            DOCUMENTO, REFERENCIA, DEBITO_LOCAL, DEBITO_DOLAR, CREDITO_LOCAL, 
            CREDITO_DOLAR, CENTRO_COSTO, DESCRIPCION_CENTRO_COSTO, TIPO_ASIENTO, 
            FECHA, ACEPTA_DATOS, CONSECUTIVO, NIT, RAZON_SOCIAL, FUENTE, NOTAS, 
            U_FLUJO_EFECTIVO, U_PATRIMONIO_NETO, U_REP_REF
          )
        SELECT 
          '${usuario}' as USUARIO,
          SUBSTRING(M.CUENTA_CONTABLE, 1, 2) as CUENTA_CONTABLE,
          LEFT(ISNULL(CAST(CC.DESCRIPCION AS VARCHAR(MAX)), ''), 500) as DESCRIPCION_CUENTA_CONTABLE,
          LEFT(ISNULL(CAST(M.ASIENTO AS VARCHAR(MAX)), ''), 100) as ASIENTO,
          LEFT(CASE 
            WHEN A.ORIGEN IN ('CP', 'CB', 'CC', 'CJ', 'IC', 'FA') 
            THEN SUBSTRING(LTRIM(RTRIM(CAST(M.FUENTE AS VARCHAR(MAX)))), 1, 3) 
            ELSE '' 
          END, 50) as TIPO,
          LEFT(CASE 
            WHEN A.ORIGEN IN ('FA') 
            THEN SUBSTRING(LTRIM(RTRIM(CAST(M.FUENTE AS VARCHAR(MAX)))), 5, 20)
            WHEN A.ORIGEN IN ('CP', 'CB', 'CC', 'CJ', 'IC') 
            THEN SUBSTRING(LTRIM(RTRIM(CAST(M.FUENTE AS VARCHAR(MAX)))), 4, 20)
            ELSE '' 
          END, 100) as DOCUMENTO,
          LEFT(ISNULL(CAST(M.REFERENCIA AS VARCHAR(MAX)), ''), 500) as REFERENCIA,
          ISNULL(M.DEBITO_LOCAL, 0) as DEBITO_LOCAL,
          ISNULL(M.DEBITO_DOLAR, 0) as DEBITO_DOLAR,
          ISNULL(M.CREDITO_LOCAL, 0) as CREDITO_LOCAL,
          ISNULL(M.CREDITO_DOLAR, 0) as CREDITO_DOLAR,
          LEFT(ISNULL(CAST(M.CENTRO_COSTO AS VARCHAR(MAX)), ''), 100) as CENTRO_COSTO,
          LEFT(ISNULL(CAST(C.DESCRIPCION AS VARCHAR(MAX)), ''), 500) as DESCRIPCION_CENTRO_COSTO,
          LEFT(ISNULL(CAST(A.TIPO_ASIENTO AS VARCHAR(MAX)), ''), 50) as TIPO_ASIENTO,
          A.FECHA,
          CASE CC.ACEPTA_DATOS WHEN 'N' THEN 0 ELSE 1 END as ACEPTA_DATOS,
          ISNULL(M.CONSECUTIVO, 0) as CONSECUTIVO,
          LEFT(ISNULL(CAST(M.NIT AS VARCHAR(MAX)), ''), 100) as NIT,
          LEFT(ISNULL(CAST(N.RAZON_SOCIAL AS VARCHAR(MAX)), ''), 500) as RAZON_SOCIAL,
          LEFT(ISNULL(CAST(M.FUENTE AS VARCHAR(MAX)), ''), 100) as FUENTE,
          LEFT(ISNULL(CAST(A.NOTAS AS VARCHAR(MAX)), ''), 1000) as NOTAS,
          LEFT(ISNULL(CAST(M.U_FLUJO_EFECTIVO AS VARCHAR(MAX)), ''), 50) as U_FLUJO_EFECTIVO,
          LEFT(ISNULL(CAST(M.U_PATRIMONIO_NETO AS VARCHAR(MAX)), ''), 50) as U_PATRIMONIO_NETO,
          LEFT(ISNULL(CAST(M.U_REP_REF AS VARCHAR(MAX)), ''), 100) as U_REP_REF
        FROM ${conjunto}.DIARIO M
        INNER JOIN ${conjunto}.ASIENTO_DE_DIARIO A ON M.ASIENTO = A.ASIENTO
        INNER JOIN ${conjunto}.NIT N ON M.NIT = N.NIT
        INNER JOIN ${conjunto}.CUENTA_CONTABLE CC ON CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'
        INNER JOIN ${conjunto}.CENTRO_COSTO C ON C.CENTRO_COSTO = M.CENTRO_COSTO
        WHERE A.CONTABILIDAD IN ('F', 'A')
        AND A.FECHA BETWEEN '${fechaInicio.toISOString()}' AND '${fechaFin.toISOString()}'
        
        UNION ALL
        
        SELECT 
          '${usuario}' as USUARIO,
          SUBSTRING(M.CUENTA_CONTABLE, 1, 2) as CUENTA_CONTABLE,
          LEFT(ISNULL(CAST(CC.DESCRIPCION AS VARCHAR(MAX)), ''), 500) as DESCRIPCION_CUENTA_CONTABLE,
          LEFT(ISNULL(CAST(M.ASIENTO AS VARCHAR(MAX)), ''), 100) as ASIENTO,
          LEFT(CASE 
            WHEN A.ORIGEN IN ('CP', 'CB', 'CC', 'CJ', 'IC', 'FA') 
            THEN SUBSTRING(LTRIM(RTRIM(CAST(M.FUENTE AS VARCHAR(MAX)))), 1, 3) 
            ELSE '' 
          END, 50) as TIPO,
          LEFT(CASE 
            WHEN A.ORIGEN IN ('FA') 
            THEN SUBSTRING(LTRIM(RTRIM(CAST(M.FUENTE AS VARCHAR(MAX)))), 5, 20)
            WHEN A.ORIGEN IN ('CP', 'CB', 'CC', 'CJ', 'IC') 
            THEN SUBSTRING(LTRIM(RTRIM(CAST(M.FUENTE AS VARCHAR(MAX)))), 4, 20)
            ELSE '' 
          END, 100) as DOCUMENTO,
          LEFT(ISNULL(CAST(M.REFERENCIA AS VARCHAR(MAX)), ''), 500) as REFERENCIA,
          ISNULL(M.DEBITO_LOCAL, 0) as DEBITO_LOCAL,
          ISNULL(M.DEBITO_DOLAR, 0) as DEBITO_DOLAR,
          ISNULL(M.CREDITO_LOCAL, 0) as CREDITO_LOCAL,
          ISNULL(M.CREDITO_DOLAR, 0) as CREDITO_DOLAR,
          LEFT(ISNULL(CAST(M.CENTRO_COSTO AS VARCHAR(MAX)), ''), 100) as CENTRO_COSTO,
          LEFT(ISNULL(CAST(C.DESCRIPCION AS VARCHAR(MAX)), ''), 500) as DESCRIPCION_CENTRO_COSTO,
          LEFT(ISNULL(CAST(A.TIPO_ASIENTO AS VARCHAR(MAX)), ''), 50) as TIPO_ASIENTO,
          A.FECHA,
          CASE CC.ACEPTA_DATOS WHEN 'N' THEN 0 ELSE 1 END as ACEPTA_DATOS,
          ISNULL(M.CONSECUTIVO, 0) as CONSECUTIVO,
          LEFT(ISNULL(CAST(M.NIT AS VARCHAR(MAX)), ''), 100) as NIT,
          LEFT(ISNULL(CAST(N.RAZON_SOCIAL AS VARCHAR(MAX)), ''), 500) as RAZON_SOCIAL,
          LEFT(ISNULL(CAST(M.FUENTE AS VARCHAR(MAX)), ''), 100) as FUENTE,
          LEFT(ISNULL(CAST(A.NOTAS AS VARCHAR(MAX)), ''), 1000) as NOTAS,
          LEFT(ISNULL(CAST(M.U_FLUJO_EFECTIVO AS VARCHAR(MAX)), ''), 50) as U_FLUJO_EFECTIVO,
          LEFT(ISNULL(CAST(M.U_PATRIMONIO_NETO AS VARCHAR(MAX)), ''), 50) as U_PATRIMONIO_NETO,
          LEFT(ISNULL(CAST(M.U_REP_REF AS VARCHAR(MAX)), ''), 100) as U_REP_REF
        FROM ${conjunto}.MAYOR M
        INNER JOIN ${conjunto}.ASIENTO_MAYORIZADO A ON M.ASIENTO = A.ASIENTO
        INNER JOIN ${conjunto}.NIT N ON M.NIT = N.NIT
        INNER JOIN ${conjunto}.CUENTA_CONTABLE CC ON CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'
        INNER JOIN ${conjunto}.CENTRO_COSTO C ON C.CENTRO_COSTO = M.CENTRO_COSTO
        WHERE A.CONTABILIDAD IN ('F', 'A')
        AND A.FECHA BETWEEN '${fechaInicio.toISOString()}' AND '${fechaFin.toISOString()}'
      `;

        // Ejecutar el query de inserción
        await exactusSequelize.query(query, { type: QueryTypes.INSERT });
        
        // Registrar la tabla en el caché
        this.registerCachedTable(conjunto, usuario, fechaInicio, fechaFin, tableName);
      }

      // Obtener el total de registros
      const totalResult = await exactusSequelize.query(
        `SELECT COUNT(*) as total FROM ${conjunto}.${tableName} WHERE USUARIO = '${usuario}'`,
        { type: QueryTypes.SELECT }
      );
      const total = (totalResult[0] as any).total;

      // Consultar los datos con paginación usando la tabla temporal
      const selectQuery = `
        SELECT 
          USUARIO, CUENTA_CONTABLE, DESCRIPCION_CUENTA_CONTABLE, ASIENTO, TIPO,
          DOCUMENTO, REFERENCIA, DEBITO_LOCAL, DEBITO_DOLAR, CREDITO_LOCAL,
          CREDITO_DOLAR, CENTRO_COSTO, DESCRIPCION_CENTRO_COSTO, TIPO_ASIENTO,
          FECHA, ACEPTA_DATOS, CONSECUTIVO, NIT, RAZON_SOCIAL, FUENTE,
          NOTAS, U_FLUJO_EFECTIVO, U_PATRIMONIO_NETO, U_REP_REF
        FROM ${conjunto}.${tableName}
        WHERE USUARIO = '${usuario}'
        ORDER BY FECHA ASC, ASIENTO ASC
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY
      `;

      const [movimientos] = await exactusSequelize.query(selectQuery);

      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        success: true,
        data: movimientos as MovimientoContable[],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev
        },
        message: `Reporte generado exitosamente con ${total} registros`
      };
    } catch (error) {
      console.error('Error al generar reporte de movimientos:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: `Error al generar reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  async obtenerMovimientosPorUsuario(
    conjunto: string,
    usuario: string,
    page: number = 1,
    limit: number = 100
  ): Promise<MovimientoContableResponse> {
    try {
      const offset = (page - 1) * limit;
      
      // Buscar tabla temporal existente en caché
      let tableName = this.findCachedTable(conjunto, usuario, new Date('1900-01-01'), new Date('2100-12-31'));
      
      if (!tableName) {
        // Si no hay tabla en caché, usar la tabla original
        const MovimientoContableModel = DynamicModelFactory.createMovimientoContableModel(conjunto);
        const total = await MovimientoContableModel.count({
          where: {
            USUARIO: usuario
          }
        });

        const movimientos = await MovimientoContableModel.findAll({
          attributes: [
            'USUARIO', 'CUENTA_CONTABLE', 'DESCRIPCION_CUENTA_CONTABLE', 'ASIENTO', 'TIPO',
            'DOCUMENTO', 'REFERENCIA', 'DEBITO_LOCAL', 'DEBITO_DOLAR', 'CREDITO_LOCAL',
            'CREDITO_DOLAR', 'CENTRO_COSTO', 'DESCRIPCION_CENTRO_COSTO', 'TIPO_ASIENTO',
            'FECHA', 'ACEPTA_DATOS', 'CONSECUTIVO', 'NIT', 'RAZON_SOCIAL', 'FUENTE',
            'NOTAS', 'U_FLUJO_EFECTIVO', 'U_PATRIMONIO_NETO', 'U_REP_REF'
          ],
          where: {
            USUARIO: usuario
          },
          order: [['FECHA', 'DESC'], ['ASIENTO', 'ASC']],
          limit,
          offset,
        });

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return {
          success: true,
          data: movimientos.map(movimiento => movimiento.toJSON() as MovimientoContable),
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext,
            hasPrev
          },
          message: `Movimientos obtenidos exitosamente: ${movimientos.length} de ${total} registros`
        };
      }

      // Usar tabla temporal en caché
      console.log(`♻️ Usando tabla temporal en caché: ${tableName}`);
      
      // Obtener el total de registros
      const totalResult = await exactusSequelize.query(
        `SELECT COUNT(*) as total FROM ${conjunto}.${tableName} WHERE USUARIO = '${usuario}'`,
        { type: QueryTypes.SELECT }
      );
      const total = (totalResult[0] as any).total;

      // Consultar los datos con paginación
      const selectQuery = `
        SELECT 
          USUARIO, CUENTA_CONTABLE, DESCRIPCION_CUENTA_CONTABLE, ASIENTO, TIPO,
          DOCUMENTO, REFERENCIA, DEBITO_LOCAL, DEBITO_DOLAR, CREDITO_LOCAL,
          CREDITO_DOLAR, CENTRO_COSTO, DESCRIPCION_CENTRO_COSTO, TIPO_ASIENTO,
          FECHA, ACEPTA_DATOS, CONSECUTIVO, NIT, RAZON_SOCIAL, FUENTE,
          NOTAS, U_FLUJO_EFECTIVO, U_PATRIMONIO_NETO, U_REP_REF
        FROM ${conjunto}.${tableName}
        WHERE USUARIO = '${usuario}'
        ORDER BY FECHA DESC, ASIENTO ASC
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY
      `;

      const [movimientos] = await exactusSequelize.query(selectQuery);

      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        success: true,
        data: movimientos as MovimientoContable[],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev
        },
        message: `Movimientos obtenidos exitosamente: ${movimientos.length} de ${total} registros`
      };
    } catch (error) {
      console.error('Error al obtener movimientos por usuario:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: `Error al obtener movimientos: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  async obtenerMovimientosPorCentroCosto(
    conjunto: string,
    centroCosto: string,
    page: number = 1,
    limit: number = 100
  ): Promise<MovimientoContableResponse> {
    try {
      const offset = (page - 1) * limit;
      
      const MovimientoContableModel = DynamicModelFactory.createMovimientoContableModel(conjunto);
      
      // Obtener el total de registros
      const total = await MovimientoContableModel.count({
        where: {
          CENTRO_COSTO: centroCosto
        }
      });

      const movimientos = await MovimientoContableModel.findAll({
        attributes: [
          'USUARIO', 'CUENTA_CONTABLE', 'DESCRIPCION_CUENTA_CONTABLE', 'ASIENTO', 'TIPO',
          'DOCUMENTO', 'REFERENCIA', 'DEBITO_LOCAL', 'DEBITO_DOLAR', 'CREDITO_LOCAL',
          'CREDITO_DOLAR', 'CENTRO_COSTO', 'DESCRIPCION_CENTRO_COSTO', 'TIPO_ASIENTO',
          'FECHA', 'ACEPTA_DATOS', 'CONSECUTIVO', 'NIT', 'RAZON_SOCIAL', 'FUENTE',
          'NOTAS', 'U_FLUJO_EFECTIVO', 'U_PATRIMONIO_NETO', 'U_REP_REF'
        ],
        where: {
          CENTRO_COSTO: centroCosto
        },
        order: [['FECHA', 'DESC'], ['ASIENTO', 'ASC']],
        limit,
        offset,
      });

      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        success: true,
        data: movimientos.map(movimiento => movimiento.toJSON() as MovimientoContable),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev
        },
        message: `Movimientos obtenidos exitosamente: ${movimientos.length} de ${total} registros`
      };
    } catch (error) {
      console.error('Error al obtener movimientos por centro de costo:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: `Error al obtener movimientos: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  async obtenerMovimientosPorCuentaContable(
    conjunto: string,
    cuentaContable: string,
    page: number = 1,
    limit: number = 100
  ): Promise<MovimientoContableResponse> {
    try {
      const offset = (page - 1) * limit;
      
      const MovimientoContableModel = DynamicModelFactory.createMovimientoContableModel(conjunto);
      
      // Obtener el total de registros
      const total = await MovimientoContableModel.count({
        where: {
          CUENTA_CONTABLE: cuentaContable
        }
      });

      const movimientos = await MovimientoContableModel.findAll({
        attributes: [
          'USUARIO', 'CUENTA_CONTABLE', 'DESCRIPCION_CUENTA_CONTABLE', 'ASIENTO', 'TIPO',
          'DOCUMENTO', 'REFERENCIA', 'DEBITO_LOCAL', 'DEBITO_DOLAR', 'CREDITO_LOCAL',
          'CREDITO_DOLAR', 'CENTRO_COSTO', 'DESCRIPCION_CENTRO_COSTO', 'TIPO_ASIENTO',
          'FECHA', 'ACEPTA_DATOS', 'CONSECUTIVO', 'NIT', 'RAZON_SOCIAL', 'FUENTE',
          'NOTAS', 'U_FLUJO_EFECTIVO', 'U_PATRIMONIO_NETO', 'U_REP_REF'
        ],
        where: {
          CUENTA_CONTABLE: cuentaContable
        },
        order: [['FECHA', 'DESC'], ['ASIENTO', 'ASC']],
        limit,
        offset,
      });

      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        success: true,
        data: movimientos.map(movimiento => movimiento.toJSON() as MovimientoContable),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev
        },
        message: `Movimientos obtenidos exitosamente: ${movimientos.length} de ${total} registros`
      };
    } catch (error) {
      console.error('Error al obtener movimientos por cuenta contable:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: `Error al obtener movimientos: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  async getMovimientosCount(
    conjunto: string,
    usuario: string,
    fechaInicio?: Date,
    fechaFin?: Date
  ): Promise<number> {
    try {
      const MovimientoContableModel = DynamicModelFactory.createMovimientoContableModel(conjunto);
      const whereClause: any = {
        USUARIO: usuario
      };

      if (fechaInicio && fechaFin) {
        whereClause.FECHA = {
          [Op.between]: [fechaInicio, fechaFin]
        };
      }

      return await MovimientoContableModel.count({
        where: whereClause
      });
    } catch (error) {
      console.error('Error al obtener conteo de movimientos:', error);
      throw new Error('Error al obtener conteo de movimientos');
    }
  }

  async exportarExcel(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    limit: number = 1000
  ): Promise<Buffer> {
    try {
      console.log(`Generando Excel de movimientos contables para conjunto ${conjunto}, usuario ${usuario}`);
      
      // Buscar tabla temporal existente en caché
      let tableName = this.findCachedTable(conjunto, usuario, fechaInicio, fechaFin);
      
      if (!tableName) {
        // Si no hay tabla en caché, generar el reporte primero
        const result = await this.generarReporteMovimientos(
          conjunto,
          usuario,
          fechaInicio,
          fechaFin,
          1,
          limit
        );
        
        // Buscar la tabla después de generar el reporte
        tableName = this.findCachedTable(conjunto, usuario, fechaInicio, fechaFin);
      }

      if (!tableName) {
        throw new Error('No se pudo encontrar la tabla temporal para la exportación');
      }

      console.log(`📊 Usando tabla temporal para Excel: ${tableName}`);
      
      // Obtener todos los datos de la tabla temporal para el Excel
      const selectQuery = `
        SELECT 
          USUARIO, CUENTA_CONTABLE, DESCRIPCION_CUENTA_CONTABLE, ASIENTO, TIPO,
          DOCUMENTO, REFERENCIA, DEBITO_LOCAL, DEBITO_DOLAR, CREDITO_LOCAL,
          CREDITO_DOLAR, CENTRO_COSTO, DESCRIPCION_CENTRO_COSTO, TIPO_ASIENTO,
          FECHA, ACEPTA_DATOS, CONSECUTIVO, NIT, RAZON_SOCIAL, FUENTE,
          NOTAS, U_FLUJO_EFECTIVO, U_PATRIMONIO_NETO, U_REP_REF
        FROM ${conjunto}.${tableName}
        WHERE USUARIO = '${usuario}'
        ORDER BY FECHA ASC, ASIENTO ASC
        ${limit > 0 ? `OFFSET 0 ROWS FETCH NEXT ${limit} ROWS ONLY` : ''}
      `;

      const [movimientos] = await exactusSequelize.query(selectQuery);
      const result = {
        success: true,
        data: movimientos as MovimientoContable[],
        pagination: {
          page: 1,
          limit: limit,
          total: movimientos.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        },
        message: `Reporte generado exitosamente con ${movimientos.length} registros`
      };

      // Preparar los datos para Excel
      const excelData = result.data.map(item => ({
        'Usuario': item.USUARIO || '',
        'Cuenta Contable': item.CUENTA_CONTABLE || '',
        'Descripción Cuenta': item.DESCRIPCION_CUENTA_CONTABLE || '',
        'Asiento': item.ASIENTO || '',
        'Tipo': item.TIPO || '',
        'Documento': item.DOCUMENTO || '',
        'Referencia': item.REFERENCIA || '',
        'Débito Local': Number(item.DEBITO_LOCAL || 0),
        'Débito Dólar': Number(item.DEBITO_DOLAR || 0),
        'Crédito Local': Number(item.CREDITO_LOCAL || 0),
        'Crédito Dólar': Number(item.CREDITO_DOLAR || 0),
        'Centro Costo': item.CENTRO_COSTO || '',
        'Descripción Centro Costo': item.DESCRIPCION_CENTRO_COSTO || '',
        'Tipo Asiento': item.TIPO_ASIENTO || '',
        'Fecha': item.FECHA ? new Date(item.FECHA).toLocaleDateString('es-ES') : '',
        'Acepta Datos': item.ACEPTA_DATOS ? 'Sí' : 'No',
        'Consecutivo': item.CONSECUTIVO || '',
        'NIT': item.NIT || '',
        'Razón Social': item.RAZON_SOCIAL || '',
        'Fuente': item.FUENTE || '',
        'Notas': item.NOTAS || ''
      }));

      // Calcular totales
      const totalDebitoLocal = result.data.reduce((sum, item) => sum + (item.DEBITO_LOCAL || 0), 0);
      const totalDebitoDolar = result.data.reduce((sum, item) => sum + (item.DEBITO_DOLAR || 0), 0);
      const totalCreditoLocal = result.data.reduce((sum, item) => sum + (item.CREDITO_LOCAL || 0), 0);
      const totalCreditoDolar = result.data.reduce((sum, item) => sum + (item.CREDITO_DOLAR || 0), 0);

      // Agregar fila de totales
      const totalRow = {
        'Usuario': '',
        'Cuenta Contable': '',
        'Descripción Cuenta': '',
        'Asiento': '',
        'Tipo': '',
        'Documento': '',
        'Referencia': '',
        'Débito Local': totalDebitoLocal,
        'Débito Dólar': totalDebitoDolar,
        'Crédito Local': totalCreditoLocal,
        'Crédito Dólar': totalCreditoDolar,
        'Centro Costo': '',
        'Descripción Centro Costo': '',
        'Tipo Asiento': '',
        'Fecha': '',
        'Acepta Datos': '',
        'Consecutivo': '',
        'NIT': '',
        'Razón Social': '',
        'Fuente': '',
        'Notas': 'TOTAL GENERAL'
      };

      // Agregar fila vacía antes del total
      const emptyRow = {
        'Usuario': '',
        'Cuenta Contable': '',
        'Descripción Cuenta': '',
        'Asiento': '',
        'Tipo': '',
        'Documento': '',
        'Referencia': '',
        'Débito Local': '',
        'Débito Dólar': '',
        'Crédito Local': '',
        'Crédito Dólar': '',
        'Centro Costo': '',
        'Descripción Centro Costo': '',
        'Tipo Asiento': '',
        'Fecha': '',
        'Acepta Datos': '',
        'Consecutivo': '',
        'NIT': '',
        'Razón Social': '',
        'Fuente': '',
        'Notas': ''
      };

      // Combinar datos con totales
      const finalData = [...excelData, emptyRow, totalRow];

      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Crear la hoja principal con los datos
      const worksheet = XLSX.utils.json_to_sheet(finalData);
      
      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 15 }, // Usuario
        { wch: 20 }, // Cuenta Contable
        { wch: 30 }, // Descripción Cuenta
        { wch: 15 }, // Asiento
        { wch: 10 }, // Tipo
        { wch: 15 }, // Documento
        { wch: 30 }, // Referencia
        { wch: 15 }, // Débito Local
        { wch: 15 }, // Débito Dólar
        { wch: 15 }, // Crédito Local
        { wch: 15 }, // Crédito Dólar
        { wch: 15 }, // Centro Costo
        { wch: 30 }, // Descripción Centro Costo
        { wch: 15 }, // Tipo Asiento
        { wch: 12 }, // Fecha
        { wch: 12 }, // Acepta Datos
        { wch: 12 }, // Consecutivo
        { wch: 15 }, // NIT
        { wch: 30 }, // Razón Social
        { wch: 15 }, // Fuente
        { wch: 40 }  // Notas
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimientos Contables');
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log('Archivo Excel de movimientos contables generado exitosamente');
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel de movimientos contables:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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
