import { injectable } from 'inversify';
import { exactusSequelize } from '../database/config/exactus-database';
import { EstadoResultados, FiltrosEstadoResultados, TipoEgp, PeriodoContable } from '../../domain/entities/EstadoResultados';

@injectable()
export class EstadoResultadosRepository {

  async getTiposEgp(conjunto: string, usuario: string): Promise<TipoEgp[]> {
    try {
      const query = `
        SELECT cast ( UPPER(T.TIPO) + '' + T.DESCRIPCION + '' + T.QRP as varchar(1000) ) as tipo_descripcion_qrp
        FROM ${conjunto}.TIPO_EGP T (NOLOCK)
        INNER JOIN ${conjunto}.USUARIO_EGP U (NOLOCK) ON T.TIPO=U.TIPO AND U.USUARIO = :usuario      
        WHERE 1 = 1 AND T.TIPO NOT IN ( '10.1', '10.2' )   	
        AND ( T.TIPO NOT LIKE '320%' OR T.TIPO = '320' )    	
        AND ( T.TIPO NOT LIKE '324%' OR T.TIPO = '324'  ) 
        ORDER BY 1
      `;

      const [results] = await exactusSequelize.query(query, { 
        replacements: { usuario } 
      });
      
      return (results as any[]).map((row: any) => ({
        tipo: row.tipo_descripcion_qrp?.split(' ')[0] || '',
        descripcion: row.tipo_descripcion_qrp?.split(' ').slice(1, -1).join(' ') || '',
        qrp: row.tipo_descripcion_qrp?.split(' ').pop() || ''
      }));
    } catch (error) {
      console.error('Error al obtener tipos EGP:', error);
      throw new Error(`Error al obtener tipos EGP: ${error}`);
    }
  }

  async getPeriodosContables(conjunto: string, fecha: string): Promise<PeriodoContable[]> {
    try {
      const query = `
        SELECT descripcion, contabilidad, estado 
        FROM ${conjunto}.periodo_contable (NOLOCK)                                   
        WHERE fecha_final = :fecha
        AND contabilidad = 'F'
      `;

      const [results] = await exactusSequelize.query(query, { 
        replacements: { fecha } 
      });
      
      return (results as any[]).map((row: any) => ({
        descripcion: row.descripcion || '',
        contabilidad: row.contabilidad || '',
        estado: row.estado || ''
      }));
    } catch (error) {
      console.error('Error al obtener períodos contables:', error);
      throw new Error(`Error al obtener períodos contables: ${error}`);
    }
  }

