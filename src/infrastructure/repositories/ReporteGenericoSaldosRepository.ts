import { injectable, inject } from "inversify";
import { IDatabaseService } from "../../domain/services/IDatabaseService";
import { IReporteGenericoSaldosRepository } from "../../domain/repositories/IReporteGenericoSaldosRepository";
import {
  ReporteGenericoSaldos,
  FiltrosReporteGenericoSaldos,
  ReporteGenericoSaldosResponse,
  EstadisticasReporteGenericoSaldos,
} from "../../domain/entities/ReporteGenericoSaldos";
import * as XLSX from "xlsx";

@injectable()
export class ReporteGenericoSaldosRepository
  implements IReporteGenericoSaldosRepository
{
  constructor(
    @inject("IDatabaseService") private databaseService: IDatabaseService
  ) {}

  /**
   * Genera el reporte genérico de saldos
   */
  async generarReporteGenericoSaldos(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad: string = "F,A",
    tipoAsiento: string = "06",
    claseAsiento: string = "C"
  ): Promise<void> {
    try {
      // Primero verificar qué esquemas están disponibles
      const schemasQuery = `
        SELECT SCHEMA_NAME 
        FROM INFORMATION_SCHEMA.SCHEMATA 
        WHERE SCHEMA_NAME NOT IN ('INFORMATION_SCHEMA', 'sys', 'guest', 'INFORMATION_SCHEMA')
        ORDER BY SCHEMA_NAME
      `;

      const schemas = await this.databaseService.ejecutarQuery(schemasQuery);
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
                      AND TABLE_NAME = 'R_XML_8DDC555F668DCE4')
        BEGIN
          CREATE TABLE ${conjunto}.R_XML_8DDC555F668DCE4 (
            sCuentaContable NVARCHAR(50),
            sDescCuentaContable NVARCHAR(255),
            sNit NVARCHAR(20),
            sRazonSocial NVARCHAR(255),
            sReferencia NVARCHAR(255),
            sCodTipoDoc NVARCHAR(10),
            sTipoDocSunat NVARCHAR(100),
            sAsiento NVARCHAR(20),
            nConsecutivo INT,
            dtFechaAsiento DATETIME,
            nSaldoLocal DECIMAL(18,2),
            nSaldoDolar DECIMAL(18,2)
          )
        END
      `;

      await this.databaseService.ejecutarNonQuery(createTableQuery);

      // Limpiar la tabla temporal
      await this.databaseService.ejecutarNonQuery(
        `DELETE FROM ${conjunto}.R_XML_8DDC555F668DCE4 WHERE 1=1`
      );

      const query = `
        INSERT INTO ${conjunto}.R_XML_8DDC555F668DCE4 (    
          sCuentaContable, sDescCuentaContable, sNit, sRazonSocial, sReferencia,  
          sCodTipoDoc, sTipoDocSunat, sAsiento, nConsecutivo, dtFechaAsiento, nSaldoLocal, nSaldoDolar
        )  
        SELECT          
          CUENTA_CONTABLE,          
          DESC_CUENTA,          
          NIT,          
          RAZON_SOCIAL,          
          REFERENCIA,          
          CODIGO,          
          DESCRIPCION,          
          MAX(CASE ORDEN WHEN 1 THEN ASIENTO ELSE '' END) ASIENTO,  
          MAX(CASE ORDEN WHEN 1 THEN CONSECUTIVO ELSE -99999999 END) CONSECUTIVO,          
          MIN(FECHA),          
          SUM(SALDO_LOCAL),          
          SUM(SALDO_DOLAR)  
        FROM (    
          SELECT  
            CUENTA_CONTABLE, DESC_CUENTA, NIT, RAZON_SOCIAL, REFERENCIA, CODIGO, DESCRIPCION, 
            ASIENTO, CONSECUTIVO, FECHA, SALDO_LOCAL, SALDO_DOLAR, 
            ROW_NUMBER() OVER (PARTITION BY CUENTA_CONTABLE, NIT, REFERENCIA ORDER BY FECHA, ASIENTO) ORDEN  
          FROM (    
            SELECT          
              M.CUENTA_CONTABLE,          
              C.DESCRIPCION DESC_CUENTA,          
              M.NIT NIT,          
              N.RAZON_SOCIAL RAZON_SOCIAL,          
              'Cuenta corriente ' + M.NIT REFERENCIA,         
              T.CODIGO,          
              T.DESCRIPCION,          
              M.ASIENTO,          
              M.CONSECUTIVO,          
              AD.FECHA FECHA,
              ( ISNULL(M.DEBITO_LOCAL, 0) - ISNULL(M.CREDITO_LOCAL, 0) ) * ( CASE C.SALDO_NORMAL WHEN 'D' THEN 1 ELSE -1 END ) SALDO_LOCAL, 
              ( ISNULL(M.DEBITO_DOLAR, 0) - ISNULL(M.CREDITO_DOLAR, 0) ) * ( CASE C.SALDO_NORMAL WHEN 'D' THEN 1 ELSE -1 END ) SALDO_DOLAR   
            FROM          
              ${conjunto}.DIARIO M  
            INNER JOIN ${conjunto}.CUENTA_CONTABLE C ON M.CUENTA_CONTABLE = C.CUENTA_CONTABLE  	
            INNER JOIN ${conjunto}.ASIENTO_DE_DIARIO AD ON AD.ASIENTO = M.ASIENTO  	  	
            LEFT OUTER JOIN ${conjunto}.NIT N ON N.NIT = M.NIT  	
            LEFT OUTER JOIN ${conjunto}.TIPO_DOC_SUNAT T ON ${conjunto}.EXACTUS_OBTENER_TIPO_DOC_PERS ( N.NIT, N.TIPO_DOC_IDENTIFICACION, N.TIPO_PERS, 1) = T.CODIGO  
            WHERE AD.FECHA >= ?                                             
            AND AD.FECHA < ?                                  
            AND AD.TIPO_ASIENTO <> ?  
            AND AD.CONTABILIDAD IN ( 'F', 'A' )          
            AND AD.CLASE_ASIENTO <> ?   
            AND NOT EXISTS ( SELECT 1 FROM ${conjunto}.proceso_cierre_cg pcg WHERE pcg.asiento_apertura = m.asiento AND pcg.asiento_apertura IS NOT NULL)   
          ) DIARIO    

          UNION ALL   

          SELECT  
            CUENTA_CONTABLE, DESC_CUENTA, NIT, RAZON_SOCIAL, REFERENCIA, CODIGO, DESCRIPCION, 
            ASIENTO, CONSECUTIVO, FECHA, SALDO_LOCAL, SALDO_DOLAR, 
            ROW_NUMBER() OVER (PARTITION BY CUENTA_CONTABLE, NIT, REFERENCIA ORDER BY FECHA, ASIENTO ) ORDEN 
          FROM (    
            SELECT          
              M.CUENTA_CONTABLE,          
              C.DESCRIPCION DESC_CUENTA,         
              M.NIT NIT,          
              N.RAZON_SOCIAL RAZON_SOCIAL,          
              'Cuenta corriente ' + M.NIT REFERENCIA,         
              T.CODIGO,          
              T.DESCRIPCION,          
              M.ASIENTO,          
              M.CONSECUTIVO,        
              M.FECHA FECHA,
              ( ISNULL(M.DEBITO_LOCAL, 0) - ISNULL(M.CREDITO_LOCAL, 0) ) * ( CASE C.SALDO_NORMAL WHEN 'D' THEN 1 ELSE -1 END ) SALDO_LOCAL,   
              ( ISNULL(M.DEBITO_DOLAR, 0) - ISNULL(M.CREDITO_DOLAR, 0) ) * ( CASE C.SALDO_NORMAL WHEN 'D' THEN 1 ELSE -1 END ) SALDO_DOLAR  
            FROM          
              ${conjunto}.MAYOR M  	
            INNER JOIN ${conjunto}.CUENTA_CONTABLE C ON M.CUENTA_CONTABLE = C.CUENTA_CONTABLE  	  	
            LEFT OUTER JOIN ${conjunto}.NIT N ON N.NIT = M.NIT  
            LEFT OUTER JOIN ${conjunto}.TIPO_DOC_SUNAT T ON ${conjunto}.EXACTUS_OBTENER_TIPO_DOC_PERS ( N.NIT, N.TIPO_DOC_IDENTIFICACION, N.TIPO_PERS, 1) = T.CODIGO   
            WHERE M.FECHA >= ?                                           
            AND M.FECHA < ?                                 
            AND M.TIPO_ASIENTO <> ?  
            AND M.CONTABILIDAD IN ( 'F', 'A' )   
            AND M.CLASE_ASIENTO != ?   
            AND NOT EXISTS ( SELECT 1 FROM ${conjunto}.proceso_cierre_cg pcg  
            WHERE pcg.asiento_apertura = m.asiento AND pcg.asiento_apertura IS NOT NULL)   
          ) MAYOR    
        ) VISTA  
        GROUP BY CUENTA_CONTABLE, DESC_CUENTA, NIT, RAZON_SOCIAL, REFERENCIA, CODIGO, DESCRIPCION    
        HAVING SUM(SALDO_LOCAL) != 0
      `;

      const params = [
        fechaInicio,
        fechaFin,
        tipoAsiento,
        claseAsiento, // Para DIARIO
        fechaInicio,
        fechaFin,
        tipoAsiento,
        claseAsiento, // Para MAYOR
      ];

      await this.databaseService.ejecutarNonQuery(query, params);
      console.log("Reporte genérico de saldos generado exitosamente");
    } catch (error) {
      console.error("Error generando reporte genérico de saldos:", error);
      throw new Error(
        `Error al generar el reporte genérico de saldos: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Obtiene los datos del reporte genérico de saldos con filtros y paginación
   */
  async obtenerReporteGenericoSaldos(
    conjunto: string,
    filtros: FiltrosReporteGenericoSaldos
  ): Promise<ReporteGenericoSaldosResponse> {
    try {
      // Verificar si la tabla temporal existe, si no existe, generar el reporte primero
      const tableExistsQuery = `
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = '${conjunto}' 
        AND TABLE_NAME = 'R_XML_8DDC555F668DCE4'
      `;

      const tableExistsResult = await this.databaseService.ejecutarQuery(
        tableExistsQuery
      );
      const tableExists = tableExistsResult[0]?.count > 0;

      if (!tableExists) {
        // Si la tabla no existe, generar el reporte primero
        console.log("Tabla temporal no existe, generando reporte primero...");
        await this.generarReporteGenericoSaldos(
          conjunto,
          filtros.usuario || "ADMIN",
          filtros.fechaInicio || new Date("2020-01-01"),
          filtros.fechaFin || new Date(),
          filtros.contabilidad || "F,A",
          filtros.tipoAsiento || "06",
          filtros.claseAsiento || "C"
        );
      }

      let whereClause = "WHERE 1=1";
      const params: any[] = [];

      // Construir filtros dinámicos
      if (filtros.cuentaContable) {
        whereClause += " AND sCuentaContable LIKE ?";
        params.push(`%${filtros.cuentaContable}%`);
      }

      if (filtros.nit) {
        whereClause += " AND sNit LIKE ?";
        params.push(`%${filtros.nit}%`);
      }

      if (filtros.razonSocial) {
        whereClause += " AND sRazonSocial LIKE ?";
        params.push(`%${filtros.razonSocial}%`);
      }

      if (filtros.codTipoDoc) {
        whereClause += " AND sCodTipoDoc = ?";
        params.push(filtros.codTipoDoc);
      }

      if (filtros.tipoDocSunat) {
        whereClause += " AND sTipoDocSunat LIKE ?";
        params.push(`%${filtros.tipoDocSunat}%`);
      }

      if (filtros.asiento) {
        whereClause += " AND sAsiento = ?";
        params.push(filtros.asiento);
      }

      if (filtros.consecutivo) {
        whereClause += " AND nConsecutivo = ?";
        params.push(filtros.consecutivo);
      }

      if (filtros.saldoLocalMin !== undefined) {
        whereClause += " AND nSaldoLocal >= ?";
        params.push(filtros.saldoLocalMin);
      }

      if (filtros.saldoLocalMax !== undefined) {
        whereClause += " AND nSaldoLocal <= ?";
        params.push(filtros.saldoLocalMax);
      }

      if (filtros.saldoDolarMin !== undefined) {
        whereClause += " AND nSaldoDolar >= ?";
        params.push(filtros.saldoDolarMin);
      }

      if (filtros.saldoDolarMax !== undefined) {
        whereClause += " AND nSaldoDolar <= ?";
        params.push(filtros.saldoDolarMax);
      }

      // Obtener el total de registros
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM ${conjunto}.R_XML_8DDC555F668DCE4 
        ${whereClause}
      `;

      const countResult = await this.databaseService.ejecutarQuery(
        countQuery,
        params
      );
      const total = countResult[0]?.total || 0;

      // Calcular paginación
      const page = filtros.page || 1;
      const limit = filtros.limit || 25;
      const offset = (page - 1) * limit;
      const totalPaginas = Math.ceil(total / limit);

      // Obtener los datos paginados
      const dataQuery = `
        SELECT 
          sCuentaContable, sDescCuentaContable, sNit, sRazonSocial, sReferencia,
          sCodTipoDoc, sTipoDocSunat, sAsiento, nConsecutivo, dtFechaAsiento, 
          nSaldoLocal, nSaldoDolar
        FROM ${conjunto}.R_XML_8DDC555F668DCE4 
        ${whereClause}
        ORDER BY sCuentaContable, sNit
        OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
      `;

      const data = await this.databaseService.ejecutarQuery(dataQuery, params);

      return {
        data: data as ReporteGenericoSaldos[],
        total,
        totalPaginas,
        paginaActual: page,
        limite: limit,
        filtros,
      };
    } catch (error) {
      console.error("Error obteniendo reporte genérico de saldos:", error);
      throw new Error(
        `Error al obtener el reporte genérico de saldos: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Exporta el reporte genérico de saldos a Excel
   */
  async exportarExcel(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad: string = "F,A",
    tipoAsiento: string = "06",
    claseAsiento: string = "C",
    limit: number = 10000
  ): Promise<Buffer> {
    try {
      // Verificar si la tabla temporal existe, si no existe, generar el reporte primero
      const tableExistsQuery = `
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = '${conjunto}' 
        AND TABLE_NAME = 'R_XML_8DDC555F668DCE4'
      `;

      const tableExistsResult = await this.databaseService.ejecutarQuery(
        tableExistsQuery
      );
      const tableExists = tableExistsResult[0]?.count > 0;

      if (!tableExists) {
        // Si la tabla no existe, generar el reporte primero
        console.log("Tabla temporal no existe, generando reporte primero...");
        await this.generarReporteGenericoSaldos(
          conjunto,
          usuario,
          fechaInicio,
          fechaFin,
          contabilidad,
          tipoAsiento,
          claseAsiento
        );
      }

      // Obtener todos los datos para exportar
      const query = `
        SELECT 
          sCuentaContable, sDescCuentaContable, sNit, sRazonSocial, sReferencia,
          sCodTipoDoc, sTipoDocSunat, sAsiento, nConsecutivo, dtFechaAsiento, 
          nSaldoLocal, nSaldoDolar
        FROM ${conjunto}.R_XML_8DDC555F668DCE4 
        ORDER BY sCuentaContable, sNit
        OFFSET 0 ROWS FETCH NEXT ? ROWS ONLY
      `;

      const data = await this.databaseService.ejecutarQuery(query, [limit]);

      // Crear el archivo Excel
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Reporte Generico Saldos"
      );

      // Convertir a buffer
      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });
      return excelBuffer;
    } catch (error) {
      console.error(
        "Error exportando reporte genérico de saldos a Excel:",
        error
      );
      throw new Error(
        `Error al exportar el reporte genérico de saldos: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Obtiene estadísticas del reporte genérico de saldos
   */
  async obtenerEstadisticas(
    conjunto: string,
    filtros: FiltrosReporteGenericoSaldos
  ): Promise<EstadisticasReporteGenericoSaldos> {
    try {
      // Verificar si la tabla temporal existe, si no existe, generar el reporte primero
      const tableExistsQuery = `
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = '${conjunto}' 
        AND TABLE_NAME = 'R_XML_8DDC555F668DCE4'
      `;

      const tableExistsResult = await this.databaseService.ejecutarQuery(
        tableExistsQuery
      );
      const tableExists = tableExistsResult[0]?.count > 0;

      if (!tableExists) {
        // Si la tabla no existe, generar el reporte primero
        console.log("Tabla temporal no existe, generando reporte primero...");
        await this.generarReporteGenericoSaldos(
          conjunto,
          filtros.usuario || "ADMIN",
          filtros.fechaInicio || new Date("2020-01-01"),
          filtros.fechaFin || new Date(),
          filtros.contabilidad || "F,A",
          filtros.tipoAsiento || "06",
          filtros.claseAsiento || "C"
        );
      }

      // Obtener estadísticas
      const statsQuery = `
        SELECT 
          COUNT(*) as totalRegistros,
          SUM(nSaldoLocal) as totalSaldoLocal,
          SUM(nSaldoDolar) as totalSaldoDolar,
          COUNT(DISTINCT sCuentaContable) as cuentasConSaldo,
          COUNT(DISTINCT sNit) as nitsUnicos
        FROM ${conjunto}.R_XML_8DDC555F668DCE4
      `;

      const stats = await this.databaseService.ejecutarQuery(statsQuery);
      const result = stats[0];

      // Obtener tipos de documento
      const tiposDocQuery = `
        SELECT sCodTipoDoc, COUNT(*) as cantidad
        FROM ${conjunto}.R_XML_8DDC555F668DCE4
        WHERE sCodTipoDoc IS NOT NULL
        GROUP BY sCodTipoDoc
      `;

      const tiposDoc = await this.databaseService.ejecutarQuery(tiposDocQuery);
      const tiposDocumento: { [key: string]: number } = {};
      tiposDoc.forEach((tipo: any) => {
        tiposDocumento[tipo.sCodTipoDoc] = tipo.cantidad;
      });

      return {
        totalRegistros: result.totalRegistros || 0,
        totalSaldoLocal: result.totalSaldoLocal || 0,
        totalSaldoDolar: result.totalSaldoDolar || 0,
        cuentasConSaldo: result.cuentasConSaldo || 0,
        cuentasSinSaldo: 0, // Se puede calcular si es necesario
        nitsUnicos: result.nitsUnicos || 0,
        tiposDocumento,
        fechaGeneracion: new Date(),
      };
    } catch (error) {
      console.error(
        "Error obteniendo estadísticas del reporte genérico de saldos:",
        error
      );
      throw new Error(
        `Error al obtener estadísticas del reporte genérico de saldos: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}
