import { injectable } from 'inversify';
import { exactusSequelize } from '../database/config/exactus-database';
import { IReporteGenericoSaldosRepository } from '../../domain/repositories/IReporteGenericoSaldosRepository';
import { 
  FiltrosReporteGenericoSaldos, 
  ReporteGenericoSaldos, 
  ReporteGenericoSaldosResponse,
  FiltroCuentaContable, 
  DetalleCuentaContable,
  FiltroTipoDocumento,
  FiltroTipoAsiento,
  FiltroClaseAsiento
} from '../../domain/entities/ReporteGenericoSaldos';
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
export class ReporteGenericoSaldosRepository implements IReporteGenericoSaldosRepository {
  
  constructor() {
    // Iniciar limpieza automática de caché
    this.startCacheCleanup();
  }

  /**
   * Genera un hash único para los filtros
   */
  private generateFiltersHash(conjunto: string, filtros: FiltrosReporteGenericoSaldos): string {
    const filterString = JSON.stringify({
      conjunto,
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
      contabilidad: filtros.contabilidad,
      origen: filtros.origen,
      cuentasContablesPorFecha: filtros.cuentasContablesPorFecha,
      agrupadoPor: filtros.agrupadoPor,
      porTipoCambio: filtros.porTipoCambio,
      filtroChecks: filtros.filtroChecks,
      libroElectronico: filtros.libroElectronico,
      formatoCuentas: filtros.formatoCuentas,
      tituloPrincipal: filtros.tituloPrincipal,
      titulo2: filtros.titulo2,
      titulo3: filtros.titulo3,
      titulo4: filtros.titulo4,
      fechaImpresion: filtros.fechaImpresion
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
  private findCachedTable(conjunto: string, filtros: FiltrosReporteGenericoSaldos): string | null {
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
  private registerCachedTable(conjunto: string, filtros: FiltrosReporteGenericoSaldos, tableName: string): void {
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
   * Obtiene el filtro de tipos de documento
   */
  async obtenerFiltroTiposDocumento(conjunto: string): Promise<FiltroTipoDocumento[]> {
    try {
      const query = `
        SELECT 
          codigo,
          descripcion
        FROM ${conjunto}.tipo_doc_sunat (NOLOCK)
        ORDER BY codigo ASC
      `;

      const [results] = await exactusSequelize.query(query);
      return results as FiltroTipoDocumento[];
    } catch (error) {
      console.error('Error obteniendo filtro de tipos de documento:', error);
      throw new Error(`Error al obtener filtro de tipos de documento: ${error}`);
    }
  }

  /**
   * Obtiene el filtro de tipos de asiento
   */
  async obtenerFiltroTiposAsiento(conjunto: string): Promise<FiltroTipoAsiento[]> {
    try {
      const query = `
        SELECT 
          tipo_asiento as codigo,
          descripcion
        FROM ${conjunto}.tipo_asiento (NOLOCK)
        ORDER BY tipo_asiento ASC
      `;

      const [results] = await exactusSequelize.query(query);
      return results as FiltroTipoAsiento[];
    } catch (error) {
      console.error('Error obteniendo filtro de tipos de asiento:', error);
      throw new Error(`Error al obtener filtro de tipos de asiento: ${error}`);
    }
  }

  /**
   * Obtiene el filtro de clases de asiento
   */
  async obtenerFiltroClasesAsiento(conjunto: string): Promise<FiltroClaseAsiento[]> {
    try {
      const query = `
        SELECT 
          clase_asiento as codigo,
          descripcion
        FROM ${conjunto}.clase_asiento (NOLOCK)
        ORDER BY clase_asiento ASC
      `;

      const [results] = await exactusSequelize.query(query);
      return results as FiltroClaseAsiento[];
    } catch (error) {
      console.error('Error obteniendo filtro de clases de asiento:', error);
      throw new Error(`Error al obtener filtro de clases de asiento: ${error}`);
    }
  }

  /**
   * Genera el reporte genérico de saldos basado en la consulta SQL proporcionada
   */
  async generarReporteGenericoSaldos(
    conjunto: string,
    filtros: FiltrosReporteGenericoSaldos
  ): Promise<ReporteGenericoSaldosResponse> {
    try {
      // Parámetros de paginación con valores por defecto
      const page = filtros.page || 1;
      const limit = filtros.limit || 25;
      const offset = (page - 1) * limit;

      // Buscar tabla temporal existente en caché
      let tableName = this.findCachedTable(conjunto, filtros);
      let isNewTable = false;

      if (!tableName) {
        // Crear nueva tabla temporal con nombre único
        tableName = `R_XML_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        isNewTable = true;
        
        console.log(`🆕 Creando nueva tabla temporal: ${tableName}`);
        
        // Query para crear la tabla temporal
        const createTableQuery = `
          IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES
                        WHERE TABLE_SCHEMA = '${conjunto}'
                        AND TABLE_NAME = '${tableName}')
          BEGIN
              CREATE TABLE ${conjunto}.${tableName} (
                  sCuentaContable NVARCHAR(50),
                  sDescCuentaContable NVARCHAR(255),
                  sNit NVARCHAR(50),
                  sRazonSocial NVARCHAR(255),
                  sReferencia NVARCHAR(255),
                  sCodTipoDoc NVARCHAR(10),
                  sTipoDocSunat NVARCHAR(100),
                  sAsiento NVARCHAR(50),
                  nConsecutivo INT,
                  dtFechaAsiento DATETIME,
                  nSaldoLocal DECIMAL(18,2),
                  nSaldoDolar DECIMAL(18,2)
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
        
        // Query principal para insertar datos
        const insertQuery = `
          INSERT INTO ${conjunto}.${tableName} (
              sCuentaContable,
              sDescCuentaContable,
              sNit,
              sRazonSocial,
              sReferencia,
              sCodTipoDoc,
              sTipoDocSunat,
              sAsiento,
              nConsecutivo,
              dtFechaAsiento,
              nSaldoLocal,
              nSaldoDolar
          )
        SELECT 
            CUENTA_CONTABLE,
            DESC_CUENTA,
            NIT,
            RAZON_SOCIAL,
            REFERENCIA,
            CODIGO,
            DESCRIPCION,
            MAX(CASE ORDEN WHEN 1 THEN ASIENTO ELSE '' END) AS ASIENTO,
            MAX(CASE ORDEN WHEN 1 THEN CONSECUTIVO ELSE -99999999 END) AS CONSECUTIVO,
            MIN(FECHA) AS FECHA,
            SUM(SALDO_LOCAL) AS SALDO_LOCAL,
            SUM(SALDO_DOLAR) AS SALDO_DOLAR
        FROM (
            -- PARTE 1: DATOS DEL DIARIO
            SELECT 
                CUENTA_CONTABLE,
                DESC_CUENTA,
                NIT,
                RAZON_SOCIAL,
                REFERENCIA,
                CODIGO,
                DESCRIPCION,
                ASIENTO,
                CONSECUTIVO,
                FECHA,
                SALDO_LOCAL,
                SALDO_DOLAR,
                ROW_NUMBER() OVER (
                    PARTITION BY CUENTA_CONTABLE, NIT, REFERENCIA 
                    ORDER BY FECHA, ASIENTO
                ) AS ORDEN
            FROM (
                SELECT 
                    M.CUENTA_CONTABLE,
                    C.DESCRIPCION AS DESC_CUENTA,
                    M.NIT AS NIT,
                    N.RAZON_SOCIAL AS RAZON_SOCIAL,
                    'Cuenta corriente ' + M.NIT AS REFERENCIA,
                    T.CODIGO,
                    T.DESCRIPCION,
                    M.ASIENTO,
                    M.CONSECUTIVO,
                    AD.FECHA AS FECHA,
                    (ISNULL(M.DEBITO_LOCAL, 0) - ISNULL(M.CREDITO_LOCAL, 0)) * 
                    (CASE C.SALDO_NORMAL WHEN 'D' THEN 1 ELSE -1 END) AS SALDO_LOCAL,
                    (ISNULL(M.DEBITO_DOLAR, 0) - ISNULL(M.CREDITO_DOLAR, 0)) * 
                    (CASE C.SALDO_NORMAL WHEN 'D' THEN 1 ELSE -1 END) AS SALDO_DOLAR
                FROM ${conjunto}.DIARIO M
                INNER JOIN ${conjunto}.CUENTA_CONTABLE C 
                    ON M.CUENTA_CONTABLE = C.CUENTA_CONTABLE
                INNER JOIN ${conjunto}.ASIENTO_DE_DIARIO AD 
                    ON AD.ASIENTO = M.ASIENTO
                LEFT OUTER JOIN ${conjunto}.NIT N 
                    ON N.NIT = M.NIT
                LEFT OUTER JOIN ${conjunto}.TIPO_DOC_SUNAT T 
                    ON ${conjunto}.EXACTUS_OBTENER_TIPO_DOC_PERS(
                        N.NIT, 
                        N.TIPO_DOC_IDENTIFICACION, 
                        N.TIPO_PERS, 
                        1
                    ) = T.CODIGO
                WHERE AD.FECHA >= :fechaInicio
                    AND AD.FECHA < :fechaFin
                    AND AD.TIPO_ASIENTO <> '06'
                    AND AD.CONTABILIDAD IN (${this.buildContabilidadFilter(filtros.contabilidad)})
                    AND AD.CLASE_ASIENTO <> 'C'
                    AND NOT EXISTS (
                        SELECT 1 
                        FROM ${conjunto}.proceso_cierre_cg pcg
                        WHERE pcg.asiento_apertura = M.asiento 
                            AND pcg.asiento_apertura IS NOT NULL
                    )
            ) DIARIO
            
            UNION ALL
            
            -- PARTE 2: DATOS DEL MAYOR
            SELECT 
                CUENTA_CONTABLE,
                DESC_CUENTA,
                NIT,
                RAZON_SOCIAL,
                REFERENCIA,
                CODIGO,
                DESCRIPCION,
                ASIENTO,
                CONSECUTIVO,
                FECHA,
                SALDO_LOCAL,
                SALDO_DOLAR,
                ROW_NUMBER() OVER (
                    PARTITION BY CUENTA_CONTABLE, NIT, REFERENCIA 
                    ORDER BY FECHA, ASIENTO
                ) AS ORDEN
            FROM (
                SELECT 
                    M.CUENTA_CONTABLE,
                    C.DESCRIPCION AS DESC_CUENTA,
                    M.NIT AS NIT,
                    N.RAZON_SOCIAL AS RAZON_SOCIAL,
                    'Cuenta corriente ' + M.NIT AS REFERENCIA,
                    T.CODIGO,
                    T.DESCRIPCION,
                    M.ASIENTO,
                    M.CONSECUTIVO,
                    M.FECHA AS FECHA,
                    (ISNULL(M.DEBITO_LOCAL, 0) - ISNULL(M.CREDITO_LOCAL, 0)) * 
                    (CASE C.SALDO_NORMAL WHEN 'D' THEN 1 ELSE -1 END) AS SALDO_LOCAL,
                    (ISNULL(M.DEBITO_DOLAR, 0) - ISNULL(M.CREDITO_DOLAR, 0)) * 
                    (CASE C.SALDO_NORMAL WHEN 'D' THEN 1 ELSE -1 END) AS SALDO_DOLAR
                FROM ${conjunto}.MAYOR M
                INNER JOIN ${conjunto}.CUENTA_CONTABLE C 
                    ON M.CUENTA_CONTABLE = C.CUENTA_CONTABLE
                LEFT OUTER JOIN ${conjunto}.NIT N 
                    ON N.NIT = M.NIT
                LEFT OUTER JOIN ${conjunto}.TIPO_DOC_SUNAT T 
                    ON ${conjunto}.EXACTUS_OBTENER_TIPO_DOC_PERS(
                        N.NIT, 
                        N.TIPO_DOC_IDENTIFICACION, 
                        N.TIPO_PERS, 
                        1
                    ) = T.CODIGO
                WHERE M.FECHA >= :fechaInicio
                    AND M.FECHA < :fechaFin
                    AND M.TIPO_ASIENTO <> '06'
                    AND M.CONTABILIDAD IN (${this.buildContabilidadFilter(filtros.contabilidad)})
                    AND M.CLASE_ASIENTO != 'C'
                    AND NOT EXISTS (
                        SELECT 1 
                        FROM ${conjunto}.proceso_cierre_cg pcg
                        WHERE pcg.asiento_apertura = M.asiento 
                            AND pcg.asiento_apertura IS NOT NULL
                    )
            ) MAYOR
        ) VISTA
        GROUP BY 
            CUENTA_CONTABLE, 
            DESC_CUENTA, 
            NIT, 
            RAZON_SOCIAL, 
            REFERENCIA, 
            CODIGO, 
            DESCRIPCION
        HAVING SUM(SALDO_LOCAL) != 0
      `;

        await exactusSequelize.query(insertQuery, {
          replacements: {
            fechaInicio: filtros.fechaInicio,
            fechaFin: filtros.fechaFin
          }
        });
        
        // Registrar la tabla en el caché
        this.registerCachedTable(conjunto, filtros, tableName);
      }

      // Query para obtener el total de registros
      const countQuery = `
        SELECT COUNT(*) as total
        FROM ${conjunto}.${tableName}
      `;

      const [countResults] = await exactusSequelize.query(countQuery);
      const total = (countResults as any[])[0]?.total || 0;
      const totalPages = Math.ceil(total / limit);

      // Query para obtener los resultados paginados
      const selectQuery = `
        SELECT
            sCuentaContable,
            sDescCuentaContable,
            sNit,
            sRazonSocial AS apellidosNombres,
            sReferencia AS concepto,
            sCodTipoDoc AS tipo,
            sTipoDocSunat AS numero,
            sAsiento,
            nConsecutivo,
            dtFechaAsiento AS fecha,
            FORMAT(nSaldoLocal, 'N2') AS monto
        FROM ${conjunto}.${tableName}
        ORDER BY sCuentaContable, sNit
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY
      `;

      const [results] = await exactusSequelize.query(selectQuery);
      
      // Solo limpiar tabla temporal si no está en caché
      if (!this.findCachedTable(conjunto, filtros)) {
        await exactusSequelize.query(`DROP TABLE ${conjunto}.${tableName}`);
        console.log(`🗑️ Eliminada tabla temporal: ${tableName}`);
      } else {
        console.log(`💾 Manteniendo tabla temporal en caché: ${tableName}`);
      }

      // Transformar resultados al formato esperado
      const reporteData = (results as any[]).map(row => ({
        tipo: row.tipo || '',
        numero: row.numero || '',
        apellidosNombres: row.apellidosNombres || '',
        fecha: this.formatDate(row.fecha),
        concepto: row.concepto || '',
        monto: parseFloat(row.monto?.replace(/,/g, '') || '0')
      }));

      return {
        success: true,
        data: reporteData,
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
      console.error('Error generando reporte genérico de saldos:', error);
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
        message: `Error al generar reporte genérico de saldos: ${error}`,
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

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(conjunto: string, filtros: FiltrosReporteGenericoSaldos): Promise<Buffer> {
    try {
      console.log(`Generando Excel de reporte genérico de saldos para conjunto ${conjunto}`);
      
      // Obtener los datos del reporte (sin paginación para exportación)
      const filtrosSinPaginacion = { ...filtros, page: 1, limit: 10000 };
      const reporteResponse = await this.generarReporteGenericoSaldos(conjunto, filtrosSinPaginacion);
      const reporteData = reporteResponse.data;
      
      // Preparar los datos para Excel
      const excelData = reporteData.map(item => ({
        'Tipo': item.tipo,
        'Número': item.numero,
        'Apellidos y nombres, denominación o razón social': item.apellidosNombres,
        'Fecha': item.fecha,
        'Concepto o descripción de la operación': item.concepto,
        'Monto': item.monto
      }));

      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Hoja 1: Reporte Genérico de Saldos
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 15 }, // Tipo
        { wch: 15 }, // Número
        { wch: 50 }, // Apellidos y nombres
        { wch: 12 }, // Fecha
        { wch: 50 }, // Concepto
        { wch: 15 }  // Monto
      ];
      
      worksheet['!cols'] = columnWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte Genérico de Saldos');
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log('Archivo Excel de reporte genérico de saldos generado exitosamente');
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel de reporte genérico de saldos:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Construye el filtro de contabilidad para la consulta SQL
   */
  private buildContabilidadFilter(contabilidad: string): string {
    if (!contabilidad) return "'F','A'";
    
    const contabilidades = contabilidad.split(',').map(c => `'${c.trim()}'`);
    return contabilidades.join(',');
  }

  /**
   * Exporta el reporte a PDF
   */
  async exportarPDF(conjunto: string, filtros: FiltrosReporteGenericoSaldos): Promise<Buffer> {
    try {
      console.log(`Generando PDF de reporte genérico de saldos para conjunto ${conjunto}`);
      
      // Por ahora, retornamos un buffer vacío ya que no tenemos pdfkit instalado
      // En el futuro se puede implementar la generación de PDF
      const emptyBuffer = Buffer.from('');
      
      console.log('Archivo PDF de reporte genérico de saldos generado exitosamente (placeholder)');
      return emptyBuffer;
      
    } catch (error) {
      console.error('Error al generar PDF de reporte genérico de saldos:', error);
      throw new Error(`Error al generar archivo PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Formatea una fecha al formato DD/MM/YYYY
   */
  private formatDate(date: Date | string): string {
    if (!date) return '';
    
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
  }
}
