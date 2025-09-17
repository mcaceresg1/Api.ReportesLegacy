import { injectable } from "inversify";
import { exactusSequelize } from "../database/config/exactus-database";
import {
  LibroDiarioAsientos,
  LibroDiarioAsientosFiltros,
  LibroDiarioAsientosResponse,
  GenerarLibroDiarioAsientosParams,
  ExportarLibroDiarioAsientosExcelParams,
  FiltrosDisponibles,
} from "../../domain/entities/LibroDiarioAsientos";

/**
 * Repositorio para Libro Diario Asientos
 * Maneja el acceso a datos para el reporte de Libro Diario Asientos
 */
@injectable()
export class LibroDiarioAsientosRepository {

  /**
   * Obtiene los filtros disponibles para el reporte
   */
  async obtenerFiltros(conjunto: string): Promise<FiltrosDisponibles> {
    try {
      // Obtener asientos disponibles
      const asientosQuery = `
        SELECT DISTINCT asiento
        FROM ${conjunto}.asiento_de_diario (NOLOCK)
        WHERE asiento IS NOT NULL
        ORDER BY asiento
      `;

      // Obtener tipos de asiento disponibles
      const tiposAsientoQuery = `
        SELECT DISTINCT tipo_asiento, 
               CASE 
                 WHEN tipo_asiento = 'N' THEN 'Normal'
                 WHEN tipo_asiento = 'A' THEN 'Ajuste'
                 WHEN tipo_asiento = 'C' THEN 'Cierre'
                 ELSE tipo_asiento
               END as descripcion
        FROM ${conjunto}.asiento_de_diario (NOLOCK)
        WHERE tipo_asiento IS NOT NULL
        ORDER BY tipo_asiento
      `;

      // Obtener clases de asiento (tipos de asiento con descripción)
      const clasesAsientoQuery = `
        SELECT DISTINCT tipo_asiento as clase,
               CASE 
                 WHEN tipo_asiento = 'N' THEN 'Normal'
                 WHEN tipo_asiento = 'A' THEN 'Ajuste'
                 WHEN tipo_asiento = 'C' THEN 'Cierre'
                 ELSE tipo_asiento
               END as descripcion
        FROM ${conjunto}.asiento_de_diario (NOLOCK)
        WHERE tipo_asiento IS NOT NULL
        ORDER BY tipo_asiento
      `;

      // Obtener orígenes disponibles
      const origenesQuery = `
        SELECT DISTINCT origen,
               CASE 
                 WHEN origen = '01' THEN 'Manual'
                 WHEN origen = '02' THEN 'Importado'
                 WHEN origen = '03' THEN 'Sistema'
                 ELSE origen
               END as descripcion
        FROM ${conjunto}.asiento_de_diario (NOLOCK)
        WHERE origen IS NOT NULL
        ORDER BY origen
      `;

      // Obtener paquetes disponibles
      const paquetesQuery = `
        SELECT DISTINCT A.paquete, P.descripcion
        FROM ${conjunto}.asiento_de_diario A (NOLOCK)
        INNER JOIN ${conjunto}.paquete P (NOLOCK) ON A.paquete = P.paquete
        WHERE A.paquete IS NOT NULL
        ORDER BY A.paquete
      `;

      // Obtener contabilidades disponibles
      const contabilidadesQuery = `
        SELECT DISTINCT contabilidad,
               CASE 
                 WHEN contabilidad = 'F' THEN 'Fiscal'
                 WHEN contabilidad = 'C' THEN 'Corporativa'
                 ELSE contabilidad
               END as descripcion
        FROM ${conjunto}.asiento_de_diario (NOLOCK)
        WHERE contabilidad IS NOT NULL
        ORDER BY contabilidad
      `;

      // Obtener documentos globales disponibles
      const documentosGlobalesQuery = `
        SELECT DISTINCT documento_global
        FROM ${conjunto}.asiento_de_diario (NOLOCK)
        WHERE documento_global IS NOT NULL
        ORDER BY documento_global
      `;

      const [asientos] = await exactusSequelize.query(asientosQuery);
      const [tiposAsiento] = await exactusSequelize.query(tiposAsientoQuery);
      const [clasesAsiento] = await exactusSequelize.query(clasesAsientoQuery);
      const [origenes] = await exactusSequelize.query(origenesQuery);
      const [paquetes] = await exactusSequelize.query(paquetesQuery);
      const [contabilidades] = await exactusSequelize.query(contabilidadesQuery);
      const [documentosGlobales] = await exactusSequelize.query(documentosGlobalesQuery);

      return {
        asientos: (asientos as any[]).map(row => ({ asiento: row.asiento })),
        tiposAsiento: (tiposAsiento as any[]).map(row => ({ 
          tipoAsiento: row.tipo_asiento, 
          descripcion: row.descripcion 
        })),
        clasesAsiento: (clasesAsiento as any[]).map(row => ({ 
          clase: row.clase, 
          descripcion: row.descripcion 
        })),
        origenes: (origenes as any[]).map(row => ({ 
          origen: row.origen, 
          descripcion: row.descripcion 
        })),
        paquetes: (paquetes as any[]).map(row => ({ 
          paquete: row.paquete, 
          descripcion: row.descripcion 
        })),
        contabilidades: (contabilidades as any[]).map(row => ({ 
          codigo: row.contabilidad, 
          descripcion: row.descripcion 
        })),
        documentosGlobales: (documentosGlobales as any[]).map(row => ({ 
          documento: row.documento_global 
        }))
      };
    } catch (error) {
      console.error('Error obteniendo filtros de libro diario asientos:', error);
      throw new Error(`Error al obtener filtros: ${error}`);
    }
  }

