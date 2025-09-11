import { injectable } from 'inversify';
import { exactusSequelize } from '../database/config/exactus-database'
import { EstadoResultados, FiltrosEstadoResultados, TipoEgp, PeriodoContable, ValidacionBalance, LogEjecucion } from '../../domain/entities/EstadoResultados';

@injectable()
export class EstadoResultadosRepository {

  async getTiposEgp(conjunto: string, usuario: string): Promise<TipoEgp[]> {
    try {
      const query = `
        SELECT DISTINCT 
          T.TIPO,
          T.DESCRIPCION,
          T.QRP
        FROM JBRTRA.TIPO_EGP T (NOLOCK)
        INNER JOIN JBRTRA.USUARIO_EGP U (NOLOCK) ON T.TIPO = U.TIPO AND U.USUARIO = :usuario
        WHERE T.TIPO NOT IN ('10.1', '10.2')
          AND (T.TIPO NOT LIKE '320%' OR T.TIPO = '320')
          AND (T.TIPO NOT LIKE '324%' OR T.TIPO = '324')
        ORDER BY T.TIPO
      `;

      const [results] = await exactusSequelize.query(query, { 
        replacements: { usuario } 
      });
      
      return (results as any[]).map((row: any) => ({
        tipo: row.TIPO || '',
        descripcion: row.DESCRIPCION || '',
        qrp: row.QRP || ''
      }));
    } catch (error) {
      console.error('Error al obtener tipos EGP:', error);
      throw new Error(`Error al obtener tipos EGP: ${error}`);
    }
  }

