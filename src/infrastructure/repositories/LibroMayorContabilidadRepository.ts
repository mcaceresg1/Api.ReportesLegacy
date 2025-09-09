import { injectable, inject } from 'inversify';
import { QueryTypes } from 'sequelize';
import { IDatabaseService } from '../../domain/services/IDatabaseService';
import { ILibroMayorContabilidadRepository } from '../../domain/repositories/ILibroMayorContabilidadRepository';
import { 
  LibroMayorContabilidad, 
  FiltrosLibroMayorContabilidad, 
  CuentaContableInfo, 
  PeriodoContableInfo 
} from '../../domain/entities/LibroMayorContabilidad';

@injectable()
export class LibroMayorContabilidadRepository implements ILibroMayorContabilidadRepository {
  constructor(
    @inject('IDatabaseService') private databaseService: IDatabaseService
  ) {}

  async obtenerCuentasContables(conjunto: string): Promise<CuentaContableInfo[]> {
    try {
      const query = `
        SELECT DISTINCT 
          SUBSTRING(C.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000' as cuenta_contable,
          C.DESCRIPCION as descripcion,
          C.SALDO_NORMAL as saldo_normal,
          C.ACEPTA_DATOS as acepta_datos
        FROM ${conjunto}.CUENTA_CONTABLE C
        WHERE C.CUENTA_CONTABLE LIKE '__.0.0.0.000'
        ORDER BY C.CUENTA_CONTABLE
      `;

      const result = await this.databaseService.ejecutarQuery(query, []);
      return result as CuentaContableInfo[];
    } catch (error) {
      console.error('Error al obtener cuentas contables:', error);
      throw error;
    }
  }

  async obtenerPeriodosContables(conjunto: string): Promise<PeriodoContableInfo[]> {
    try {
      const query = `
        SELECT 
          P.FECHA_FINAL as fecha_final,
          P.DESCRIPCION as descripcion,
          P.CONTABILIDAD as contabilidad,
          P.ESTADO as estado
        FROM ${conjunto}.PERIODO_CONTABLE P
        WHERE P.CONTABILIDAD = 'F'
        ORDER BY P.FECHA_FINAL DESC
      `;

      const result = await this.databaseService.ejecutarQuery(query, []);
      return result as PeriodoContableInfo[];
    } catch (error) {
      console.error('Error al obtener períodos contables:', error);
      throw error;
    }
  }

