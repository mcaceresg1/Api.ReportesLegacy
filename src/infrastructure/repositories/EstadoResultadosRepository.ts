import { injectable } from 'inversify';
import { exactusSequelize } from '../database/config/exactus-database'
import { EstadoResultados, FiltrosEstadoResultados, TipoEgp, PeriodoContable, ValidacionBalance, LogEjecucion } from '../../domain/entities/EstadoResultados';

@injectable()
export class EstadoResultadosRepository {

  async getTiposEgp(conjunto: string, usuario: string): Promise<TipoEgp[]> {
    try {
      const query = `
        SELECT DISTINCT 
          E.TIPO,
          CASE 
            WHEN E.TIPO = 'GYPPQ' THEN 'GYPPQ - Estado de Resultados Comparativo'
            WHEN E.TIPO = 'GYPPA' THEN 'GYPPA - Estado de Resultados Anual'
            WHEN E.TIPO = 'GYPPB' THEN 'GYPPB - Estado de Resultados Básico'
            ELSE E.TIPO + ' - Tipo de Reporte'
          END as DESCRIPCION,
          'Q' as QRP
        FROM JBRTRA.EGP E (NOLOCK)
        WHERE E.USUARIO = :usuario
          AND E.TIPO NOT IN ('10.1', '10.2')
          AND (E.TIPO NOT LIKE '320%' OR E.TIPO = '320')
          AND (E.TIPO NOT LIKE '324%' OR E.TIPO = '324')
        ORDER BY E.TIPO
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

  async getEstadoResultados(
    conjunto: string, 
    usuario: string, 
    filtros: FiltrosEstadoResultados,
    page: number = 1,
    pageSize: number = 20
  ): Promise<EstadoResultados[]> {
    const inicioEjecucion = Date.now();
    const maxRetries = 2;
    let lastError: Error | null = null;
    
    try {
      // Validar parámetros requeridos
      if (!conjunto || !usuario || !filtros.fecha) {
        throw new Error('Conjunto, usuario y fecha son requeridos');
      }

      const fechaActual = filtros.fecha!;
      const fechaAnterior = this.calcularFechaAnterior(fechaActual);
      const tipoEgp = filtros.tipoEgp || 'GYPPQ';

      console.log(`🔍 [REPOSITORY] Iniciando getEstadoResultados para conjunto: ${conjunto}, usuario: ${usuario}, fecha: ${fechaActual}`);

      // Consulta optimizada con mejor performance
      const finalQuery = `
        WITH PosicionesConDatos AS (
          SELECT 
            P.FAMILIA,
            P.NOMBRE AS CONCEPTO,
            P.POSICION,
            P.ORDEN,
            P.FAMILIA_PADRE,
            PA.NOMBRE AS PADRE_NOMBRE,
            ISNULL(SUM(CASE WHEN EG.PERIODO = :fecha_periodo_actual THEN EG.SALDO ELSE 0 END), 0) AS SALDO_ACTUAL,
            ISNULL(SUM(CASE WHEN EG.PERIODO = :fecha_periodo_anterior THEN EG.SALDO ELSE 0 END), 0) AS SALDO_ANTERIOR
          FROM JBRTRA.POSICION_EGP P (NOLOCK)
          LEFT JOIN JBRTRA.POSICION_EGP PA (NOLOCK) ON PA.TIPO = P.TIPO AND PA.FAMILIA = P.FAMILIA_PADRE
          LEFT JOIN JBRTRA.EGP EG (NOLOCK) ON EG.TIPO = P.TIPO AND EG.FAMILIA = P.FAMILIA AND EG.USUARIO = :usuario
          WHERE P.TIPO = :tipo_egp
          GROUP BY P.FAMILIA, P.NOMBRE, P.POSICION, P.ORDEN, P.FAMILIA_PADRE, PA.NOMBRE
        )
        SELECT 
          PADRE_NOMBRE,
          FAMILIA,
          CONCEPTO,
          POSICION,
          'Nuevo Sol' AS MONEDA,
          ORDEN,
          SALDO_ACTUAL,
          SALDO_ANTERIOR,
          (SALDO_ACTUAL - SALDO_ANTERIOR) AS VARIACION,
          FAMILIA_PADRE
        FROM PosicionesConDatos
        WHERE FAMILIA_PADRE IS NOT NULL
        
        UNION ALL
        
        SELECT 
          NULL AS PADRE_NOMBRE,
          FAMILIA,
          CONCEPTO,
          POSICION,
          'Nuevo Sol' AS MONEDA,
          ORDEN,
          SALDO_ACTUAL,
          SALDO_ANTERIOR,
          (SALDO_ACTUAL - SALDO_ANTERIOR) AS VARIACION,
          FAMILIA_PADRE
        FROM PosicionesConDatos
        WHERE FAMILIA_PADRE IS NULL
        ORDER BY POSICION, ORDEN
        OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY
      `;

      console.log(`🔍 [REPOSITORY] Ejecutando consulta optimizada...`);
      
      // Intentar ejecutar la consulta con retry en caso de timeout
      let results: any = null;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const [queryResults] = await exactusSequelize.query(finalQuery, {
            replacements: {
              fecha_periodo_actual: fechaActual,
              fecha_periodo_anterior: fechaAnterior,
              usuario: usuario,
              tipo_egp: tipoEgp,
              offset: (page - 1) * pageSize,
              pageSize: pageSize
            }
          });
          results = queryResults;
          break; // Si la consulta es exitosa, salir del loop
        } catch (error: any) {
          lastError = error;
          if (error.message && error.message.includes('Timeout') && attempt < maxRetries) {
            console.warn(`⚠️ [REPOSITORY] Timeout en intento ${attempt}, reintentando...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Esperar antes del retry
            continue;
          }
          throw error; // Si no es timeout o es el último intento, lanzar el error
        }
      }

      if (!results) {
        throw lastError || new Error('No se pudieron obtener resultados después de varios intentos');
      }

      console.log(`🔍 [REPOSITORY] Consulta completada. Resultados: ${results ? (results as any[]).length : 0}`);

      // Generar estructura del reporte
      const estructuraReporte = this.generarEstructuraReporte(conjunto, fechaActual, fechaAnterior);
      
      // Mapear resultados con jerarquía
      const datosReporte = this.mapearResultadosConJerarquia(results ? (results as any[]) : [], fechaActual, fechaAnterior, tipoEgp);
      
      // Calcular totales (solo si no hay timeout)
      let totales: EstadoResultados[] = [];
      try {
        totales = await this.calcularTotales(conjunto, usuario, tipoEgp, fechaActual, fechaAnterior);
      } catch (error) {
        console.warn('⚠️ [REPOSITORY] Error al calcular totales, continuando sin ellos:', error);
      }
      
      // Combinar todos los elementos
      const resultadoFinal = [...estructuraReporte, ...datosReporte, ...totales];
      
      // Registrar ejecución
      const tiempoEjecucion = Date.now() - inicioEjecucion;
      try {
        await this.registrarEjecucion(conjunto, usuario, fechaActual, fechaAnterior, resultadoFinal.length, tiempoEjecucion);
      } catch (error) {
        console.warn('⚠️ [REPOSITORY] Error al registrar ejecución:', error);
      }
      
      console.log(`✅ [REPOSITORY] getEstadoResultados completado en ${tiempoEjecucion}ms`);
      
      return resultadoFinal;

    } catch (error) {
      const tiempoEjecucion = Date.now() - inicioEjecucion;
      console.error(`❌ [REPOSITORY] Error después de ${tiempoEjecucion}ms:`, error);
      
      // Registrar error de ejecución
      try {
        await this.registrarErrorEjecucion(conjunto, usuario, filtros.fecha!, error as Error, tiempoEjecucion);
      } catch (logError) {
        console.error('Error al registrar error de ejecución:', logError);
      }
      
      throw new Error(`Error al obtener estado de resultados: ${error}`);
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

  private formatearNumero(valor: number): string {
    if (valor === 0) return '0.00';
    if (valor < 0) return `(${Math.abs(valor).toFixed(2)})`;
    return valor.toFixed(2);
  }

  private formatearVariacion(valor: number): string {
    if (valor === 0) return '0.00';
    if (valor > 0) return `+${valor.toFixed(2)}`;
    return `(${Math.abs(valor).toFixed(2)})`;
  }

  private calcularNivelJerarquia(familiaPadre: string): number {
    if (!familiaPadre) return 1;
    return 2;
  }

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
          esTotal: true,
          saldo_inicial_formateado: this.formatearNumero(row.saldo_anterior),
          saldo_final_formateado: this.formatearNumero(row.saldo_actual),
          variacion_formateada: this.formatearVariacion(variacion)
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
    return results.map((row: any) => {
      const variacion = row.VARIACION || 0;
      const nivel = this.calcularNivelJerarquia(row.FAMILIA_PADRE);
      
      return {
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
        moneda: row.MONEDA || 'Nuevo Sol',
        padre: row.PADRE_NOMBRE || '',
        orden: row.ORDEN || 0,
        mes: '',
        variacion: variacion,
        nivel: nivel,
        esTotal: false,
        esSubtotal: nivel === 1,
        esEncabezado: false,
        saldo_inicial_formateado: this.formatearNumero(row.SALDO_ANTERIOR || 0),
        saldo_final_formateado: this.formatearNumero(row.SALDO_ACTUAL || 0),
        variacion_formateada: this.formatearVariacion(variacion)
      };
    });
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