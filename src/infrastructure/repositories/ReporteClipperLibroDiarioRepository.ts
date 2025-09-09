import { injectable } from "inversify";
import { QueryTypes } from "sequelize";
import { ClipperLibroDiario } from "../../domain/entities/LibroDiarioClipper";
import {
  IClipperLibroDiarioRepository,
  PaginationOptions,
  PaginatedResult,
} from "../../domain/repositories/IClipperLibroDiarioRepository";
import { clipperGPCDatabases } from "../database/config/clipper-gpc-database";

@injectable()
export class ReporteClipperLibroDiarioRepository
  implements IClipperLibroDiarioRepository
{
  async getComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<ClipperLibroDiario>> {
    try {
      const sequelize = clipperGPCDatabases[bdClipperGPC];
      if (!sequelize)
        throw new Error(`Base de datos "${bdClipperGPC}" no configurada.`);

      // Configurar paginación por defecto
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 50;
      const offset = (page - 1) * limit;

      // Query optimizada para obtener el total de registros
      // Usa índices en MES y TIPOVOU para mejor rendimiento
      const countQuery = `
        SELECT COUNT(*) as total
        FROM VOUCHER T0 WITH (NOLOCK)
        INNER JOIN LIBROS T1 WITH (NOLOCK) ON T0.TIPOVOU = T1.CODIGO
        WHERE T0.MES = :mes
          AND T1.LIBRO = :libro
      `;

      const countResult = await sequelize.query<{ total: number }>(countQuery, {
        replacements: { mes, libro },
        type: QueryTypes.SELECT,
      });

      const total = countResult[0]?.total || 0;

      // Query principal optimizada con paginación
      // Usa NOLOCK para mejor rendimiento en consultas de solo lectura
      // Optimizada para usar índices en MES, TIPOVOU y NUMERO
      const query = `
        SELECT
          T1.NOMBRE AS CLASE,
          T1.LIBRO + '' + T1.CODIGO + '/' + T0.NUMERO AS NUMERO_COMPROBANTE,
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
        OFFSET :offset ROWS
        FETCH NEXT :limit ROWS ONLY
      `;

      const result = await sequelize.query<ClipperLibroDiario>(query, {
        replacements: { mes, libro, offset, limit },
        type: QueryTypes.SELECT,
      });

      const totalPages = Math.ceil(total / limit);

      return {
        data: result,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    } catch (error) {
      console.error("❌ Error al obtener comprobantes por libro y mes:", error);
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      };
    }
  }

  async getComprobantesAgrupados(
    libro: string,
    mes: string,
    bdClipperGPC: string,
    pagination?: PaginationOptions
  ): Promise<
    PaginatedResult<{
      numeroComprobante: string;
      clase: string;
      totalDebe: number;
      totalHaber: number;
      detalles: ClipperLibroDiario[];
    }>
  > {
    // Para comprobantes agrupados, obtenemos todos los datos primero
    // y luego aplicamos paginación en memoria
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 50;

    const result = await this.getComprobantes(libro, mes, bdClipperGPC, {
      page: 1,
      limit: 10000,
    });

    const agrupado = result.data.reduce(
      (acc, item) => {
        const key = item.numeroComprobante;
        if (!acc[key]) {
          acc[key] = {
            numeroComprobante: key,
            clase: item.clase,
            totalDebe: 0,
            totalHaber: 0,
            detalles: [],
          };
        }

        acc[key].totalDebe += item.montod ?? 0;
        acc[key].totalHaber += item.montoh ?? 0;
        acc[key].detalles.push(item);
        return acc;
      },
      {} as Record<
        string,
        {
          numeroComprobante: string;
          clase: string;
          totalDebe: number;
          totalHaber: number;
          detalles: ClipperLibroDiario[];
        }
      >
    );

    const agrupadosArray = Object.values(agrupado);
    const total = agrupadosArray.length;
    const offset = (page - 1) * limit;
    const paginatedData = agrupadosArray.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async getComprobantePorNumero(
    numeroComprobante: string,
    bdClipperGPC: string
  ): Promise<ClipperLibroDiario | null> {
    try {
      const sequelize = clipperGPCDatabases[bdClipperGPC];
      if (!sequelize)
        throw new Error(`Base de datos "${bdClipperGPC}" no configurada.`);

      const partes = numeroComprobante.split("/");
      if (partes.length !== 2) {
        throw new Error(
          `Formato inválido de número de comprobante: "${numeroComprobante}". Debe ser 'D00/00001'.`
        );
      }

      const libroCodigo = partes[0] ?? "";
      const numero = partes[1];
      if (!libroCodigo) {
        throw new Error("Código de libro inválido o vacío.");
      }

      const codigo = libroCodigo.substring(1);
      const libro = libroCodigo[0];

      // Query optimizada para obtener detalle de comprobante
      const query = `
        SELECT
          T1.NOMBRE AS CLASE,
          T1.LIBRO + '' + T1.CODIGO + '/' + T0.NUMERO AS NUMERO_COMPROBANTE,
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
        WHERE T1.LIBRO = :libro
          AND T1.CODIGO = :codigo
          AND T0.NUMERO = :numero
        ORDER BY T0.NUMERO DESC
      `;

      const result = await sequelize.query<ClipperLibroDiario>(query, {
        replacements: { libro, codigo, numero },
        type: QueryTypes.SELECT,
      });

      return result[0] ?? null;
    } catch (error) {
      console.error("❌ Error al obtener detalle de comprobante:", error);
      return null;
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
}
