import { injectable } from "inversify";
import { IAnalisisCuentasClipperRepository } from "../../domain/repositories/IAnalisisCuentasClipperRepository";
import {
  AnalisisCuentasClipper,
  AnalisisCuentasClipperFiltros,
  AnalisisCuentasClipperResponse,
  AnalisisCuentasRangoClipper,
  AnalisisCuentasRangoClipperFiltros,
  AnalisisCuentasRangoClipperResponse,
  AnalisisCuentasFechasClipper,
  AnalisisCuentasFechasClipperFiltros,
  AnalisisCuentasFechasClipperResponse,
  AnalisisCuentasVencimientoClipper,
  AnalisisCuentasVencimientoClipperFiltros,
  AnalisisCuentasVencimientoClipperResponse,
} from "../../domain/entities/AnalisisCuentasClipper";

import { clipperGPCDatabases } from "../database/config/clipper-gpc-database";
import { QueryTypes } from "sequelize";

/**
 * Implementación del repositorio para Análisis de Cuentas Clipper
 * Maneja el acceso a datos usando Sequelize y la base de datos Clipper GPC
 */
@injectable()
export class AnalisisCuentasClipperRepository
  implements IAnalisisCuentasClipperRepository
{
  private getDatabase(baseDatos: string) {
    const db = clipperGPCDatabases[baseDatos];
    if (!db) {
      throw new Error(`Base de datos '${baseDatos}' no encontrada`);
    }
    return db;
  }

  /**
   * Convierte fecha de formato DD/MM/YYYY a YYYY-MM-DD para SQL Server
   * @param fecha - Fecha en formato DD/MM/YYYY
   * @returns Fecha en formato YYYY-MM-DD
   */
  private convertDateFormat(fecha: string): string {
    const [dia, mes, año] = fecha.split("/");
    return `${año}-${mes!.padStart(2, "0")}-${dia!.padStart(2, "0")}`;
  }

  /**
   * Formatea la cuenta para la consulta SQL
   * Si la cuenta no contiene '%', la convierte a formato de búsqueda con wildcard
   * @param cuenta - La cuenta a formatear
   * @returns La cuenta formateada para la consulta LIKE
   */
  private formatCuentaForQuery(cuenta?: string): string {
    if (!cuenta) {
      return "10%";
    }

    // Si ya contiene '%', devolver tal como está
    if (cuenta.includes("%")) {
      return cuenta;
    }

    // Si no contiene '%', agregarlo al final para búsqueda con wildcard
    return `${cuenta}%`;
  }

  async obtenerReporteAnalisisCuentasClipper(
    filtros: AnalisisCuentasClipperFiltros
  ): Promise<AnalisisCuentasClipperResponse> {
    try {
      const db = this.getDatabase(filtros.baseDatos);

      // Construir la consulta SQL con parámetros interpolados
      const query = this.buildQueryWithParams(filtros);

      console.log("Query ejecutada:", query);
      console.log("Parámetros:", {
        mes: filtros.mes,
        nivel: filtros.nivel,
        cuenta: this.formatCuentaForQuery(filtros.cuenta),
      });

      // Ejecutar la consulta
      const resultados = await db.query(query, {
        type: QueryTypes.SELECT,
      });

      console.log("Resultados obtenidos:", resultados.length);

      return {
        success: true,
        data: resultados as AnalisisCuentasClipper[],
        message: "Reporte generado exitosamente",
      };
    } catch (error) {
      console.error("Error en obtenerReporteAnalisisCuentasClipper:", error);
      throw new Error(
        `Error al obtener el reporte: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  private buildQuery(filtros: AnalisisCuentasClipperFiltros): string {
    const baseQuery = this.buildBaseQuery(filtros);

    return `
      ${baseQuery}
      ORDER BY CUENTA
    `;
  }

  private buildQueryWithParams(filtros: AnalisisCuentasClipperFiltros): string {
    const mes = filtros.mes;
    const nivel = filtros.nivel;
    const cuenta = this.formatCuentaForQuery(filtros.cuenta);

    return `
      WITH BASE AS (
        SELECT 
          T0.CUENTA,
          T0.NOMBRE,
          SALDO_ANTERIOR = 
            SUM(
              CASE WHEN ${mes} > 1 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_01, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER01, 0)) ELSE 0 END +
              CASE WHEN ${mes} > 2 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_02, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER02, 0)) ELSE 0 END +
              CASE WHEN ${mes} > 3 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_03, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER03, 0)) ELSE 0 END +
              CASE WHEN ${mes} > 4 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_04, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER04, 0)) ELSE 0 END +
              CASE WHEN ${mes} > 5 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_05, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER05, 0)) ELSE 0 END +
              CASE WHEN ${mes} > 6 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_06, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER06, 0)) ELSE 0 END +
              CASE WHEN ${mes} > 7 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_07, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER07, 0)) ELSE 0 END +
              CASE WHEN ${mes} > 8 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_08, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER08, 0)) ELSE 0 END +
              CASE WHEN ${mes} > 9 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_09, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER09, 0)) ELSE 0 END +
              CASE WHEN ${mes} > 10 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_10, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER10, 0)) ELSE 0 END +
              CASE WHEN ${mes} > 11 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_11, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER11, 0)) ELSE 0 END
            ),
          DEBE_MES = SUM(
            CASE ${mes}
              WHEN 1 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_01, 0))
              WHEN 2 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_02, 0))
              WHEN 3 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_03, 0))
              WHEN 4 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_04, 0))
              WHEN 5 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_05, 0))
              WHEN 6 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_06, 0))
              WHEN 7 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_07, 0))
              WHEN 8 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_08, 0))
              WHEN 9 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_09, 0))
              WHEN 10 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_10, 0))
              WHEN 11 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_11, 0))
              WHEN 12 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_12, 0))
            END
          ),
          HABER_MES = SUM(
            CASE ${mes}
              WHEN 1 THEN TRY_CONVERT(FLOAT, ISNULL(HABER01, 0))
              WHEN 2 THEN TRY_CONVERT(FLOAT, ISNULL(HABER02, 0))
              WHEN 3 THEN TRY_CONVERT(FLOAT, ISNULL(HABER03, 0))
              WHEN 4 THEN TRY_CONVERT(FLOAT, ISNULL(HABER04, 0))
              WHEN 5 THEN TRY_CONVERT(FLOAT, ISNULL(HABER05, 0))
              WHEN 6 THEN TRY_CONVERT(FLOAT, ISNULL(HABER06, 0))
              WHEN 7 THEN TRY_CONVERT(FLOAT, ISNULL(HABER07, 0))
              WHEN 8 THEN TRY_CONVERT(FLOAT, ISNULL(HABER08, 0))
              WHEN 9 THEN TRY_CONVERT(FLOAT, ISNULL(HABER09, 0))
              WHEN 10 THEN TRY_CONVERT(FLOAT, ISNULL(HABER10, 0))
              WHEN 11 THEN TRY_CONVERT(FLOAT, ISNULL(HABER11, 0))
              WHEN 12 THEN TRY_CONVERT(FLOAT, ISNULL(HABER12, 0))
            END
          )
        FROM PCGR T0
        WHERE T0.CUENTA LIKE '${cuenta}'
          AND T0.NIVEL = ${nivel}
        GROUP BY T0.CUENTA, T0.NOMBRE
      )
      SELECT 
        CUENTA,
        NOMBRE,
        FORMAT(SALDO_ANTERIOR, 'N2') AS SALDO_ANTERIOR,
        FORMAT(DEBE_MES, 'N2') AS DEBE_MES,
        FORMAT(HABER_MES, 'N2') AS HABER_MES,
        FORMAT(SALDO_ANTERIOR + DEBE_MES - HABER_MES, 'N2') AS SALDO_FINAL
      FROM BASE
      ORDER BY CUENTA
    `;
  }

  private buildBaseQuery(filtros: AnalisisCuentasClipperFiltros): string {
    return `
      WITH BASE AS (
        SELECT 
          T0.CUENTA,
          T0.NOMBRE,
          SALDO_ANTERIOR = 
            SUM(
              CASE WHEN :mes > 1 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_01, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER01, 0)) ELSE 0 END +
              CASE WHEN :mes > 2 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_02, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER02, 0)) ELSE 0 END +
              CASE WHEN :mes > 3 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_03, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER03, 0)) ELSE 0 END +
              CASE WHEN :mes > 4 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_04, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER04, 0)) ELSE 0 END +
              CASE WHEN :mes > 5 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_05, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER05, 0)) ELSE 0 END +
              CASE WHEN :mes > 6 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_06, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER06, 0)) ELSE 0 END +
              CASE WHEN :mes > 7 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_07, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER07, 0)) ELSE 0 END +
              CASE WHEN :mes > 8 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_08, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER08, 0)) ELSE 0 END +
              CASE WHEN :mes > 9 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_09, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER09, 0)) ELSE 0 END +
              CASE WHEN :mes > 10 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_10, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER10, 0)) ELSE 0 END +
              CASE WHEN :mes > 11 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_11, 0)) - TRY_CONVERT(FLOAT, ISNULL(HABER11, 0)) ELSE 0 END
            ),
          DEBE_MES = SUM(
            CASE :mes
              WHEN 1 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_01, 0))
              WHEN 2 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_02, 0))
              WHEN 3 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_03, 0))
              WHEN 4 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_04, 0))
              WHEN 5 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_05, 0))
              WHEN 6 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_06, 0))
              WHEN 7 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_07, 0))
              WHEN 8 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_08, 0))
              WHEN 9 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_09, 0))
              WHEN 10 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_10, 0))
              WHEN 11 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_11, 0))
              WHEN 12 THEN TRY_CONVERT(FLOAT, ISNULL(DEBE_12, 0))
            END
          ),
          HABER_MES = SUM(
            CASE :mes
              WHEN 1 THEN TRY_CONVERT(FLOAT, ISNULL(HABER01, 0))
              WHEN 2 THEN TRY_CONVERT(FLOAT, ISNULL(HABER02, 0))
              WHEN 3 THEN TRY_CONVERT(FLOAT, ISNULL(HABER03, 0))
              WHEN 4 THEN TRY_CONVERT(FLOAT, ISNULL(HABER04, 0))
              WHEN 5 THEN TRY_CONVERT(FLOAT, ISNULL(HABER05, 0))
              WHEN 6 THEN TRY_CONVERT(FLOAT, ISNULL(HABER06, 0))
              WHEN 7 THEN TRY_CONVERT(FLOAT, ISNULL(HABER07, 0))
              WHEN 8 THEN TRY_CONVERT(FLOAT, ISNULL(HABER08, 0))
              WHEN 9 THEN TRY_CONVERT(FLOAT, ISNULL(HABER09, 0))
              WHEN 10 THEN TRY_CONVERT(FLOAT, ISNULL(HABER10, 0))
              WHEN 11 THEN TRY_CONVERT(FLOAT, ISNULL(HABER11, 0))
              WHEN 12 THEN TRY_CONVERT(FLOAT, ISNULL(HABER12, 0))
            END
          )
        FROM PCGR T0
        WHERE T0.CUENTA LIKE :cuenta
          AND T0.NIVEL = :nivel
        GROUP BY T0.CUENTA, T0.NOMBRE
      )
      SELECT 
        CUENTA,
        NOMBRE,
        FORMAT(SALDO_ANTERIOR, 'N2') AS SALDO_ANTERIOR,
        FORMAT(DEBE_MES, 'N2') AS DEBE_MES,
        FORMAT(HABER_MES, 'N2') AS HABER_MES,
        FORMAT(SALDO_ANTERIOR + DEBE_MES - HABER_MES, 'N2') AS SALDO_FINAL
      FROM BASE
    `;
  }

  /**
   * Obtiene el reporte de análisis de cuentas por rango
   * @param filtros - Filtros para la consulta (baseDatos, cuentaDesde, cuentaHasta)
   * @returns Promise con la respuesta del reporte
   */
  async obtenerReporteAnalisisCuentaRangoClipper(
    filtros: AnalisisCuentasRangoClipperFiltros
  ): Promise<AnalisisCuentasRangoClipperResponse> {
    try {
      const db = this.getDatabase(filtros.baseDatos);

      // Construir la consulta SQL con parámetros interpolados
      const query = this.buildRangoQuery(filtros);

      console.log("Query ejecutada:", query);
      console.log("Parámetros:", {
        cuentaDesde: filtros.cuentaDesde,
        cuentaHasta: filtros.cuentaHasta,
      });

      // Ejecutar la consulta
      const resultados = await db.query(query, {
        type: QueryTypes.SELECT,
      });

      console.log("Resultados obtenidos:", resultados.length);

      return {
        success: true,
        data: resultados as AnalisisCuentasRangoClipper[],
        message: "Reporte de análisis por rango generado exitosamente",
      };
    } catch (error) {
      console.error(
        "Error en obtenerReporteAnalisisCuentaRangoClipper:",
        error
      );
      throw new Error(
        `Error al obtener el reporte por rango: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Construye la consulta SQL para el análisis por rango
   * @param filtros - Filtros para la consulta
   * @returns Query SQL formateada
   */
  private buildRangoQuery(filtros: AnalisisCuentasRangoClipperFiltros): string {
    const cuentaDesde = filtros.cuentaDesde;
    const cuentaHasta = filtros.cuentaHasta;

    return `
      SELECT 
        V.CUENTA,
        P.NOMBRE,
        FORMAT(SUM(TRY_CONVERT(FLOAT, ISNULL(V.MONTOD, '0'))), 'N2') AS DEBE,
        FORMAT(SUM(TRY_CONVERT(FLOAT, ISNULL(V.MONTOH, '0'))), 'N2') AS HABER
      FROM VOUCHER V
      LEFT JOIN PCGR P ON V.CUENTA = P.CUENTA
      WHERE V.CUENTA BETWEEN '${cuentaDesde}' AND '${cuentaHasta}'
      GROUP BY V.CUENTA, P.NOMBRE
      ORDER BY V.CUENTA
    `;
  }

  /**
   * Obtiene el reporte de análisis de cuentas por rango de fechas
   * @param filtros - Filtros para la consulta (baseDatos, fechaDesde, fechaHasta)
   * @returns Promise con la respuesta del reporte
   */
  async obtenerReporteAnalisisCuentasFechasClipper(
    filtros: AnalisisCuentasFechasClipperFiltros
  ): Promise<AnalisisCuentasFechasClipperResponse> {
    try {
      const db = this.getDatabase(filtros.baseDatos);

      // Construir la consulta SQL con parámetros interpolados
      const query = this.buildFechasQuery(filtros);

      console.log("Query ejecutada:", query);
      console.log("Parámetros:", {
        fechaDesde: filtros.fechaDesde,
        fechaHasta: filtros.fechaHasta,
      });

      // Ejecutar la consulta
      const resultados = await db.query(query, {
        type: QueryTypes.SELECT,
      });

      console.log("Resultados obtenidos:", resultados.length);

      return {
        success: true,
        data: resultados as AnalisisCuentasFechasClipper[],
        message: "Reporte de análisis por fechas generado exitosamente",
      };
    } catch (error) {
      console.error(
        "Error en obtenerReporteAnalisisCuentasFechasClipper:",
        error
      );
      throw new Error(
        `Error al obtener el reporte por fechas: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Construye la consulta SQL para el análisis por fechas
   * @param filtros - Filtros para la consulta
   * @returns Query SQL formateada
   */
  private buildFechasQuery(
    filtros: AnalisisCuentasFechasClipperFiltros
  ): string {
    const fechaDesde = filtros.fechaDesde;
    const fechaHasta = filtros.fechaHasta;

    return `
      SELECT     V.CUENTA,    P.NOMBRE,  
        FORMAT(SUM(TRY_CONVERT(FLOAT, ISNULL(V.MONTOD, '0'))), 'N2') AS DEBE, 
           FORMAT(SUM(TRY_CONVERT(FLOAT, ISNULL(V.MONTOH, '0'))), 'N2') AS HABER
             FROM VOUCHER V
             LEFT JOIN PCGR P ON V.CUENTA = P.CUENTA
             WHERE  TRY_CONVERT(DATE, V.FECHA) BETWEEN '${fechaDesde}' AND '${fechaHasta}'  
              AND V.CUENTA IS NOT NULL   
               AND LTRIM(RTRIM(V.CUENTA)) <> ''
               GROUP BY V.CUENTA, P.NOMBRE, TRY_CONVERT(DATE, V.FECHA)
               ORDER BY V.CUENTA;

    `;
  }

  /**
   * Obtiene el reporte de análisis de cuentas por fecha de vencimiento
   * @param filtros - Filtros para la consulta (baseDatos, cuentaDesde, cuentaHasta, fechaVencimientoDesde, fechaVencimientoHasta)
   * @returns Promise con la respuesta del reporte
   */
  async obtenerReporteAnalisisCuentasVencimientoClipper(
    filtros: AnalisisCuentasVencimientoClipperFiltros
  ): Promise<AnalisisCuentasVencimientoClipperResponse> {
    try {
      const db = this.getDatabase(filtros.baseDatos);

      // Construir la consulta SQL optimizada
      const query = this.buildVencimientoQuery(filtros);

      console.log("Query optimizada ejecutada:", query);
      console.log("Parámetros:", {
        cuentaDesde: filtros.cuentaDesde,
        cuentaHasta: filtros.cuentaHasta,
        fechaVencimientoDesde: filtros.fechaVencimientoDesde,
        fechaVencimientoHasta: filtros.fechaVencimientoHasta,
      });

      const startTime = Date.now();

      // Ejecutar la consulta
      const resultados = await db.query(query, {
        type: QueryTypes.SELECT,
      });

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      console.log(
        `Resultados obtenidos: ${resultados.length} en ${executionTime}ms`
      );

      return {
        success: true,
        data: resultados as AnalisisCuentasVencimientoClipper[],
        message: `Reporte de análisis por fecha de vencimiento generado exitosamente (${resultados.length} registros en ${executionTime}ms)`,
      };
    } catch (error) {
      console.error(
        "Error en obtenerReporteAnalisisCuentasVencimientoClipper:",
        error
      );
      throw new Error(
        `Error al obtener el reporte por fecha de vencimiento: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Construye la consulta SQL optimizada para el análisis por fecha de vencimiento
   * @param filtros - Filtros para la consulta
   * @returns Query SQL optimizada
   */
  private buildVencimientoQuery(
    filtros: AnalisisCuentasVencimientoClipperFiltros
  ): string {
    const cuentaDesde = filtros.cuentaDesde;
    const cuentaHasta = filtros.cuentaHasta;
    const fechaVencimientoDesde = filtros.fechaVencimientoDesde;
    const fechaVencimientoHasta = filtros.fechaVencimientoHasta;

    // Convertir fechas de DD/MM/YYYY a YYYY-MM-DD para SQL Server
    const fechaDesdeFormatted = this.convertDateFormat(fechaVencimientoDesde);
    const fechaHastaFormatted = this.convertDateFormat(fechaVencimientoHasta);

    return `
      WITH VOUCHER_FILTRADO AS (
        SELECT 
          TRY_CONVERT(DATE, V.FECVEN, 103) AS FECVEN,
          V.CUENTA,
          TRY_CONVERT(FLOAT, ISNULL(V.MONTOD, '0')) AS MONTOD
        FROM VOUCHER V WITH (NOLOCK)
        WHERE 
          V.CUENTA BETWEEN '${cuentaDesde}' AND '${cuentaHasta}'
          AND TRY_CONVERT(DATE, V.FECVEN, 103) BETWEEN '${fechaDesdeFormatted}' AND '${fechaHastaFormatted}'
          AND V.CUENTA IS NOT NULL
          AND LTRIM(RTRIM(V.CUENTA)) <> ''
          AND V.MONTOD IS NOT NULL
          AND V.MONTOD <> '0'
      ),
      CUENTAS_AGREGADAS AS (
        SELECT 
          FECVEN,
          CUENTA,
          SUM(MONTOD) AS TOTAL_DEBE
        FROM VOUCHER_FILTRADO
        GROUP BY CUENTA, FECVEN
      )
      SELECT 
        CA.FECVEN,
        CA.CUENTA,
        ISNULL(P.NOMBRE, 'SIN NOMBRE') AS NOMBRE,
        FORMAT(CA.TOTAL_DEBE, 'N2') AS DEBE
      FROM CUENTAS_AGREGADAS CA
      LEFT JOIN PCGR P WITH (NOLOCK) ON CA.CUENTA = P.CUENTA
      ORDER BY CA.CUENTA, CA.FECVEN
    `;
  }

  /**
   * Construye una consulta SQL ultra-optimizada para el análisis por fecha de vencimiento
   * Esta versión está diseñada para manejar grandes volúmenes de datos
   * @param filtros - Filtros para la consulta
   * @returns Query SQL ultra-optimizada
   */
  private buildVencimientoQueryUltraOptimized(
    filtros: AnalisisCuentasVencimientoClipperFiltros
  ): string {
    const cuentaDesde = filtros.cuentaDesde;
    const cuentaHasta = filtros.cuentaHasta;
    const fechaVencimientoDesde = filtros.fechaVencimientoDesde;
    const fechaVencimientoHasta = filtros.fechaVencimientoHasta;

    // Convertir fechas de DD/MM/YYYY a YYYY-MM-DD para SQL Server
    const fechaDesdeFormatted = this.convertDateFormat(fechaVencimientoDesde);
    const fechaHastaFormatted = this.convertDateFormat(fechaVencimientoHasta);

    return `
      SELECT 
        TRY_CONVERT(DATE, V.FECVEN, 103) AS FECVEN,
        V.CUENTA,
        ISNULL(P.NOMBRE, 'SIN NOMBRE') AS NOMBRE,
        FORMAT(SUM(TRY_CONVERT(FLOAT, ISNULL(V.MONTOD, '0'))), 'N2') AS DEBE
      FROM VOUCHER V WITH (NOLOCK, INDEX(IX_VOUCHER_CUENTA_FECVEN))
      LEFT JOIN PCGR P WITH (NOLOCK) ON V.CUENTA = P.CUENTA
      WHERE 
        V.CUENTA BETWEEN '${cuentaDesde}' AND '${cuentaHasta}'
        AND TRY_CONVERT(DATE, V.FECVEN, 103) BETWEEN '${fechaDesdeFormatted}' AND '${fechaHastaFormatted}'
        AND V.CUENTA IS NOT NULL
        AND LTRIM(RTRIM(V.CUENTA)) <> ''
        AND V.MONTOD IS NOT NULL
        AND V.MONTOD <> '0'
      GROUP BY 
        TRY_CONVERT(DATE, V.FECVEN, 103), V.CUENTA, P.NOMBRE
      ORDER BY 
        V.CUENTA, TRY_CONVERT(DATE, V.FECVEN, 103)
    `;
  }
}
