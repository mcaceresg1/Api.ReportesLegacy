import { injectable } from "inversify";
import { exactusSequelize } from "../database/config/exactus-database";
import {
  LibroDiarioAsientos,
  LibroDiarioAsientosFiltros,
  LibroDiarioAsientosResponse,
  GenerarLibroDiarioAsientosParams,
  ExportarLibroDiarioAsientosExcelParams,
} from "../../domain/entities/LibroDiarioAsientos";

@injectable()
export class LibroDiarioAsientosRepository {

  /**
   * Obtiene los filtros disponibles (asientos, tipos de asiento y paquetes)
   */
  async obtenerFiltros(conjunto: string): Promise<{ asiento: string; tipoAsiento: string; paquete: string }[]> {
    try {
      const query = `
        SELECT DISTINCT 
          A.asiento,
          A.tipo_asiento as tipoAsiento,
          A.paquete
        FROM ${conjunto}.asiento_de_diario A (NOLOCK)
        INNER JOIN ${conjunto}.paquete P (NOLOCK) ON A.paquete = P.paquete
        WHERE A.asiento IS NOT NULL 
          AND A.tipo_asiento IS NOT NULL
          AND A.paquete IS NOT NULL
        ORDER BY A.asiento, A.tipo_asiento, A.paquete
      `;

      const [results] = await exactusSequelize.query(query);
      return (results as any[]).map((row: any) => ({
        asiento: row.asiento,
        tipoAsiento: row.tipoAsiento,
        paquete: row.paquete,
      }));
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
  ): Promise<LibroDiarioAsientos[]> {
    try {
      let whereClause = "WHERE 1=1";
      const params: any[] = [];

      if (filtros.asiento) {
        whereClause += " AND A.asiento = ?";
        params.push(filtros.asiento);
      }

      if (filtros.tipoAsiento) {
        whereClause += " AND A.tipo_asiento = ?";
        params.push(filtros.tipoAsiento);
      }

      if (filtros.paquete) {
        whereClause += " AND A.paquete = ?";
        params.push(filtros.paquete);
      }

      if (filtros.fechaDesde) {
        whereClause += " AND A.fecha >= ?";
        params.push(filtros.fechaDesde);
      }

      if (filtros.fechaHasta) {
        whereClause += " AND A.fecha <= ?";
        params.push(filtros.fechaHasta);
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
          A.total_debito_loc - A.total_credito_loc as diferencia_local,
          A.total_debito_dol,
          A.total_credito_dol,
          A.total_control_dol,
          A.total_debito_dol - A.total_credito_dol as diferencia_dolar
        FROM ${conjunto}.asiento_de_diario A (NOLOCK)
        INNER JOIN ${conjunto}.paquete P (NOLOCK) ON A.paquete = P.paquete
        ${whereClause}
        ORDER BY A.asiento ASC
      `;

      const [results] = await exactusSequelize.query(query, { replacements: params });
      return results as LibroDiarioAsientos[];
    } catch (error) {
      console.error('Error generando reporte de libro diario asientos:', error);
      throw new Error(`Error al generar reporte: ${error}`);
    }
  }

  /**
   * Obtiene los datos paginados del Libro Diario Asientos
   */
  async obtenerAsientos(
    conjunto: string,
    filtros: LibroDiarioAsientosFiltros
  ): Promise<LibroDiarioAsientosResponse> {
    try {
      let whereClause = "WHERE 1=1";
      const params: any[] = [];

      if (filtros.asiento) {
        whereClause += " AND A.asiento = ?";
        params.push(filtros.asiento);
      }

      if (filtros.tipoAsiento) {
        whereClause += " AND A.tipo_asiento = ?";
        params.push(filtros.tipoAsiento);
      }

      if (filtros.paquete) {
        whereClause += " AND A.paquete = ?";
        params.push(filtros.paquete);
      }

      if (filtros.fechaDesde) {
        whereClause += " AND A.fecha >= ?";
        params.push(filtros.fechaDesde);
      }

      if (filtros.fechaHasta) {
        whereClause += " AND A.fecha <= ?";
        params.push(filtros.fechaHasta);
      }

      // Obtener total de registros
      const countQuery = `
        SELECT COUNT(*) as total
        FROM ${conjunto}.asiento_de_diario A (NOLOCK)
        INNER JOIN ${conjunto}.paquete P (NOLOCK) ON A.paquete = P.paquete
        ${whereClause}
      `;

      const [countResults] = await exactusSequelize.query(countQuery, { replacements: params });
      const total = (countResults as any[])[0].total;

      // Calcular paginación
      const page = filtros.page || 1;
      const limit = filtros.limit || 20;
      const offset = (page - 1) * limit;
      const totalPages = Math.ceil(total / limit);

      // Obtener datos paginados
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
          A.total_debito_loc - A.total_credito_loc as diferencia_local,
          A.total_debito_dol,
          A.total_credito_dol,
          A.total_control_dol,
          A.total_debito_dol - A.total_credito_dol as diferencia_dolar
        FROM ${conjunto}.asiento_de_diario A (NOLOCK)
        INNER JOIN ${conjunto}.paquete P (NOLOCK) ON A.paquete = P.paquete
        ${whereClause}
        ORDER BY A.asiento ASC
        OFFSET ? ROWS
        FETCH NEXT ? ROWS ONLY
      `;

      const [dataResults] = await exactusSequelize.query(dataQuery, { 
        replacements: [...params, offset, limit] 
      });

      return {
        success: true,
        data: dataResults as LibroDiarioAsientos[],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        message: "Datos obtenidos exitosamente"
      };
    } catch (error) {
      console.error('Error obteniendo asientos de libro diario:', error);
      throw new Error(`Error al obtener asientos: ${error}`);
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
      let whereClause = "WHERE 1=1";
      const params: any[] = [];

      if (filtros.asiento) {
        whereClause += " AND A.asiento = ?";
        params.push(filtros.asiento);
      }

      if (filtros.tipoAsiento) {
        whereClause += " AND A.tipo_asiento = ?";
        params.push(filtros.tipoAsiento);
      }

      if (filtros.paquete) {
        whereClause += " AND A.paquete = ?";
        params.push(filtros.paquete);
      }

      if (filtros.fechaDesde) {
        whereClause += " AND A.fecha >= ?";
        params.push(filtros.fechaDesde);
      }

      if (filtros.fechaHasta) {
        whereClause += " AND A.fecha <= ?";
        params.push(filtros.fechaHasta);
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
          A.total_debito_loc - A.total_credito_loc as diferencia_local,
          A.total_debito_dol,
          A.total_credito_dol,
          A.total_control_dol,
          A.total_debito_dol - A.total_credito_dol as diferencia_dolar
        FROM ${conjunto}.asiento_de_diario A (NOLOCK)
        INNER JOIN ${conjunto}.paquete P (NOLOCK) ON A.paquete = P.paquete
        ${whereClause}
        ORDER BY A.asiento ASC
      `;

      const [results] = await exactusSequelize.query(query, { replacements: params });
      return Buffer.from(JSON.stringify(results));
    } catch (error) {
      console.error('Error exportando Excel de libro diario asientos:', error);
      throw new Error(`Error al exportar Excel: ${error}`);
    }
  }
}
