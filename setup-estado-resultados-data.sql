-- =================================================================
-- SCRIPT DE CONFIGURACIÓN DE DATOS PARA ESTADO DE RESULTADOS
-- =================================================================
-- Este script genera los datos necesarios para el Estado de Resultados

-- Limpiar datos existentes
DELETE FROM JBRTRA.EGP WHERE USUARIO = 'ADMPQUES';

-- =================================================================
-- PARTE A: QUERIES PARA GENERAR LA DATA DEL REPORTE
-- =================================================================
-- Estos queries procesan y almacenan los datos en la tabla EGP

-- -----------------------------------------------------------------
-- A.1: GENERACIÓN DE DATA PARA DICIEMBRE 2022
-- -----------------------------------------------------------------
INSERT INTO JBRTRA.EGP (PERIODO, TIPO, FAMILIA, SALDO, SALDO_DOLAR, USUARIO)   
SELECT '2022-12-31 00:00:00',
       TIPO, 
       FAMILIA, 
       SUM(SALDO_LOCAL), 
       SUM(SALDO_DOLAR),
       'ADMPQUES'          
FROM (    
    -- Cuentas SIN restricción de centro de costo
    SELECT E.TIPO,
           E.FAMILIA,
           V.CREDITO_LOCAL - V.DEBITO_LOCAL AS SALDO_LOCAL,
           V.CREDITO_DOLAR - V.DEBITO_DOLAR AS SALDO_DOLAR    
    FROM (   	
        -- Saldos fiscales al cierre
        SELECT m.centro_costo,
               m.cuenta_contable,
               CASE WHEN m.saldo_fisc_local > 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS debito_local,
               CASE WHEN m.saldo_fisc_local < 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS credito_local,
               CASE WHEN m.saldo_fisc_dolar > 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS debito_dolar,
               CASE WHEN m.saldo_fisc_dolar < 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS credito_dolar   	
        FROM JBRTRA.saldo m  
        INNER JOIN (  	
            SELECT m.centro_costo, 
                   m.cuenta_contable, 
                   MAX(m.fecha) AS fecha  	
            FROM JBRTRA.saldo m  	
            WHERE m.fecha <= '2022-12-31 00:00:00'                                                       
            GROUP BY m.centro_costo, m.cuenta_contable
        ) smax ON (m.centro_costo = smax.centro_costo 
                  AND m.cuenta_contable = smax.cuenta_contable 
                  AND m.fecha = smax.fecha)
        WHERE 1 = 1
        
        UNION ALL
        
        -- Movimientos del diario
        SELECT m.centro_costo,
               m.cuenta_contable,
               COALESCE(m.debito_local, 0) AS debito_local,
               COALESCE(m.credito_local, 0) AS credito_local,
               COALESCE(m.debito_dolar, 0) AS debito_dolar,
               COALESCE(m.credito_dolar, 0) AS credito_dolar  	
        FROM JBRTRA.asiento_de_diario am 
        INNER JOIN JBRTRA.diario m ON (am.asiento = m.asiento) 
        WHERE am.fecha <= '2022-12-31 00:00:00'  
            AND contabilidad IN ('F', 'A')
    ) V  	
    INNER JOIN JBRTRA.EGP_CUENTAS_DET E ON (E.CUENTA_CONTABLE = V.CUENTA_CONTABLE)
    WHERE E.TIPO = 'GYPPQ'  
        AND NOT EXISTS (
            SELECT 1 
            FROM JBRTRA.EGP_CENTROS_CUENTAS X  
            WHERE E.TIPO = X.TIPO 
                AND E.FAMILIA = X.FAMILIA 
                AND E.CUENTA_CONTABLE_ORIGINAL = X.CUENTA_CONTABLE
        )
    
    UNION ALL    
    
    -- Cuentas CON restricción de centro de costo
    SELECT E.TIPO,
           E.FAMILIA,
           V.CREDITO_LOCAL - V.DEBITO_LOCAL AS SALDO_LOCAL,
           V.CREDITO_DOLAR - V.DEBITO_DOLAR AS SALDO_DOLAR  
    FROM (   
        -- Saldos fiscales al cierre (con centro de costo)
        SELECT m.centro_costo,
               m.cuenta_contable,
               CASE WHEN m.saldo_fisc_local > 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS debito_local,
               CASE WHEN m.saldo_fisc_local < 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS credito_local,
               CASE WHEN m.saldo_fisc_dolar > 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS debito_dolar,
               CASE WHEN m.saldo_fisc_dolar < 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS credito_dolar   	
        FROM JBRTRA.saldo m  
        INNER JOIN (  
            SELECT m.centro_costo, 
                   m.cuenta_contable, 
                   MAX(m.fecha) AS fecha  	
            FROM JBRTRA.saldo m  	
            WHERE m.fecha <= '2022-12-31 00:00:00'            
            GROUP BY m.centro_costo, m.cuenta_contable
        ) smax ON (m.centro_costo = smax.centro_costo 
                  AND m.cuenta_contable = smax.cuenta_contable 
                  AND m.fecha = smax.fecha)
        WHERE 1 = 1  
        
        UNION ALL
        
        -- Movimientos del diario (con centro de costo)
        SELECT m.centro_costo,
               m.cuenta_contable,
               COALESCE(m.debito_local, 0) AS debito_local,
               COALESCE(m.credito_local, 0) AS credito_local,
               COALESCE(m.debito_dolar, 0) AS debito_dolar,
               COALESCE(m.credito_dolar, 0) AS credito_dolar  
        FROM JBRTRA.asiento_de_diario am 
        INNER JOIN JBRTRA.diario m ON (am.asiento = m.asiento) 
        WHERE am.fecha <= '2022-12-31 00:00:00'  
            AND contabilidad IN ('F', 'A')
    ) V  		
    INNER JOIN JBRTRA.EGP_CENTROS_CUENTAS_DET E 
        ON (E.CUENTA_CONTABLE = V.CUENTA_CONTABLE 
            AND E.CENTRO_COSTO = V.CENTRO_COSTO)  
    WHERE E.TIPO = 'GYPPQ'
) VISTA  
GROUP BY TIPO, FAMILIA;