  async generarReporte(filtros: FiltrosLibroMayorContabilidad): Promise<LibroMayorContabilidad[]> {
    try {
      const { conjunto, fechaDesde, fechaHasta, cuentaContableDesde, cuentaContableHasta, centroCosto, tipoAsiento, origen, contabilidad, claseAsiento, limit } = filtros;

      // Crear tabla temporal si no existe
      const createTableQuery = `
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES 
                      WHERE TABLE_SCHEMA = '${conjunto}' 
                      AND TABLE_NAME = 'REPCG_MAYOR')
        BEGIN
          CREATE TABLE ${conjunto}.REPCG_MAYOR (
            CUENTA NVARCHAR(50),
            FECHA DATETIME,
            SALDO_DEUDOR DECIMAL(18,2),
            SALDO_DEUDOR_DOLAR DECIMAL(18,2),
            SALDO_ACREEDOR DECIMAL(18,2),
            SALDO_ACREEDOR_DOLAR DECIMAL(18,2),
            ASIENTO NVARCHAR(50),
            ORIGEN NVARCHAR(10),
            FUENTE NVARCHAR(50),
            REFERENCIA NVARCHAR(255),
            TIPO_LINEA NVARCHAR(10),
            DEBITO_LOCAL DECIMAL(18,2),
            DEBITO_DOLAR DECIMAL(18,2),
            CREDITO_LOCAL DECIMAL(18,2),
            CREDITO_DOLAR DECIMAL(18,2),
            CENTRO_COSTO NVARCHAR(50),
            DESCRIPCION NVARCHAR(255),
            ACEPTA INT,
            CONSECUTIVO INT,
            TIPO_ASIENTO NVARCHAR(10),
            NIT NVARCHAR(50),
            NIT_NOMBRE NVARCHAR(255),
            TIPO NVARCHAR(10),
            DOCUMENTO NVARCHAR(50),
            USUARIO NVARCHAR(50)
          )
        END
      `;
      
      await this.databaseService.ejecutarQuery(createTableQuery, []);

      // Limpiar tabla temporal
      await this.databaseService.ejecutarQuery(`DELETE FROM ${conjunto}.REPCG_MAYOR WHERE USUARIO = 'ADMPQUES'`, []);

      // Insertar saldos iniciales
      const insertSaldosIniciales = `
        INSERT INTO ${conjunto}.REPCG_MAYOR  
        (CUENTA,FECHA,SALDO_DEUDOR, SALDO_DEUDOR_DOLAR, SALDO_ACREEDOR, 
        SALDO_ACREEDOR_DOLAR,ASIENTO,ORIGEN,FUENTE,REFERENCIA,TIPO_LINEA,  
        CENTRO_COSTO, DESCRIPCION, ACEPTA, CONSECUTIVO ,TIPO_ASIENTO,NIT,NIT_NOMBRE,USUARIO)
        SELECT  CUENTA,  FECHA,  SUM ( DEBITO_LOCAL ),  SUM ( DEBITO_DOLAR ),  SUM ( CREDITO_LOCAL ),  SUM ( CREDITO_DOLAR ),
        '' ASIENTO,  '' ORIGEN,  '' FUENTE,  '' REFERENCIA,   '1' TIPO_LINEA,  '' CENTRO_COSTO, 
        DESCRIPCION,  ACEPTA,  NULL CONSECUTIVO,  NULL TIPO_ASIENTO,  NULL NIT,  NULL NIT_NOMBRE,  
        'ADMPQUES'   USUARIO    
        FROM (    
        SELECT  SUBSTRING (M.CUENTA_CONTABLE, 1, 2) CUENTA,  :fechaDesde  FECHA,   
        (CASE CC.SALDO_NORMAL WHEN 'D' THEN  ISNULL(DEBITO_LOCAL, 0)  - ISNULL(CREDITO_LOCAL, 0)  ELSE 0 END) DEBITO_LOCAL, 
        (CASE CC.SALDO_NORMAL WHEN 'D' THEN  ISNULL(DEBITO_DOLAR, 0)  - ISNULL(CREDITO_DOLAR, 0)   ELSE 0 END) DEBITO_DOLAR,  
        (CASE CC.SALDO_NORMAL WHEN 'A' THEN  ISNULL(CREDITO_LOCAL, 0)  - ISNULL(DEBITO_LOCAL, 0)  ELSE 0 END) CREDITO_LOCAL,  
        (CASE CC.SALDO_NORMAL WHEN 'A' THEN  ISNULL(CREDITO_DOLAR, 0)  - ISNULL(DEBITO_DOLAR, 0)  ELSE 0 END) CREDITO_DOLAR, 
        CC.DESCRIPCION DESCRIPCION,
        CASE CC.ACEPTA_DATOS WHEN 'N' THEN 0 ELSE 1 END ACEPTA  
        FROM  (   	
        select  	m.centro_costo,  	m.cuenta_contable,  	
        case when m.saldo_fisc_local > 0 then abs(m.saldo_fisc_local) else 0 end debito_local,  	
        case when m.saldo_fisc_local < 0 then abs(m.saldo_fisc_local) else 0 end credito_local,  	
        case when m.saldo_fisc_dolar > 0 then abs(m.saldo_fisc_dolar) else 0 end debito_dolar,  	
        case when m.saldo_fisc_dolar < 0 then abs(m.saldo_fisc_dolar) else 0 end credito_dolar   	 
        from ${conjunto}.saldo m  
        inner join ( select m.centro_costo, m.cuenta_contable, max(m.fecha) fecha  
                     from ${conjunto}.saldo m  	
                    where m.fecha <= :fechaHasta  
                    group by m.centro_costo, m.cuenta_contable  ) smax on ( m.centro_costo = smax.centro_costo and m.cuenta_contable = smax.cuenta_contable and m.fecha = smax.fecha )  
                    where 1 = 1   
                    UNION ALL    	
                    select  	m.centro_costo,  	m.cuenta_contable,  	
                    coalesce ( m.debito_local, 0 )  debito_local,  	
                    coalesce ( m.credito_local, 0 )  credito_local,  	
                    coalesce ( m.debito_dolar, 0 )  debito_dolar,  	
                    coalesce ( m.credito_dolar, 0 )  credito_dolar  	
                    from ${conjunto}.asiento_de_diario am
                    inner join ${conjunto}.diario m on ( am.asiento = m.asiento ) 
                    where am.fecha <= :fechaHasta                                      
                    and contabilidad in  ( 'F', 'A' )  ) m  	
                    INNER JOIN ${conjunto}.CUENTA_CONTABLE  CC  		
                    ON CC.CUENTA_CONTABLE=SUBSTRING (M.CUENTA_CONTABLE,1, 2) + '.0.0.0.000' )  VISTA  GROUP BY CUENTA, FECHA, DESCRIPCION, ACEPTA
      `;

      await this.databaseService.ejecutarQuery(insertSaldosIniciales, [fechaDesde, fechaHasta]);

      // Insertar movimientos del mayor
      const insertMovimientosMayor = `
        INSERT INTO ${conjunto}.REPCG_MAYOR  
        (CUENTA,FECHA,ASIENTO,ORIGEN,FUENTE,REFERENCIA,TIPO_LINEA, DEBITO_LOCAL ,DEBITO_DOLAR,CREDITO_LOCAL,CREDITO_DOLAR, 
        CENTRO_COSTO, DESCRIPCION, ACEPTA, CONSECUTIVO ,TIPO_ASIENTO,NIT,NIT_NOMBRE,TIPO,DOCUMENTO, USUARIO    )   
        SELECT  SUBSTRING (M.CUENTA_CONTABLE,1, 2),  M.FECHA,  M.ASIENTO,  M.ORIGEN,  M.FUENTE,   M.REFERENCIA ,  
        '2' TIPO_LINEA,  M.DEBITO_LOCAL,  M.DEBITO_DOLAR,  M.CREDITO_LOCAL,  M.CREDITO_DOLAR,  M.CENTRO_COSTO,  CC.DESCRIPCION, 
        CASE CC.ACEPTA_DATOS WHEN 'N' THEN 0  ELSE 1 END,  M.CONSECUTIVO,  M.TIPO_ASIENTO,  M.NIT, N.RAZON_SOCIAL, 
        CASE WHEN M.ORIGEN IN ( 'CP', 'CB', 'CC', 'FEE', 'PY', 'MT', 'IC' ) THEN SUBSTRING ( M.FUENTE, 1, 3)  WHEN M.ORIGEN = 'CJ' THEN   SUBSTRING( M.FUENTE, 1, 3 )  ELSE  '' END,  
        CASE WHEN M.ORIGEN IN ( 'CP', 'CB', 'CC', 'FEE', 'IC' ) THEN SUBSTRING(M.FUENTE,4, 40 )	 WHEN M.ORIGEN = 'CJ' THEN   SUBSTRING( M.FUENTE, 4, 40 )  ELSE '' END, 
        'ADMPQUES'                
        FROM  ${conjunto}.MAYOR M   
        INNER JOIN ${conjunto}.CUENTA_CONTABLE CC  		
        ON CC.CUENTA_CONTABLE=SUBSTRING (M.CUENTA_CONTABLE,1, 2)  + '.0.0.0.000'  	
        INNER JOIN ${conjunto}.NIT N  ON M.NIT = N.NIT  	   
        WHERE  M.CONTABILIDAD IN ('A','F') 
        AND  M.FECHA   >= :fechaDesde                        
        AND M.FECHA  <= :fechaHasta                      
        AND M.CLASE_ASIENTO != 'C'
      `;

      await this.databaseService.ejecutarQuery(insertMovimientosMayor, [fechaDesde, fechaHasta]);

      // Insertar movimientos del diario
      const insertMovimientosDiario = `
        INSERT INTO ${conjunto}.REPCG_MAYOR  (CUENTA,FECHA,ASIENTO,ORIGEN,FUENTE,REFERENCIA,TIPO_LINEA, DEBITO_LOCAL ,DEBITO_DOLAR,CREDITO_LOCAL,CREDITO_DOLAR,  
        CENTRO_COSTO, DESCRIPCION, ACEPTA,  CONSECUTIVO ,TIPO_ASIENTO,NIT,NIT_NOMBRE,TIPO,DOCUMENTO,USUARIO    )    
        SELECT  SUBSTRING (M.CUENTA_CONTABLE,1, 2),  A.FECHA,  M.ASIENTO,  A.ORIGEN,  M.FUENTE,   M.REFERENCIA ,  '2' TIPO_LINEA,  
        M.DEBITO_LOCAL,  M.DEBITO_DOLAR,  M.CREDITO_LOCAL,  M.CREDITO_DOLAR,  M.CENTRO_COSTO,  CC.DESCRIPCION,  
        CASE CC.ACEPTA_DATOS  WHEN 'N' THEN 0  ELSE 1  END,  M.CONSECUTIVO,  
        A.TIPO_ASIENTO,  M.NIT, N.RAZON_SOCIAL, 
        CASE WHEN A.ORIGEN IN ( 'CP', 'CB', 'CC', 'FEE', 'PY', 'MT', 'IC' ) THEN SUBSTRING ( M.FUENTE, 1, 3) WHEN A.ORIGEN = 'CJ' THEN   SUBSTRING( M.FUENTE, 1, 3 )  ELSE  '' END,  
        CASE WHEN A.ORIGEN IN ( 'CP', 'CB', 'CC', 'FEE', 'IC' ) THEN SUBSTRING(M.FUENTE,4, 40 ) WHEN A.ORIGEN = 'CJ' THEN   SUBSTRING( M.FUENTE, 4, 40 )  ELSE '' END,  
        'ADMPQUES'              
        FROM  ${conjunto}.DIARIO M   	
        INNER JOIN ${conjunto}.ASIENTO_DE_DIARIO A  		ON M.ASIENTO=A.ASIENTO  	
        INNER JOIN ${conjunto}.CUENTA_CONTABLE CC  		ON CC.CUENTA_CONTABLE=SUBSTRING (M.CUENTA_CONTABLE,1, 2)  + '.0.0.0.000'	
        INNER JOIN ${conjunto}.NIT N  		ON M.NIT = N.NIT  	    
        WHERE  A.CONTABILIDAD IN ('A','F') 
        AND  A.FECHA   >= :fechaDesde                         
        AND A.FECHA  <= :fechaHasta                       
        AND A.CLASE_ASIENTO != 'C'
      `;

      await this.databaseService.ejecutarQuery(insertMovimientosDiario, [fechaDesde, fechaHasta]);

      // Actualizar período contable
      const updatePeriodoContable = `
        UPDATE ${conjunto}.REPCG_MAYOR  	
        SET PERIODO_CONTABLE =  	
        ( SELECT MIN( FECHA_FINAL ) 
        FROM ${conjunto}.PERIODO_CONTABLE P  
        WHERE  P.CONTABILIDAD IN ( 'A', 'F' )  AND ${conjunto}.REPCG_MAYOR.FECHA < P.FECHA_FINAL + 1 )	  	
        WHERE USUARIO = 'ADMPQUES'
      `;

      await this.databaseService.ejecutarQuery(updatePeriodoContable, []);

      // Insertar en tabla de resultados
      const insertResultados = `
        INSERT INTO ${conjunto}.R_XML_8DDC3925E54E9CF (  PERIODO_CONTABLE,  CUENTA_CONTABLE,  DESCRIPCION,  ASIENTO,  TIPO,  DOCUMENTO,  REFERENCIA,  
        DEBITO_LOCAL,  DEBITO_DOLAR_MAYOR,  CREDITO_LOCAL,  CREDITO_DOLAR_MAYOR,  SALDO_DEUDOR,  SALDO_DEUDOR_DOLAR,  SALDO_ACREEDOR,  
        SALDO_ACREEDOR_DOLAR,  CENTRO_COSTO,  TIPO_ASIENTO,  FECHA,  NIT,  NIT_NOMBRE,  FUENTE,  CONSECUTIVO,  CORRELATIVO_ASIENTO,  TIPO_LINEA   )
        SELECT  PERIODO_CONTABLE,  CUENTA,  DESCRIPCION,  ASIENTO,  TIPO,  DOCUMENTO,  REFERENCIA,  COALESCE ( DEBITO_LOCAL, 0), 
        COALESCE ( DEBITO_DOLAR, 0),  COALESCE ( CREDITO_LOCAL, 0),  COALESCE ( CREDITO_DOLAR, 0),  COALESCE ( SALDO_DEUDOR, 0),  
        COALESCE ( SALDO_DEUDOR_DOLAR, 0),  COALESCE ( SALDO_ACREEDOR, 0),  COALESCE ( SALDO_ACREEDOR_DOLAR, 0),  
        CENTRO_COSTO,  TIPO_ASIENTO,  FECHA,  NIT,  NIT_NOMBRE,  FUENTE,  CONSECUTIVO,  CORRELATIVO_ASIENTO, 
        TIPO_LINEA  FROM ${conjunto}.REPCG_MAYOR  WHERE USUARIO = 'ADMPQUES'
      `;

      await this.databaseService.ejecutarQuery(insertResultados, []);

      // Obtener resultados finales
      const selectResultados = `
        SELECT 
          ISNULL(SALDO_ACREEDOR_DOLAR, 0) as saldo_acreedor_dolar,
          ISNULL(CREDITO_DOLAR_MAYOR, 0) as credito_dolar_mayor,
          ISNULL(CORRELATIVO_ASIENTO, '') as correlativo_asiento,
          ISNULL(SALDO_DEUDOR_DOLAR, 0) as saldo_deudor_dolar,
          ISNULL(DEBITO_DOLAR_MAYOR, 0) as debito_dolar_mayor,
          ISNULL(CUENTA_CONTABLE, '') as cuenta_contable,
          ISNULL(SALDO_ACREEDOR, 0) as saldo_acreedor,
          ISNULL(CREDITO_DOLAR, 0) as credito_dolar,
          ISNULL(CREDITO_LOCAL, 0) as credito_local,
          ISNULL(SALDO_DEUDOR, 0) as saldo_deudor,
          ISNULL(DEBITO_DOLAR, 0) as debito_dolar,
          ISNULL(DEBITO_LOCAL, 0) as debito_local,
          ISNULL(CENTRO_COSTO, '') as centro_costo,
          ISNULL(TIPO_ASIENTO, '') as tipo_asiento,
          ISNULL(DESCRIPCION, '') as descripcion,
          ISNULL(CONSECUTIVO, 0) as consecutivo,
          ISNULL(REFERENCIA, '') as referencia,
          ISNULL(NIT_NOMBRE, '') as nit_nombre,
          ISNULL(DOCUMENTO, '') as documento,
          ISNULL(CREDITO, 0) as credito,
          ISNULL(ASIENTO, '') as asiento,
          ISNULL(DEBITO, 0) as debito,
          FECHA as fecha,
          ISNULL(TIPO, '') as tipo,
          ISNULL(NIT, '') as nit,
          ISNULL(FUENTE, '') as fuente,
          PERIODO_CONTABLE as periodo_contable,
          TIPO_LINEA as tipo_linea
        FROM ${conjunto}.R_XML_8DDC3925E54E9CF 
        ORDER BY PERIODO_CONTABLE, CUENTA_CONTABLE, TIPO_LINEA, FECHA, ASIENTO
        ${limit ? `OFFSET 0 ROWS FETCH NEXT ${limit} ROWS ONLY` : ''}
      `;

      const result = await this.databaseService.ejecutarQuery(selectResultados, []);
      return result as LibroMayorContabilidad[];
    } catch (error) {
      console.error('Error al generar reporte de Libro Mayor de Contabilidad:', error);
      throw error;
    }
  }

