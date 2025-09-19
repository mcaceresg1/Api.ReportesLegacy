import { injectable } from 'inversify';
import { exactusSequelize } from '../database/config/exactus-database'
import { EstadoResultados, FiltrosEstadoResultados, TipoEgp, PeriodoContable } from '../../domain/entities/EstadoResultados';
import { DynamicModelFactory } from '../database/models/DynamicModel';

@injectable()
export class EstadoResultadosRepository {

  async getTiposEgp(conjunto: string, usuario: string): Promise<TipoEgp[]> {
    try {
      console.log(`🔍 [REPOSITORY] Obteniendo tipos EGP para usuario: ${usuario}`);
      
      // Query estándar usando TIPO_EGP y USUARIO_EGP
      const query = `
        SELECT CAST(UPPER(T.TIPO) + ' ' + T.DESCRIPCION + ' ' + T.QRP AS VARCHAR(1000)) AS TIPO_DESCRIPCION
        FROM ${conjunto}.TIPO_EGP T 
        INNER JOIN ${conjunto}.USUARIO_EGP U 
            ON T.TIPO = U.TIPO 
            AND U.USUARIO = :usuario      
        WHERE 1 = 1  
            AND T.TIPO NOT IN ('10.1', '10.2')   	
            AND (T.TIPO NOT LIKE '320%' OR T.TIPO = '320')    	
            AND (T.TIPO NOT LIKE '324%' OR T.TIPO = '324') 
        ORDER BY 1
      `;

      const [results] = await exactusSequelize.query(query, { 
        replacements: { usuario } 
      });
      
      console.log(`✅ [REPOSITORY] Tipos EGP obtenidos: ${(results as any[]).length} registros`);
      
      return (results as any[]).map((row: any) => {
        const tipoDescripcion = row.TIPO_DESCRIPCION || '';
        const partes = tipoDescripcion.split(' ');
        const tipo = partes[0] || '';
        const descripcion = partes.slice(1, -1).join(' ') || '';
        const qrp = partes[partes.length - 1] || '';
        
        return {
          tipo: tipo,
          descripcion: descripcion,
          qrp: qrp
        };
      });
    } catch (error) {
      console.error('Error al obtener tipos EGP:', error);
      throw new Error(`Error al obtener tipos EGP: ${error}`);
    }
  }

