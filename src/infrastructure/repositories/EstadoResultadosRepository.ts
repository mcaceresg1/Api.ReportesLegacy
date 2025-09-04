import { injectable, inject } from 'inversify';
import { IDatabaseService } from '../../domain/services/IDatabaseService';
import { TYPES } from '../container/types';
import { EstadoResultados, FiltrosEstadoResultados, TipoEgp, PeriodoContable } from '../../domain/entities/EstadoResultados';

@injectable()
export class EstadoResultadosRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private databaseService: IDatabaseService
  ) {}

  async getTiposEgp(conjunto: string, usuario: string): Promise<TipoEgp[]> {
    const query = `
      SELECT cast ( UPPER(T.TIPO) + '' + T.DESCRIPCION + '' + T.QRP as varchar(1000) ) as tipo_descripcion_qrp
      FROM ${conjunto}.TIPO_EGP T 
      INNER JOIN ${conjunto}.USUARIO_EGP U ON T.TIPO=U.TIPO AND U.USUARIO = @usuario      
      WHERE 1 = 1 AND T.TIPO NOT IN ( '10.1', '10.2' )   	
      AND ( T.TIPO NOT LIKE '320%' OR T.TIPO = '320' )    	
      AND ( T.TIPO NOT LIKE '324%' OR T.TIPO = '324'  ) 
      ORDER BY 1
    `;

    const result = await this.databaseService.ejecutarQuery(query, [usuario]);
    
    return result.map((row: any) => ({
      tipo: row.tipo_descripcion_qrp?.split(' ')[0] || '',
      descripcion: row.tipo_descripcion_qrp?.split(' ').slice(1, -1).join(' ') || '',
      qrp: row.tipo_descripcion_qrp?.split(' ').pop() || ''
    }));
  }

  async getPeriodosContables(conjunto: string, fecha: string): Promise<PeriodoContable[]> {
    const query = `
      SELECT descripcion, contabilidad, estado 
      FROM ${conjunto}.periodo_contable                                   
      WHERE fecha_final = @fecha
      AND contabilidad = 'F'
    `;

    const result = await this.databaseService.ejecutarQuery(query, [fecha]);
    
    return result.map((row: any) => ({
      descripcion: row.descripcion || '',
      contabilidad: row.contabilidad || '',
      estado: row.estado || ''
    }));
  }

  async getEstadoResultados(
    conjunto: string, 
    usuario: string, 
    filtros: FiltrosEstadoResultados,
    page: number = 1,
    pageSize: number = 20
  ): Promise<EstadoResultados[]> {
    // Crear tabla temporal para los resultados
    const createTableQuery = `
      CREATE TABLE ${conjunto}.R_XML_8DDC9208B6470F8 (
        cuenta_contable VARCHAR(254), 
        fecha_balance DATETIME, 
        saldo_inicial DECIMAL(32,12), 
        nombre_cuenta VARCHAR(254), 
        fecha_inicio DATETIME, 
        fecha_cuenta DATETIME, 
        saldo_final DECIMAL(32,12), 
        tiporeporte VARCHAR(254),
        posicion VARCHAR(254), 
        caracter VARCHAR(254), 
        moneda VARCHAR(254), 
        padre VARCHAR(254), 
        orden DECIMAL(32,12), 
        mes VARCHAR(254),
        ROW_ORDER_BY INT NOT NULL IDENTITY PRIMARY KEY
      )
    `;

    // Limpiar tabla temporal si existe
    await this.databaseService.ejecutarQuery(`DROP TABLE IF EXISTS ${conjunto}.R_XML_8DDC9208B6470F8`, []);
    
    // Crear tabla temporal
    await this.databaseService.ejecutarQuery(createTableQuery, []);

    // Insertar datos del período actual
    const insertCurrentPeriodQuery = `
      INSERT INTO ${conjunto}.EGP ( PERIODO, TIPO, FAMILIA, SALDO, SALDO_DOLAR , USUARIO  )   
      SELECT  
      @fecha_periodo_actual, TIPO, FAMILIA, SUM ( SALDO_LOCAL), SUM (SALDO_DOLAR) , @usuario          
      FROM (    
      SELECT  E.TIPO,  E.FAMILIA,  V.CREDITO_LOCAL - V.DEBITO_LOCAL SALDO_LOCAL,  V.CREDITO_DOLAR - V.DEBITO_DOLAR SALDO_DOLAR    
      FROM  (   	
      select  	m.centro_costo,  	m.cuenta_contable,  	
      case when m.saldo_fisc_local > 0 then abs(m.saldo_fisc_local) else 0 end debito_local,  	
      case when m.saldo_fisc_local < 0 then abs(m.saldo_fisc_local) else 0 end credito_local,  	
      case when m.saldo_fisc_dolar > 0 then abs(m.saldo_fisc_dolar) else 0 end debito_dolar,  	
      case when m.saldo_fisc_dolar < 0 then abs(m.saldo_fisc_dolar) else 0 end credito_dolar   	
      from ${conjunto}.saldo m  
      inner join (  	select m.centro_costo, m.cuenta_contable, max(m.fecha) fecha  	from ${conjunto}.saldo m  	where m.fecha <= @fecha_periodo_actual                                                       
      group by m.centro_costo, m.cuenta_contable  ) smax on ( m.centro_costo = smax.centro_costo and m.cuenta_contable = smax.cuenta_contable and m.fecha = smax.fecha )   where 1 = 1  
      UNION ALL
      select  	m.centro_costo,  	m.cuenta_contable,  	coalesce ( m.debito_local, 0 )  debito_local,  	coalesce ( m.credito_local, 0 )  credito_local,  	
      coalesce ( m.debito_dolar, 0 )  debito_dolar,  	coalesce ( m.credito_dolar, 0 )  credito_dolar  	
      from ${conjunto}.asiento_de_diario am 
      inner join ${conjunto}.diario m on ( am.asiento = m.asiento ) 
      where am.fecha <= @fecha_periodo_actual  and contabilidad in  ( 'F', 'A' )  ) V  	
      INNER JOIN ${conjunto}.EGP_CUENTAS_DET E ON ( E.CUENTA_CONTABLE = V.CUENTA_CONTABLE )
      WHERE E.TIPO=@tipo_egp  AND  NOT EXISTS (	SELECT 1 FROM ${conjunto}.EGP_CENTROS_CUENTAS X  WHERE E.TIPO = X.TIPO AND E.FAMILIA = X.FAMILIA AND E.CUENTA_CONTABLE_ORIGINAL = X.CUENTA_CONTABLE  )  
      UNION ALL    
      SELECT  E.TIPO,  E.FAMILIA,  V.CREDITO_LOCAL - V.DEBITO_LOCAL,  V.CREDITO_DOLAR - V.DEBITO_DOLAR  
      FROM  (   
      select  	m.centro_costo,  	m.cuenta_contable,  	
      case when m.saldo_fisc_local > 0 then abs(m.saldo_fisc_local) else 0 end debito_local,  	
      case when m.saldo_fisc_local < 0 then abs(m.saldo_fisc_local) else 0 end credito_local,  	
      case when m.saldo_fisc_dolar > 0 then abs(m.saldo_fisc_dolar) else 0 end debito_dolar,  	
      case when m.saldo_fisc_dolar < 0 then abs(m.saldo_fisc_dolar) else 0 end credito_dolar   	
      from ${conjunto}.saldo m  
      inner join (  
      select m.centro_costo, m.cuenta_contable, max(m.fecha) fecha  	
      from ${conjunto}.saldo m  	
      where m.fecha <= @fecha_periodo_actual            
      group by m.centro_costo, m.cuenta_contable  ) smax on ( m.centro_costo = smax.centro_costo and m.cuenta_contable = smax.cuenta_contable and m.fecha = smax.fecha )   where 1 = 1  
      UNION ALL
      select  	m.centro_costo,  	m.cuenta_contable,  	coalesce ( m.debito_local, 0 )  debito_local,  	coalesce ( m.credito_local, 0 )  credito_local,  	
      coalesce ( m.debito_dolar, 0 )  debito_dolar,  	coalesce ( m.credito_dolar, 0 )  credito_dolar  
      from ${conjunto}.asiento_de_diario am inner join ${conjunto}.diario m on ( am.asiento = m.asiento ) 
      where am.fecha <= @fecha_periodo_actual  and contabilidad in  ( 'F', 'A' )  ) V  		
      INNER JOIN ${conjunto}.EGP_CENTROS_CUENTAS_DET E ON  ( E.CUENTA_CONTABLE = V.CUENTA_CONTABLE AND E.CENTRO_COSTO = V.CENTRO_COSTO )  
      WHERE E.TIPO=@tipo_egp  ) VISTA  
      GROUP BY TIPO, FAMILIA
    `;

    const fechaActual = filtros.fecha || new Date().toISOString().split('T')[0];
    const tipoEgp = filtros.tipoEgp || 'GYPPQ';
    
    if (!fechaActual) {
      throw new Error('Fecha es requerida');
    }

    await this.databaseService.ejecutarQuery(insertCurrentPeriodQuery, [
      fechaActual,
      usuario,
      tipoEgp
    ]);

    // Insertar datos del período anterior
    const fechaAnterior = new Date(fechaActual);
    fechaAnterior.setMonth(fechaAnterior.getMonth() - 1);
    const fechaAnteriorStr = fechaAnterior.toISOString().split('T')[0];

    const insertPreviousPeriodQuery = `
      INSERT INTO ${conjunto}.EGP ( PERIODO, TIPO, FAMILIA, SALDO, SALDO_DOLAR , USUARIO  ) 
      SELECT @fecha_periodo_anterior, TIPO, FAMILIA, SUM ( SALDO_LOCAL), SUM (SALDO_DOLAR) , @usuario    
      FROM (    
      SELECT  E.TIPO,  E.FAMILIA,  V.CREDITO_LOCAL - V.DEBITO_LOCAL SALDO_LOCAL,  V.CREDITO_DOLAR - V.DEBITO_DOLAR SALDO_DOLAR   
      FROM  (   	
      select  	m.centro_costo,  	m.cuenta_contable,  	
      case when m.saldo_fisc_local > 0 then abs(m.saldo_fisc_local) else 0 end debito_local,  	
      case when m.saldo_fisc_local < 0 then abs(m.saldo_fisc_local) else 0 end credito_local,  
      case when m.saldo_fisc_dolar > 0 then abs(m.saldo_fisc_dolar) else 0 end debito_dolar, 
      case when m.saldo_fisc_dolar < 0 then abs(m.saldo_fisc_dolar) else 0 end credito_dolar   	
      from ${conjunto}.saldo m
      inner join (  	
      select m.centro_costo, m.cuenta_contable, max(m.fecha) fecha  	from ${conjunto}.saldo m  	where m.fecha <= @fecha_periodo_anterior        
      group by m.centro_costo, m.cuenta_contable  ) smax on ( m.centro_costo = smax.centro_costo and m.cuenta_contable = smax.cuenta_contable and m.fecha = smax.fecha )   where 1 = 1 
      UNION ALL    
      select  	m.centro_costo,  	m.cuenta_contable,  	coalesce ( m.debito_local, 0 )  debito_local,  	coalesce ( m.credito_local, 0 )  credito_local,  	coalesce ( m.debito_dolar, 0 )  debito_dolar,
      coalesce ( m.credito_dolar, 0 )  credito_dolar  	 
      from ${conjunto}.asiento_de_diario am inner join ${conjunto}.diario m on ( am.asiento = m.asiento )  where am.fecha <= @fecha_periodo_anterior   and contabilidad in  ( 'F', 'A' )  ) V  	
      INNER JOIN ${conjunto}.EGP_CUENTAS_DET E ON ( E.CUENTA_CONTABLE = V.CUENTA_CONTABLE )  
      WHERE E.TIPO=@tipo_egp  AND  NOT EXISTS (	
      SELECT 1 FROM ${conjunto}.EGP_CENTROS_CUENTAS X   	
      WHERE E.TIPO = X.TIPO AND E.FAMILIA = X.FAMILIA AND E.CUENTA_CONTABLE_ORIGINAL = X.CUENTA_CONTABLE  )    
      UNION ALL   
      SELECT  E.TIPO,  E.FAMILIA,  V.CREDITO_LOCAL - V.DEBITO_LOCAL,  V.CREDITO_DOLAR - V.DEBITO_DOLAR  
      FROM  (   	select  	m.centro_costo,  	m.cuenta_contable,  	
      case when m.saldo_fisc_local > 0 then abs(m.saldo_fisc_local) else 0 end debito_local,  
      case when m.saldo_fisc_local < 0 then abs(m.saldo_fisc_local) else 0 end credito_local,  
      case when m.saldo_fisc_dolar > 0 then abs(m.saldo_fisc_dolar) else 0 end debito_dolar,  	
      case when m.saldo_fisc_dolar < 0 then abs(m.saldo_fisc_dolar) else 0 end credito_dolar   	
      from ${conjunto}.saldo m  inner join ( 
      select m.centro_costo, m.cuenta_contable, max(m.fecha) fecha  
      from ${conjunto}.saldo m  	
      where m.fecha <= @fecha_periodo_anterior                 
      group by m.centro_costo, m.cuenta_contable  ) smax on ( m.centro_costo = smax.centro_costo and m.cuenta_contable = smax.cuenta_contable and m.fecha = smax.fecha )   where 1 = 1  
      UNION ALL    	
      select  	m.centro_costo,  	m.cuenta_contable,  	coalesce ( m.debito_local, 0 )  debito_local,  	coalesce ( m.credito_local, 0 )  credito_local,  
      coalesce ( m.debito_dolar, 0 )  debito_dolar,  	coalesce ( m.credito_dolar, 0 )  credito_dolar  
      from ${conjunto}.asiento_de_diario am inner join ${conjunto}.diario m on ( am.asiento = m.asiento )
      where am.fecha <= @fecha_periodo_anterior  and contabilidad in  ( 'F', 'A' )  ) V  		
      INNER JOIN ${conjunto}.EGP_CENTROS_CUENTAS_DET E ON  ( E.CUENTA_CONTABLE = V.CUENTA_CONTABLE AND E.CENTRO_COSTO = V.CENTRO_COSTO )  WHERE E.TIPO=@tipo_egp  ) VISTA 
      GROUP BY TIPO, FAMILIA
    `;

    await this.databaseService.ejecutarQuery(insertPreviousPeriodQuery, [
      fechaAnteriorStr,
      usuario,
      tipoEgp
    ]);

    // Consulta final para obtener los resultados
    const finalQuery = `
      SELECT   PA.NOMBRE,   P.FAMILIA,   P.NOMBRE as nombre_cuenta,   P.POSICION,'Nuevo Sol' as moneda,   P.ORDEN,     
      ISNULL(SUM(CASE EG.PERIODO WHEN @fecha_periodo_actual  THEN EG.SALDO ELSE 0 END),0) AS SALDO2, 
      ISNULL(SUM(CASE EG.PERIODO WHEN @fecha_periodo_anterior  THEN EG.SALDO ELSE 0 END),0) AS SALDO1       
      FROM ${conjunto}.POSICION_EGP P   
      INNER JOIN ${conjunto}.POSICION_EGP PA   ON PA.TIPO = P.TIPO AND PA.FAMILIA = P.FAMILIA_PADRE 
      LEFT OUTER JOIN ${conjunto}.EGP EG   ON EG.TIPO = P.TIPO AND EG.FAMILIA = P.FAMILIA AND EG.USUARIO = @usuario          
      WHERE P.TIPO= @tipo_egp
      GROUP BY PA.NOMBRE,P.FAMILIA, P.NOMBRE, P.POSICION, P.ORDEN   
      UNION ALL   
      SELECT   NULL,   P.FAMILIA,   P.NOMBRE as nombre_cuenta,   P.POSICION, 'Nuevo Sol' ,   P.ORDEN, 
      ISNULL(SUM(CASE EG.PERIODO WHEN @fecha_periodo_actual THEN EG.SALDO ELSE 0 END),0) AS SALDO2,
      ISNULL(SUM(CASE EG.PERIODO WHEN @fecha_periodo_anterior THEN EG.SALDO ELSE 0 END),0) AS SALDO1   
      FROM ${conjunto}.POSICION_EGP P   
      LEFT OUTER JOIN ${conjunto}.EGP EG   ON EG.TIPO = P.TIPO AND EG.FAMILIA = P.FAMILIA AND EG.USUARIO =@usuario        
      WHERE P.FAMILIA_PADRE IS NULL AND P.AGRUPA = 'N'   AND P.TIPO= @tipo_egp                         
      GROUP BY P.FAMILIA,P.NOMBRE,P.POSICION,P.ORDEN ORDER BY 4, 6
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `;

    const offset = (page - 1) * pageSize;
    const result = await this.databaseService.ejecutarQuery(finalQuery, [
      fechaActual,
      fechaAnteriorStr,
      usuario,
      tipoEgp,
      offset,
      pageSize
    ]);

    // Limpiar tabla temporal
    await this.databaseService.ejecutarQuery(`DROP TABLE IF EXISTS ${conjunto}.R_XML_8DDC9208B6470F8`, []);

    return result.map((row: any) => ({
      cuenta_contable: row.nombre_cuenta || '',
      fecha_balance: new Date(fechaActual),
      saldo_inicial: row.SALDO1 || 0,
      nombre_cuenta: row.nombre_cuenta || '',
      fecha_inicio: new Date(fechaAnteriorStr || fechaActual),
      fecha_cuenta: new Date(fechaActual),
      saldo_final: row.SALDO2 || 0,
      tiporeporte: tipoEgp,
      posicion: row.POSICION || '',
      caracter: '',
      moneda: row.moneda || 'Nuevo Sol',
      padre: row.NOMBRE || '',
      orden: row.ORDEN || 0,
      mes: fechaActual ? fechaActual.split('-')[1] || '' : ''
    }));
  }

  async getTotalRecords(
    conjunto: string, 
    usuario: string, 
    filtros: FiltrosEstadoResultados
  ): Promise<number> {
    // Implementar conteo total de registros si es necesario
    return 0;
  }
}
