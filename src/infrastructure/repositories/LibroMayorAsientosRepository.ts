import { injectable } from "inversify";
import { exactusSequelize } from "../database/config/exactus-database";
import {
  LibroMayorAsientos,
  LibroMayorAsientosFiltros,
  LibroMayorAsientosResponse,
  GenerarLibroMayorAsientosParams,
  ExportarLibroMayorAsientosExcelParams,
} from "../../domain/entities/LibroMayorAsientos";

@injectable()
export class LibroMayorAsientosRepository {

  /**
   * Obtiene los filtros disponibles (asientos y tipos de asiento)
   */
  async obtenerFiltros(conjunto: string): Promise<{ asiento: string; tipoAsiento: string }[]> {
    try {
      const query = `
        SELECT DISTINCT 
          asiento,
          tipo_asiento as tipoAsiento
        FROM ${conjunto}.asiento_mayorizado (NOLOCK)
        WHERE asiento IS NOT NULL 
          AND tipo_asiento IS NOT NULL
        ORDER BY asiento, tipo_asiento
      `;

      const [results] = await exactusSequelize.query(query);
      return (results as any[]).map((row: any) => ({
        asiento: row.asiento,
        tipoAsiento: row.tipoAsiento,
      }));
    } catch (error) {
      console.error('Error obteniendo filtros de libro mayor asientos:', error);
      throw new Error(`Error al obtener filtros: ${error}`);
    }
  }

  /**
   * Genera el reporte de Libro Mayor Asientos
   */
  async generarReporte(
    conjunto: string,
    filtros: GenerarLibroMayorAsientosParams
  ): Promise<LibroMayorAsientos[]> {
    try {
      let whereClause = "WHERE 1=1";
      const replacements: any = {};

      // Aplicar filtros simplificados
      if (filtros.asiento) {
        whereClause += " AND asiento = :asiento";
        replacements.asiento = filtros.asiento;
      }

      if (filtros.tipoAsiento) {
        whereClause += " AND tipo_asiento = :tipoAsiento";
        replacements.tipoAsiento = filtros.tipoAsiento;
      }

      const query = `
        SELECT 
          A.asiento,
          '' as contabilidad,
          '' as tipo_asiento,
          A.contabilidad,
          A.tipo_asiento,
          A.fecha,
          A.origen,
          A.documento_global,
          0 as monto_total_local,
          0 as monto_total_dolar,
          0 as mayor_auditoria,
          A.monto_total_local,
          0 as monto_total_dolar,
          0 as mayor_auditoria,
          A.monto_total_dolar,
          A.mayor_auditoria,
          A.exportado,
          A.tipo_ingreso_mayor
        FROM ${conjunto}.asiento_mayorizado A (NOLOCK)
        ${whereClause}
        ORDER BY 1 ASC
      `;

      const [results] = await exactusSequelize.query(query, { replacements });
      return (results as any[]).map((row: any) => ({
        asiento: row.asiento,
        contabilidad: row.contabilidad,
        tipo_asiento: row.tipo_asiento,
        fecha: new Date(row.fecha),
        origen: row.origen,
        documento_global: row.documento_global,
        monto_total_local: row.monto_total_local,
        monto_total_dolar: row.monto_total_dolar,
        mayor_auditoria: row.mayor_auditoria,
        exportado: row.exportado,
        tipo_ingreso_mayor: row.tipo_ingreso_mayor,
      }));
    } catch (error) {
      console.error('Error generando reporte de libro mayor asientos:', error);
      throw new Error(`Error al generar reporte: ${error}`);
    }
  }