  async getEstadoResultados(
    conjunto: string, 
    usuario: string, 
    filtros: FiltrosEstadoResultados,
    page: number = 1,
    pageSize: number = 20
  ): Promise<EstadoResultados[]> {
    try {
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
      await exactusSequelize.query(`DROP TABLE IF EXISTS ${conjunto}.R_XML_8DDC9208B6470F8`);
      
      // Crear tabla temporal
      await exactusSequelize.query(createTableQuery);

      // Insertar datos del período actual
      const insertCurrentPeriodQuery = `
        INSERT INTO ${conjunto}.EGP ( PERIODO, TIPO, FAMILIA, SALDO, SALDO_DOLAR , USUARIO  )   
        SELECT  
        :fecha_periodo_actual, TIPO, FAMILIA, SUM ( SALDO_LOCAL), SUM (SALDO_DOLAR) , :usuario          
        FROM (    
        SELECT  E.TIPO,  E.FAMILIA,  V.CREDITO_LOCAL - V.DEBITO_LOCAL SALDO_LOCAL,  V.CREDITO_DOLAR - V.DEBITO_DOLAR SALDO_DOLAR    
        FROM  (   	
        select  	m.centro_costo,  	m.cuenta_contable,  	
        case when m.saldo_fisc_local > 0 then abs(m.saldo_fisc_local) else 0 end debito_local,  	
        case when m.saldo_fisc_local < 0 then abs(m.saldo_fisc_local) else 0 end credito_local,  	
        case when m.saldo_fisc_dolar > 0 then abs(m.saldo_fisc_dolar) else 0 end debito_dolar,  	
        case when m.saldo_fisc_dolar < 0 then abs(m.saldo_fisc_dolar) else 0 end credito_dolar   	
        from ${conjunto}.saldo m (NOLOCK)
        inner join (  	select m.centro_costo, m.cuenta_contable, max(m.fecha) fecha  	from ${conjunto}.saldo m (NOLOCK)  	where m.fecha <= :fecha_periodo_actual                                                       
        group by m.centro_costo, m.cuenta_contable  ) smax on ( m.centro_costo = smax.centro_costo and m.cuenta_contable = smax.cuenta_contable and m.fecha = smax.fecha )   where 1 = 1  
        UNION ALL
        select  	m.centro_costo,  	m.cuenta_contable,  	coalesce ( m.debito_local, 0 )  debito_local,  	coalesce ( m.credito_local, 0 )  credito_local,  	
        coalesce ( m.debito_dolar, 0 )  debito_dolar,  	coalesce ( m.credito_dolar, 0 )  credito_dolar  	
        from ${conjunto}.asiento_de_diario am (NOLOCK)
        inner join ${conjunto}.diario m (NOLOCK) on ( am.asiento = m.asiento ) 
        where am.fecha <= :fecha_periodo_actual  and contabilidad in  ( 'F', 'A' )  ) V  	
        INNER JOIN ${conjunto}.EGP_CUENTAS_DET E (NOLOCK) ON ( E.CUENTA_CONTABLE = V.CUENTA_CONTABLE )
        WHERE E.TIPO=:tipo_egp  AND  NOT EXISTS (	SELECT 1 FROM ${conjunto}.EGP_CENTROS_CUENTAS X (NOLOCK)  WHERE E.TIPO = X.TIPO AND E.FAMILIA = X.FAMILIA AND E.CUENTA_CONTABLE_ORIGINAL = X.CUENTA_CONTABLE  )  
        UNION ALL    
        SELECT  E.TIPO,  E.FAMILIA,  V.CREDITO_LOCAL - V.DEBITO_LOCAL,  V.CREDITO_DOLAR - V.DEBITO_DOLAR  
        FROM  (   
        select  	m.centro_costo,  	m.cuenta_contable,  	
        case when m.saldo_fisc_local > 0 then abs(m.saldo_fisc_local) else 0 end debito_local,  	
        case when m.saldo_fisc_local < 0 then abs(m.saldo_fisc_local) else 0 end credito_local,  	
        case when m.saldo_fisc_dolar > 0 then abs(m.saldo_fisc_dolar) else 0 end debito_dolar,  	
        case when m.saldo_fisc_dolar < 0 then abs(m.saldo_fisc_dolar) else 0 end credito_dolar   	
        from ${conjunto}.saldo m (NOLOCK)
        inner join (  
        select m.centro_costo, m.cuenta_contable, max(m.fecha) fecha  	
        from ${conjunto}.saldo m (NOLOCK)  	
        where m.fecha <= :fecha_periodo_actual            
        group by m.centro_costo, m.cuenta_contable  ) smax on ( m.centro_costo = smax.centro_costo and m.cuenta_contable = smax.cuenta_contable and m.fecha = smax.fecha )   where 1 = 1  
        UNION ALL
        select  	m.centro_costo,  	m.cuenta_contable,  	coalesce ( m.debito_local, 0 )  debito_local,  	coalesce ( m.credito_local, 0 )  credito_local,  	
        coalesce ( m.debito_dolar, 0 )  debito_dolar,  	coalesce ( m.credito_dolar, 0 )  credito_dolar  
        from ${conjunto}.asiento_de_diario am (NOLOCK) inner join ${conjunto}.diario m (NOLOCK) on ( am.asiento = m.asiento ) 
        where am.fecha <= :fecha_periodo_actual  and contabilidad in  ( 'F', 'A' )  ) V  		
        INNER JOIN ${conjunto}.EGP_CENTROS_CUENTAS_DET E (NOLOCK) ON  ( E.CUENTA_CONTABLE = V.CUENTA_CONTABLE AND E.CENTRO_COSTO = V.CENTRO_COSTO )  
        WHERE E.TIPO=:tipo_egp  ) VISTA  
        GROUP BY TIPO, FAMILIA
      `;

      const fechaActual = filtros.fecha || new Date().toISOString().split('T')[0];
      const tipoEgp = filtros.tipoEgp || 'GYPPQ';
      
      if (!fechaActual) {
        throw new Error('Fecha es requerida');
      }

      await exactusSequelize.query(insertCurrentPeriodQuery, { 
        replacements: { 
          fecha_periodo_actual: fechaActual,
          usuario,
          tipo_egp: tipoEgp
        } 
      });

      // Insertar datos del período anterior
      const fechaAnterior = new Date(fechaActual);
      fechaAnterior.setMonth(fechaAnterior.getMonth() - 1);
      const fechaAnteriorStr = fechaAnterior.toISOString().split('T')[0];

      const insertPreviousPeriodQuery = `
        INSERT INTO ${conjunto}.EGP ( PERIODO, TIPO, FAMILIA, SALDO, SALDO_DOLAR , USUARIO  ) 
        SELECT :fecha_periodo_anterior, TIPO, FAMILIA, SUM ( SALDO_LOCAL), SUM (SALDO_DOLAR) , :usuario    
        FROM (    
        SELECT  E.TIPO,  E.FAMILIA,  V.CREDITO_LOCAL - V.DEBITO_LOCAL SALDO_LOCAL,  V.CREDITO_DOLAR - V.DEBITO_DOLAR SALDO_DOLAR   
        FROM  (   	
        select  	m.centro_costo,  	m.cuenta_contable,  	
        case when m.saldo_fisc_local > 0 then abs(m.saldo_fisc_local) else 0 end debito_local,  	
        case when m.saldo_fisc_local < 0 then abs(m.saldo_fisc_local) else 0 end credito_local,  
        case when m.saldo_fisc_dolar > 0 then abs(m.saldo_fisc_dolar) else 0 end debito_dolar, 
        case when m.saldo_fisc_dolar < 0 then abs(m.saldo_fisc_dolar) else 0 end credito_dolar   	
        from ${conjunto}.saldo m (NOLOCK)
        inner join (  	
        select m.centro_costo, m.cuenta_contable, max(m.fecha) fecha  	from ${conjunto}.saldo m (NOLOCK)  	where m.fecha <= :fecha_periodo_anterior        
        group by m.centro_costo, m.cuenta_contable  ) smax on ( m.centro_costo = smax.centro_costo and m.cuenta_contable = smax.cuenta_contable and m.fecha = smax.fecha )   where 1 = 1 
        UNION ALL    
        select  	m.centro_costo,  	m.cuenta_contable,  	coalesce ( m.debito_local, 0 )  debito_local,  	coalesce ( m.credito_local, 0 )  credito_local,  	coalesce ( m.debito_dolar, 0 )  debito_dolar,
        coalesce ( m.credito_dolar, 0 )  credito_dolar  	 
        from ${conjunto}.asiento_de_diario am (NOLOCK) inner join ${conjunto}.diario m (NOLOCK) on ( am.asiento = m.asiento )  where am.fecha <= :fecha_periodo_anterior   and contabilidad in  ( 'F', 'A' )  ) V  	
        INNER JOIN ${conjunto}.EGP_CUENTAS_DET E (NOLOCK) ON ( E.CUENTA_CONTABLE = V.CUENTA_CONTABLE )  
        WHERE E.TIPO=:tipo_egp  AND  NOT EXISTS (	
        SELECT 1 FROM ${conjunto}.EGP_CENTROS_CUENTAS X (NOLOCK)   	
        WHERE E.TIPO = X.TIPO AND E.FAMILIA = X.FAMILIA AND E.CUENTA_CONTABLE_ORIGINAL = X.CUENTA_CONTABLE  )    
        UNION ALL   
        SELECT  E.TIPO,  E.FAMILIA,  V.CREDITO_LOCAL - V.DEBITO_LOCAL,  V.CREDITO_DOLAR - V.DEBITO_DOLAR  
        FROM  (   	select  	m.centro_costo,  	m.cuenta_contable,  	
        case when m.saldo_fisc_local > 0 then abs(m.saldo_fisc_local) else 0 end debito_local,  
        case when m.saldo_fisc_local < 0 then abs(m.saldo_fisc_local) else 0 end credito_local,  
        case when m.saldo_fisc_dolar > 0 then abs(m.saldo_fisc_dolar) else 0 end debito_dolar,  	
        case when m.saldo_fisc_dolar < 0 then abs(m.saldo_fisc_dolar) else 0 end credito_dolar   	
        from ${conjunto}.saldo m (NOLOCK)  inner join ( 
        select m.centro_costo, m.cuenta_contable, max(m.fecha) fecha  
        from ${conjunto}.saldo m (NOLOCK)  	
        where m.fecha <= :fecha_periodo_anterior                 
        group by m.centro_costo, m.cuenta_contable  ) smax on ( m.centro_costo = smax.centro_costo and m.cuenta_contable = smax.cuenta_contable and m.fecha = smax.fecha )   where 1 = 1  
        UNION ALL    	
        select  	m.centro_costo,  	m.cuenta_contable,  	coalesce ( m.debito_local, 0 )  debito_local,  	coalesce ( m.credito_local, 0 )  credito_local,  
        coalesce ( m.debito_dolar, 0 )  debito_dolar,  	coalesce ( m.credito_dolar, 0 )  credito_dolar  
        from ${conjunto}.asiento_de_diario am (NOLOCK) inner join ${conjunto}.diario m (NOLOCK) on ( am.asiento = m.asiento )
        where am.fecha <= :fecha_periodo_anterior  and contabilidad in  ( 'F', 'A' )  ) V  		
        INNER JOIN ${conjunto}.EGP_CENTROS_CUENTAS_DET E (NOLOCK) ON  ( E.CUENTA_CONTABLE = V.CUENTA_CONTABLE AND E.CENTRO_COSTO = V.CENTRO_COSTO )  WHERE E.TIPO=:tipo_egp  ) VISTA 
        GROUP BY TIPO, FAMILIA
      `;

      await exactusSequelize.query(insertPreviousPeriodQuery, { 
        replacements: { 
          fecha_periodo_anterior: fechaAnteriorStr,
          usuario,
          tipo_egp: tipoEgp
        } 
      });

      // Consulta final para obtener los resultados
      const finalQuery = `
        SELECT   PA.NOMBRE,   P.FAMILIA,   P.NOMBRE as nombre_cuenta,   P.POSICION,'Nuevo Sol' as moneda,   P.ORDEN,     
        ISNULL(SUM(CASE EG.PERIODO WHEN :fecha_periodo_actual  THEN EG.SALDO ELSE 0 END),0) AS SALDO2, 
        ISNULL(SUM(CASE EG.PERIODO WHEN :fecha_periodo_anterior  THEN EG.SALDO ELSE 0 END),0) AS SALDO1       
        FROM ${conjunto}.POSICION_EGP P (NOLOCK)
        INNER JOIN ${conjunto}.POSICION_EGP PA (NOLOCK)   ON PA.TIPO = P.TIPO AND PA.FAMILIA = P.FAMILIA_PADRE 
        LEFT OUTER JOIN ${conjunto}.EGP EG (NOLOCK)   ON EG.TIPO = P.TIPO AND EG.FAMILIA = P.FAMILIA AND EG.USUARIO = :usuario          
        WHERE P.TIPO= :tipo_egp
        GROUP BY PA.NOMBRE,P.FAMILIA, P.NOMBRE, P.POSICION, P.ORDEN   
        UNION ALL   
        SELECT   NULL,   P.FAMILIA,   P.NOMBRE as nombre_cuenta,   P.POSICION, 'Nuevo Sol' ,   P.ORDEN, 
        ISNULL(SUM(CASE EG.PERIODO WHEN :fecha_periodo_actual THEN EG.SALDO ELSE 0 END),0) AS SALDO2,
        ISNULL(SUM(CASE EG.PERIODO WHEN :fecha_periodo_anterior THEN EG.SALDO ELSE 0 END),0) AS SALDO1   
        FROM ${conjunto}.POSICION_EGP P (NOLOCK)
        LEFT OUTER JOIN ${conjunto}.EGP EG (NOLOCK)   ON EG.TIPO = P.TIPO AND EG.FAMILIA = P.FAMILIA AND EG.USUARIO = :usuario        
        WHERE P.FAMILIA_PADRE IS NULL AND P.AGRUPA = 'N'   AND P.TIPO= :tipo_egp                         
        GROUP BY P.FAMILIA,P.NOMBRE,P.POSICION,P.ORDEN ORDER BY 4, 6
        OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY
      `;

      const offset = (page - 1) * pageSize;
      const [results] = await exactusSequelize.query(finalQuery, { 
        replacements: { 
          fecha_periodo_actual: fechaActual,
          fecha_periodo_anterior: fechaAnteriorStr,
          usuario,
          tipo_egp: tipoEgp,
          offset,
          pageSize
        } 
      });

      // Limpiar tabla temporal
      await exactusSequelize.query(`DROP TABLE IF EXISTS ${conjunto}.R_XML_8DDC9208B6470F8`);

      return (results as any[]).map((row: any) => ({
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
    } catch (error) {
      console.error('Error al obtener estado de resultados:', error);
      throw new Error(`Error al obtener estado de resultados: ${error}`);
    }
  }

  async getTotalRecords(
    conjunto: string, 
    usuario: string, 
    filtros: FiltrosEstadoResultados
  ): Promise<number> {
    try {
      // Implementar conteo total de registros si es necesario
      // Por ahora retornamos 0, pero se puede implementar la lógica de conteo
      return 0;
    } catch (error) {
      console.error('Error al obtener total de registros:', error);
      throw new Error(`Error al obtener total de registros: ${error}`);
    }
  }
}
