import { injectable, inject } from "inversify";
import { IDatabaseService } from "../../domain/services/IDatabaseService";
import {
  LibroMayorAsientos,
  LibroMayorAsientosFiltros,
  LibroMayorAsientosResponse,
  GenerarLibroMayorAsientosParams,
  ExportarLibroMayorAsientosExcelParams,
} from "../../domain/entities/LibroMayorAsientos";

@injectable()
export class LibroMayorAsientosRepository {
  constructor(
    @inject("IDatabaseService")
    private databaseService: IDatabaseService
  ) {}

  /**
   * Obtiene los filtros disponibles (asientos y referencias)
   */
  async obtenerFiltros(conjunto: string): Promise<{ asiento: string; referencia: string }[]> {
    const query = `
      SELECT DISTINCT 
      asiento,
        documento_global as referencia
      FROM ${conjunto}.asiento_mayorizado (NOLOCK)
      WHERE asiento IS NOT NULL 
        AND documento_global IS NOT NULL
      ORDER BY asiento, documento_global
    `;

    const result = await this.databaseService.ejecutarQuery(query);
    return result.map((row: any) => ({
      asiento: row.asiento,
      referencia: row.referencia,
    }));
  }

  /**
   * Genera el reporte de Libro Mayor Asientos
   */
  async generarReporte(
    conjunto: string,
    filtros: GenerarLibroMayorAsientosParams
  ): Promise<LibroMayorAsientos[]> {
    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    // Aplicar filtros
    if (filtros.asiento) {
      whereClause += " AND asiento = ?";
      params.push(filtros.asiento);
    }

    if (filtros.referencia) {
      whereClause += " AND documento_global = ?";
      params.push(filtros.referencia);
    }

    if (filtros.fechaInicio) {
      whereClause += " AND fecha >= ?";
      params.push(filtros.fechaInicio);
    }

    if (filtros.fechaFin) {
      whereClause += " AND fecha <= ?";
      params.push(filtros.fechaFin);
    }

    if (filtros.contabilidad) {
      whereClause += " AND contabilidad = ?";
      params.push(filtros.contabilidad);
    }

    if (filtros.tipoAsiento) {
      whereClause += " AND tipo_asiento = ?";
      params.push(filtros.tipoAsiento);
    }

    if (filtros.origen) {
      whereClause += " AND origen = ?";
      params.push(filtros.origen);
    }

    if (filtros.exportado) {
      whereClause += " AND exportado = ?";
      params.push(filtros.exportado);
    }

    if (filtros.mayorizacion) {
      whereClause += " AND mayor_auditoria = ?";
      params.push(filtros.mayorizacion);
    }

    if (filtros.documentoGlobal) {
      whereClause += " AND documento_global = ?";
      params.push(filtros.documentoGlobal);
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

    const result = await this.databaseService.ejecutarQuery(query, params);
    return result.map((row: any) => ({
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
  }

  /**
   * Obtiene los datos paginados del reporte
   */
  async obtenerAsientos(
    conjunto: string,
    filtros: LibroMayorAsientosFiltros
  ): Promise<LibroMayorAsientosResponse> {
    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    // Aplicar filtros
    if (filtros.asiento) {
      whereClause += " AND asiento = ?";
      params.push(filtros.asiento);
    }

    if (filtros.referencia) {
      whereClause += " AND documento_global = ?";
      params.push(filtros.referencia);
    }

    if (filtros.fechaInicio) {
      whereClause += " AND fecha >= ?";
      params.push(filtros.fechaInicio);
    }

    if (filtros.fechaFin) {
      whereClause += " AND fecha <= ?";
      params.push(filtros.fechaFin);
    }

    if (filtros.contabilidad) {
      whereClause += " AND contabilidad = ?";
      params.push(filtros.contabilidad);
    }

    if (filtros.tipoAsiento) {
      whereClause += " AND tipo_asiento = ?";
      params.push(filtros.tipoAsiento);
    }

    if (filtros.origen) {
      whereClause += " AND origen = ?";
      params.push(filtros.origen);
    }

    if (filtros.exportado) {
      whereClause += " AND exportado = ?";
      params.push(filtros.exportado);
    }

    if (filtros.mayorizacion) {
      whereClause += " AND mayor_auditoria = ?";
      params.push(filtros.mayorizacion);
    }

    if (filtros.documentoGlobal) {
      whereClause += " AND documento_global = ?";
      params.push(filtros.documentoGlobal);
    }

    // Obtener total de registros
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${conjunto}.asiento_mayorizado (NOLOCK)
      ${whereClause}
    `;

    const countResult = await this.databaseService.ejecutarQuery(countQuery, params);
    const total = countResult[0].total;

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

    const data = await this.databaseService.ejecutarQuery(dataQuery, params);
    const asientos = data.map((row: any) => ({
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
  }

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(
    conjunto: string,
    filtros: ExportarLibroMayorAsientosExcelParams
  ): Promise<LibroMayorAsientos[]> {
    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    // Aplicar filtros
    if (filtros.asiento) {
      whereClause += " AND asiento = ?";
      params.push(filtros.asiento);
    }

    if (filtros.referencia) {
      whereClause += " AND documento_global = ?";
      params.push(filtros.referencia);
    }

    if (filtros.fechaInicio) {
      whereClause += " AND fecha >= ?";
      params.push(filtros.fechaInicio);
    }

    if (filtros.fechaFin) {
      whereClause += " AND fecha <= ?";
      params.push(filtros.fechaFin);
    }

    if (filtros.contabilidad) {
      whereClause += " AND contabilidad = ?";
      params.push(filtros.contabilidad);
    }

    if (filtros.tipoAsiento) {
      whereClause += " AND tipo_asiento = ?";
      params.push(filtros.tipoAsiento);
    }

    if (filtros.origen) {
      whereClause += " AND origen = ?";
      params.push(filtros.origen);
    }

    if (filtros.exportado) {
      whereClause += " AND exportado = ?";
      params.push(filtros.exportado);
    }

    if (filtros.mayorizacion) {
      whereClause += " AND mayor_auditoria = ?";
      params.push(filtros.mayorizacion);
    }

    if (filtros.documentoGlobal) {
      whereClause += " AND documento_global = ?";
      params.push(filtros.documentoGlobal);
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

    const result = await this.databaseService.ejecutarQuery(query, params);
    return result.map((row: any) => ({
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
  }
}
