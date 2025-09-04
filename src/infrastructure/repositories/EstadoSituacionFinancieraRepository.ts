import { injectable, inject } from 'inversify';
import { IDatabaseService } from '../../domain/services/IDatabaseService';
import { 
  EstadoSituacionFinanciera, 
  FiltrosEstadoSituacionFinanciera, 
  EstadoSituacionFinancieraRequest,
  EstadoSituacionFinancieraResponse,
  TipoBalanceInfo,
  PeriodoContableInfo,
  TiposBalanceResponse,
  PeriodosContablesResponse,
  GenerarEstadoSituacionFinancieraParams,
  ExportarEstadoSituacionFinancieraExcelParams,
  ExportarEstadoSituacionFinancieraPDFParams
} from '../../domain/entities/EstadoSituacionFinanciera';
import { TYPES } from '../container/types';

@injectable()
export class EstadoSituacionFinancieraRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private databaseService: IDatabaseService
  ) {}

  /**
   * Obtiene los tipos de balance disponibles
   */
  async obtenerTiposBalance(conjunto: string, usuario: string = 'ADMPQUES'): Promise<TiposBalanceResponse> {
    try {
      const query = `
        SELECT 
          UPPER(T.TIPO) + ' ' + T.DESCRIPCION + ' ' + T.QRP as displayText,
          T.TIPO as tipo,
          T.DESCRIPCION as descripcion,
          T.QRP as qrp
        FROM ${conjunto}.TIPO_BALANCE T
        INNER JOIN ${conjunto}.USUARIO_BALANCE U ON T.TIPO = U.TIPO AND U.USUARIO = @usuario
        WHERE 1 = 1 
          AND (T.TIPO NOT LIKE '301%' OR T.TIPO = '301')
        ORDER BY 1
      `;

      const result = await this.databaseService.ejecutarQuery(query);
      
      return {
        success: true,
        data: result.map((row: any) => ({
          tipo: row.tipo,
          descripcion: row.descripcion,
          qrp: row.qrp,
          displayText: row.displayText
        })),
        message: 'Tipos de balance obtenidos correctamente'
      };
    } catch (error) {
      console.error('Error al obtener tipos de balance:', error);
      return {
        success: false,
        data: [],
        message: 'Error al obtener tipos de balance'
      };
    }
  }

  /**
   * Obtiene los períodos contables disponibles
   */
  async obtenerPeriodosContables(conjunto: string, fecha: string): Promise<PeriodosContablesResponse> {
    try {
      const query = `
        SELECT 
          descripcion,
          contabilidad,
          estado,
          fecha_final
        FROM ${conjunto}.periodo_contable
        WHERE fecha_final = @fecha
          AND contabilidad = 'F'
      `;

      const result = await this.databaseService.ejecutarQuery(query);
      
      return {
        success: true,
        data: result.map((row: any) => ({
          descripcion: row.descripcion,
          contabilidad: row.contabilidad,
          estado: row.estado,
          fecha_final: new Date(row.fecha_final)
        })),
        message: 'Períodos contables obtenidos correctamente'
      };
    } catch (error) {
      console.error('Error al obtener períodos contables:', error);
      return {
        success: false,
        data: [],
        message: 'Error al obtener períodos contables'
      };
    }
  }

  /**
   * Genera el reporte de Estado de Situación Financiera
   */
  async generarReporte(params: GenerarEstadoSituacionFinancieraParams): Promise<boolean> {
    try {
      const { conjunto, fecha, tipoBalance = 'BGFIS', contabilidad = 'F' } = params;
      
      // Limpiar tabla temporal
      await this.databaseService.ejecutarQuery(`DELETE FROM ${conjunto}.BG WHERE USUARIO = 'ADMPQUES'`);
      await this.databaseService.ejecutarQuery(`DELETE FROM ${conjunto}.R_XML_8DDC9166B472A25`);

      // Insertar datos del período actual
      await this.insertarDatosPeriodoActual(conjunto, fecha, tipoBalance, contabilidad);
      
      // Insertar datos del período anterior
      await this.insertarDatosPeriodoAnterior(conjunto, fecha, tipoBalance, contabilidad);
      
      // Generar vista final
      await this.generarVistaFinal(conjunto, tipoBalance);

      return true;
    } catch (error) {
      console.error('Error al generar reporte:', error);
      throw error;
    }
  }

  /**
   * Inserta datos del período actual
   */
  private async insertarDatosPeriodoActual(conjunto: string, fecha: string, tipoBalance: string, contabilidad: string): Promise<void> {
    // Insertar datos sin familia destino
    const querySinFamilia = `
      INSERT INTO ${conjunto}.BG (TIPO, FAMILIA, MONTO, MONTO_DOLAR, MONTO_ANT, MONTO_DOL_ANT, USUARIO)
      SELECT 
        B.TIPO,
        B.FAMILIA,
        SUM(V.DEBITO_LOCAL - V.CREDITO_LOCAL) SALDO_LOCAL,
        SUM(V.DEBITO_DOLAR - V.CREDITO_DOLAR) SALDO_DOLAR,
        0 SALDO_LOCAL_ANT,
        0 SALDO_DOLAR_ANT,
        'ADMPQUES'
      FROM (
        SELECT 
          m.centro_costo,
          m.cuenta_contable,
          CASE WHEN m.saldo_fisc_local > 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END debito_local,
          CASE WHEN m.saldo_fisc_local < 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END credito_local,
          CASE WHEN m.saldo_fisc_dolar > 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END debito_dolar,
          CASE WHEN m.saldo_fisc_dolar < 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END credito_dolar
        FROM ${conjunto}.saldo m
        INNER JOIN (
          SELECT m.centro_costo, m.cuenta_contable, MAX(m.fecha) fecha
          FROM ${conjunto}.saldo m
          WHERE m.fecha <= @fecha
          GROUP BY m.centro_costo, m.cuenta_contable
        ) smax ON (m.centro_costo = smax.centro_costo AND m.cuenta_contable = smax.cuenta_contable AND m.fecha = smax.fecha)
        WHERE 1 = 1
        
        UNION ALL
        
        SELECT 
          m.centro_costo,
          m.cuenta_contable,
          COALESCE(m.debito_local, 0) debito_local,
          COALESCE(m.credito_local, 0) credito_local,
          COALESCE(m.debito_dolar, 0) debito_dolar,
          COALESCE(m.credito_dolar, 0) credito_dolar
        FROM ${conjunto}.asiento_de_diario am
        INNER JOIN ${conjunto}.diario m ON (am.asiento = m.asiento)
        WHERE am.fecha <= @fecha 
          AND contabilidad IN ('F', 'A')
      ) V
      INNER JOIN ${conjunto}.BG_CUENTAS_DET B ON (B.CUENTA_CONTABLE = V.CUENTA_CONTABLE)
      WHERE B.TIPO = @tipoBalance AND B.FAMILIA_DESTINO IS NULL
      GROUP BY B.TIPO, B.FAMILIA
    `;

    await this.databaseService.ejecutarQuery(querySinFamilia);

    // Insertar datos con familia destino
    const queryConFamilia = `
      INSERT INTO ${conjunto}.BG (TIPO, FAMILIA, MONTO, MONTO_DOLAR, MONTO_ANT, MONTO_DOL_ANT, USUARIO)
      SELECT 
        TIPO,
        CASE 
          WHEN (SALDO_EXCEPCION = 'A' AND (SUM(SALDO_LOCAL + SALDO_LOCAL_ANT) OVER (PARTITION BY TIPO, SALDO_EXCEPCION, GRUPO_EXCEPCION)) >= 0) 
            OR (SALDO_EXCEPCION = 'D' AND (SUM(SALDO_LOCAL + SALDO_LOCAL_ANT) OVER (PARTITION BY TIPO, SALDO_EXCEPCION, GRUPO_EXCEPCION)) <= 0)
          THEN FAMILIA
          ELSE FAMILIA_DESTINO
        END FAMILIA,
        SALDO_LOCAL,
        SALDO_DOLAR,
        SALDO_LOCAL_ANT,
        SALDO_DOLAR_ANT,
        'ADMPQUES'
      FROM (
        SELECT 
          B.TIPO,
          B.FAMILIA,
          B.FAMILIA_DESTINO,
          COALESCE(GEB.SALDO_EXCEPCION, CASE B.SALDO_NORMAL WHEN 'D' THEN 'A' ELSE 'D' END) SALDO_EXCEPCION,
          B.GRUPO_EXCEPCION,
          SUM(V.DEBITO_LOCAL - V.CREDITO_LOCAL) SALDO_LOCAL,
          SUM(V.DEBITO_DOLAR - V.CREDITO_DOLAR) SALDO_DOLAR,
          0 SALDO_LOCAL_ANT,
          0 SALDO_DOLAR_ANT
        FROM (
          SELECT 
            m.centro_costo,
            m.cuenta_contable,
            CASE WHEN m.saldo_fisc_local > 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END debito_local,
            CASE WHEN m.saldo_fisc_local < 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END credito_local,
            CASE WHEN m.saldo_fisc_dolar > 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END debito_dolar,
            CASE WHEN m.saldo_fisc_dolar < 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END credito_dolar
          FROM ${conjunto}.saldo m
          INNER JOIN (
            SELECT m.centro_costo, m.cuenta_contable, MAX(m.fecha) fecha
            FROM ${conjunto}.saldo m
            WHERE m.fecha <= @fecha
            GROUP BY m.centro_costo, m.cuenta_contable
          ) smax ON (m.centro_costo = smax.centro_costo AND m.cuenta_contable = smax.cuenta_contable AND m.fecha = smax.fecha)
          WHERE 1 = 1
          
          UNION ALL
          
          SELECT 
            m.centro_costo,
            m.cuenta_contable,
            COALESCE(m.debito_local, 0) debito_local,
            COALESCE(m.credito_local, 0) credito_local,
            COALESCE(m.debito_dolar, 0) debito_dolar,
            COALESCE(m.credito_dolar, 0) credito_dolar
          FROM ${conjunto}.asiento_de_diario am
          INNER JOIN ${conjunto}.diario m ON (am.asiento = m.asiento)
          WHERE am.fecha <= @fecha 
            AND contabilidad IN ('F', 'A')
        ) V
        INNER JOIN ${conjunto}.BG_CUENTAS_DET B ON (B.CUENTA_CONTABLE = V.CUENTA_CONTABLE)
        LEFT OUTER JOIN ${conjunto}.GRUPO_EXCEPCION_BG GEB ON (GEB.GRUPO_EXCEPCION = B.GRUPO_EXCEPCION)
        WHERE B.TIPO = @tipoBalance AND B.FAMILIA_DESTINO IS NOT NULL
        GROUP BY B.TIPO, B.FAMILIA, B.FAMILIA_DESTINO, 
                 COALESCE(GEB.SALDO_EXCEPCION, CASE B.SALDO_NORMAL WHEN 'D' THEN 'A' ELSE 'D' END), B.GRUPO_EXCEPCION
      ) VISTA
    `;

    await this.databaseService.ejecutarQuery(queryConFamilia);
  }

  /**
   * Inserta datos del período anterior
   */
  private async insertarDatosPeriodoAnterior(conjunto: string, fecha: string, tipoBalance: string, contabilidad: string): Promise<void> {
    // Calcular fecha anterior (asumiendo año anterior)
    const fechaAnterior = new Date(fecha);
    fechaAnterior.setFullYear(fechaAnterior.getFullYear() - 1);
    const fechaAnteriorStr = fechaAnterior.toISOString().split('T')[0];

    // Insertar datos sin familia destino para período anterior
    const querySinFamiliaAnt = `
      INSERT INTO ${conjunto}.BG (TIPO, FAMILIA, MONTO, MONTO_DOLAR, MONTO_ANT, MONTO_DOL_ANT, USUARIO)
      SELECT 
        B.TIPO,
        B.FAMILIA,
        0 SALDO_LOCAL,
        0 SALDO_DOLAR,
        SUM(V.DEBITO_LOCAL - V.CREDITO_LOCAL) SALDO_LOCAL_ANT,
        SUM(V.DEBITO_DOLAR - V.CREDITO_DOLAR) SALDO_DOLAR_ANT,
        'ADMPQUES'
      FROM (
        SELECT 
          m.centro_costo,
          m.cuenta_contable,
          CASE WHEN m.saldo_fisc_local > 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END debito_local,
          CASE WHEN m.saldo_fisc_local < 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END credito_local,
          CASE WHEN m.saldo_fisc_dolar > 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END debito_dolar,
          CASE WHEN m.saldo_fisc_dolar < 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END credito_dolar
        FROM ${conjunto}.saldo m
        INNER JOIN (
          SELECT m.centro_costo, m.cuenta_contable, MAX(m.fecha) fecha
          FROM ${conjunto}.saldo m
          WHERE m.fecha <= @fechaAnterior
          GROUP BY m.centro_costo, m.cuenta_contable
        ) smax ON (m.centro_costo = smax.centro_costo AND m.cuenta_contable = smax.cuenta_contable AND m.fecha = smax.fecha)
        WHERE 1 = 1
        
        UNION ALL
        
        SELECT 
          m.centro_costo,
          m.cuenta_contable,
          COALESCE(m.debito_local, 0) debito_local,
          COALESCE(m.credito_local, 0) credito_local,
          COALESCE(m.debito_dolar, 0) debito_dolar,
          COALESCE(m.credito_dolar, 0) credito_dolar
        FROM ${conjunto}.asiento_de_diario am
        INNER JOIN ${conjunto}.diario m ON (am.asiento = m.asiento)
        WHERE am.fecha <= @fechaAnterior 
          AND contabilidad IN ('F', 'A')
      ) V
      INNER JOIN ${conjunto}.BG_CUENTAS_DET B ON (B.CUENTA_CONTABLE = V.CUENTA_CONTABLE)
      WHERE B.TIPO = @tipoBalance AND B.FAMILIA_DESTINO IS NULL
      GROUP BY B.TIPO, B.FAMILIA
    `;

    await this.databaseService.ejecutarQuery(querySinFamiliaAnt);

    // Insertar datos con familia destino para período anterior
    const queryConFamiliaAnt = `
      INSERT INTO ${conjunto}.BG (TIPO, FAMILIA, MONTO, MONTO_DOLAR, MONTO_ANT, MONTO_DOL_ANT, USUARIO)
      SELECT 
        TIPO,
        CASE 
          WHEN (SALDO_EXCEPCION = 'A' AND (SUM(SALDO_LOCAL + SALDO_LOCAL_ANT) OVER (PARTITION BY TIPO, SALDO_EXCEPCION, GRUPO_EXCEPCION)) >= 0) 
            OR (SALDO_EXCEPCION = 'D' AND (SUM(SALDO_LOCAL + SALDO_LOCAL_ANT) OVER (PARTITION BY TIPO, SALDO_EXCEPCION, GRUPO_EXCEPCION)) <= 0)
          THEN FAMILIA
          ELSE FAMILIA_DESTINO
        END FAMILIA,
        SALDO_LOCAL,
        SALDO_DOLAR,
        SALDO_LOCAL_ANT,
        SALDO_DOLAR_ANT,
        'ADMPQUES'
      FROM (
        SELECT 
          B.TIPO,
          B.FAMILIA,
          B.FAMILIA_DESTINO,
          COALESCE(GEB.SALDO_EXCEPCION, CASE B.SALDO_NORMAL WHEN 'D' THEN 'A' ELSE 'D' END) SALDO_EXCEPCION,
          B.GRUPO_EXCEPCION,
          0 SALDO_LOCAL,
          0 SALDO_DOLAR,
          SUM(V.DEBITO_LOCAL - V.CREDITO_LOCAL) SALDO_LOCAL_ANT,
          SUM(V.DEBITO_DOLAR - V.CREDITO_DOLAR) SALDO_DOLAR_ANT
        FROM (
          SELECT 
            m.centro_costo,
            m.cuenta_contable,
            CASE WHEN m.saldo_fisc_local > 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END debito_local,
            CASE WHEN m.saldo_fisc_local < 0 THEN ABS(m.saldo_fisc_local) ELSE 0 END credito_local,
            CASE WHEN m.saldo_fisc_dolar > 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END debito_dolar,
            CASE WHEN m.saldo_fisc_dolar < 0 THEN ABS(m.saldo_fisc_dolar) ELSE 0 END credito_dolar
          FROM ${conjunto}.saldo m
          INNER JOIN (
            SELECT m.centro_costo, m.cuenta_contable, MAX(m.fecha) fecha
            FROM ${conjunto}.saldo m
            WHERE m.fecha <= @fechaAnterior
            GROUP BY m.centro_costo, m.cuenta_contable
          ) smax ON (m.centro_costo = smax.centro_costo AND m.cuenta_contable = smax.cuenta_contable AND m.fecha = smax.fecha)
          WHERE 1 = 1
          
          UNION ALL
          
          SELECT 
            m.centro_costo,
            m.cuenta_contable,
            COALESCE(m.debito_local, 0) debito_local,
            COALESCE(m.credito_local, 0) credito_local,
            COALESCE(m.debito_dolar, 0) debito_dolar,
            COALESCE(m.credito_dolar, 0) credito_dolar
          FROM ${conjunto}.asiento_de_diario am
          INNER JOIN ${conjunto}.diario m ON (am.asiento = m.asiento)
          WHERE am.fecha <= @fechaAnterior 
            AND contabilidad IN ('F', 'A')
        ) V
        INNER JOIN ${conjunto}.BG_CUENTAS_DET B ON (B.CUENTA_CONTABLE = V.CUENTA_CONTABLE)
        LEFT OUTER JOIN ${conjunto}.GRUPO_EXCEPCION_BG GEB ON (GEB.GRUPO_EXCEPCION = B.GRUPO_EXCEPCION)
        WHERE B.TIPO = @tipoBalance AND B.FAMILIA_DESTINO IS NOT NULL
        GROUP BY B.TIPO, B.FAMILIA, B.FAMILIA_DESTINO, 
                 COALESCE(GEB.SALDO_EXCEPCION, CASE B.SALDO_NORMAL WHEN 'D' THEN 'A' ELSE 'D' END), B.GRUPO_EXCEPCION
      ) VISTA
    `;

    await this.databaseService.ejecutarQuery(queryConFamiliaAnt);
  }

  /**
   * Genera la vista final del reporte
   */
  private async generarVistaFinal(conjunto: string, tipoBalance: string): Promise<void> {
    const query = `
      INSERT INTO ${conjunto}.R_XML_8DDC9166B472A25 (
        PADRE, CUENTA_CONTABLE, SALDO, SALDO_DOLAR, POSICION, AGRUPA, ORDEN, NATURALEZA,
        SALDO_ANT, SALDO_DOL_ANT, FAMILIA
      )
      SELECT 
        PA.NOMBRE FAMILIA_PADRE,
        P.NOMBRE,
        SUM(ISNULL(CASE P.NATURALEZA WHEN 'P' THEN -1 ELSE 1 END * B.MONTO, 0)),
        SUM(ISNULL(CASE P.NATURALEZA WHEN 'P' THEN -1 ELSE 1 END * B.MONTO_DOLAR, 0)),
        P.POSICION,
        P.AGRUPA,
        P.ORDEN,
        P.NATURALEZA,
        SUM(ISNULL(CASE P.NATURALEZA WHEN 'P' THEN -1 ELSE 1 END * B.MONTO_ANT, 0)),
        SUM(ISNULL(CASE P.NATURALEZA WHEN 'P' THEN -1 ELSE 1 END * B.MONTO_DOL_ANT, 0)),
        P.FAMILIA
      FROM ${conjunto}.POSICION_BG P
      INNER JOIN ${conjunto}.POSICION_BG PA ON P.FAMILIA_PADRE = PA.FAMILIA AND P.TIPO = PA.TIPO
      LEFT OUTER JOIN ${conjunto}.BG B ON P.TIPO = B.TIPO AND P.FAMILIA = B.FAMILIA 
        AND B.USUARIO = 'ADMPQUES' AND B.TIPO = @tipoBalance
      WHERE P.AGRUPA = 'N' AND P.TIPO = @tipoBalance
      GROUP BY P.NOMBRE, P.POSICION, P.ORDEN, P.NATURALEZA, P.AGRUPA, PA.NOMBRE, P.FAMILIA
      
      UNION ALL
      
      SELECT 
        NULL FAMILIA_PADRE,
        P.NOMBRE,
        SUM(ISNULL(CASE P.NATURALEZA WHEN 'P' THEN -1 ELSE 1 END * B.MONTO, 0)),
        SUM(ISNULL(CASE P.NATURALEZA WHEN 'P' THEN -1 ELSE 1 END * B.MONTO_DOLAR, 0)),
        P.POSICION,
        P.AGRUPA,
        P.ORDEN,
        P.NATURALEZA,
        SUM(ISNULL(CASE P.NATURALEZA WHEN 'P' THEN -1 ELSE 1 END * B.MONTO_ANT, 0)),
        SUM(ISNULL(CASE P.NATURALEZA WHEN 'P' THEN -1 ELSE 1 END * B.MONTO_DOL_ANT, 0)),
        P.FAMILIA
      FROM ${conjunto}.POSICION_BG P
      LEFT OUTER JOIN ${conjunto}.BG B ON P.TIPO = B.TIPO AND P.FAMILIA = B.FAMILIA 
        AND B.USUARIO = 'ADMPQUES' AND B.TIPO = @tipoBalance
      WHERE P.FAMILIA_PADRE IS NULL AND P.AGRUPA = 'N' AND P.TIPO = @tipoBalance
      GROUP BY P.NOMBRE, P.POSICION, P.AGRUPA, P.ORDEN, P.NATURALEZA, P.FAMILIA
    `;

    await this.databaseService.ejecutarQuery(query);
  }

  /**
   * Obtiene los datos del Estado de Situación Financiera
   */
  async obtenerEstadoSituacionFinanciera(
    request: EstadoSituacionFinancieraRequest
  ): Promise<EstadoSituacionFinancieraResponse> {
    try {
      const { conjunto, page = 1, limit = 25 } = request;
      const offset = (page - 1) * limit;

      const query = `
        SELECT 
          ISNULL(cuenta_contable, '') as cuenta_contable,
          ISNULL(tipo_reporte, '') as tipo_reporte,
          ISNULL(naturaleza, '') as naturaleza,
          fecha_comp,
          ISNULL(nUtilidad, 0) as nUtilidad,
          ISNULL(saldo_ant, 0) as saldo_ant,
          ISNULL(posicion, '') as posicion,
          ISNULL(familia, '') as familia,
          ISNULL(moneda, '') as moneda,
          ISNULL(nombre, '') as nombre,
          ISNULL(agrupa, '') as agrupa,
          ISNULL(padre, '') as padre,
          ISNULL(saldo, 0) as saldo,
          fecha,
          ISNULL(total, 0) as total
        FROM ${conjunto}.R_XML_8DDC9166B472A25
        ORDER BY ROW_ORDER_BY
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM ${conjunto}.R_XML_8DDC9166B472A25
      `;

      const [data, countResult] = await Promise.all([
        this.databaseService.ejecutarQuery(query),
        this.databaseService.ejecutarQuery(countQuery)
      ]);

      const total = countResult[0]?.total || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: data.map((row: any) => ({
          activo: row.nombre || '',
          activo_saldo_ant: row.saldo_ant || 0,
          activo_saldo: row.saldo || 0,
          pasivo_patrimonio: row.nombre || '',
          pasivo_saldo_ant: row.saldo_ant || 0,
          pasivo_saldo: row.saldo || 0,
          cuenta_contable: row.cuenta_contable,
          tipo_reporte: row.tipo_reporte,
          naturaleza: row.naturaleza,
          fecha_comp: row.fecha_comp ? new Date(row.fecha_comp) : new Date(),
          nUtilidad: row.nUtilidad,
          saldo_ant: row.saldo_ant,
          posicion: row.posicion,
          familia: row.familia,
          moneda: row.moneda,
          nombre: row.nombre,
          agrupa: row.agrupa,
          padre: row.padre,
          saldo: row.saldo,
          fecha: row.fecha ? new Date(row.fecha) : new Date(),
          total: row.total
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        message: 'Datos obtenidos correctamente'
      };
    } catch (error) {
      console.error('Error al obtener datos:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 25,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: 'Error al obtener datos'
      };
    }
  }

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(params: ExportarEstadoSituacionFinancieraExcelParams): Promise<Buffer> {
    try {
      const { conjunto } = params;
      
      // Primero generar el reporte
      await this.generarReporte(params);
      
      // Obtener todos los datos
      const query = `
        SELECT 
          ISNULL(cuenta_contable, '') as cuenta_contable,
          ISNULL(tipo_reporte, '') as tipo_reporte,
          ISNULL(naturaleza, '') as naturaleza,
          fecha_comp,
          ISNULL(nUtilidad, 0) as nUtilidad,
          ISNULL(saldo_ant, 0) as saldo_ant,
          ISNULL(posicion, '') as posicion,
          ISNULL(familia, '') as familia,
          ISNULL(moneda, '') as moneda,
          ISNULL(nombre, '') as nombre,
          ISNULL(agrupa, '') as agrupa,
          ISNULL(padre, '') as padre,
          ISNULL(saldo, 0) as saldo,
          fecha,
          ISNULL(total, 0) as total
        FROM ${conjunto}.R_XML_8DDC9166B472A25
        ORDER BY ROW_ORDER_BY
      `;

      const data = await this.databaseService.ejecutarQuery(query);
      
      // Aquí se implementaría la lógica para generar el archivo Excel
      // Por ahora retornamos un buffer vacío
      return Buffer.from('Excel export placeholder');
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      throw error;
    }
  }

  /**
   * Exporta el reporte a PDF
   */
  async exportarPDF(params: ExportarEstadoSituacionFinancieraPDFParams): Promise<Buffer> {
    try {
      const { conjunto } = params;
      
      // Primero generar el reporte
      await this.generarReporte(params);
      
      // Obtener todos los datos
      const query = `
        SELECT 
          ISNULL(cuenta_contable, '') as cuenta_contable,
          ISNULL(tipo_reporte, '') as tipo_reporte,
          ISNULL(naturaleza, '') as naturaleza,
          fecha_comp,
          ISNULL(nUtilidad, 0) as nUtilidad,
          ISNULL(saldo_ant, 0) as saldo_ant,
          ISNULL(posicion, '') as posicion,
          ISNULL(familia, '') as familia,
          ISNULL(moneda, '') as moneda,
          ISNULL(nombre, '') as nombre,
          ISNULL(agrupa, '') as agrupa,
          ISNULL(padre, '') as padre,
          ISNULL(saldo, 0) as saldo,
          fecha,
          ISNULL(total, 0) as total
        FROM ${conjunto}.R_XML_8DDC9166B472A25
        ORDER BY ROW_ORDER_BY
      `;

      const data = await this.databaseService.ejecutarQuery(query);
      
      // Aquí se implementaría la lógica para generar el archivo PDF
      // Por ahora retornamos un buffer vacío
      return Buffer.from('PDF export placeholder');
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      throw error;
    }
  }
}
