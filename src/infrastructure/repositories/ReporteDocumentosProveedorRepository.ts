import { injectable } from "inversify";
import { QueryTypes } from "sequelize";
import { exactusSequelize } from "../../infrastructure/database/config/exactus-database";
import { IReporteDocumentosProveedorRepository } from "../../domain/repositories/IReporteDocumentosProveedorRepository";
import {
  DocumentosPorPagar,
  ProveedorFiltro,
  ReporteProveedor,
} from "../../domain/entities/ReporteDocumentosProveedor";

@injectable()
export class ReporteDocumentosProveedorRepository
  implements IReporteDocumentosProveedorRepository
{
  /**
   * Obtiene la lista de proveedores filtrados por un valor específico.
   * @param conjunto Nombre del esquema/base de datos
   */

  async obtenerProveedor(
    conjunto: string,
    filtro: string
  ): Promise<ProveedorFiltro[]> {
    try {
      // Si no hay filtro, retornar los primeros 50 proveedores activos
      if (!filtro || filtro.trim() === "") {
        const querySinFiltro = `
          SELECT TOP 50
            proveedor,
            nombre,
            alias,
            activo,
            moneda,
            saldo
          FROM ${conjunto}.proveedor
          WHERE activo = 'S'
          ORDER BY nombre ASC
        `;

        const result = await exactusSequelize.query<ProveedorFiltro>(
          querySinFiltro,
          {
            type: QueryTypes.SELECT,
          }
        );

        return result;
      }

      // Búsqueda con filtro optimizada
      const query = `
        SELECT TOP 100
          proveedor,
          nombre,
          alias,
          activo,
          moneda,
          saldo
        FROM ${conjunto}.proveedor
        WHERE (nombre LIKE :filtro OR proveedor LIKE :filtro)
          AND activo = 'S'
        ORDER BY 
          CASE 
            WHEN proveedor LIKE :filtroExacto THEN 1
            WHEN nombre LIKE :filtroExacto THEN 2
            WHEN proveedor LIKE :filtro THEN 3
            ELSE 4
          END,
          nombre ASC
      `;

      const filtroLimpio = filtro.trim();
      const result = await exactusSequelize.query<ProveedorFiltro>(query, {
        replacements: {
          filtro: `%${filtroLimpio}%`,
          filtroExacto: `${filtroLimpio}%`,
        },
        type: QueryTypes.SELECT,
      });

      return result;
    } catch (error) {
      console.error("Error al buscar proveedores:", error);
      return [];
    }
  }

  /**
   * Obtiene los documentos asociados a un proveedor entre un rango de fechas.
   *
   * @param conjunto Nombre del esquema/base de datos
   * @param proveedor Código del proveedor
   * @param fechaInicio Fecha inicial del rango
   * @param fechaFin Fecha final del rango
   */
  async obtenerReporteDocumentosPorProveedor(
    conjunto: string,
    proveedor: string,
    fechaInicio: string,
    fechaFin: string
  ): Promise<ReporteProveedor[]> {
    try {
      const query = `
        SELECT 
          dcp.proveedor,pro.nombre,dcp.fecha_vence,dcp.tipo,dcp.documento,dcp.aplicacion,dcp.moneda,dcp.monto
        FROM ${conjunto}.documentos_cp dcp
        INNER JOIN ${conjunto}.subtipo_doc_cp sdc 
          ON dcp.tipo = sdc.tipo AND dcp.subtipo = sdc.subtipo
        INNER JOIN ${conjunto}.proveedor pro 
          ON pro.proveedor = dcp.proveedor
        INNER JOIN ${conjunto}.condicion_pago cop 
          ON dcp.condicion_pago = cop.condicion_pago
        WHERE 
        dcp.proveedor >= :proveedor  AND dcp.proveedor <= :proveedor  
          AND pro.contribuyente LIKE :rucLike
          AND dcp.fecha_documento BETWEEN :fechaInicio AND :fechaFin
        ORDER BY dcp.proveedor ASC
      `;

      const result = await exactusSequelize.query<ReporteProveedor>(query, {
        replacements: {
          proveedor,
          rucLike: `${proveedor}%`,
          fechaInicio,
          fechaFin,
        },
        type: QueryTypes.SELECT,
      });

      return result;
    } catch (error) {
      console.error(
        "Error al obtener reporte de documentos por proveedor:",
        error
      );
      return [];
    }
  }

  /**
   * Obtiene los documentos de proveedores con filtro de fechas.
   * @param conjunto Nombre del esquema/base de datos
   * @param fechaInicio Fecha inicial del rango
   * @param fechaFin Fecha final del rango
   */
  async obtenerDocumentos(
    conjunto: string,
    fechaInicio: string,
    fechaFin: string
  ): Promise<any[]> {
    try {
      console.log("🔍 [Repository] Obteniendo documentos con parámetros:", {
        conjunto,
        fechaInicio,
        fechaFin,
      });

      const query = `
        SELECT           
          dcp.proveedor,
          pro.nombre,
          dcp.fecha_vence,
          dcp.tipo,
          dcp.documento,
          dcp.aplicacion,
          dcp.moneda,
          dcp.monto       
        FROM ${conjunto}.documentos_cp dcp        
        INNER JOIN ${conjunto}.subtipo_doc_cp sdc           
          ON dcp.tipo = sdc.tipo AND dcp.subtipo = sdc.subtipo      
        INNER JOIN ${conjunto}.proveedor pro           
          ON pro.proveedor = dcp.proveedor    
        INNER JOIN ${conjunto}.condicion_pago cop           
          ON dcp.condicion_pago = cop.condicion_pago     
        WHERE dcp.proveedor like '%'     
          AND dcp.fecha_documento BETWEEN :fechaInicio AND :fechaFin
        ORDER BY dcp.proveedor ASC
      `;

      const fechaInicioISO = fechaInicio
        ? new Date(fechaInicio).toISOString().split("T")[0]
        : "1900-01-01";
      const fechaFinISO = fechaFin
        ? new Date(fechaFin).toISOString().split("T")[0]
        : "9999-12-31";

      console.log("📋 [Repository] Parámetros procesados:", {
        fechaInicio: fechaInicioISO,
        fechaFin: fechaFinISO,
      });

      const result = await exactusSequelize.query(query, {
        replacements: {
          fechaInicio: fechaInicioISO,
          fechaFin: fechaFinISO,
        },
        type: QueryTypes.SELECT,
      });

      console.log("📊 [Repository] Documentos obtenidos:", {
        cantidad: result?.length || 0,
        primerosElementos: result?.slice(0, 2) || [],
      });

      return result;
    } catch (error) {
      console.error("❌ [Repository] Error al obtener documentos:", error);
      return [];
    }
  }

  async obtenerReporteDocumentosPorPagar(
    conjunto: string,
    proveedor: string,
    fechaInicio: string,
    fechaFin: string
  ): Promise<DocumentosPorPagar[]> {
    try {
      console.log("🔍 [Repository] Parámetros recibidos:", {
        conjunto,
        proveedor,
        fechaInicio,
        fechaFin,
      });
      console.log("🔍 [Repository] Tipo de proveedor:", typeof proveedor);
      console.log(
        "🔍 [Repository] Proveedor es undefined?",
        proveedor === undefined
      );
      console.log("🔍 [Repository] Proveedor es null?", proveedor === null);
      console.log(
        "🔍 [Repository] Proveedor es string vacío?",
        proveedor === ""
      );

      const query = `
        SELECT
          P.CONTRIBUYENTE,
          P.NOMBRE,
          DCP.FECHA_DOCUMENTO,
          DCP.DOCUMENTO,
          DCP.TIPO,
          DCP.APLICACION,
          AD.FECHA,
          DCP.ASIENTO,
          CASE WHEN DCP.TIPO IN ('CHQ', 'TEF', 'RET', 'N/C', 'O/C', 'CNJ') THEN DCP.MONTO_LOCAL ELSE 0 END AS DEBE_LOC,
          CASE WHEN DCP.TIPO IN ('FAC', 'B/V', 'L/C', 'RHP', 'INT', 'N/D', 'O/D') THEN DCP.MONTO_LOCAL ELSE 0 END AS HABER_LOC,
          CASE WHEN DCP.TIPO IN ('CHQ', 'TEF', 'RET', 'N/C', 'O/C', 'CNJ') THEN DCP.MONTO_DOLAR ELSE 0 END AS DEBE_DOL,
          CASE WHEN DCP.TIPO IN ('FAC', 'B/V', 'L/C', 'RHP', 'INT', 'N/D', 'O/D') THEN DCP.MONTO_DOLAR ELSE 0 END AS HABER_DOL,
          DCP.MONEDA
        FROM ${conjunto}.PROVEEDOR P
        INNER JOIN ${conjunto}.DOCUMENTOS_CP DCP ON DCP.PROVEEDOR = P.PROVEEDOR
        INNER JOIN ${conjunto}.SUBTIPO_DOC_CP SDC ON SDC.TIPO = DCP.TIPO AND SDC.SUBTIPO = DCP.SUBTIPO
        INNER JOIN ${conjunto}.ASIENTO_DE_DIARIO AD ON DCP.ASIENTO = AD.ASIENTO
        WHERE
          DCP.TIPO IN ('B/V', 'CHQ', 'CNJ', 'DCC', 'DEP')
          AND (:proveedor = '' OR P.PROVEEDOR = :proveedor)
          AND AD.FECHA >= :fechaInicio
          AND AD.FECHA <= :fechaFin
  
        UNION ALL
  
        SELECT
          P.CONTRIBUYENTE,
          P.NOMBRE,
          DCP.FECHA_DOCUMENTO,
          DCP.DOCUMENTO,
          DCP.TIPO,
          DCP.APLICACION,
          AM.FECHA,
          DCP.ASIENTO,
          CASE WHEN DCP.TIPO IN ('CHQ', 'TEF', 'RET', 'N/C', 'O/C', 'CNJ') THEN DCP.MONTO_LOCAL ELSE 0 END AS DEBE_LOC,
          CASE WHEN DCP.TIPO IN ('FAC', 'B/V', 'L/C', 'RHP', 'INT', 'N/D', 'O/D') THEN DCP.MONTO_LOCAL ELSE 0 END AS HABER_LOC,
          CASE WHEN DCP.TIPO IN ('CHQ', 'TEF', 'RET', 'N/C', 'O/C', 'CNJ') THEN DCP.MONTO_DOLAR ELSE 0 END AS DEBE_DOL,
          CASE WHEN DCP.TIPO IN ('FAC', 'B/V', 'L/C', 'RHP', 'INT', 'N/D', 'O/D') THEN DCP.MONTO_DOLAR ELSE 0 END AS HABER_DOL,
          DCP.MONEDA
        FROM ${conjunto}.PROVEEDOR P
        INNER JOIN ${conjunto}.DOCUMENTOS_CP DCP ON DCP.PROVEEDOR = P.PROVEEDOR
        INNER JOIN ${conjunto}.SUBTIPO_DOC_CP SDC ON SDC.TIPO = DCP.TIPO AND SDC.SUBTIPO = DCP.SUBTIPO
        INNER JOIN ${conjunto}.ASIENTO_MAYORIZADO AM ON DCP.ASIENTO = AM.ASIENTO
        WHERE
          DCP.TIPO IN ('B/V', 'CHQ', 'CNJ', 'DCC', 'DEP')
          AND (:proveedor = '' OR P.PROVEEDOR = :proveedor)
          AND AM.FECHA >= :fechaInicio
          AND AM.FECHA <= :fechaFin
      `;

      const fechaInicioISO = fechaInicio
        ? new Date(fechaInicio).toISOString().split("T")[0]
        : "1900-01-01";
      const fechaFinISO = fechaFin
        ? new Date(fechaFin).toISOString().split("T")[0]
        : "9999-12-31";
      const proveedorFinal = proveedor || "";

      console.log("📋 [Repository] Parámetros procesados para la consulta:", {
        proveedor: proveedorFinal,
        fechaInicio: fechaInicioISO,
        fechaFin: fechaFinISO,
      });

      console.log("🔍 [Repository] Ejecutando consulta SQL...");
      const result = await exactusSequelize.query<DocumentosPorPagar>(query, {
        replacements: {
          proveedor: proveedorFinal,
          fechaInicio: fechaInicioISO,
          fechaFin: fechaFinISO,
        },
        type: QueryTypes.SELECT,
      });

      console.log("📊 [Repository] Resultado de la consulta:", {
        cantidad: result?.length || 0,
        primerosElementos: result?.slice(0, 2) || [],
      });

      // Log detallado del primer elemento para debugging
      if (result && result.length > 0) {
        const firstElement = result[0] as any;
        console.log("🔍 [Repository] Primer elemento detallado:", {
          CONTRIBUYENTE: firstElement.CONTRIBUYENTE,
          NOMBRE: firstElement.NOMBRE,
          TIPO: firstElement.TIPO,
          DEBE_LOC: firstElement.DEBE_LOC,
          HABER_LOC: firstElement.HABER_LOC,
          DEBE_DOL: firstElement.DEBE_DOL,
          HABER_DOL: firstElement.HABER_DOL,
          MONEDA: firstElement.MONEDA,
        });
      }

      return result;
    } catch (error) {
      console.error(
        "❌ [Repository] Error al obtener reporte de documentos por proveedor:",
        error
      );
      return [];
    }
  }
}
