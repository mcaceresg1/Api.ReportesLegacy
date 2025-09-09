import { injectable } from "inversify";
import { IBalanceComprobacionRepository } from "../../domain/repositories/IBalanceComprobacionRepository";
import {
  BalanceComprobacion,
  BalanceComprobacionFiltros,
  BalanceComprobacionResponse,
} from "../../domain/entities/BalanceComprobacion";
import { exactusSequelize } from "../database/config/exactus-database";
import * as XLSX from "xlsx";

@injectable()
export class BalanceComprobacionRepository
  implements IBalanceComprobacionRepository
{

  /**
   * Genera el reporte de Balance de Comprobación
   */
  async generarReporteBalanceComprobacion(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad: string = "F,A",
    tipoReporte: string = "Preliminar"
  ): Promise<void> {
    try {
      // Primero verificar qué esquemas están disponibles
      const schemasQuery = `
        SELECT SCHEMA_NAME 
        FROM INFORMATION_SCHEMA.SCHEMATA 
        WHERE SCHEMA_NAME NOT IN ('INFORMATION_SCHEMA', 'sys', 'guest', 'INFORMATION_SCHEMA')
        ORDER BY SCHEMA_NAME
      `;

      const [schemas] = await exactusSequelize.query(schemasQuery);
      console.log("Esquemas disponibles:", schemas);
      console.log("Tipo de schemas:", typeof schemas);
      console.log("Es array:", Array.isArray(schemas));

      // Asegurar que schemas sea un array
      const schemasArray = Array.isArray(schemas) ? schemas : [schemas];

      // Verificar si el esquema existe
      const schemaExists = schemasArray.some(
        (schema: any) => schema.SCHEMA_NAME === conjunto
      );
      if (!schemaExists) {
        throw new Error(
          `El esquema '${conjunto}' no existe. Esquemas disponibles: ${schemasArray
            .map((s: any) => s.SCHEMA_NAME)
            .join(", ")}`
        );
      }

      // Crear la tabla temporal si no existe
      const createTableQuery = `
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES 
                      WHERE TABLE_SCHEMA = '${conjunto}' 
                      AND TABLE_NAME = 'R_XML_8DDC5522302C179')
        BEGIN
          CREATE TABLE ${conjunto}.R_XML_8DDC5522302C179 (
            CUENTA_CONTABLE NVARCHAR(50),
            DESCRIPCION NVARCHAR(255),
            CUENTA1 NVARCHAR(50),
            DESC1 NVARCHAR(255),
            CUENTA2 NVARCHAR(50),
            DESC2 NVARCHAR(255),
            CUENTA3 NVARCHAR(50),
            DESC3 NVARCHAR(255),
            CUENTA4 NVARCHAR(50),
            DESC4 NVARCHAR(255),
            CUENTA5 NVARCHAR(50),
            DESC5 NVARCHAR(255),
            SALDO_LOCAL DECIMAL(18,2),
            SALDO_DOLAR DECIMAL(18,2),
            DEBITO_LOCAL DECIMAL(18,2),
            DEBITO_DOLAR DECIMAL(18,2),
            CREDITO_LOCAL DECIMAL(18,2),
            CREDITO_DOLAR DECIMAL(18,2),
            MONEDA INT,
            NIVEL INT,
            TNIVEL1 INT,
            TNIVEL2 INT,
            TNIVEL3 INT,
            TNIVEL4 INT,
            TNIVEL5 INT,
            TNIVEL6 INT,
            TNIVEL7 INT,
            TNIVEL8 INT,
            TNIVEL9 INT,
            TNIVEL10 INT,
            TNIVEL11 INT,
            TNIVEL12 INT,
            NIVEL1 INT,
            NIVEL2 INT,
            NIVEL3 INT,
            NIVEL4 INT,
            NIVEL5 INT,
            NIVEL6 INT,
            NIVEL7 INT,
            NIVEL8 INT,
            NIVEL9 INT,
            NIVEL10 INT,
            NIVEL11 INT,
            NIVEL12 INT,
            sTIPO NVARCHAR(50),
            sTIPO_DETALLADO NVARCHAR(100),
            TIPO_REPORTE NVARCHAR(50),
            CENTRO_COSTO NVARCHAR(50),
            CUENTA6 NVARCHAR(50),
            CUENTA7 NVARCHAR(50),
            DESC6 NVARCHAR(255),
            DESC7 NVARCHAR(255),
            CUENTA8 NVARCHAR(50),
            DESC8 NVARCHAR(255),
            CUENTA9 NVARCHAR(50),
            DESC9 NVARCHAR(255),
            CUENTA10 NVARCHAR(50),
            DESC10 NVARCHAR(255),
            CUENTA11 NVARCHAR(50),
            DESC11 NVARCHAR(255)
          )
        END
      `;

      await exactusSequelize.query(createTableQuery);

      // Limpiar la tabla temporal
      await exactusSequelize.query(
        `DELETE FROM ${conjunto}.R_XML_8DDC5522302C179 WHERE 1=1`
      );

      // Consulta optimizada para mejor rendimiento - versión simplificada
      const query = `
        INSERT INTO ${conjunto}.R_XML_8DDC5522302C179 (
          CUENTA_CONTABLE,
          DESCRIPCION,
          CUENTA1, DESC1,
          CUENTA2, DESC2,
          CUENTA3, DESC3,
          CUENTA4, DESC4,
          CUENTA5, DESC5,
          SALDO_LOCAL,
          SALDO_DOLAR,
          DEBITO_LOCAL,
          DEBITO_DOLAR,
          CREDITO_LOCAL,
          CREDITO_DOLAR,
          MONEDA,
          NIVEL,
          TNIVEL1, TNIVEL2, TNIVEL3, TNIVEL4, TNIVEL5, TNIVEL6,
          TNIVEL7, TNIVEL8, TNIVEL9, TNIVEL10, TNIVEL11, TNIVEL12,
          NIVEL1, NIVEL2, NIVEL3, NIVEL4, NIVEL5, NIVEL6,
          NIVEL7, NIVEL8, NIVEL9, NIVEL10, NIVEL11, NIVEL12,
          sTIPO,
          sTIPO_DETALLADO,
          TIPO_REPORTE,
          CENTRO_COSTO,
          CUENTA6, CUENTA7, DESC6, DESC7,
          CUENTA8, DESC8, CUENTA9, DESC9,
          CUENTA10, DESC10, CUENTA11, DESC11
        )
        SELECT 
          C.CUENTA_CONTABLE,
          C.DESCRIPCION,
          SUBSTRING(C.CUENTA_CONTABLE, 1, 2) AS CUENTA1,
          ISNULL(CC1.DESCRIPCION, '') AS DESC1,
          SUBSTRING(C.CUENTA_CONTABLE, 1, 4) AS CUENTA2,
          ISNULL(CC2.DESCRIPCION, '') AS DESC2,
          SUBSTRING(C.CUENTA_CONTABLE, 1, 6) AS CUENTA3,
          ISNULL(CC3.DESCRIPCION, '') AS DESC3,
          SUBSTRING(C.CUENTA_CONTABLE, 1, 8) AS CUENTA4,
          ISNULL(CC4.DESCRIPCION, '') AS DESC4,
          SUBSTRING(C.CUENTA_CONTABLE, 1, 12) AS CUENTA5,
          ISNULL(CC5.DESCRIPCION, '') AS DESC5,
          ISNULL(SUM(BAL.SALDO_LOCAL), 0) AS SALDO_LOCAL,
          ISNULL(SUM(BAL.SALDO_DOLAR), 0) AS SALDO_DOLAR,
          ISNULL(SUM(BAL.DEBITO_LOCAL), 0) AS DEBITO_LOCAL,
          ISNULL(SUM(BAL.DEBITO_DOLAR), 0) AS DEBITO_DOLAR,
          ISNULL(SUM(BAL.CREDITO_LOCAL), 0) AS CREDITO_LOCAL,
          ISNULL(SUM(BAL.CREDITO_DOLAR), 0) AS CREDITO_DOLAR,
          0 AS MONEDA,
          1 AS NIVEL,
          0, 0, 0, 0, 0, 0, -- TNIVEL1-6
          0, 0, 0, 0, 0, 0, -- TNIVEL7-12
          0, 1, 0, 0, 0, 0, -- NIVEL1-6
          0, 0, 0, 0, 0, 0, -- NIVEL7-12
          ISNULL(C.TIPO, '') AS sTIPO,
          ISNULL(C.TIPO_DETALLADO, '') AS sTIPO_DETALLADO,
          ? AS TIPO_REPORTE,
          NULL AS CENTRO_COSTO,
          NULL, NULL, NULL, NULL, -- CUENTA6, CUENTA7, DESC6, DESC7
          NULL, NULL, NULL, NULL, -- CUENTA8, DESC8, CUENTA9, DESC9
          NULL, NULL, NULL, NULL  -- CUENTA10, DESC10, CUENTA11, DESC11
        FROM ${conjunto}.CUENTA_CONTABLE C
        LEFT JOIN ${conjunto}.CUENTA_CONTABLE CC1 ON 
          CC1.CUENTA_CONTABLE = SUBSTRING(C.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'
        LEFT JOIN ${conjunto}.CUENTA_CONTABLE CC2 ON 
          CC2.CUENTA_CONTABLE = SUBSTRING(C.CUENTA_CONTABLE, 1, 4) + '.0.0.000'
        LEFT JOIN ${conjunto}.CUENTA_CONTABLE CC3 ON 
          CC3.CUENTA_CONTABLE = SUBSTRING(C.CUENTA_CONTABLE, 1, 6) + '.0.000'
        LEFT JOIN ${conjunto}.CUENTA_CONTABLE CC4 ON 
          CC4.CUENTA_CONTABLE = SUBSTRING(C.CUENTA_CONTABLE, 1, 8) + '.000'
        LEFT JOIN ${conjunto}.CUENTA_CONTABLE CC5 ON 
          CC5.CUENTA_CONTABLE = SUBSTRING(C.CUENTA_CONTABLE, 1, 12) + ''
        LEFT JOIN (
          -- Consulta simplificada para movimientos contables
          SELECT 
            cuenta_contable,
            SUM(ISNULL(debito_local, 0) - ISNULL(credito_local, 0)) AS SALDO_LOCAL,
            SUM(ISNULL(debito_dolar, 0) - ISNULL(credito_dolar, 0)) AS SALDO_DOLAR,
            SUM(ISNULL(debito_local, 0)) AS DEBITO_LOCAL,
            SUM(ISNULL(debito_dolar, 0)) AS DEBITO_DOLAR,
            SUM(ISNULL(credito_local, 0)) AS CREDITO_LOCAL,
            SUM(ISNULL(credito_dolar, 0)) AS CREDITO_DOLAR
          FROM (
            -- Saldos iniciales simplificados
            SELECT 
              m.cuenta_contable,
              CASE WHEN m.saldo_fisc_local > 0 THEN m.saldo_fisc_local ELSE 0 END AS debito_local,
              CASE WHEN m.saldo_fisc_local < 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS credito_local,
              CASE WHEN m.saldo_fisc_dolar > 0 THEN m.saldo_fisc_dolar ELSE 0 END AS debito_dolar,
              CASE WHEN m.saldo_fisc_dolar < 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS credito_dolar
            FROM ${conjunto}.saldo m
            WHERE m.fecha <= ?
            
            UNION ALL
            
            -- Movimientos del periodo simplificados
            SELECT 
              m.cuenta_contable,
              ISNULL(m.debito_local, 0) AS debito_local,
              ISNULL(m.credito_local, 0) AS credito_local,
              ISNULL(m.debito_dolar, 0) AS debito_dolar,
              ISNULL(m.credito_dolar, 0) AS credito_dolar
            FROM ${conjunto}.asiento_de_diario am
            INNER JOIN ${conjunto}.diario m ON (am.asiento = m.asiento)
            WHERE am.fecha >= ? AND am.fecha <= ?
              AND contabilidad IN ('F', 'A')
          ) movimientos
          GROUP BY cuenta_contable
        ) BAL ON C.CUENTA_CONTABLE = BAL.cuenta_contable
        WHERE C.CUENTA_CONTABLE IS NOT NULL
        GROUP BY 
          C.CUENTA_CONTABLE,
          C.DESCRIPCION,
          C.TIPO,
          C.TIPO_DETALLADO,
          CC1.DESCRIPCION,
          CC2.DESCRIPCION,
          CC3.DESCRIPCION,
          CC4.DESCRIPCION,
          CC5.DESCRIPCION
      `;

      const fechaFinStr = fechaFin.toISOString().slice(0, 19).replace("T", " ");
      const fechaInicioStr = fechaInicio
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const fechaFinMasUno = new Date(fechaFin);
      fechaFinMasUno.setDate(fechaFinMasUno.getDate() + 1);
      const fechaFinMasUnoStr = fechaFinMasUno
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      await exactusSequelize.query(query, {
        replacements: [
          tipoReporte,
          fechaFinStr,        // Saldos hasta fecha fin
          fechaInicioStr,     // Asientos desde fecha inicio
          fechaFinStr,        // Asientos hasta fecha fin
        ]
      });
    } catch (error) {
      console.error(
        "Error generando reporte de Balance de Comprobación:",
        error
      );
      throw new Error(
        `Error al generar el reporte de Balance de Comprobación: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Obtiene los datos del Balance de Comprobación con filtros y paginación
   */
  async obtenerBalanceComprobacion(
    conjunto: string,
    filtros: BalanceComprobacionFiltros
  ): Promise<BalanceComprobacionResponse> {
    try {
      // Verificar si la tabla temporal existe, si no existe, generar el reporte primero
      const tableExistsQuery = `
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = '${conjunto}' 
        AND TABLE_NAME = 'R_XML_8DDC5522302C179'
      `;

      const [tableExistsResult] = await exactusSequelize.query(
        tableExistsQuery
      );
      const tableExists = (tableExistsResult as any[])[0]?.count > 0;

      if (!tableExists) {
        // Si la tabla no existe, generar el reporte primero
        console.log("Tabla temporal no existe, generando reporte primero...");
        await this.generarReporteBalanceComprobacion(
          conjunto,
          filtros.usuario || "ADMIN",
          filtros.fechaInicio || new Date("2020-01-01"),
          filtros.fechaFin || new Date(),
          filtros.contabilidad || "F,A",
          filtros.tipoReporte || "Preliminar"
        );
      }

      let whereClause = "WHERE 1=1";
      const params: any[] = [];

      // Construir filtros dinámicos
      if (filtros.cuentaDesde) {
        whereClause += " AND CUENTA_CONTABLE >= ?";
        params.push(filtros.cuentaDesde);
      }

      if (filtros.cuentaHasta) {
        whereClause += " AND CUENTA_CONTABLE <= ?";
        params.push(filtros.cuentaHasta);
      }

      if (filtros.tipo) {
        whereClause += " AND sTIPO = ?";
        params.push(filtros.tipo);
      }

      if (filtros.tipoDetallado) {
        whereClause += " AND sTIPO_DETALLADO = ?";
        params.push(filtros.tipoDetallado);
      }

      // Query para obtener el total de registros
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM ${conjunto}.R_XML_8DDC5522302C179 
        ${whereClause}
      `;

      const [countResult] = await exactusSequelize.query(
        countQuery,
        { replacements: params }
      );
      const total = (countResult as any[])[0]?.total || 0;

      // Query para obtener los datos paginados con formato de Balance de Comprobación
      const dataQuery = `
        SELECT 
          -- Información básica de cuenta
          ISNULL(CUENTA_CONTABLE, '') AS CUENTA_CONTABLE,
          ISNULL(DESCRIPCION, '') AS DESCRIPCION,
          ISNULL(sTIPO, '') AS sTIPO,
          ISNULL(sTIPO_DETALLADO, '') AS sTIPO_DETALLADO,
          ISNULL(TIPO_REPORTE, '') AS TIPO_REPORTE,
          ISNULL(CENTRO_COSTO, '') AS CENTRO_COSTO,
          
          -- Saldos y movimientos
          ISNULL(SALDO_LOCAL, 0) AS SALDO_LOCAL,
          ISNULL(SALDO_DOLAR, 0) AS SALDO_DOLAR,
          ISNULL(DEBITO_LOCAL, 0) AS DEBITO_LOCAL,
          ISNULL(DEBITO_DOLAR, 0) AS DEBITO_DOLAR,
          ISNULL(CREDITO_LOCAL, 0) AS CREDITO_LOCAL,
          ISNULL(CREDITO_DOLAR, 0) AS CREDITO_DOLAR,
          
          -- Jerarquía de cuentas
          ISNULL(CUENTA1, '') AS CUENTA1,
          ISNULL(DESC1, '') AS DESC1,
          ISNULL(CUENTA2, '') AS CUENTA2,
          ISNULL(DESC2, '') AS DESC2,
          ISNULL(CUENTA3, '') AS CUENTA3,
          ISNULL(DESC3, '') AS DESC3,
          ISNULL(CUENTA4, '') AS CUENTA4,
          ISNULL(DESC4, '') AS DESC4,
          ISNULL(CUENTA5, '') AS CUENTA5,
          ISNULL(DESC5, '') AS DESC5,
          ISNULL(CUENTA6, '') AS CUENTA6,
          ISNULL(DESC6, '') AS DESC6,
          ISNULL(CUENTA7, '') AS CUENTA7,
          ISNULL(DESC7, '') AS DESC7,
          ISNULL(CUENTA8, '') AS CUENTA8,
          ISNULL(DESC8, '') AS DESC8,
          ISNULL(CUENTA9, '') AS CUENTA9,
          ISNULL(DESC9, '') AS DESC9,
          ISNULL(CUENTA10, '') AS CUENTA10,
          ISNULL(DESC10, '') AS DESC10,
          ISNULL(CUENTA11, '') AS CUENTA11,
          ISNULL(DESC11, '') AS DESC11,
          
          -- Configuración de niveles
          ISNULL(MONEDA, 0) AS MONEDA,
          ISNULL(NIVEL, 0) AS NIVEL,
          ISNULL(NIVEL1, 0) AS NIVEL1,
          ISNULL(NIVEL2, 0) AS NIVEL2,
          ISNULL(NIVEL3, 0) AS NIVEL3,
          ISNULL(NIVEL4, 0) AS NIVEL4,
          ISNULL(NIVEL5, 0) AS NIVEL5,
          ISNULL(NIVEL6, 0) AS NIVEL6,
          ISNULL(NIVEL7, 0) AS NIVEL7,
          ISNULL(NIVEL8, 0) AS NIVEL8,
          ISNULL(NIVEL9, 0) AS NIVEL9,
          ISNULL(NIVEL10, 0) AS NIVEL10,
          ISNULL(NIVEL11, 0) AS NIVEL11,
          ISNULL(NIVEL12, 0) AS NIVEL12,
          
          -- Tipos de nivel
          ISNULL(TNIVEL1, 0) AS TNIVEL1,
          ISNULL(TNIVEL2, 0) AS TNIVEL2,
          ISNULL(TNIVEL3, 0) AS TNIVEL3,
          ISNULL(TNIVEL4, 0) AS TNIVEL4,
          ISNULL(TNIVEL5, 0) AS TNIVEL5,
          ISNULL(TNIVEL6, 0) AS TNIVEL6,
          ISNULL(TNIVEL7, 0) AS TNIVEL7,
          ISNULL(TNIVEL8, 0) AS TNIVEL8,
          ISNULL(TNIVEL9, 0) AS TNIVEL9,
          ISNULL(TNIVEL10, 0) AS TNIVEL10,
          ISNULL(TNIVEL11, 0) AS TNIVEL11,
          ISNULL(TNIVEL12, 0) AS TNIVEL12
        FROM ${conjunto}.R_XML_8DDC5522302C179 
        ${whereClause}
        ORDER BY CUENTA_CONTABLE
        OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
      `;

      const offset = filtros.offset || 0;
      const limit = filtros.limit || 25;
      const dataParams = [...params, offset, limit];

      const [data] = await exactusSequelize.query(
        dataQuery,
        { replacements: dataParams }
      );

      const pagina = Math.floor(offset / limit) + 1;
      const totalPaginas = Math.ceil(total / limit);

      return {
        data: data as BalanceComprobacion[],
        total,
        pagina,
        porPagina: limit,
        totalPaginas,
      };
    } catch (error) {
      console.error("Error obteniendo Balance de Comprobación:", error);
      throw new Error(
        `Error al obtener el Balance de Comprobación: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Exporta el Balance de Comprobación a Excel
   */
  async exportarExcel(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad: string = "F,A",
    tipoReporte: string = "Preliminar",
    limit: number = 10000
  ): Promise<Buffer> {
    try {
      // Verificar si la tabla temporal existe, si no existe, generar el reporte primero
      const tableExistsQuery = `
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = '${conjunto}' 
        AND TABLE_NAME = 'R_XML_8DDC5522302C179'
      `;

      const [tableExistsResult] = await exactusSequelize.query(
        tableExistsQuery
      );
      const tableExists = (tableExistsResult as any[])[0]?.count > 0;

      if (!tableExists) {
        // Si la tabla no existe, generar el reporte primero
        console.log("Tabla temporal no existe, generando reporte primero...");
        await this.generarReporteBalanceComprobacion(
          conjunto,
          usuario,
          fechaInicio,
          fechaFin,
          contabilidad,
          tipoReporte
        );
      }
      const query = `
        SELECT 
          isnull(CUENTA_CONTABLE, '') CUENTA_CONTABLE,
          isnull(sTIPO_DETALLADO, '') sTIPO_DETALLADO,
          isnull(CREDITO_LOCAL, 0) CREDITO_LOCAL,
          isnull(CREDITO_DOLAR, 0) CREDITO_DOLAR,
          isnull(DEBITO_LOCAL, 0) DEBITO_LOCAL,
          isnull(DEBITO_DOLAR, 0) DEBITO_DOLAR,
          isnull(TIPO_REPORTE, '') TIPO_REPORTE,
          isnull(CENTRO_COSTO, '') CENTRO_COSTO,
          isnull(DESCRIPCION, '') DESCRIPCION,
          isnull(SALDO_LOCAL, 0) SALDO_LOCAL,
          isnull(SALDO_DOLAR, 0) SALDO_DOLAR,
          isnull(CUENTA1, '') CUENTA1,
          isnull(CUENTA2, '') CUENTA2,
          isnull(CUENTA3, '') CUENTA3,
          isnull(TNIVEL1, 0) TNIVEL1,
          isnull(TNIVEL2, 0) TNIVEL2,
          isnull(TNIVEL3, 0) TNIVEL3,
          isnull(CUENTA4, '') CUENTA4,
          isnull(TNIVEL4, 0) TNIVEL4,
          isnull(CUENTA5, '') CUENTA5,
          isnull(TNIVEL5, 0) TNIVEL5,
          isnull(TNIVEL6, 0) TNIVEL6,
          isnull(MONEDA, 0) MONEDA,
          isnull(NIVEL1, 0) NIVEL1,
          isnull(NIVEL3, 0) NIVEL3,
          isnull(NIVEL5, 0) NIVEL5,
          isnull(NIVEL2, 0) NIVEL2,
          isnull(NIVEL6, 0) NIVEL6,
          isnull(NIVEL4, 0) NIVEL4,
          isnull(DESC1, '') DESC1,
          isnull(DESC2, '') DESC2,
          isnull(DESC3, '') DESC3,
          isnull(NIVEL, 0) NIVEL,
          isnull(sTIPO, '') sTIPO,
          isnull(DESC4, '') DESC4,
          isnull(DESC5, '') DESC5,
          isnull(CUENTA6, '') CUENTA6,
          isnull(CUENTA7, '') CUENTA7,
          isnull(DESC6, '') DESC6,
          isnull(DESC7, '') DESC7,
          isnull(NIVEL7, 0) NIVEL7,
          isnull(TNIVEL7, 0) TNIVEL7,
          isnull(NIVEL8, 0) NIVEL8,
          isnull(TNIVEL8, 0) TNIVEL8,
          isnull(CUENTA8, '') CUENTA8,
          isnull(DESC8, '') DESC8,
          isnull(CUENTA9, '') CUENTA9,
          isnull(DESC9, '') DESC9,
          isnull(NIVEL9, 0) NIVEL9,
          isnull(TNIVEL9, 0) TNIVEL9,
          isnull(CUENTA10, '') CUENTA10,
          isnull(DESC10, '') DESC10,
          isnull(NIVEL10, 0) NIVEL10,
          isnull(TNIVEL10, 0) TNIVEL10,
          isnull(CUENTA11, '') CUENTA11,
          isnull(DESC11, '') DESC11,
          isnull(NIVEL11, 0) NIVEL11,
          isnull(TNIVEL11, 0) TNIVEL11,
          isnull(NIVEL12, 0) NIVEL12,
          isnull(TNIVEL12, 0) TNIVEL12
                 FROM ${conjunto}.R_XML_8DDC5522302C179 
         ORDER BY CUENTA_CONTABLE
         OFFSET 0 ROWS FETCH NEXT ? ROWS ONLY
      `;

      const [data] = await exactusSequelize.query(query, { 
        replacements: [limit] 
      });

      // Crear workbook de Excel
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Configurar ancho de columnas
      const columnWidths = [
        { wch: 15 }, // CUENTA_CONTABLE
        { wch: 50 }, // DESCRIPCION
        { wch: 10 }, // CUENTA1
        { wch: 30 }, // DESC1
        { wch: 10 }, // CUENTA2
        { wch: 30 }, // DESC2
        { wch: 10 }, // CUENTA3
        { wch: 30 }, // DESC3
        { wch: 10 }, // CUENTA4
        { wch: 30 }, // DESC4
        { wch: 10 }, // CUENTA5
        { wch: 30 }, // DESC5
        { wch: 15 }, // SALDO_LOCAL
        { wch: 15 }, // SALDO_DOLAR
        { wch: 15 }, // DEBITO_LOCAL
        { wch: 15 }, // DEBITO_DOLAR
        { wch: 15 }, // CREDITO_LOCAL
        { wch: 15 }, // CREDITO_DOLAR
        { wch: 10 }, // MONEDA
        { wch: 10 }, // NIVEL
        { wch: 10 }, // TNIVEL1
        { wch: 10 }, // TNIVEL2
        { wch: 10 }, // TNIVEL3
        { wch: 10 }, // TNIVEL4
        { wch: 10 }, // TNIVEL5
        { wch: 10 }, // TNIVEL6
        { wch: 10 }, // TNIVEL7
        { wch: 10 }, // TNIVEL8
        { wch: 10 }, // TNIVEL9
        { wch: 10 }, // TNIVEL10
        { wch: 10 }, // TNIVEL11
        { wch: 10 }, // TNIVEL12
        { wch: 10 }, // NIVEL1
        { wch: 10 }, // NIVEL2
        { wch: 10 }, // NIVEL3
        { wch: 10 }, // NIVEL4
        { wch: 10 }, // NIVEL5
        { wch: 10 }, // NIVEL6
        { wch: 10 }, // NIVEL7
        { wch: 10 }, // NIVEL8
        { wch: 10 }, // NIVEL9
        { wch: 10 }, // NIVEL10
        { wch: 10 }, // NIVEL11
        { wch: 10 }, // NIVEL12
        { wch: 15 }, // sTIPO
        { wch: 20 }, // sTIPO_DETALLADO
        { wch: 15 }, // TIPO_REPORTE
        { wch: 15 }, // CENTRO_COSTO
        { wch: 10 }, // CUENTA6
        { wch: 10 }, // CUENTA7
        { wch: 30 }, // DESC6
        { wch: 30 }, // DESC7
        { wch: 10 }, // CUENTA8
        { wch: 30 }, // DESC8
        { wch: 10 }, // CUENTA9
        { wch: 30 }, // DESC9
        { wch: 10 }, // CUENTA10
        { wch: 30 }, // DESC10
        { wch: 10 }, // CUENTA11
        { wch: 30 }, // DESC11
      ];

      worksheet["!cols"] = columnWidths;

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Balance de Comprobación"
      );

      // Convertir a buffer
      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      return excelBuffer;
    } catch (error) {
      console.error("Error exportando Balance de Comprobación a Excel:", error);
      throw new Error(
        `Error al exportar Balance de Comprobación a Excel: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}
