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
   * Obtiene los filtros disponibles (asientos y referencias)
   */
  async obtenerFiltros(conjunto: string): Promise<{ asiento: string; referencia: string }[]> {
    try {
      const query = `
        SELECT DISTINCT 
          asiento,
          documento_global as referencia
        FROM ${conjunto}.asiento_mayorizado (NOLOCK)
        WHERE asiento IS NOT NULL 
          AND documento_global IS NOT NULL
        ORDER BY asiento, documento_global
      `;

      const [results] = await exactusSequelize.query(query);
      return (results as any[]).map((row: any) => ({
        asiento: row.asiento,
        referencia: row.referencia,
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

      // Aplicar filtros
      if (filtros.asiento) {
        whereClause += " AND asiento = :asiento";
        replacements.asiento = filtros.asiento;
      }

      if (filtros.referencia) {
        whereClause += " AND documento_global = :referencia";
        replacements.referencia = filtros.referencia;
      }

      if (filtros.fechaInicio) {
        whereClause += " AND fecha >= :fechaInicio";
        replacements.fechaInicio = filtros.fechaInicio;
      }

      if (filtros.fechaFin) {
        whereClause += " AND fecha <= :fechaFin";
        replacements.fechaFin = filtros.fechaFin;
      }

      if (filtros.contabilidad) {
        whereClause += " AND contabilidad = :contabilidad";
        replacements.contabilidad = filtros.contabilidad;
      }

      if (filtros.tipoAsiento) {
        whereClause += " AND tipo_asiento = :tipoAsiento";
        replacements.tipoAsiento = filtros.tipoAsiento;
      }

      if (filtros.origen) {
        whereClause += " AND origen = :origen";
        replacements.origen = filtros.origen;
      }

      if (filtros.exportado) {
        whereClause += " AND exportado = :exportado";
        replacements.exportado = filtros.exportado;
      }

      if (filtros.mayorizacion) {
        whereClause += " AND mayor_auditoria = :mayorizacion";
        replacements.mayorizacion = filtros.mayorizacion;
      }

      if (filtros.documentoGlobal) {
        whereClause += " AND documento_global = :documentoGlobal";
        replacements.documentoGlobal = filtros.documentoGlobal;
      }

      const query = `
        SELECT 
          asiento,
          '' as contabilidad,
          '' as tipo_asiento,
          fecha,
          origen,
          documento_global,
          0 as monto_total_local,
          0 as monto_total_dolar,
          mayor_auditoria,
          exportado,
          tipo_ingreso_mayor
        FROM ${conjunto}.asiento_mayorizado (NOLOCK)
        ${whereClause}
        ORDER BY asiento ASC
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

      // Aplicar filtros
      if (filtros.asiento) {
        whereClause += " AND asiento = :asiento";
        replacements.asiento = filtros.asiento;
      }

      if (filtros.referencia) {
        whereClause += " AND documento_global = :referencia";
        replacements.referencia = filtros.referencia;
      }

      if (filtros.fechaInicio) {
        whereClause += " AND fecha >= :fechaInicio";
        replacements.fechaInicio = filtros.fechaInicio;
      }

      if (filtros.fechaFin) {
        whereClause += " AND fecha <= :fechaFin";
        replacements.fechaFin = filtros.fechaFin;
      }

      if (filtros.contabilidad) {
        whereClause += " AND contabilidad = :contabilidad";
        replacements.contabilidad = filtros.contabilidad;
      }

      if (filtros.tipoAsiento) {
        whereClause += " AND tipo_asiento = :tipoAsiento";
        replacements.tipoAsiento = filtros.tipoAsiento;
      }

      if (filtros.origen) {
        whereClause += " AND origen = :origen";
        replacements.origen = filtros.origen;
      }

      if (filtros.exportado) {
        whereClause += " AND exportado = :exportado";
        replacements.exportado = filtros.exportado;
      }

      if (filtros.mayorizacion) {
        whereClause += " AND mayor_auditoria = :mayorizacion";
        replacements.mayorizacion = filtros.mayorizacion;
      }

      if (filtros.documentoGlobal) {
        whereClause += " AND documento_global = :documentoGlobal";
        replacements.documentoGlobal = filtros.documentoGlobal;
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
          asiento,
          '' as contabilidad,
          '' as tipo_asiento,
          fecha,
          origen,
          documento_global,
          0 as monto_total_local,
          0 as monto_total_dolar,
          mayor_auditoria,
          exportado,
          tipo_ingreso_mayor
        FROM ${conjunto}.asiento_mayorizado (NOLOCK)
        ${whereClause}
        ORDER BY asiento ASC
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

      // Aplicar filtros
      if (filtros.asiento) {
        whereClause += " AND asiento = :asiento";
        replacements.asiento = filtros.asiento;
      }

      if (filtros.referencia) {
        whereClause += " AND documento_global = :referencia";
        replacements.referencia = filtros.referencia;
      }

      if (filtros.fechaInicio) {
        whereClause += " AND fecha >= :fechaInicio";
        replacements.fechaInicio = filtros.fechaInicio;
      }

      if (filtros.fechaFin) {
        whereClause += " AND fecha <= :fechaFin";
        replacements.fechaFin = filtros.fechaFin;
      }

      if (filtros.contabilidad) {
        whereClause += " AND contabilidad = :contabilidad";
        replacements.contabilidad = filtros.contabilidad;
      }

      if (filtros.tipoAsiento) {
        whereClause += " AND tipo_asiento = :tipoAsiento";
        replacements.tipoAsiento = filtros.tipoAsiento;
      }

      if (filtros.origen) {
        whereClause += " AND origen = :origen";
        replacements.origen = filtros.origen;
      }

      if (filtros.exportado) {
        whereClause += " AND exportado = :exportado";
        replacements.exportado = filtros.exportado;
      }

      if (filtros.mayorizacion) {
        whereClause += " AND mayor_auditoria = :mayorizacion";
        replacements.mayorizacion = filtros.mayorizacion;
      }

      if (filtros.documentoGlobal) {
        whereClause += " AND documento_global = :documentoGlobal";
        replacements.documentoGlobal = filtros.documentoGlobal;
      }

      // Aplicar límite si se especifica
      let limitClause = "";
      if (filtros.limit) {
        limitClause = `TOP ${filtros.limit}`;
      }

      const query = `
        SELECT ${limitClause}
          asiento,
          '' as contabilidad,
          '' as tipo_asiento,
          fecha,
          origen,
          documento_global,
          0 as monto_total_local,
          0 as monto_total_dolar,
          mayor_auditoria,
          exportado,
          tipo_ingreso_mayor
        FROM ${conjunto}.asiento_mayorizado (NOLOCK)
        ${whereClause}
        ORDER BY asiento ASC
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
