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
  ): Promise<{
    success: boolean;
    data: LibroMayorAsientos[];
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
          A.contabilidad,
          A.tipo_asiento,
          A.fecha,
          A.origen,
          A.documento_global,
          A.monto_total_local,
          A.monto_total_dolar,
          A.mayor_auditoria,
          A.exportado,
          A.tipo_ingreso_mayor
        FROM ${conjunto}.asiento_mayorizado A (NOLOCK)
        ${whereClause}
        ORDER BY A.asiento ASC
      `;

      const [results] = await exactusSequelize.query(query, { replacements });
      const data = (results as any[]).map((row: any) => ({
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
      console.error('Error generando reporte de libro mayor asientos:', error);
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

      // Aplicar paginación estandarizada
      const page = filtros.page || 1;
      const limit = filtros.limit || 25;
      const offset = (page - 1) * limit;

      console.log('=== REPOSITORIO obtenerAsientos ===');
      console.log('Filtros recibidos:', filtros);
      console.log('Paginación calculada:');
      console.log('- page:', page);
      console.log('- limit:', limit);
      console.log('- offset:', offset);

      const dataQuery = `
        SELECT 
          A.asiento,
          A.contabilidad,
          A.tipo_asiento,
          A.fecha,
          A.origen,
          A.documento_global,
          A.monto_total_local,
          A.monto_total_dolar,
          A.mayor_auditoria,
          A.exportado,
          A.tipo_ingreso_mayor
        FROM ${conjunto}.asiento_mayorizado A (NOLOCK)
        ${whereClause}
        ORDER BY A.asiento ASC
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY
      `;

      console.log('Query SQL ejecutada:');
      console.log('- Count query:', countQuery);
      console.log('- Data query:', dataQuery);
      console.log('- Replacements:', replacements);

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

      console.log('Resultados obtenidos:');
      console.log('- Total registros:', total);
      console.log('- Registros en página:', asientos.length);
      console.log('- Total páginas:', totalPages);
      console.log('- Página actual:', page);
      console.log('- Has next:', page < totalPages);
      console.log('- Has prev:', page > 1);

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
          A.contabilidad,
          A.tipo_asiento,
          A.fecha,
          A.origen,
          A.documento_global,
          A.monto_total_local,
          A.monto_total_dolar,
          A.mayor_auditoria,
          A.exportado,
          A.tipo_ingreso_mayor
        FROM ${conjunto}.asiento_mayorizado A (NOLOCK)
        ${whereClause}
        ORDER BY A.asiento ASC
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
