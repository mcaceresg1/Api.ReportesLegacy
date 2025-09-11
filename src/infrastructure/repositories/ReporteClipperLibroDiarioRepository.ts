import { injectable } from "inversify";
import { QueryTypes } from "sequelize";
import { ClipperLibroDiario } from "../../domain/entities/LibroDiarioClipper";
import { ComprobanteResumen } from "../../domain/entities/ComprobanteResumen";
import { IClipperLibroDiarioRepository } from "../../domain/repositories/IClipperLibroDiarioRepository";
import { clipperGPCDatabases } from "../database/config/clipper-gpc-database";

@injectable()
export class ReporteClipperLibroDiarioRepository
  implements IClipperLibroDiarioRepository
{
  async getComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<ClipperLibroDiario[]> {
    try {
      console.log(
        `🔍 [REPOSITORY] Iniciando getComprobantes: ${libro}/${mes}/${bdClipperGPC}`
      );

      const sequelize = clipperGPCDatabases[bdClipperGPC];
      if (!sequelize)
        throw new Error(`Base de datos "${bdClipperGPC}" no configurada.`);

      // Query principal optimizada sin paginación
      // Usa NOLOCK para mejor rendimiento en consultas de solo lectura
      // Optimizada para usar índices en MES, TIPOVOU y NUMERO
      const query = `
        SELECT
          T1.NOMBRE AS CLASE,
          T1.LIBRO + '' + T1.CODIGO + '/' + T0.NUMERO AS NUMERO_COMPROBANTE,	
          T2.CUENTA,
          T2.NOMBRE,
          CASE
            WHEN T0.TDOC <> '' THEN T0.TDOC + '/' + T0.NDOC
            ELSE ''
          END AS DOCUMENTO,
          T0.GLOSA,
          T0.MONTOD AS montoDebe,
          T0.MONTOH AS montoHaber
        FROM VOUCHER T0 WITH (NOLOCK)
        INNER JOIN LIBROS T1 WITH (NOLOCK) ON T0.TIPOVOU = T1.CODIGO
        INNER JOIN PCGR T2 WITH (NOLOCK) ON T0.CUENTA = T2.CUENTA
        WHERE T0.MES = :mes
          AND T1.LIBRO = :libro
        ORDER BY T0.NUMERO DESC
      `;

      console.log("🔍 [REPOSITORY] Ejecutando query SQL...");
      const result = await sequelize.query<any>(query, {
        replacements: { mes, libro },
        type: QueryTypes.SELECT,
      });

      console.log("🔍 [REPOSITORY] Resultado de la query:", {
        type: typeof result,
        isArray: Array.isArray(result),
        length: Array.isArray(result) ? result.length : "N/A",
        firstItem:
          Array.isArray(result) && result.length > 0 ? result[0] : "N/A",
      });

      // Mapear los nombres de columnas de SQL Server a la entidad TypeScript
      const mappedResult: ClipperLibroDiario[] = result.map((row: any) => ({
        clase: row.CLASE,
        numeroComprobante: row.NUMERO_COMPROBANTE,
        cuenta: row.CUENTA,
        nombre: row.NOMBRE,
        documento: row.DOCUMENTO,
        glosa: row.GLOSA,
        montod: parseFloat(row.montoDebe) || 0,
        montoh: parseFloat(row.montoHaber) || 0,
      }));

      console.log("🔍 [REPOSITORY] Resultado mapeado:", {
        type: typeof mappedResult,
        isArray: Array.isArray(mappedResult),
        length: Array.isArray(mappedResult) ? mappedResult.length : "N/A",
        hasPagination:
          mappedResult &&
          typeof mappedResult === "object" &&
          "pagination" in mappedResult,
      });

      return mappedResult;
    } catch (error) {
      console.error("❌ Error al obtener comprobantes por libro y mes:", error);
      return [];
    }
  }

  async getComprobantesPorClase(
    libro: string,
    mes: string,
    bdClipperGPC: string,
    clase: string
  ): Promise<ClipperLibroDiario[]> {
    try {
      console.log(
        `🔍 [REPOSITORY] Iniciando getComprobantesPorClase: ${libro}/${mes}/${bdClipperGPC}/${clase}`
      );

      const sequelize = clipperGPCDatabases[bdClipperGPC];
      if (!sequelize)
        throw new Error(`Base de datos "${bdClipperGPC}" no configurada.`);

      // Query optimizada para filtrar por clase específica
      const query = `
        SELECT
          T1.NOMBRE AS CLASE,
          T1.LIBRO + '' + T1.CODIGO + '/' + T0.NUMERO AS NUMERO_COMPROBANTE,	
          T2.CUENTA,
          T2.NOMBRE,
          CASE
            WHEN T0.TDOC <> '' THEN T0.TDOC + '/' + T0.NDOC
            ELSE ''
          END AS DOCUMENTO,
          T0.GLOSA,
          T0.MONTOD AS montoDebe,
          T0.MONTOH AS montoHaber
        FROM VOUCHER T0 WITH (NOLOCK)
        INNER JOIN LIBROS T1 WITH (NOLOCK) ON T0.TIPOVOU = T1.CODIGO
        INNER JOIN PCGR T2 WITH (NOLOCK) ON T0.CUENTA = T2.CUENTA
        WHERE T0.MES = :mes
          AND T1.LIBRO = :libro
          AND T1.NOMBRE = :clase
        ORDER BY T0.NUMERO DESC
      `;

      console.log("🔍 [REPOSITORY] Ejecutando query SQL por clase...");
      const result = await sequelize.query<any>(query, {
        replacements: { mes, libro, clase },
        type: QueryTypes.SELECT,
      });

      console.log("🔍 [REPOSITORY] Resultado de la query por clase:", {
        type: typeof result,
        isArray: Array.isArray(result),
        length: Array.isArray(result) ? result.length : "N/A",
        clase: clase,
        firstItem:
          Array.isArray(result) && result.length > 0 ? result[0] : "N/A",
      });

      // Mapear los nombres de columnas de SQL Server a la entidad TypeScript
      const mappedResult: ClipperLibroDiario[] = result.map((row: any) => ({
        clase: row.CLASE,
        numeroComprobante: row.NUMERO_COMPROBANTE,
        cuenta: row.CUENTA,
        nombre: row.NOMBRE,
        documento: row.DOCUMENTO,
        glosa: row.GLOSA,
        montod: parseFloat(row.montoDebe) || 0,
        montoh: parseFloat(row.montoHaber) || 0,
      }));

      console.log("🔍 [REPOSITORY] Resultado mapeado por clase:", {
        type: typeof mappedResult,
        isArray: Array.isArray(mappedResult),
        length: Array.isArray(mappedResult) ? mappedResult.length : "N/A",
        clase: clase,
      });

      return mappedResult;
    } catch (error) {
      console.error("❌ Error al obtener comprobantes por clase:", error);
      return [];
    }
  }

  async getTotalComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<number> {
    try {
      const sequelize = clipperGPCDatabases[bdClipperGPC];
      if (!sequelize)
        throw new Error(`Base de datos "${bdClipperGPC}" no configurada.`);

      // Query optimizada para obtener total de comprobantes
      const query = `
        SELECT COUNT(*) as total
        FROM VOUCHER T0 WITH (NOLOCK)
        INNER JOIN LIBROS T1 WITH (NOLOCK) ON T0.TIPOVOU = T1.CODIGO
        WHERE T0.MES = :mes
          AND T1.LIBRO = :libro
      `;

      const result = await sequelize.query<{ total: number }>(query, {
        replacements: { mes, libro },
        type: QueryTypes.SELECT,
      });

      return result[0]?.total || 0;
    } catch (error) {
      console.error("❌ Error al obtener total de comprobantes:", error);
      return 0;
    }
  }

  async getComprobantesResumen(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<ComprobanteResumen[]> {
    try {
      console.log(
        `🔍 [REPOSITORY] Iniciando getComprobantesResumen: ${libro}/${mes}/${bdClipperGPC}`
      );

      const sequelize = clipperGPCDatabases[bdClipperGPC];
      if (!sequelize)
        throw new Error(`Base de datos "${bdClipperGPC}" no configurada.`);

      // Query optimizada para obtener comprobantes únicos agrupados
      const query = `
        SELECT DISTINCT
          T1.LIBRO + '' + T1.CODIGO + '/' + T0.NUMERO AS COMPROBANTE,
          T1.NOMBRE AS CLASE
        FROM VOUCHER T0 WITH (NOLOCK)
        INNER JOIN LIBROS T1 WITH (NOLOCK) ON T0.TIPOVOU = T1.CODIGO
        WHERE T0.MES = :mes
          AND T1.LIBRO = :libro
        ORDER BY T1.LIBRO + '' + T1.CODIGO + '/' + T0.NUMERO
      `;

      console.log("🔍 [REPOSITORY] Ejecutando query SQL para resumen...");
      const result = await sequelize.query<any>(query, {
        replacements: { mes, libro },
        type: QueryTypes.SELECT,
      });

      console.log(
        `✅ [REPOSITORY] Query ejecutada. Registros encontrados: ${result.length}`
      );

      // Mapear resultados a la entidad ComprobanteResumen
      const comprobantesResumen: ComprobanteResumen[] = result.map((row) => ({
        comprobante: `COMPROBANTE>>${row.COMPROBANTE}`,
        clase: `CLASE: ${row.CLASE}`,
      }));

      console.log(
        `✅ [REPOSITORY] getComprobantesResumen completado. Total: ${comprobantesResumen.length}`
      );
      return comprobantesResumen;
    } catch (error) {
      console.error("❌ Error en getComprobantesResumen:", error);
      throw error;
    }
  }
}