  async getPeriodosContables(conjunto: string, fecha: string): Promise<PeriodoContable[]> {
    try {
      console.log(`🔍 [REPOSITORY] Verificando período contable para fecha: ${fecha}`);
      
      // Query estándar de verificación de período contable
      const query = `
        SELECT descripcion, contabilidad, estado 
        FROM ${conjunto}.periodo_contable                                   
        WHERE fecha_final = :fecha
            AND contabilidad = 'F'
      `;

      const [results] = await exactusSequelize.query(query, { 
        replacements: { fecha: fecha } 
      });
      
      console.log(`✅ [REPOSITORY] Período contable verificado: ${(results as any[]).length} registros`);
      
      return (results as any[]).map((row: any) => ({
        descripcion: row.descripcion || '',
        contabilidad: row.contabilidad || '',
        estado: row.estado || '',
        fechaInicial: '', // No se incluye en el query estándar
        fechaFinal: fecha
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
  ): Promise<{
    success: boolean;
    data: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    message: string;
  }> {
    const startTime = Date.now();
    
    try {
      console.log(`🚀 [ESTADO_RESULTADOS] Iniciando consulta optimizada para conjunto ${conjunto}`);
      
      // Validar parámetros requeridos
      if (!conjunto || !usuario || !filtros.fecha) {
        throw new Error('Conjunto, usuario y fecha son requeridos');
      }

      // Procesar fechas
      const fechaActual = this.procesarFecha(filtros.fecha);
      const fechaAnterior = this.calcularFechaAnterior(fechaActual);
      const tipoEgp = filtros.tipoEgp || 'GYPPQ';

      console.log(`📊 [ESTADO_RESULTADOS] Parámetros: fechaActual=${fechaActual}, fechaAnterior=${fechaAnterior}, tipoEgp=${tipoEgp}`);

      // Calcular offset para paginación
      const offset = (page - 1) * pageSize;

      // Query optimizado con paginación nativa
      const query = `
        WITH BASE_DATA AS (
          SELECT   
              PA.NOMBRE AS GRUPO_PADRE,
              P.FAMILIA,   
              P.NOMBRE AS CONCEPTO,   
              P.POSICION,
              'Nuevo Sol' AS MONEDA,   
              P.ORDEN,     
              ISNULL(SUM(CASE EG.PERIODO WHEN :fecha_actual THEN EG.SALDO ELSE 0 END), 0) AS SALDO_DICIEMBRE, 
              ISNULL(SUM(CASE EG.PERIODO WHEN :fecha_anterior THEN EG.SALDO ELSE 0 END), 0) AS SALDO_NOVIEMBRE       
          FROM ${conjunto}.POSICION_EGP P (NOLOCK)
          INNER JOIN ${conjunto}.POSICION_EGP PA (NOLOCK)
              ON PA.TIPO = P.TIPO 
              AND PA.FAMILIA = P.FAMILIA_PADRE 
          LEFT OUTER JOIN ${conjunto}.EGP EG (NOLOCK)
              ON EG.TIPO = P.TIPO 
              AND EG.FAMILIA = P.FAMILIA 
              AND EG.USUARIO = :usuario          
          WHERE P.TIPO = :tipo_egp
          GROUP BY PA.NOMBRE, P.FAMILIA, P.NOMBRE, P.POSICION, P.ORDEN   

          UNION ALL   

          -- Conceptos sin padre (totales principales)
          SELECT   
              NULL AS GRUPO_PADRE,   
              P.FAMILIA,   
              P.NOMBRE AS CONCEPTO,   
              P.POSICION, 
              'Nuevo Sol' AS MONEDA,   
              P.ORDEN, 
              ISNULL(SUM(CASE EG.PERIODO WHEN :fecha_actual THEN EG.SALDO ELSE 0 END), 0) AS SALDO_DICIEMBRE,
              ISNULL(SUM(CASE EG.PERIODO WHEN :fecha_anterior THEN EG.SALDO ELSE 0 END), 0) AS SALDO_NOVIEMBRE   
          FROM ${conjunto}.POSICION_EGP P (NOLOCK)
          LEFT OUTER JOIN ${conjunto}.EGP EG (NOLOCK)
              ON EG.TIPO = P.TIPO 
              AND EG.FAMILIA = P.FAMILIA 
              AND EG.USUARIO = :usuario        
          WHERE P.FAMILIA_PADRE IS NULL 
              AND P.AGRUPA = 'N'   
              AND P.TIPO = :tipo_egp                         
          GROUP BY P.FAMILIA, P.NOMBRE, P.POSICION, P.ORDEN 
        )
        SELECT 
          GRUPO_PADRE,
          FAMILIA,
          CONCEPTO,
          POSICION,
          MONEDA,
          ORDEN,
          SALDO_DICIEMBRE,
          SALDO_NOVIEMBRE,
          (SALDO_DICIEMBRE - SALDO_NOVIEMBRE) AS VARIACION
        FROM BASE_DATA
        ORDER BY POSICION, ORDEN
        OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY
      `;

      // Query para obtener el total de registros
      const countQuery = `
        WITH BASE_DATA AS (
          SELECT   
              PA.NOMBRE AS GRUPO_PADRE,
              P.FAMILIA,   
              P.NOMBRE AS CONCEPTO,   
              P.POSICION,
              P.ORDEN     
          FROM ${conjunto}.POSICION_EGP P (NOLOCK)
          INNER JOIN ${conjunto}.POSICION_EGP PA (NOLOCK)
              ON PA.TIPO = P.TIPO 
              AND PA.FAMILIA = P.FAMILIA_PADRE 
          WHERE P.TIPO = :tipo_egp

          UNION ALL   

          SELECT   
              NULL AS GRUPO_PADRE,   
              P.FAMILIA,   
              P.NOMBRE AS CONCEPTO,   
              P.POSICION,
              P.ORDEN   
          FROM ${conjunto}.POSICION_EGP P (NOLOCK)
          WHERE P.FAMILIA_PADRE IS NULL 
              AND P.AGRUPA = 'N'   
              AND P.TIPO = :tipo_egp                         
        )
        SELECT COUNT(*) as total FROM BASE_DATA
      `;

      console.log(`📊 [ESTADO_RESULTADOS] Ejecutando consultas paralelas...`);
      
      // Ejecutar consultas en paralelo para mejor rendimiento
      const [dataResults, countResults] = await Promise.all([
        exactusSequelize.query(query, {
          replacements: {
            fecha_actual: fechaActual,
            fecha_anterior: fechaAnterior,
            usuario: usuario,
            tipo_egp: tipoEgp,
            offset: offset,
            pageSize: pageSize
          }
        }),
        exactusSequelize.query(countQuery, {
          replacements: {
            tipo_egp: tipoEgp
          }
        })
      ]);

      const data = dataResults[0] as any[];
      const totalRecords = (countResults[0] as any[])[0]?.total || 0;
      
      console.log(`✅ [ESTADO_RESULTADOS] Datos obtenidos: ${data.length} registros de ${totalRecords} total`);

      // Mapear resultados
      const datosReporte = this.mapearResultadosEstandar(data);
      
      const totalPages = Math.ceil(totalRecords / pageSize);
      const executionTime = Date.now() - startTime;
      
      console.log(`🎉 [ESTADO_RESULTADOS] Consulta completada en ${executionTime}ms`);
      
      return {
        success: true,
        data: datosReporte,
        pagination: {
          page,
          limit: pageSize,
          total: totalRecords,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        message: "Datos obtenidos exitosamente",
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      console.error(`❌ [ESTADO_RESULTADOS] Error después de ${executionTime}ms:`, error);
      
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: pageSize,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        message: `Error al obtener estado de resultados: ${error.message}`,
      };
    }
  }

  async getTotalRecords(conjunto: string, usuario: string, filtros: FiltrosEstadoResultados): Promise<number> {
    try {
      const tipoEgp = filtros.tipoEgp || 'GYPPQ';
      
      const query = `
        WITH BASE_DATA AS (
          SELECT   
              PA.NOMBRE AS GRUPO_PADRE,
              P.FAMILIA,   
              P.NOMBRE AS CONCEPTO,   
              P.POSICION,
              P.ORDEN     
          FROM ${conjunto}.POSICION_EGP P (NOLOCK)
          INNER JOIN ${conjunto}.POSICION_EGP PA (NOLOCK)
              ON PA.TIPO = P.TIPO 
              AND PA.FAMILIA = P.FAMILIA_PADRE 
          WHERE P.TIPO = :tipo_egp

          UNION ALL   

          SELECT   
              NULL AS GRUPO_PADRE,   
              P.FAMILIA,   
              P.NOMBRE AS CONCEPTO,   
              P.POSICION,
              P.ORDEN   
          FROM ${conjunto}.POSICION_EGP P (NOLOCK)
          WHERE P.FAMILIA_PADRE IS NULL 
              AND P.AGRUPA = 'N'   
              AND P.TIPO = :tipo_egp                         
        )
        SELECT COUNT(*) as total FROM BASE_DATA
      `;

      const [results] = await exactusSequelize.query(query, {
        replacements: { tipo_egp: tipoEgp }
      });

      return (results as any[])[0]?.total || 0;
    } catch (error) {
      console.error('Error al obtener total de registros:', error);
      return 0;
    }
  }

  // Métodos auxiliares optimizados
  private calcularFechaAnterior(fecha: string): string {
    const fechaObj = new Date(fecha);
    fechaObj.setMonth(fechaObj.getMonth() - 1);
    return fechaObj.toISOString().split('T')[0] || '';
  }

  private mapearResultadosEstandar(results: any[]): any[] {
    // Mapeo optimizado para el frontend
    return results.map((row: any) => ({
      // Campos principales para el frontend
      concepto: row.CONCEPTO || '',
      saldo_noviembre: Number(row.SALDO_NOVIEMBRE || 0),
      saldo_diciembre: Number(row.SALDO_DICIEMBRE || 0),
      variacion: Number(row.VARIACION || 0),
      
      // Campos adicionales para compatibilidad
      cuenta_contable: row.FAMILIA || '',
      nombre_cuenta: row.GRUPO_PADRE || row.CONCEPTO || '',
      familia: row.FAMILIA || '',
      posicion: row.POSICION || '',
      moneda: row.MONEDA || 'Nuevo Sol',
      orden: Number(row.ORDEN || 0),
      grupo_padre: row.GRUPO_PADRE || '',
      saldo_final: Number(row.SALDO_DICIEMBRE || 0),
      saldo_inicial: Number(row.SALDO_NOVIEMBRE || 0),
      fecha_balance: new Date(),
      fecha_inicio: new Date(),
      fecha_cuenta: new Date(),
      tiporeporte: 'GYPPQ',
      caracter: 'D',
      padre: '',
      mes: ''
    }));
  }

  private procesarFecha(fecha: any): string {
    try {
      if (!fecha) {
        return new Date().toISOString().split('T')[0]!;
      }

      if (typeof fecha === 'string') {
        const dateObj = new Date(fecha);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toISOString().split('T')[0]!;
        }
      } else if (typeof fecha === 'object' && 'toISOString' in fecha) {
        return (fecha as any).toISOString().split('T')[0]!;
      }

      return new Date().toISOString().split('T')[0]!;
    } catch (error) {
      console.warn('Error al procesar fecha, usando fecha actual:', error);
      return new Date().toISOString().split('T')[0]!;
    }
  }

}