  async obtenerLibroMayorContabilidad(filtros: FiltrosLibroMayorContabilidad): Promise<{
    data: LibroMayorContabilidad[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    try {
      const { conjunto, limit = 1000 } = filtros;
      const page = 1; // Por ahora usamos página 1 por defecto
      const pageSize = limit;
      const offset = (page - 1) * pageSize;

      // Primero generar el reporte
      await this.generarReporte(filtros);

      // Contar total de registros
      const countQuery = `
        SELECT COUNT(*) as total
        FROM ${conjunto}.R_XML_8DDC3925E54E9CF
      `;
      const countResult = await this.databaseService.ejecutarQuery(countQuery, []);
      const total = (countResult[0] as any).total;

      // Obtener datos paginados
      const dataQuery = `
        SELECT 
          ISNULL(SALDO_ACREEDOR_DOLAR, 0) as saldo_acreedor_dolar,
          ISNULL(CREDITO_DOLAR_MAYOR, 0) as credito_dolar_mayor,
          ISNULL(CORRELATIVO_ASIENTO, '') as correlativo_asiento,
          ISNULL(SALDO_DEUDOR_DOLAR, 0) as saldo_deudor_dolar,
          ISNULL(DEBITO_DOLAR_MAYOR, 0) as debito_dolar_mayor,
          ISNULL(CUENTA_CONTABLE, '') as cuenta_contable,
          ISNULL(SALDO_ACREEDOR, 0) as saldo_acreedor,
          ISNULL(CREDITO_DOLAR, 0) as credito_dolar,
          ISNULL(CREDITO_LOCAL, 0) as credito_local,
          ISNULL(SALDO_DEUDOR, 0) as saldo_deudor,
          ISNULL(DEBITO_DOLAR, 0) as debito_dolar,
          ISNULL(DEBITO_LOCAL, 0) as debito_local,
          ISNULL(CENTRO_COSTO, '') as centro_costo,
          ISNULL(TIPO_ASIENTO, '') as tipo_asiento,
          ISNULL(DESCRIPCION, '') as descripcion,
          ISNULL(CONSECUTIVO, 0) as consecutivo,
          ISNULL(REFERENCIA, '') as referencia,
          ISNULL(NIT_NOMBRE, '') as nit_nombre,
          ISNULL(DOCUMENTO, '') as documento,
          ISNULL(CREDITO, 0) as credito,
          ISNULL(ASIENTO, '') as asiento,
          ISNULL(DEBITO, 0) as debito,
          FECHA as fecha,
          ISNULL(TIPO, '') as tipo,
          ISNULL(NIT, '') as nit,
          ISNULL(FUENTE, '') as fuente,
          PERIODO_CONTABLE as periodo_contable,
          TIPO_LINEA as tipo_linea
        FROM ${conjunto}.R_XML_8DDC3925E54E9CF 
        ORDER BY PERIODO_CONTABLE, CUENTA_CONTABLE, TIPO_LINEA, FECHA, ASIENTO
        OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY
      `;

      const data = await this.databaseService.ejecutarQuery(dataQuery, []) as LibroMayorContabilidad[];
      const totalPages = Math.ceil(total / pageSize);

      return {
        data,
        total,
        page,
        pageSize,
        totalPages
      };
    } catch (error) {
      console.error('Error al obtener Libro Mayor de Contabilidad:', error);
      throw error;
    }
  }

  async exportarExcel(filtros: FiltrosLibroMayorContabilidad): Promise<Buffer> {
    try {
      // Generar el reporte primero
      const data = await this.generarReporte(filtros);
      
      // Aquí se implementaría la lógica de exportación a Excel
      // Por ahora retornamos un buffer vacío
      return Buffer.from('');
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      throw error;
    }
  }

  async exportarPDF(filtros: FiltrosLibroMayorContabilidad): Promise<Buffer> {
    try {
      // Generar el reporte primero
      const data = await this.generarReporte(filtros);
      
      // Aquí se implementaría la lógica de exportación a PDF
      // Por ahora retornamos un buffer vacío
      return Buffer.from('');
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      throw error;
    }
  }
}