  async getPeriodosContables(conjunto: string, fecha: string): Promise<PeriodoContable[]> {
    try {
      // Convertir fecha de formato YYYY/MM/DD a YYYY-MM-DD
      const fechaFormateada = fecha.replace(/\//g, '-');
      
      const query = `
        SELECT 
          descripcion, 
          contabilidad, 
          estado,
          fecha_inicial,
          fecha_final
        FROM JBRTRA.periodo_contable (NOLOCK)                                   
        WHERE fecha_final = :fecha
          AND contabilidad = 'F'
        ORDER BY fecha_final DESC
      `;

      const [results] = await exactusSequelize.query(query, { 
        replacements: { fecha: fechaFormateada } 
      });
      
      return (results as any[]).map((row: any) => ({
        descripcion: row.descripcion || '',
        contabilidad: row.contabilidad || '',
        estado: row.estado || '',
        fechaInicial: row.fecha_inicial || '',
        fechaFinal: row.fecha_final || ''
      }));
    } catch (error) {
      console.error('Error al obtener períodos contables:', error);
      throw new Error(`Error al obtener períodos contables: ${error}`);
    }
  }

  // Método de diagnóstico para probar la conexión a la base de datos
  async testDatabaseConnection(): Promise<boolean> {
    try {
      console.log(`🔍 [REPOSITORY] Probando conexión a la base de datos...`);
      const [results] = await exactusSequelize.query('SELECT 1 as test');
      console.log(`✅ [REPOSITORY] Conexión a la base de datos exitosa`);
      return true;
    } catch (error) {
      console.error(`❌ [REPOSITORY] Error de conexión a la base de datos:`, error);
      return false;
    }
  }

  async getEstadoResultados(
    conjunto: string, 
    usuario: string, 
    filtros: FiltrosEstadoResultados,
    page: number = 1,
    pageSize: number = 20
  ): Promise<EstadoResultados[]> {
    const inicioEjecucion = Date.now();
    
    try {
      // Validar parámetros requeridos
      if (!conjunto || !usuario || !filtros.fecha) {
        throw new Error('Conjunto, usuario y fecha son requeridos');
      }

      const fechaActual = filtros.fecha!;
      const fechaAnterior = this.calcularFechaAnterior(fechaActual);
      const tipoEgp = filtros.tipoEgp || 'GYPPQ';

      console.log(`🔍 [REPOSITORY] Iniciando proceso estándar de Estado de Resultados...`);
      console.log(`🔍 [REPOSITORY] Parámetros: conjunto=${conjunto}, usuario=${usuario}, fechaActual=${fechaActual}, fechaAnterior=${fechaAnterior}, tipoEgp=${tipoEgp}`);

      // Paso 0: Probar conexión a la base de datos
      console.log(`🔍 [REPOSITORY] Paso 0: Probando conexión a la base de datos...`);
      const dbConnected = await this.testDatabaseConnection();
      if (!dbConnected) {
        throw new Error('No se pudo conectar a la base de datos');
      }
      console.log(`✅ [REPOSITORY] Paso 0 completado`);

      // Paso 1: Crear tabla temporal
      console.log(`🔍 [REPOSITORY] Paso 1: Creando tabla temporal...`);
      await this.crearTablaTemporal();
      console.log(`✅ [REPOSITORY] Paso 1 completado`);

      // Paso 2: Cargar datos EGP para período actual
      console.log(`🔍 [REPOSITORY] Paso 2: Cargando datos EGP para período actual (${fechaActual})...`);
      await this.cargarDatosEGP(fechaActual, tipoEgp, usuario);
      console.log(`✅ [REPOSITORY] Paso 2 completado`);

      // Paso 3: Cargar datos EGP para período anterior
      console.log(`🔍 [REPOSITORY] Paso 3: Cargando datos EGP para período anterior (${fechaAnterior})...`);
      await this.cargarDatosEGP(fechaAnterior, tipoEgp, usuario);
      console.log(`✅ [REPOSITORY] Paso 3 completado`);

      // Paso 4: Ejecutar query principal estándar (usando nombres de columnas correctos)
      const queryPrincipal = `
        SELECT 
          PA.NOMBRE AS PADRE_NOMBRE,
          P.FAMILIA,
          P.NOMBRE AS CONCEPTO,
          P.POSICION,
          'Nuevo Sol' AS MONEDA,
          P.ORDEN,     
          ISNULL(SUM(CASE WHEN EG.PERIODO = :fecha_actual THEN EG.SALDO ELSE 0 END), 0) AS SALDO2,
          ISNULL(SUM(CASE WHEN EG.PERIODO = :fecha_anterior THEN EG.SALDO ELSE 0 END), 0) AS SALDO1,
          (ISNULL(SUM(CASE WHEN EG.PERIODO = :fecha_actual THEN EG.SALDO ELSE 0 END), 0) - 
           ISNULL(SUM(CASE WHEN EG.PERIODO = :fecha_anterior THEN EG.SALDO ELSE 0 END), 0)) AS VARIACION,
          P.FAMILIA_PADRE
        FROM JBRTRA.POSICION_EGP P (NOLOCK)   
        INNER JOIN JBRTRA.POSICION_EGP PA (NOLOCK) ON PA.TIPO = P.TIPO AND PA.FAMILIA = P.FAMILIA_PADRE
        LEFT OUTER JOIN JBRTRA.EGP EG (NOLOCK) ON EG.TIPO = P.TIPO AND EG.FAMILIA = P.FAMILIA AND EG.USUARIO = :usuario
        WHERE P.TIPO = :tipo_egp
        GROUP BY PA.NOMBRE, P.FAMILIA, P.NOMBRE, P.POSICION, P.ORDEN, P.FAMILIA_PADRE   

        UNION ALL   

        SELECT 
          NULL AS PADRE_NOMBRE,
          P.FAMILIA,
          P.NOMBRE AS CONCEPTO,
          P.POSICION, 
          'Nuevo Sol' AS MONEDA,
          P.ORDEN, 
          ISNULL(SUM(CASE WHEN EG.PERIODO = :fecha_actual THEN EG.SALDO ELSE 0 END), 0) AS SALDO2,
          ISNULL(SUM(CASE WHEN EG.PERIODO = :fecha_anterior THEN EG.SALDO ELSE 0 END), 0) AS SALDO1,
          (ISNULL(SUM(CASE WHEN EG.PERIODO = :fecha_actual THEN EG.SALDO ELSE 0 END), 0) - 
           ISNULL(SUM(CASE WHEN EG.PERIODO = :fecha_anterior THEN EG.SALDO ELSE 0 END), 0)) AS VARIACION,
          P.FAMILIA_PADRE
        FROM JBRTRA.POSICION_EGP P (NOLOCK)   
        LEFT OUTER JOIN JBRTRA.EGP EG (NOLOCK) ON EG.TIPO = P.TIPO AND EG.FAMILIA = P.FAMILIA AND EG.USUARIO = :usuario
        WHERE P.FAMILIA_PADRE IS NULL AND P.AGRUPA = 'N' AND P.TIPO = :tipo_egp
        GROUP BY P.FAMILIA, P.NOMBRE, P.POSICION, P.ORDEN, P.FAMILIA_PADRE
        
        ORDER BY POSICION, ORDEN
      `;

      console.log(`🔍 [REPOSITORY] Paso 4: Ejecutando query principal estándar...`);
      console.log(`🔍 [REPOSITORY] Parámetros: fecha_actual=${fechaActual}, fecha_anterior=${fechaAnterior}, usuario=${usuario}, tipo_egp=${tipoEgp}`);
      
      const [results] = await exactusSequelize.query(queryPrincipal, {
        replacements: {
          fecha_actual: fechaActual,
          fecha_anterior: fechaAnterior,
          usuario: usuario,
          tipo_egp: tipoEgp
        }
      });

      console.log(`🔍 [REPOSITORY] Query principal completado. Resultados: ${results ? (results as any[]).length : 0}`);
      
      if (results && (results as any[]).length > 0) {
        console.log(`🔍 [REPOSITORY] Primer resultado:`, (results as any[])[0]);
      }
      
      // Mapear resultados con jerarquía
      const datosReporte = this.mapearResultadosConJerarquia(results ? (results as any[]) : [], fechaActual, fechaAnterior, tipoEgp);
      
      // Agregar encabezado
      const estructuraReporte = this.generarEstructuraReporte(conjunto, fechaActual, fechaAnterior);
      const resultadoFinal = [...estructuraReporte, ...datosReporte];
      
      const tiempoEjecucion = Date.now() - inicioEjecucion;
      console.log(`✅ [REPOSITORY] getEstadoResultados estándar completado en ${tiempoEjecucion}ms`);
      
      return resultadoFinal;

    } catch (error) {
      const tiempoEjecucion = Date.now() - inicioEjecucion;
      console.error(`❌ [REPOSITORY] Error después de ${tiempoEjecucion}ms:`, error);
      console.error(`❌ [REPOSITORY] Stack trace:`, error instanceof Error ? error.stack : 'No stack trace available');
      
      // Si falla, devolver datos mock para testing
      console.log(`🔄 [REPOSITORY] Devolviendo datos mock para testing...`);
      return this.getDatosMock(filtros.fecha!);
    }
  }

  async getTotalRecords(conjunto: string, usuario: string, filtros: FiltrosEstadoResultados): Promise<number> {
    try {
      const query = `
        SELECT COUNT(*) as total
        FROM JBRTRA.POSICION_EGP P (NOLOCK)
        WHERE P.TIPO = :tipo_egp
      `;

      const [results] = await exactusSequelize.query(query, {
        replacements: { tipo_egp: filtros.tipoEgp || 'GYPPQ' }
      });

      return (results as any[])[0]?.total || 0;
    } catch (error) {
      console.error('Error al obtener total de registros:', error);
      return 0;
    }
  }

  // Métodos auxiliares
  private calcularFechaAnterior(fecha: string): string {
    const fechaObj = new Date(fecha);
    fechaObj.setMonth(fechaObj.getMonth() - 1);
    return fechaObj.toISOString().split('T')[0] || '';
  }

  private async crearTablaTemporal(): Promise<void> {
    try {
      const query = `
        IF OBJECT_ID('JBRTRA.R_XML_8DDC9208B6470F8', 'U') IS NOT NULL
          DROP TABLE JBRTRA.R_XML_8DDC9208B6470F8;
        
        CREATE TABLE JBRTRA.R_XML_8DDC9208B6470F8 (
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

      await exactusSequelize.query(query);
      console.log(`✅ [REPOSITORY] Tabla temporal creada exitosamente`);
    } catch (error) {
      console.error('Error al crear tabla temporal:', error);
      throw new Error(`Error al crear tabla temporal: ${error}`);
    }
  }

  private async cargarDatosEGP(fecha: string, tipoEgp: string, usuario: string): Promise<void> {
    try {
      const query = `
        INSERT INTO JBRTRA.EGP (PERIODO, TIPO, FAMILIA, SALDO, SALDO_DOLAR, USUARIO)
        SELECT 
          :fecha,
          TIPO,
          FAMILIA,
          SUM(SALDO_LOCAL),
          SUM(SALDO_DOLAR),
          :usuario
        FROM (
          SELECT 
            E.TIPO,
            E.FAMILIA,
            V.CREDITO_LOCAL - V.DEBITO_LOCAL AS SALDO_LOCAL,
            V.CREDITO_DOLAR - V.DEBITO_DOLAR AS SALDO_DOLAR
          FROM (
            -- Saldos fiscales
            SELECT 
              m.centro_costo,
              m.cuenta_contable,
              CASE WHEN m.saldo_fisc_local > 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS debito_local,
              CASE WHEN m.saldo_fisc_local < 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS credito_local,
              CASE WHEN m.saldo_fisc_dolar > 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS debito_dolar,
              CASE WHEN m.saldo_fisc_dolar < 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS credito_dolar
            FROM JBRTRA.saldo m (NOLOCK)
            INNER JOIN (
              SELECT m.centro_costo, m.cuenta_contable, MAX(m.fecha) AS fecha
              FROM JBRTRA.saldo m (NOLOCK)
              WHERE m.fecha <= :fecha
              GROUP BY m.centro_costo, m.cuenta_contable
            ) smax ON (m.centro_costo = smax.centro_costo AND m.cuenta_contable = smax.cuenta_contable AND m.fecha = smax.fecha)
            WHERE 1 = 1
            
            UNION ALL
            
            -- Movimientos del diario
            SELECT 
              m.centro_costo,
              m.cuenta_contable,
              COALESCE(m.debito_local, 0) AS debito_local,
              COALESCE(m.credito_local, 0) AS credito_local,
              COALESCE(m.debito_dolar, 0) AS debito_dolar,
              COALESCE(m.credito_dolar, 0) AS credito_dolar
            FROM JBRTRA.asiento_de_diario am (NOLOCK)
            INNER JOIN JBRTRA.diario m (NOLOCK) ON (am.asiento = m.asiento)
            WHERE am.fecha <= :fecha
              AND contabilidad IN ('F', 'A')
          ) V
          INNER JOIN JBRTRA.EGP_CUENTAS_DET E (NOLOCK) ON (E.CUENTA_CONTABLE = V.CUENTA_CONTABLE)
          WHERE E.TIPO = :tipo_egp
            AND NOT EXISTS (
              SELECT 1 FROM JBRTRA.EGP_CENTROS_CUENTAS X (NOLOCK)
              WHERE E.TIPO = X.TIPO AND E.FAMILIA = X.FAMILIA AND E.CUENTA_CONTABLE_ORIGINAL = X.CUENTA_CONTABLE
            )
          
          UNION ALL
          
          SELECT 
            E.TIPO,
            E.FAMILIA,
            V.CREDITO_LOCAL - V.DEBITO_LOCAL,
            V.CREDITO_DOLAR - V.DEBITO_DOLAR
          FROM (
            -- Saldos fiscales con centro de costo
            SELECT 
              m.centro_costo,
              m.cuenta_contable,
              CASE WHEN m.saldo_fisc_local > 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS debito_local,
              CASE WHEN m.saldo_fisc_local < 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END AS credito_local,
              CASE WHEN m.saldo_fisc_dolar > 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS debito_dolar,
              CASE WHEN m.saldo_fisc_dolar < 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END AS credito_dolar
            FROM JBRTRA.saldo m (NOLOCK)
            INNER JOIN (
              SELECT m.centro_costo, m.cuenta_contable, MAX(m.fecha) AS fecha
              FROM JBRTRA.saldo m (NOLOCK)
              WHERE m.fecha <= :fecha
              GROUP BY m.centro_costo, m.cuenta_contable
            ) smax ON (m.centro_costo = smax.centro_costo AND m.cuenta_contable = smax.cuenta_contable AND m.fecha = smax.fecha)
            WHERE 1 = 1
            
            UNION ALL
            
            -- Movimientos del diario con centro de costo
            SELECT 
              m.centro_costo,
              m.cuenta_contable,
              COALESCE(m.debito_local, 0) AS debito_local,
              COALESCE(m.credito_local, 0) AS credito_local,
              COALESCE(m.debito_dolar, 0) AS debito_dolar,
              COALESCE(m.credito_dolar, 0) AS credito_dolar
            FROM JBRTRA.asiento_de_diario am (NOLOCK)
            INNER JOIN JBRTRA.diario m (NOLOCK) ON (am.asiento = m.asiento)
            WHERE am.fecha <= :fecha
              AND contabilidad IN ('F', 'A')
          ) V
          INNER JOIN JBRTRA.EGP_CENTROS_CUENTAS_DET E (NOLOCK) ON (E.CUENTA_CONTABLE = V.CUENTA_CONTABLE AND E.CENTRO_COSTO = V.CENTRO_COSTO)
          WHERE E.TIPO = :tipo_egp
        ) VISTA
        GROUP BY TIPO, FAMILIA
      `;

      await exactusSequelize.query(query, {
        replacements: {
          fecha: fecha,
          tipo_egp: tipoEgp,
          usuario: usuario
        }
      });

      console.log(`✅ [REPOSITORY] Datos EGP cargados para fecha: ${fecha}`);
    } catch (error) {
      console.error(`Error al cargar datos EGP para fecha ${fecha}:`, error);
      throw new Error(`Error al cargar datos EGP: ${error}`);
    }
  }

  // Métodos de formateo eliminados - se manejarán en el frontend

  // Método eliminado - cálculo inline para mejor performance

  private generarEstructuraReporte(conjunto: string, fechaActual: string, fechaAnterior: string): EstadoResultados[] {
    return [
      {
        cuenta_contable: '',
        fecha_balance: new Date(fechaActual),
        saldo_inicial: 0,
        nombre_cuenta: 'EMPRESA XYZ S.A.',
        fecha_inicio: new Date(fechaAnterior),
        fecha_cuenta: new Date(fechaActual),
        saldo_final: 0,
        tiporeporte: 'ESTADO DE RESULTADOS COMPARATIVO',
        posicion: '0',
        caracter: 'E',
        moneda: 'Nuevo Sol',
        padre: '',
        orden: 0,
        mes: 'Período: ' + fechaAnterior + ' vs ' + fechaActual,
        esEncabezado: true
      }
    ];
  }

  private async calcularTotales(conjunto: string, usuario: string, tipoEgp: string, fechaActual: string, fechaAnterior: string): Promise<EstadoResultados[]> {
    try {
      const query = `
        SELECT 
          'TOTAL INGRESOS' as concepto,
          SUM(CASE WHEN EG.PERIODO = :fechaActual THEN EG.SALDO ELSE 0 END) as saldo_actual,
          SUM(CASE WHEN EG.PERIODO = :fechaAnterior THEN EG.SALDO ELSE 0 END) as saldo_anterior
        FROM JBRTRA.EGP EG (NOLOCK)
        INNER JOIN JBRTRA.POSICION_EGP P (NOLOCK) ON EG.TIPO = P.TIPO AND EG.FAMILIA = P.FAMILIA
        WHERE EG.USUARIO = :usuario AND EG.TIPO = :tipoEgp AND P.POSICION = 1
      `;

      const [results] = await exactusSequelize.query(query, {
        replacements: { fechaActual, fechaAnterior, usuario, tipoEgp }
      });

      const totales: EstadoResultados[] = [];
      
      if (results && (results as any[]).length > 0) {
        const row = (results as any[])[0];
        const variacion = row.saldo_actual - row.saldo_anterior;
        
        totales.push({
          cuenta_contable: '',
          fecha_balance: new Date(fechaActual),
          saldo_inicial: row.saldo_anterior,
          nombre_cuenta: 'TOTAL INGRESOS',
          fecha_inicio: new Date(fechaAnterior),
          fecha_cuenta: new Date(fechaActual),
          saldo_final: row.saldo_actual,
          tiporeporte: 'TOTAL',
          posicion: '1',
          caracter: 'T',
          moneda: 'Nuevo Sol',
          padre: '',
          orden: 999,
          mes: '',
          variacion: variacion,
          esTotal: true
        });
      }

      return totales;
    } catch (error) {
      console.error('Error al calcular totales:', error);
      return [];
    }
  }

  async validarBalance(
    conjunto: string,
    usuario: string,
    tipoEgp: string,
    fechaActual: string,
    fechaAnterior: string
  ): Promise<ValidacionBalance> {
    try {
      const query = `
        SELECT 
          SUM(CASE WHEN EG.PERIODO = :fechaActual THEN EG.SALDO ELSE 0 END) as total_ingresos,
          SUM(CASE WHEN EG.PERIODO = :fechaActual THEN EG.SALDO ELSE 0 END) as total_egresos
        FROM JBRTRA.EGP EG (NOLOCK)
        INNER JOIN JBRTRA.POSICION_EGP P (NOLOCK) ON EG.TIPO = P.TIPO AND EG.FAMILIA = P.FAMILIA
        WHERE EG.USUARIO = :usuario AND EG.TIPO = :tipoEgp
      `;

      const [results] = await exactusSequelize.query(query, {
        replacements: { fechaActual, usuario, tipoEgp }
      });

      const row = (results as any[])[0];
      const totalIngresos = row.total_ingresos || 0;
      const totalEgresos = row.total_egresos || 0;
      const utilidad = totalIngresos - totalEgresos;

      return {
        valido: Math.abs(utilidad) < 0.01, // Tolerancia de 1 centavo
        mensaje: utilidad === 0 ? 'Balance correcto' : `Diferencia de ${utilidad.toFixed(2)}`,
        totalIngresos,
        totalEgresos,
        utilidad
      };
    } catch (error) {
      console.error('Error al validar balance:', error);
      return {
        valido: false,
        mensaje: 'Error al validar balance',
        totalIngresos: 0,
        totalEgresos: 0,
        utilidad: 0
      };
    }
  }

  private async registrarEjecucion(
    conjunto: string,
    usuario: string,
    fechaActual: string,
    fechaAnterior: string,
    registrosProcesados: number,
    tiempoEjecucion: number
  ): Promise<void> {
    try {
      const query = `
        INSERT INTO JBRTRA.LOG_REPORTES (usuario, reporte, fecha_ejecucion, periodo_actual, periodo_anterior, registros_procesados, tiempo_ejecucion, estado)
        VALUES (:usuario, 'ESTADO_RESULTADOS', GETDATE(), :fechaActual, :fechaAnterior, :registrosProcesados, :tiempoEjecucion, 'EXITOSO')
      `;

      await exactusSequelize.query(query, {
        replacements: { usuario, fechaActual, fechaAnterior, registrosProcesados, tiempoEjecucion }
      });
    } catch (error) {
      console.error('Error al registrar ejecución:', error);
    }
  }

  private async registrarErrorEjecucion(
    conjunto: string,
    usuario: string,
    fechaActual: string,
    error: Error,
    tiempoEjecucion: number
  ): Promise<void> {
    try {
      const query = `
        INSERT INTO JBRTRA.LOG_REPORTES (usuario, reporte, fecha_ejecucion, periodo_actual, periodo_anterior, registros_procesados, tiempo_ejecucion, estado, mensaje_error)
        VALUES (:usuario, 'ESTADO_RESULTADOS', GETDATE(), :fechaActual, NULL, 0, :tiempoEjecucion, 'ERROR', :mensajeError)
      `;

      await exactusSequelize.query(query, {
        replacements: { 
          usuario, 
          fechaActual, 
          tiempoEjecucion, 
          mensajeError: error.message.substring(0, 500) // Limitar mensaje a 500 caracteres
        }
      });
    } catch (logError) {
      console.error('Error al registrar error de ejecución:', logError);
    }
  }

  private mapearResultadosConJerarquia(results: any[], fechaActual: string, fechaAnterior: string, tipoEgp: string): EstadoResultados[] {
    // Mapeo correcto según el query estándar
    return results.map((row: any) => {
      const saldoActual = row.SALDO_ACTUAL || row.SALDO2 || 0;
      const saldoAnterior = row.SALDO_ANTERIOR || row.SALDO1 || 0;
      const variacion = saldoActual - saldoAnterior;
      
      return {
        cuenta_contable: row.FAMILIA || '',
        fecha_balance: new Date(fechaActual),
        saldo_inicial: saldoAnterior,
        nombre_cuenta: row.CONCEPTO || '',
        fecha_inicio: new Date(fechaAnterior),
        fecha_cuenta: new Date(fechaActual),
        saldo_final: saldoActual,
        tiporeporte: tipoEgp,
        posicion: row.POSICION || '0',
        caracter: 'D',
        moneda: row.MONEDA || 'Nuevo Sol',
        padre: row.PADRE_NOMBRE || '',
        orden: row.ORDEN || 0,
        mes: '',
        variacion: variacion,
        nivel: row.PADRE_NOMBRE ? 2 : 1,
        esTotal: false,
        esSubtotal: !row.PADRE_NOMBRE,
        esEncabezado: false
      };
    });
  }

  private mapearResultadosBasicos(results: any[], fechaActual: string, fechaAnterior: string, tipoEgp: string): EstadoResultados[] {
    // Mapeo ultra-simplificado para evitar timeouts
    return results.map((row: any) => ({
      cuenta_contable: row.FAMILIA || '',
      fecha_balance: new Date(fechaActual),
      saldo_inicial: row.SALDO_ANTERIOR || 0,
      nombre_cuenta: row.CONCEPTO || '',
      fecha_inicio: new Date(fechaAnterior),
      fecha_cuenta: new Date(fechaActual),
      saldo_final: row.SALDO_ACTUAL || 0,
      tiporeporte: tipoEgp,
      posicion: row.POSICION || '0',
      caracter: 'D',
      moneda: 'Nuevo Sol',
      padre: '',
      orden: row.ORDEN || 0,
      mes: '',
      variacion: row.VARIACION || 0,
      nivel: row.FAMILIA_PADRE ? 2 : 1,
      esTotal: false,
      esSubtotal: !row.FAMILIA_PADRE,
      esEncabezado: false
    }));
  }

  private getDatosMock(fecha: string): EstadoResultados[] {
    // Datos mock para testing cuando la consulta falla
    const fechaAnterior = this.calcularFechaAnterior(fecha);
    
    return [
      {
        cuenta_contable: '',
        fecha_balance: new Date(fecha),
        saldo_inicial: 0,
        nombre_cuenta: 'EMPRESA XYZ S.A. - MODO MOCK',
        fecha_inicio: new Date(fechaAnterior),
        fecha_cuenta: new Date(fecha),
        saldo_final: 0,
        tiporeporte: 'ESTADO DE RESULTADOS COMPARATIVO - MOCK',
        posicion: '0',
        caracter: 'E',
        moneda: 'Nuevo Sol',
        padre: '',
        orden: 0,
        mes: 'Período: ' + fechaAnterior + ' vs ' + fecha + ' (MOCK)',
        esEncabezado: true
      },
      {
        cuenta_contable: 'MOCK001',
        fecha_balance: new Date(fecha),
        saldo_inicial: 100000,
        nombre_cuenta: 'INGRESOS POR VENTAS - MOCK',
        fecha_inicio: new Date(fechaAnterior),
        fecha_cuenta: new Date(fecha),
        saldo_final: 120000,
        tiporeporte: 'GYPPQ',
        posicion: '1',
        caracter: 'D',
        moneda: 'Nuevo Sol',
        padre: '',
        orden: 1,
        mes: '',
        variacion: 20000,
        nivel: 1,
        esTotal: false,
        esSubtotal: true,
        esEncabezado: false
      },
      {
        cuenta_contable: 'MOCK002',
        fecha_balance: new Date(fecha),
        saldo_inicial: 80000,
        nombre_cuenta: 'COSTO DE VENTAS - MOCK',
        fecha_inicio: new Date(fechaAnterior),
        fecha_cuenta: new Date(fecha),
        saldo_final: 90000,
        tiporeporte: 'GYPPQ',
        posicion: '2',
        caracter: 'D',
        moneda: 'Nuevo Sol',
        padre: '',
        orden: 2,
        mes: '',
        variacion: 10000,
        nivel: 1,
        esTotal: false,
        esSubtotal: true,
        esEncabezado: false
      }
    ];
  }

  /**
   * Método para obtener sugerencias de índices que mejorarían el performance
   * Este método puede ser llamado para analizar y sugerir índices
   */
  async getSugerenciasIndices(): Promise<string[]> {
    return [
      '-- Índices sugeridos para mejorar performance del Estado de Resultados:',
      '-- 1. Índice compuesto en JBRTRA.POSICION_EGP:',
      'CREATE INDEX IX_POSICION_EGP_TIPO_FAMILIA ON JBRTRA.POSICION_EGP (TIPO, FAMILIA) INCLUDE (NOMBRE, POSICION, ORDEN, FAMILIA_PADRE);',
      '',
      '-- 2. Índice compuesto en JBRTRA.EGP:',
      'CREATE INDEX IX_EGP_USUARIO_TIPO_FAMILIA_PERIODO ON JBRTRA.EGP (USUARIO, TIPO, FAMILIA, PERIODO) INCLUDE (SALDO);',
      '',
      '-- 3. Índice en JBRTRA.POSICION_EGP para búsquedas por FAMILIA_PADRE:',
      'CREATE INDEX IX_POSICION_EGP_FAMILIA_PADRE ON JBRTRA.POSICION_EGP (FAMILIA_PADRE) WHERE FAMILIA_PADRE IS NOT NULL;',
      '',
      '-- 4. Índice en JBRTRA.POSICION_EGP para elementos sin padre:',
      'CREATE INDEX IX_POSICION_EGP_SIN_PADRE ON JBRTRA.POSICION_EGP (TIPO, AGRUPA) WHERE FAMILIA_PADRE IS NULL AND AGRUPA = \'N\';'
    ];
  }

  /**
   * Método alternativo con consulta más simple para casos de timeout
   */
  async getEstadoResultadosSimple(
    conjunto: string, 
    usuario: string, 
    filtros: FiltrosEstadoResultados,
    page: number = 1,
    pageSize: number = 20
  ): Promise<EstadoResultados[]> {
    const inicioEjecucion = Date.now();
    
    try {
      if (!conjunto || !usuario || !filtros.fecha) {
        throw new Error('Conjunto, usuario y fecha son requeridos');
      }

      const fechaActual = filtros.fecha!;
      const fechaAnterior = this.calcularFechaAnterior(fechaActual);
      const tipoEgp = filtros.tipoEgp || 'GYPPQ';

      console.log(`🔍 [REPOSITORY] Ejecutando consulta simple para evitar timeout...`);

      // Consulta más simple sin UNION ALL
      const simpleQuery = `
        SELECT TOP :pageSize
          PA.NOMBRE AS PADRE_NOMBRE,
          P.FAMILIA,
          P.NOMBRE AS CONCEPTO,
          P.POSICION,
          'Nuevo Sol' AS MONEDA,
          P.ORDEN,
          ISNULL(SUM(CASE WHEN EG.PERIODO = :fecha_periodo_actual THEN EG.SALDO ELSE 0 END), 0) AS SALDO_ACTUAL,
          ISNULL(SUM(CASE WHEN EG.PERIODO = :fecha_periodo_anterior THEN EG.SALDO ELSE 0 END), 0) AS SALDO_ANTERIOR,
          (ISNULL(SUM(CASE WHEN EG.PERIODO = :fecha_periodo_actual THEN EG.SALDO ELSE 0 END), 0) - 
           ISNULL(SUM(CASE WHEN EG.PERIODO = :fecha_periodo_anterior THEN EG.SALDO ELSE 0 END), 0)) AS VARIACION,
          P.FAMILIA_PADRE
        FROM JBRTRA.POSICION_EGP P (NOLOCK)
        LEFT JOIN JBRTRA.POSICION_EGP PA (NOLOCK) ON PA.TIPO = P.TIPO AND PA.FAMILIA = P.FAMILIA_PADRE
        LEFT JOIN JBRTRA.EGP EG (NOLOCK) ON EG.TIPO = P.TIPO AND EG.FAMILIA = P.FAMILIA AND EG.USUARIO = :usuario
        WHERE P.TIPO = :tipo_egp
        GROUP BY PA.NOMBRE, P.FAMILIA, P.NOMBRE, P.POSICION, P.ORDEN, P.FAMILIA_PADRE
        ORDER BY P.POSICION, P.ORDEN
      `;

      const [results] = await exactusSequelize.query(simpleQuery, {
        replacements: {
          fecha_periodo_actual: fechaActual,
          fecha_periodo_anterior: fechaAnterior,
          usuario: usuario,
          tipo_egp: tipoEgp,
          pageSize: pageSize
        }
      });

      const datosReporte = this.mapearResultadosConJerarquia(results ? (results as any[]) : [], fechaActual, fechaAnterior, tipoEgp);
      const estructuraReporte = this.generarEstructuraReporte(conjunto, fechaActual, fechaAnterior);
      const resultadoFinal = [...estructuraReporte, ...datosReporte];

      const tiempoEjecucion = Date.now() - inicioEjecucion;
      console.log(`✅ [REPOSITORY] Consulta simple completada en ${tiempoEjecucion}ms`);

      return resultadoFinal;

    } catch (error) {
      console.error('Error en consulta simple:', error);
      throw new Error(`Error al obtener estado de resultados (consulta simple): ${error}`);
    }
  }
}