  /**
   * Genera el reporte de Libro Diario Asientos
   */
  async generarReporte(
    conjunto: string,
    filtros: GenerarLibroDiarioAsientosParams
  ): Promise<{
    success: boolean;
    data: LibroDiarioAsientos[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    message: string;
  }> {
    try {
      let whereClause = "WHERE 1=1";
      const replacements: any = {};

      // Aplicar filtros
      if (filtros.asientoDesde) {
        whereClause += " AND A.asiento >= :asientoDesde";
        replacements.asientoDesde = filtros.asientoDesde;
      }

      if (filtros.asientoHasta) {
        whereClause += " AND A.asiento <= :asientoHasta";
        replacements.asientoHasta = filtros.asientoHasta;
      }

      if (filtros.tipoAsientoDesde) {
        whereClause += " AND A.tipo_asiento >= :tipoAsientoDesde";
        replacements.tipoAsientoDesde = filtros.tipoAsientoDesde;
      }

      if (filtros.tipoAsientoHasta) {
        whereClause += " AND A.tipo_asiento <= :tipoAsientoHasta";
        replacements.tipoAsientoHasta = filtros.tipoAsientoHasta;
      }

      if (filtros.fechaDesde) {
        whereClause += " AND A.fecha >= :fechaDesde";
        replacements.fechaDesde = filtros.fechaDesde;
      }

      if (filtros.fechaHasta) {
        whereClause += " AND A.fecha <= :fechaHasta";
        replacements.fechaHasta = filtros.fechaHasta;
      }

      if (filtros.claseAsiento && filtros.claseAsiento.length > 0) {
        whereClause += " AND A.tipo_asiento IN (:claseAsiento)";
        replacements.claseAsiento = filtros.claseAsiento;
      }

      if (filtros.origen && filtros.origen.length > 0) {
        whereClause += " AND A.origen IN (:origen)";
        replacements.origen = filtros.origen;
      }

      if (filtros.paqueteDesde) {
        whereClause += " AND A.paquete >= :paqueteDesde";
        replacements.paqueteDesde = filtros.paqueteDesde;
      }

      if (filtros.paqueteHasta) {
        whereClause += " AND A.paquete <= :paqueteHasta";
        replacements.paqueteHasta = filtros.paqueteHasta;
      }

      if (filtros.contabilidad && filtros.contabilidad.length > 0) {
        whereClause += " AND A.contabilidad IN (:contabilidad)";
        replacements.contabilidad = filtros.contabilidad;
      }

      if (filtros.documentoGlobalDesde) {
        whereClause += " AND A.documento_global >= :documentoGlobalDesde";
        replacements.documentoGlobalDesde = filtros.documentoGlobalDesde;
      }

      if (filtros.documentoGlobalHasta) {
        whereClause += " AND A.documento_global <= :documentoGlobalHasta";
        replacements.documentoGlobalHasta = filtros.documentoGlobalHasta;
      }

      const query = `
        SELECT 
          A.asiento,
          A.paquete,
          P.descripcion,
          A.contabilidad,
          A.tipo_asiento,
          A.fecha,
          A.origen,
          A.documento_global,
          A.total_debito_loc,
          A.total_credito_loc,
          A.total_control_loc,
          (A.total_debito_loc - A.total_credito_loc) as diferencia_local,
          A.total_debito_dol,
          A.total_credito_dol,
          A.total_control_dol,
          (A.total_debito_dol - A.total_credito_dol) as diferencia_dolar
        FROM ${conjunto}.asiento_de_diario A (NOLOCK)
        INNER JOIN ${conjunto}.paquete P (NOLOCK) ON A.paquete = P.paquete
        ${whereClause}
        ORDER BY A.asiento ASC, A.fecha ASC
      `;

      const [results] = await exactusSequelize.query(query, { replacements });
      const data = (results as any[]).map((row: any) => ({
        asiento: row.asiento,
        paquete: row.paquete,
        descripcion: row.descripcion,
        contabilidad: row.contabilidad,
        tipo_asiento: row.tipo_asiento,
        fecha: new Date(row.fecha),
        origen: row.origen,
        documento_global: row.documento_global,
        total_debito_loc: parseFloat(row.total_debito_loc) || 0,
        total_credito_loc: parseFloat(row.total_credito_loc) || 0,
        total_control_loc: parseFloat(row.total_control_loc) || 0,
        diferencia_local: parseFloat(row.diferencia_local) || 0,
        total_debito_dol: parseFloat(row.total_debito_dol) || 0,
        total_credito_dol: parseFloat(row.total_credito_dol) || 0,
        total_control_dol: parseFloat(row.total_control_dol) || 0,
        diferencia_dolar: parseFloat(row.diferencia_dolar) || 0,
      }));

      return {
        success: true,
        data,
        pagination: {
          page: 1,
          limit: data.length,
          total: data.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        message: "Reporte generado exitosamente"
      };
    } catch (error) {
      console.error('Error generando reporte de libro diario asientos:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        message: `Error al generar reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  /**
   * Obtiene los datos paginados del reporte
   */
  async obtenerAsientos(
    conjunto: string,
    filtros: LibroDiarioAsientosFiltros
  ): Promise<LibroDiarioAsientosResponse> {
    try {
      const page = filtros.page || 1;
      const limit = filtros.limit || 20;
      const offset = (page - 1) * limit;

      let whereClause = "WHERE 1=1";
      const replacements: any = {};

      // Aplicar filtros
      if (filtros.asientoDesde) {
        whereClause += " AND A.asiento >= :asientoDesde";
        replacements.asientoDesde = filtros.asientoDesde;
      }

      if (filtros.asientoHasta) {
        whereClause += " AND A.asiento <= :asientoHasta";
        replacements.asientoHasta = filtros.asientoHasta;
      }

      if (filtros.tipoAsientoDesde) {
        whereClause += " AND A.tipo_asiento >= :tipoAsientoDesde";
        replacements.tipoAsientoDesde = filtros.tipoAsientoDesde;
      }

      if (filtros.tipoAsientoHasta) {
        whereClause += " AND A.tipo_asiento <= :tipoAsientoHasta";
        replacements.tipoAsientoHasta = filtros.tipoAsientoHasta;
      }

      if (filtros.fechaDesde) {
        whereClause += " AND A.fecha >= :fechaDesde";
        replacements.fechaDesde = filtros.fechaDesde;
      }

      if (filtros.fechaHasta) {
        whereClause += " AND A.fecha <= :fechaHasta";
        replacements.fechaHasta = filtros.fechaHasta;
      }

      if (filtros.claseAsiento && filtros.claseAsiento.length > 0) {
        whereClause += " AND A.tipo_asiento IN (:claseAsiento)";
        replacements.claseAsiento = filtros.claseAsiento;
      }

      if (filtros.origen && filtros.origen.length > 0) {
        whereClause += " AND A.origen IN (:origen)";
        replacements.origen = filtros.origen;
      }

      if (filtros.paqueteDesde) {
        whereClause += " AND A.paquete >= :paqueteDesde";
        replacements.paqueteDesde = filtros.paqueteDesde;
      }

      if (filtros.paqueteHasta) {
        whereClause += " AND A.paquete <= :paqueteHasta";
        replacements.paqueteHasta = filtros.paqueteHasta;
      }

      if (filtros.contabilidad && filtros.contabilidad.length > 0) {
        whereClause += " AND A.contabilidad IN (:contabilidad)";
        replacements.contabilidad = filtros.contabilidad;
      }

      if (filtros.documentoGlobalDesde) {
        whereClause += " AND A.documento_global >= :documentoGlobalDesde";
        replacements.documentoGlobalDesde = filtros.documentoGlobalDesde;
      }

      if (filtros.documentoGlobalHasta) {
        whereClause += " AND A.documento_global <= :documentoGlobalHasta";
        replacements.documentoGlobalHasta = filtros.documentoGlobalHasta;
      }

      // Query para obtener el total de registros
      const countQuery = `
        SELECT COUNT(*) as total
        FROM ${conjunto}.asiento_de_diario A (NOLOCK)
        INNER JOIN ${conjunto}.paquete P (NOLOCK) ON A.paquete = P.paquete
        ${whereClause}
      `;

      const [countResults] = await exactusSequelize.query(countQuery, { replacements });
      const total = (countResults as any[])[0].total;

      // Query para obtener los datos paginados
      const dataQuery = `
        SELECT 
          A.asiento,
          A.paquete,
          P.descripcion,
          A.contabilidad,
          A.tipo_asiento,
          A.fecha,
          A.origen,
          A.documento_global,
          A.total_debito_loc,
          A.total_credito_loc,
          A.total_control_loc,
          (A.total_debito_loc - A.total_credito_loc) as diferencia_local,
          A.total_debito_dol,
          A.total_credito_dol,
          A.total_control_dol,
          (A.total_debito_dol - A.total_credito_dol) as diferencia_dolar
        FROM ${conjunto}.asiento_de_diario A (NOLOCK)
        INNER JOIN ${conjunto}.paquete P (NOLOCK) ON A.paquete = P.paquete
        ${whereClause}
        ORDER BY A.asiento ASC, A.fecha ASC
        OFFSET :offset ROWS
        FETCH NEXT :limit ROWS ONLY
      `;

      replacements.offset = offset;
      replacements.limit = limit;

      const [results] = await exactusSequelize.query(dataQuery, { replacements });
      
      const data = (results as any[]).map((row: any) => ({
        asiento: row.asiento,
        paquete: row.paquete,
        descripcion: row.descripcion,
        contabilidad: row.contabilidad,
        tipo_asiento: row.tipo_asiento,
        fecha: new Date(row.fecha),
        origen: row.origen,
        documento_global: row.documento_global,
        total_debito_loc: parseFloat(row.total_debito_loc) || 0,
        total_credito_loc: parseFloat(row.total_credito_loc) || 0,
        total_control_loc: parseFloat(row.total_control_loc) || 0,
        diferencia_local: parseFloat(row.diferencia_local) || 0,
        total_debito_dol: parseFloat(row.total_debito_dol) || 0,
        total_credito_dol: parseFloat(row.total_credito_dol) || 0,
        total_control_dol: parseFloat(row.total_control_dol) || 0,
        diferencia_dolar: parseFloat(row.diferencia_dolar) || 0,
      }));

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
        message: `Se encontraron ${total} registros`,
      };
    } catch (error) {
      console.error('Error obteniendo asientos de libro diario:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        message: `Error al obtener asientos: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(
    conjunto: string,
    filtros: ExportarLibroDiarioAsientosExcelParams
  ): Promise<Buffer> {
    try {
      const data = await this.generarReporte(conjunto, filtros);
      
      // Aquí se implementaría la lógica de exportación a Excel
      // Por ahora retornamos un buffer vacío
      return Buffer.from('Excel export placeholder');
    } catch (error) {
      console.error('Error exportando Excel de libro diario asientos:', error);
      throw new Error(`Error al exportar Excel: ${error}`);
    }
  }
}