  /**
   * Obtiene los datos paginados del reporte
   */
  async obtenerAsientos(
    conjunto: string,
    filtros: LibroMayorAsientosFiltros
  ): Promise<LibroMayorAsientosResponse> {
    try {
      let whereClause = "WHERE 1=1";
      const replacements: any = {};

      // Aplicar filtros simplificados
      if (filtros.asiento) {
        whereClause += " AND asiento = :asiento";
        replacements.asiento = filtros.asiento;
      }

      if (filtros.tipoAsiento) {
        whereClause += " AND tipo_asiento = :tipoAsiento";
        replacements.tipoAsiento = filtros.tipoAsiento;
      }

      // Obtener total de registros
      const countQuery = `
        SELECT COUNT(*) as total
        FROM ${conjunto}.asiento_mayorizado (NOLOCK)
        ${whereClause}
      `;

      const [countResults] = await exactusSequelize.query(countQuery, { replacements });
      const total = (countResults as any[])[0].total;

      // Aplicar paginación
      const page = filtros.page || 1;
      const limit = filtros.limit || 25;
      const offset = (page - 1) * limit;

      const dataQuery = `
        SELECT 
          A.asiento,
          '' as contabilidad,
          '' as tipo_asiento,
          A.contabilidad,
          A.tipo_asiento,
          A.fecha,
          A.origen,
          A.documento_global,
          0 as monto_total_local,
          0 as monto_total_dolar,
          0 as mayor_auditoria,
          A.monto_total_local,
          0 as monto_total_dolar,
          0 as mayor_auditoria,
          A.monto_total_dolar,
          A.mayor_auditoria,
          A.exportado,
          A.tipo_ingreso_mayor
        FROM ${conjunto}.asiento_mayorizado A (NOLOCK)
        ${whereClause}
        ORDER BY 1 ASC
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY
      `;

      const [dataResults] = await exactusSequelize.query(dataQuery, { replacements });
      const asientos = (dataResults as any[]).map((row: any) => ({
        asiento: row.asiento,
        contabilidad: row.contabilidad,
        tipo_asiento: row.tipo_asiento,
        fecha: new Date(row.fecha),
        origen: row.origen,
        documento_global: row.documento_global,
        monto_total_local: row.monto_total_local,
        monto_total_dolar: row.monto_total_dolar,
        mayor_auditoria: row.mayor_auditoria,
        exportado: row.exportado,
        tipo_ingreso_mayor: row.tipo_ingreso_mayor,
      }));

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: asientos,
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
      console.error('Error obteniendo asientos de libro mayor:', error);
      throw new Error(`Error al obtener asientos: ${error}`);
    }
  }

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(
    conjunto: string,
    filtros: ExportarLibroMayorAsientosExcelParams
  ): Promise<LibroMayorAsientos[]> {
    try {
      let whereClause = "WHERE 1=1";
      const replacements: any = {};

      // Aplicar filtros simplificados
      if (filtros.asiento) {
        whereClause += " AND asiento = :asiento";
        replacements.asiento = filtros.asiento;
      }

      if (filtros.tipoAsiento) {
        whereClause += " AND tipo_asiento = :tipoAsiento";
        replacements.tipoAsiento = filtros.tipoAsiento;
      }

      // Aplicar límite si se especifica
      let limitClause = "";
      if (filtros.limit) {
        limitClause = `TOP ${filtros.limit}`;
      }

      const query = `
        SELECT ${limitClause}
          A.asiento,
          '' as contabilidad,
          '' as tipo_asiento,
          A.contabilidad,
          A.tipo_asiento,
          A.fecha,
          A.origen,
          A.documento_global,
          0 as monto_total_local,
          0 as monto_total_dolar,
          0 as mayor_auditoria,
          A.monto_total_local,
          0 as monto_total_dolar,
          0 as mayor_auditoria,
          A.monto_total_dolar,
          A.mayor_auditoria,
          A.exportado,
          A.tipo_ingreso_mayor
        FROM ${conjunto}.asiento_mayorizado A (NOLOCK)
        ${whereClause}
        ORDER BY 1 ASC
      `;

      const [results] = await exactusSequelize.query(query, { replacements });
      return (results as any[]).map((row: any) => ({
        asiento: row.asiento,
        contabilidad: row.contabilidad,
        tipo_asiento: row.tipo_asiento,
        fecha: new Date(row.fecha),
        origen: row.origen,
        documento_global: row.documento_global,
        monto_total_local: row.monto_total_local,
        monto_total_dolar: row.monto_total_dolar,
        mayor_auditoria: row.mayor_auditoria,
        exportado: row.exportado,
        tipo_ingreso_mayor: row.tipo_ingreso_mayor,
      }));
    } catch (error) {
      console.error('Error exportando Excel de libro mayor asientos:', error);
      throw new Error(`Error al exportar Excel: ${error}`);
    }
  }
}