-- -----------------------------------------------------------------
-- A.2: GENERACIÓN DE DATA PARA NOVIEMBRE 2022
-- -----------------------------------------------------------------
INSERT INTO JBRTRA.EGP (PERIODO, TIPO, FAMILIA, SALDO, SALDO_DOLAR, USUARIO) 
SELECT '2022-11-30 00:00:00',
       TIPO, 
       FAMILIA, 
       SUM(SALDO_LOCAL), 
       SUM(SALDO_DOLAR),
       'ADMPQUES'    
FROM (    
    -- [La misma estructura que el query anterior, pero para fecha 2022-11-30]
    SELECT E.TIPO,
           E.FAMILIA,
           V.CREDITO_LOCAL - V.DEBITO_LOCAL AS SALDO_LOCAL,
           V.CREDITO_DOLAR - V.DEBITO_DOLAR AS SALDO_DOLAR   
    FROM (   	
        SELECT m.centro_costo,
               m.cuenta_contable,
               CASE WHEN m.saldo_fisc_local > 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS debito_local,
               CASE WHEN m.saldo_fisc_local < 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS credito_local,
               CASE WHEN m.saldo_fisc_dolar > 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS debito_dolar,
               CASE WHEN m.saldo_fisc_dolar < 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS credito_dolar   	
        FROM JBRTRA.saldo m
        INNER JOIN (  	
            SELECT m.centro_costo, 
                   m.cuenta_contable, 
                   MAX(m.fecha) AS fecha  	
            FROM JBRTRA.saldo m  	
            WHERE m.fecha <= '2022-11-30 00:00:00'        
            GROUP BY m.centro_costo, m.cuenta_contable
        ) smax ON (m.centro_costo = smax.centro_costo 
                  AND m.cuenta_contable = smax.cuenta_contable 
                  AND m.fecha = smax.fecha)
        WHERE 1 = 1 
        
        UNION ALL    
        
        SELECT m.centro_costo,
               m.cuenta_contable,
               COALESCE(m.debito_local, 0) AS debito_local,
               COALESCE(m.credito_local, 0) AS credito_local,
               COALESCE(m.debito_dolar, 0) AS debito_dolar,
               COALESCE(m.credito_dolar, 0) AS credito_dolar  	 
        FROM JBRTRA.asiento_de_diario am 
        INNER JOIN JBRTRA.diario m ON (am.asiento = m.asiento)  
        WHERE am.fecha <= '2022-11-30 00:00:00'   
            AND contabilidad IN ('F', 'A')
    ) V  	
    INNER JOIN JBRTRA.EGP_CUENTAS_DET E ON (E.CUENTA_CONTABLE = V.CUENTA_CONTABLE)  
    WHERE E.TIPO = 'GYPPQ'  
        AND NOT EXISTS (
            SELECT 1 
            FROM JBRTRA.EGP_CENTROS_CUENTAS X   	
            WHERE E.TIPO = X.TIPO 
                AND E.FAMILIA = X.FAMILIA 
                AND E.CUENTA_CONTABLE_ORIGINAL = X.CUENTA_CONTABLE
        )
    
    UNION ALL   
    
    SELECT E.TIPO,
           E.FAMILIA,
           V.CREDITO_LOCAL - V.DEBITO_LOCAL AS SALDO_LOCAL,
           V.CREDITO_DOLAR - V.DEBITO_DOLAR AS SALDO_DOLAR  
    FROM (   	
        SELECT m.centro_costo,
               m.cuenta_contable,
               CASE WHEN m.saldo_fisc_local > 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS debito_local,
               CASE WHEN m.saldo_fisc_local < 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS credito_local,
               CASE WHEN m.saldo_fisc_dolar > 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS debito_dolar,
               CASE WHEN m.saldo_fisc_dolar < 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS credito_dolar   	
        FROM JBRTRA.saldo m  
        INNER JOIN ( 
            SELECT m.centro_costo, 
                   m.cuenta_contable, 
                   MAX(m.fecha) AS fecha  
            FROM JBRTRA.saldo m  	
            WHERE m.fecha <= '2022-11-30 00:00:00'                 
            GROUP BY m.centro_costo, m.cuenta_contable
        ) smax ON (m.centro_costo = smax.centro_costo 
                  AND m.cuenta_contable = smax.cuenta_contable 
                  AND m.fecha = smax.fecha)
        WHERE 1 = 1  
        
        UNION ALL    	
        
        SELECT m.centro_costo,
               m.cuenta_contable,
               COALESCE(m.debito_local, 0) AS debito_local,
               COALESCE(m.credito_local, 0) AS credito_local,
               COALESCE(m.debito_dolar, 0) AS debito_dolar,
               COALESCE(m.credito_dolar, 0) AS credito_dolar  
        FROM JBRTRA.asiento_de_diario am 
        INNER JOIN JBRTRA.diario m ON (am.asiento = m.asiento)
        WHERE am.fecha <= '2022-11-30 00:00:00'  
            AND contabilidad IN ('F', 'A')
    ) V  		
    INNER JOIN JBRTRA.EGP_CENTROS_CUENTAS_DET E 
        ON (E.CUENTA_CONTABLE = V.CUENTA_CONTABLE 
            AND E.CENTRO_COSTO = V.CENTRO_COSTO)  
    WHERE E.TIPO = 'GYPPQ'
) VISTA 
GROUP BY TIPO, FAMILIA;

-- Verificar datos insertados en EGP
SELECT COUNT(*) as TotalRegistros, TIPO, USUARIO
FROM JBRTRA.EGP 
WHERE USUARIO = 'ADMPQUES'
GROUP BY TIPO, USUARIO;

-- Mostrar algunos registros de ejemplo de EGP
SELECT TOP 10 * FROM JBRTRA.EGP WHERE USUARIO = 'ADMPQUES' ORDER BY PERIODO, TIPO, FAMILIA;

-- Verificar datos en periodo_contable
SELECT COUNT(*) as TotalPeriodos, contabilidad, estado
FROM JBRTRA.periodo_contable 
GROUP BY contabilidad, estado;

-- Mostrar algunos períodos contables de ejemplo
SELECT TOP 10 * FROM JBRTRA.periodo_contable 
WHERE contabilidad = 'F' 
ORDER BY fecha_final DESC;

-- Verificar períodos para la fecha específica 2011-03-12
SELECT * FROM JBRTRA.periodo_contable 
WHERE fecha_final = '2011-03-12' 
  AND contabilidad = 'F';
