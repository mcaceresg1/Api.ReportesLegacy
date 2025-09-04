import { injectable, inject } from "inversify";
import { IDatabaseService } from "../../domain/services/IDatabaseService";
import {
  LibroMayor,
  LibroMayorFiltros,
  LibroMayorResponse,
  GenerarLibroMayorParams,
  ExportarLibroMayorExcelParams,
  CuentaContableInfo,
  PeriodoContableInfo,
} from "../../domain/entities/LibroMayor";

@injectable()
export class LibroMayorRepository {
  constructor(
    @inject("IDatabaseService")
    private databaseService: IDatabaseService
  ) {}

  /**
   * Obtiene las cuentas contables para un conjunto específico
   */
  async obtenerCuentasContables(conjunto: string): Promise<CuentaContableInfo[]> {
    const query = `
      SELECT 
        cuenta_contable, 
        descripcion,
        descripcion_ifrs, 
        tipo, 
        tipo_detallado, 
        conversion,     
        saldo_normal, 
        tipo_cambio, 
        acepta_datos, 
        tipo_oaf,        
        consolida, 
        usa_centro_costo, 
        usuario,
        fecha_hora,        
        usuario_ult_mod, 
        fch_hora_ult_mod, 
        notas, 
        acepta_unidades,      
        unidad, 
        uso_restringido, 
        seccion_cuenta, 
        origen_conversion,     
        valida_presup_cr, 
        cuenta_ifrs, 
        usa_conta_electro, 
        version, 
        fecha_ini_ce,  
        fecha_fin_ce, 
        cod_agrupador, 
        desc_cod_agrup, 
        sub_cta_de, 
        desc_sub_cta, 
        nivel, 
        maneja_tercero, 
        RowPointer 
      FROM ${conjunto}.cuenta_contable (NOLOCK)
      ORDER BY cuenta_contable
    `;

    const result = await this.databaseService.ejecutarQuery(query);
    return result.map((row: any) => ({
      cuenta_contable: row.cuenta_contable,
      descripcion: row.descripcion,
      descripcion_ifrs: row.descripcion_ifrs,
      tipo: row.tipo,
      tipo_detallado: row.tipo_detallado,
      conversion: row.conversion,
      saldo_normal: row.saldo_normal,
      tipo_cambio: row.tipo_cambio,
      acepta_datos: row.acepta_datos,
      tipo_oaf: row.tipo_oaf,
      consolida: row.consolida,
      usa_centro_costo: row.usa_centro_costo,
      usuario: row.usuario,
      fecha_hora: new Date(row.fecha_hora),
      usuario_ult_mod: row.usuario_ult_mod,
      fch_hora_ult_mod: new Date(row.fch_hora_ult_mod),
      notas: row.notas,
      acepta_unidades: row.acepta_unidades,
      unidad: row.unidad,
      uso_restringido: row.uso_restringido,
      seccion_cuenta: row.seccion_cuenta,
      origen_conversion: row.origen_conversion,
      valida_presup_cr: row.valida_presup_cr,
      cuenta_ifrs: row.cuenta_ifrs,
      usa_conta_electro: row.usa_conta_electro,
      version: row.version,
      fecha_ini_ce: new Date(row.fecha_ini_ce),
      fecha_fin_ce: new Date(row.fecha_fin_ce),
      cod_agrupador: row.cod_agrupador,
      desc_cod_agrup: row.desc_cod_agrup,
      sub_cta_de: row.sub_cta_de,
      desc_sub_cta: row.desc_sub_cta,
      nivel: row.nivel,
      maneja_tercero: row.maneja_tercero,
      RowPointer: row.RowPointer,
    }));
  }

  /**
   * Obtiene los períodos contables para un conjunto específico
   */
  async obtenerPeriodosContables(conjunto: string): Promise<PeriodoContableInfo[]> {
    const query = `
      SELECT DISTINCT 
        P.fecha_final,
        P.descripcion
      FROM ${conjunto}.periodo_contable P (NOLOCK)
      ORDER BY P.fecha_final ASC
    `;

    const result = await this.databaseService.ejecutarQuery(query);
    return result.map((row: any) => ({
      fecha_final: new Date(row.fecha_final),
      descripcion: row.descripcion,
    }));
  }

  /**
   * Genera el reporte de Libro Mayor con los queries complejos
   */
  async generarReporte(
    conjunto: string,
    filtros: GenerarLibroMayorParams
  ): Promise<LibroMayor[]> {
    // Query principal que combina MAYOR y SALDO
    const query = `
      -- Query para obtener datos del MAYOR (período anterior)
      SELECT 
        CENTRO_COSTO, 
        CUENTA_CONTABLE,  
        0 as saldo_fisc_local,
        0 as saldo_fisc_dolar,
        0 as saldo_corp_local,
        0 as saldo_corp_dolar,
        0 as saldo_fisc_und,
        0 as saldo_corp_und,
        SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_LOCAL WHEN 'F' THEN DEBITO_LOCAL ELSE 0 END, 0) ) as debito_fisc_local, 
        SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_LOCAL WHEN 'F' THEN CREDITO_LOCAL ELSE 0 END, 0) ) as credito_fisc_local,  
        SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_DOLAR WHEN 'F' THEN DEBITO_DOLAR ELSE 0 END, 0) ) as debito_fisc_dolar, 
        SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_DOLAR WHEN 'F' THEN CREDITO_DOLAR ELSE 0 END, 0) ) as credito_fisc_dolar,  
        SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_LOCAL WHEN  'C' THEN DEBITO_LOCAL ELSE 0 END, 0) ) as debito_corp_local,
        SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_LOCAL WHEN  'C' THEN CREDITO_LOCAL ELSE 0 END, 0) ) as credito_corp_local,  
        SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_DOLAR WHEN  'C' THEN DEBITO_DOLAR ELSE 0 END, 0) ) as debito_corp_dolar,
        SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_DOLAR WHEN  'C' THEN CREDITO_DOLAR ELSE 0 END, 0) ) as credito_corp_dolar, 
        SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_UNIDADES WHEN 'F' THEN DEBITO_UNIDADES ELSE 0 END, 0) ) as debito_fisc_und,
        SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_UNIDADES WHEN 'F' THEN CREDITO_UNIDADES ELSE 0 END, 0) ) as credito_fisc_und,  
        SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_UNIDADES WHEN  'C' THEN DEBITO_UNIDADES ELSE 0 END, 0) ) as debito_corp_und, 
        SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_UNIDADES WHEN  'C' THEN CREDITO_UNIDADES ELSE 0 END, 0) ) as credito_corp_und
      FROM ${conjunto}.MAYOR (NOLOCK)
      WHERE cuenta_contable >= ? 
        AND cuenta_contable <= ? 
        AND (FECHA >= ? AND FECHA < ?)
        ${filtros.centroCosto ? 'AND CENTRO_COSTO = ?' : ''}
      GROUP BY CENTRO_COSTO, CUENTA_CONTABLE

      UNION ALL

      -- Query para obtener saldos iniciales del período
      SELECT  
        CENTRO_COSTO, 
        CUENTA_CONTABLE,  
        SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_fisc_local,  
        SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_fisc_dolar,  
        SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_corp_local,  
        SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_corp_dolar,  
        SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_fisc_und,  
        SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_corp_und,  
        SUM(DEBITO_FISC_LOCAL) as debito_fisc_local, 
        SUM(CREDITO_FISC_LOCAL) as credito_fisc_local,
        SUM(DEBITO_FISC_DOLAR) as debito_fisc_dolar, 
        SUM(CREDITO_FISC_DOLAR) as credito_fisc_dolar, 
        SUM(DEBITO_CORP_LOCAL) as debito_corp_local, 
        SUM(CREDITO_CORP_LOCAL) as credito_corp_local,  
        SUM(DEBITO_CORP_DOLAR) as debito_corp_dolar,  
        SUM(CREDITO_CORP_DOLAR) as credito_corp_dolar,  
        SUM(DEBITO_FISC_UND) as debito_fisc_und,	
        SUM(CREDITO_FISC_UND) as credito_fisc_und,  
        SUM(DEBITO_CORP_UND) as debito_corp_und, 
        SUM(CREDITO_CORP_UND) as credito_corp_und
      FROM ${conjunto}.SALDO (NOLOCK)
      WHERE cuenta_contable >= ?
        AND cuenta_contable <= ?
        AND FECHA >= ?
        AND FECHA < ?
        ${filtros.centroCosto ? 'AND CENTRO_COSTO = ?' : ''}
      GROUP BY CENTRO_COSTO, CUENTA_CONTABLE

      UNION ALL 

      -- Query para obtener saldos finales del período
      SELECT  
        CENTRO_COSTO, 
        CUENTA_CONTABLE,  
        SUM(s.saldo_fisc_local) as saldo_fisc_local, 
        SUM(s.saldo_fisc_dolar) as saldo_fisc_dolar, 
        SUM(s.saldo_corp_local) as saldo_corp_local, 
        SUM(s.saldo_corp_dolar) as saldo_corp_dolar,  
        SUM(s.saldo_fisc_und) as saldo_fisc_und, 
        SUM(s.saldo_corp_und) as saldo_corp_und,  
        0 as debito_fisc_local, 
        0 as credito_fisc_local, 
        0 as debito_fisc_dolar, 
        0 as credito_fisc_dolar, 
        0 as debito_corp_local, 
        0 as credito_corp_local,  
        0 as debito_corp_dolar,  
        0 as credito_corp_dolar,  
        0 as debito_fisc_und, 
        0 as credito_fisc_und,  
        0 as debito_corp_und, 
        0 as credito_corp_und
      FROM ${conjunto}.SALDO S (NOLOCK)
      WHERE cuenta_contable >= ? 
        AND cuenta_contable <= ? 
        AND S.FECHA = (
          SELECT MAX(FECHA) 
          FROM ${conjunto}.SALDO S1 (NOLOCK)
          WHERE s1.centro_costo = s.centro_costo 
            AND s1.cuenta_contable = s.cuenta_contable 
            AND s1.fecha <= ?
        )
        ${filtros.centroCosto ? 'AND CENTRO_COSTO = ?' : ''}
      GROUP BY CENTRO_COSTO, CUENTA_CONTABLE
      ORDER BY 1, 2
    `;

    // Preparar parámetros
    const params: any[] = [
      filtros.cuentaContableDesde || '01.1.1.1.004',
      filtros.cuentaContableHasta || '02.Z.Z.Z.ZZZ',
      '1980-01-01', // Fecha inicio para MAYOR
      filtros.fechaDesde,
      filtros.cuentaContableDesde || '01.1.1.1.004',
      filtros.cuentaContableHasta || '02.Z.Z.Z.ZZZ',
      filtros.fechaDesde,
      filtros.fechaHasta,
      filtros.cuentaContableDesde || '01.1.1.1.004',
      filtros.cuentaContableHasta || '02.Z.Z.Z.ZZZ',
      filtros.fechaHasta,
    ];

    // Agregar centro de costo si se especifica
    if (filtros.centroCosto) {
      params.splice(4, 0, filtros.centroCosto); // Para MAYOR
      params.splice(9, 0, filtros.centroCosto); // Para SALDO inicial
      params.splice(14, 0, filtros.centroCosto); // Para SALDO final
    }

    const result = await this.databaseService.ejecutarQuery(query, params);
    return result.map((row: any) => ({
      centro_costo: row.CENTRO_COSTO,
      cuenta_contable: row.CUENTA_CONTABLE,
      descripcion_cuenta: '', // Se llenará con join a cuenta_contable si es necesario
      saldo_fisc_local: parseFloat(row.saldo_fisc_local) || 0,
      saldo_fisc_dolar: parseFloat(row.saldo_fisc_dolar) || 0,
      saldo_corp_local: parseFloat(row.saldo_corp_local) || 0,
      saldo_corp_dolar: parseFloat(row.saldo_corp_dolar) || 0,
      saldo_fisc_und: parseFloat(row.saldo_fisc_und) || 0,
      saldo_corp_und: parseFloat(row.saldo_corp_und) || 0,
      debito_fisc_local: parseFloat(row.debito_fisc_local) || 0,
      credito_fisc_local: parseFloat(row.credito_fisc_local) || 0,
      debito_fisc_dolar: parseFloat(row.debito_fisc_dolar) || 0,
      credito_fisc_dolar: parseFloat(row.credito_fisc_dolar) || 0,
      debito_corp_local: parseFloat(row.debito_corp_local) || 0,
      credito_corp_local: parseFloat(row.credito_corp_local) || 0,
      debito_corp_dolar: parseFloat(row.debito_corp_dolar) || 0,
      credito_corp_dolar: parseFloat(row.credito_corp_dolar) || 0,
      debito_fisc_und: parseFloat(row.debito_fisc_und) || 0,
      credito_fisc_und: parseFloat(row.credito_fisc_und) || 0,
      debito_corp_und: parseFloat(row.debito_corp_und) || 0,
      credito_corp_und: parseFloat(row.credito_corp_und) || 0,
    }));
  }

  /**
   * Obtiene los datos paginados del reporte
   */
  async obtenerLibroMayor(
    conjunto: string,
    filtros: LibroMayorFiltros
  ): Promise<LibroMayorResponse> {
    // Primero obtener el total de registros
    const countQuery = `
      SELECT COUNT(*) as total
      FROM (
        SELECT CENTRO_COSTO, CUENTA_CONTABLE
        FROM ${conjunto}.MAYOR (NOLOCK)
        WHERE cuenta_contable >= ? 
          AND cuenta_contable <= ? 
          AND (FECHA >= ? AND FECHA < ?)
          ${filtros.centroCosto ? 'AND CENTRO_COSTO = ?' : ''}
        GROUP BY CENTRO_COSTO, CUENTA_CONTABLE
        
        UNION ALL
        
        SELECT CENTRO_COSTO, CUENTA_CONTABLE
        FROM ${conjunto}.SALDO (NOLOCK)
        WHERE cuenta_contable >= ?
          AND cuenta_contable <= ?
          AND FECHA >= ?
          AND FECHA < ?
          ${filtros.centroCosto ? 'AND CENTRO_COSTO = ?' : ''}
        GROUP BY CENTRO_COSTO, CUENTA_CONTABLE
        
        UNION ALL
        
        SELECT CENTRO_COSTO, CUENTA_CONTABLE
        FROM ${conjunto}.SALDO S (NOLOCK)
        WHERE cuenta_contable >= ? 
          AND cuenta_contable <= ? 
          AND S.FECHA = (
            SELECT MAX(FECHA) 
            FROM ${conjunto}.SALDO S1 (NOLOCK)
            WHERE s1.centro_costo = s.centro_costo 
              AND s1.cuenta_contable = s.cuenta_contable 
              AND s1.fecha <= ?
          )
          ${filtros.centroCosto ? 'AND CENTRO_COSTO = ?' : ''}
        GROUP BY CENTRO_COSTO, CUENTA_CONTABLE
      ) as total_query
    `;

    const countParams: any[] = [
      filtros.cuentaContableDesde || '01.1.1.1.004',
      filtros.cuentaContableHasta || '02.Z.Z.Z.ZZZ',
      '1980-01-01',
      filtros.fechaDesde,
      filtros.cuentaContableDesde || '01.1.1.1.004',
      filtros.cuentaContableHasta || '02.Z.Z.Z.ZZZ',
      filtros.fechaDesde,
      filtros.fechaHasta,
      filtros.cuentaContableDesde || '01.1.1.1.004',
      filtros.cuentaContableHasta || '02.Z.Z.Z.ZZZ',
      filtros.fechaHasta,
    ];

    if (filtros.centroCosto) {
      countParams.splice(4, 0, filtros.centroCosto);
      countParams.splice(9, 0, filtros.centroCosto);
      countParams.splice(14, 0, filtros.centroCosto);
    }

    const countResult = await this.databaseService.ejecutarQuery(countQuery, countParams);
    const total = countResult[0].total;

    // Aplicar paginación
    const page = filtros.page || 1;
    const limit = filtros.limit || 25;
    const offset = (page - 1) * limit;

    // Query principal con paginación
    const dataQuery = `
      SELECT * FROM (
        -- Query para obtener datos del MAYOR (período anterior)
        SELECT 
          CENTRO_COSTO, 
          CUENTA_CONTABLE,  
          0 as saldo_fisc_local,
          0 as saldo_fisc_dolar,
          0 as saldo_corp_local,
          0 as saldo_corp_dolar,
          0 as saldo_fisc_und,
          0 as saldo_corp_und,
          SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_LOCAL WHEN 'F' THEN DEBITO_LOCAL ELSE 0 END, 0) ) as debito_fisc_local, 
          SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_LOCAL WHEN 'F' THEN CREDITO_LOCAL ELSE 0 END, 0) ) as credito_fisc_local,  
          SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_DOLAR WHEN 'F' THEN DEBITO_DOLAR ELSE 0 END, 0) ) as debito_fisc_dolar, 
          SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_DOLAR WHEN 'F' THEN CREDITO_DOLAR ELSE 0 END, 0) ) as credito_fisc_dolar,  
          SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_LOCAL WHEN  'C' THEN DEBITO_LOCAL ELSE 0 END, 0) ) as debito_corp_local,
          SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_LOCAL WHEN  'C' THEN CREDITO_LOCAL ELSE 0 END, 0) ) as credito_corp_local,  
          SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_DOLAR WHEN  'C' THEN DEBITO_DOLAR ELSE 0 END, 0) ) as debito_corp_dolar,
          SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_DOLAR WHEN  'C' THEN CREDITO_DOLAR ELSE 0 END, 0) ) as credito_corp_dolar, 
          SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_UNIDADES WHEN 'F' THEN DEBITO_UNIDADES ELSE 0 END, 0) ) as debito_fisc_und,
          SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_UNIDADES WHEN 'F' THEN CREDITO_UNIDADES ELSE 0 END, 0) ) as credito_fisc_und,  
          SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_UNIDADES WHEN  'C' THEN DEBITO_UNIDADES ELSE 0 END, 0) ) as debito_corp_und, 
          SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_UNIDADES WHEN  'C' THEN CREDITO_UNIDADES ELSE 0 END, 0) ) as credito_corp_und
        FROM ${conjunto}.MAYOR (NOLOCK)
        WHERE cuenta_contable >= ? 
          AND cuenta_contable <= ? 
          AND (FECHA >= ? AND FECHA < ?)
          ${filtros.centroCosto ? 'AND CENTRO_COSTO = ?' : ''}
        GROUP BY CENTRO_COSTO, CUENTA_CONTABLE

        UNION ALL

        -- Query para obtener saldos iniciales del período
        SELECT  
          CENTRO_COSTO, 
          CUENTA_CONTABLE,  
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_fisc_local,  
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_fisc_dolar,  
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_corp_local,  
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_corp_dolar,  
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_fisc_und,  
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_corp_und,  
          SUM(DEBITO_FISC_LOCAL) as debito_fisc_local, 
          SUM(CREDITO_FISC_LOCAL) as credito_fisc_local,
          SUM(DEBITO_FISC_DOLAR) as debito_fisc_dolar, 
          SUM(CREDITO_FISC_DOLAR) as credito_fisc_dolar, 
          SUM(DEBITO_CORP_LOCAL) as debito_corp_local, 
          SUM(CREDITO_CORP_LOCAL) as credito_corp_local,  
          SUM(DEBITO_CORP_DOLAR) as debito_corp_dolar,  
          SUM(CREDITO_CORP_DOLAR) as credito_corp_dolar,  
          SUM(DEBITO_FISC_UND) as debito_fisc_und,	
          SUM(CREDITO_FISC_UND) as credito_fisc_und,  
          SUM(DEBITO_CORP_UND) as debito_corp_und, 
          SUM(CREDITO_CORP_UND) as credito_corp_und
        FROM ${conjunto}.SALDO (NOLOCK)
        WHERE cuenta_contable >= ?
          AND cuenta_contable <= ?
          AND FECHA >= ?
          AND FECHA < ?
          ${filtros.centroCosto ? 'AND CENTRO_COSTO = ?' : ''}
        GROUP BY CENTRO_COSTO, CUENTA_CONTABLE

        UNION ALL 

        -- Query para obtener saldos finales del período
        SELECT  
          CENTRO_COSTO, 
          CUENTA_CONTABLE,  
          SUM(s.saldo_fisc_local) as saldo_fisc_local, 
          SUM(s.saldo_fisc_dolar) as saldo_fisc_dolar, 
          SUM(s.saldo_corp_local) as saldo_corp_local, 
          SUM(s.saldo_corp_dolar) as saldo_corp_dolar,  
          SUM(s.saldo_fisc_und) as saldo_fisc_und, 
          SUM(s.saldo_corp_und) as saldo_corp_und,  
          0 as debito_fisc_local, 
          0 as credito_fisc_local, 
          0 as debito_fisc_dolar, 
          0 as credito_fisc_dolar, 
          0 as debito_corp_local, 
          0 as credito_corp_local,  
          0 as debito_corp_dolar,  
          0 as credito_corp_dolar,  
          0 as debito_fisc_und, 
          0 as credito_fisc_und,  
          0 as debito_corp_und, 
          0 as credito_corp_und
        FROM ${conjunto}.SALDO S (NOLOCK)
        WHERE cuenta_contable >= ? 
          AND cuenta_contable <= ? 
          AND S.FECHA = (
            SELECT MAX(FECHA) 
            FROM ${conjunto}.SALDO S1 (NOLOCK)
            WHERE s1.centro_costo = s.centro_costo 
              AND s1.cuenta_contable = s.cuenta_contable 
              AND s1.fecha <= ?
          )
          ${filtros.centroCosto ? 'AND CENTRO_COSTO = ?' : ''}
        GROUP BY CENTRO_COSTO, CUENTA_CONTABLE
      ) as libro_mayor
      ORDER BY CENTRO_COSTO, CUENTA_CONTABLE
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    const dataParams: any[] = [
      filtros.cuentaContableDesde || '01.1.1.1.004',
      filtros.cuentaContableHasta || '02.Z.Z.Z.ZZZ',
      '1980-01-01',
      filtros.fechaDesde,
      filtros.cuentaContableDesde || '01.1.1.1.004',
      filtros.cuentaContableHasta || '02.Z.Z.Z.ZZZ',
      filtros.fechaDesde,
      filtros.fechaHasta,
      filtros.cuentaContableDesde || '01.1.1.1.004',
      filtros.cuentaContableHasta || '02.Z.Z.Z.ZZZ',
      filtros.fechaHasta,
    ];

    if (filtros.centroCosto) {
      dataParams.splice(4, 0, filtros.centroCosto);
      dataParams.splice(9, 0, filtros.centroCosto);
      dataParams.splice(14, 0, filtros.centroCosto);
    }

    const data = await this.databaseService.ejecutarQuery(dataQuery, dataParams);
    const libroMayor = data.map((row: any) => ({
      centro_costo: row.CENTRO_COSTO,
      cuenta_contable: row.CUENTA_CONTABLE,
      descripcion_cuenta: '',
      saldo_fisc_local: parseFloat(row.saldo_fisc_local) || 0,
      saldo_fisc_dolar: parseFloat(row.saldo_fisc_dolar) || 0,
      saldo_corp_local: parseFloat(row.saldo_corp_local) || 0,
      saldo_corp_dolar: parseFloat(row.saldo_corp_dolar) || 0,
      saldo_fisc_und: parseFloat(row.saldo_fisc_und) || 0,
      saldo_corp_und: parseFloat(row.saldo_corp_und) || 0,
      debito_fisc_local: parseFloat(row.debito_fisc_local) || 0,
      credito_fisc_local: parseFloat(row.credito_fisc_local) || 0,
      debito_fisc_dolar: parseFloat(row.debito_fisc_dolar) || 0,
      credito_fisc_dolar: parseFloat(row.credito_fisc_dolar) || 0,
      debito_corp_local: parseFloat(row.debito_corp_local) || 0,
      credito_corp_local: parseFloat(row.credito_corp_local) || 0,
      debito_corp_dolar: parseFloat(row.debito_corp_dolar) || 0,
      credito_corp_dolar: parseFloat(row.credito_corp_dolar) || 0,
      debito_fisc_und: parseFloat(row.debito_fisc_und) || 0,
      credito_fisc_und: parseFloat(row.credito_fisc_und) || 0,
      debito_corp_und: parseFloat(row.debito_corp_und) || 0,
      credito_corp_und: parseFloat(row.credito_corp_und) || 0,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: libroMayor,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      message: "Datos obtenidos exitosamente",
    };
  }

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(
    conjunto: string,
    filtros: ExportarLibroMayorExcelParams
  ): Promise<LibroMayor[]> {
    // Aplicar límite si se especifica
    let limitClause = "";
    if (filtros.limit) {
      limitClause = `TOP ${filtros.limit}`;
    }

    const query = `
      SELECT ${limitClause} * FROM (
        -- Query para obtener datos del MAYOR (período anterior)
        SELECT 
          CENTRO_COSTO, 
          CUENTA_CONTABLE,  
          0 as saldo_fisc_local,
          0 as saldo_fisc_dolar,
          0 as saldo_corp_local,
          0 as saldo_corp_dolar,
          0 as saldo_fisc_und,
          0 as saldo_corp_und,
          SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_LOCAL WHEN 'F' THEN DEBITO_LOCAL ELSE 0 END, 0) ) as debito_fisc_local, 
          SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_LOCAL WHEN 'F' THEN CREDITO_LOCAL ELSE 0 END, 0) ) as credito_fisc_local,  
          SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_DOLAR WHEN 'F' THEN DEBITO_DOLAR ELSE 0 END, 0) ) as debito_fisc_dolar, 
          SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_DOLAR WHEN 'F' THEN CREDITO_DOLAR ELSE 0 END, 0) ) as credito_fisc_dolar,  
          SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_LOCAL WHEN  'C' THEN DEBITO_LOCAL ELSE 0 END, 0) ) as debito_corp_local,
          SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_LOCAL WHEN  'C' THEN CREDITO_LOCAL ELSE 0 END, 0) ) as credito_corp_local,  
          SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_DOLAR WHEN  'C' THEN DEBITO_DOLAR ELSE 0 END, 0) ) as debito_corp_dolar,
          SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_DOLAR WHEN  'C' THEN CREDITO_DOLAR ELSE 0 END, 0) ) as credito_corp_dolar, 
          SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_UNIDADES WHEN 'F' THEN DEBITO_UNIDADES ELSE 0 END, 0) ) as debito_fisc_und,
          SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_UNIDADES WHEN 'F' THEN CREDITO_UNIDADES ELSE 0 END, 0) ) as credito_fisc_und,  
          SUM ( ISNULL(CASE CONTABILIDAD WHEN 'A' THEN DEBITO_UNIDADES WHEN  'C' THEN DEBITO_UNIDADES ELSE 0 END, 0) ) as debito_corp_und, 
          SUM (  ISNULL(CASE CONTABILIDAD WHEN 'A' THEN CREDITO_UNIDADES WHEN  'C' THEN CREDITO_UNIDADES ELSE 0 END, 0) ) as credito_corp_und
        FROM ${conjunto}.MAYOR (NOLOCK)
        WHERE cuenta_contable >= ? 
          AND cuenta_contable <= ? 
          AND (FECHA >= ? AND FECHA < ?)
          ${filtros.centroCosto ? 'AND CENTRO_COSTO = ?' : ''}
        GROUP BY CENTRO_COSTO, CUENTA_CONTABLE

        UNION ALL

        -- Query para obtener saldos iniciales del período
        SELECT  
          CENTRO_COSTO, 
          CUENTA_CONTABLE,  
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_fisc_local,  
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_fisc_dolar,  
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_corp_local,  
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_corp_dolar,  
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_fisc_und,  
          SUM(SALDO_FISC_LOCAL - SALDO_FISC_LOCAL) as saldo_corp_und,  
          SUM(DEBITO_FISC_LOCAL) as debito_fisc_local, 
          SUM(CREDITO_FISC_LOCAL) as credito_fisc_local,
          SUM(DEBITO_FISC_DOLAR) as debito_fisc_dolar, 
          SUM(CREDITO_FISC_DOLAR) as credito_fisc_dolar, 
          SUM(DEBITO_CORP_LOCAL) as debito_corp_local, 
          SUM(CREDITO_CORP_LOCAL) as credito_corp_local,  
          SUM(DEBITO_CORP_DOLAR) as debito_corp_dolar,  
          SUM(CREDITO_CORP_DOLAR) as credito_corp_dolar,  
          SUM(DEBITO_FISC_UND) as debito_fisc_und,	
          SUM(CREDITO_FISC_UND) as credito_fisc_und,  
          SUM(DEBITO_CORP_UND) as debito_corp_und, 
          SUM(CREDITO_CORP_UND) as credito_corp_und
        FROM ${conjunto}.SALDO (NOLOCK)
        WHERE cuenta_contable >= ?
          AND cuenta_contable <= ?
          AND FECHA >= ?
          AND FECHA < ?
          ${filtros.centroCosto ? 'AND CENTRO_COSTO = ?' : ''}
        GROUP BY CENTRO_COSTO, CUENTA_CONTABLE

        UNION ALL 

        -- Query para obtener saldos finales del período
        SELECT  
          CENTRO_COSTO, 
          CUENTA_CONTABLE,  
          SUM(s.saldo_fisc_local) as saldo_fisc_local, 
          SUM(s.saldo_fisc_dolar) as saldo_fisc_dolar, 
          SUM(s.saldo_corp_local) as saldo_corp_local, 
          SUM(s.saldo_corp_dolar) as saldo_corp_dolar,  
          SUM(s.saldo_fisc_und) as saldo_fisc_und, 
          SUM(s.saldo_corp_und) as saldo_corp_und,  
          0 as debito_fisc_local, 
          0 as credito_fisc_local, 
          0 as debito_fisc_dolar, 
          0 as credito_fisc_dolar, 
          0 as debito_corp_local, 
          0 as credito_corp_local,  
          0 as debito_corp_dolar,  
          0 as credito_corp_dolar,  
          0 as debito_fisc_und, 
          0 as credito_fisc_und,  
          0 as debito_corp_und, 
          0 as credito_corp_und
        FROM ${conjunto}.SALDO S (NOLOCK)
        WHERE cuenta_contable >= ? 
          AND cuenta_contable <= ? 
          AND S.FECHA = (
            SELECT MAX(FECHA) 
            FROM ${conjunto}.SALDO S1 (NOLOCK)
            WHERE s1.centro_costo = s.centro_costo 
              AND s1.cuenta_contable = s.cuenta_contable 
              AND s1.fecha <= ?
          )
          ${filtros.centroCosto ? 'AND CENTRO_COSTO = ?' : ''}
        GROUP BY CENTRO_COSTO, CUENTA_CONTABLE
      ) as libro_mayor
      ORDER BY CENTRO_COSTO, CUENTA_CONTABLE
    `;

    const params: any[] = [
      filtros.cuentaContableDesde || '01.1.1.1.004',
      filtros.cuentaContableHasta || '02.Z.Z.Z.ZZZ',
      '1980-01-01',
      filtros.fechaDesde,
      filtros.cuentaContableDesde || '01.1.1.1.004',
      filtros.cuentaContableHasta || '02.Z.Z.Z.ZZZ',
      filtros.fechaDesde,
      filtros.fechaHasta,
      filtros.cuentaContableDesde || '01.1.1.1.004',
      filtros.cuentaContableHasta || '02.Z.Z.Z.ZZZ',
      filtros.fechaHasta,
    ];

    if (filtros.centroCosto) {
      params.splice(4, 0, filtros.centroCosto);
      params.splice(9, 0, filtros.centroCosto);
      params.splice(14, 0, filtros.centroCosto);
    }

    const result = await this.databaseService.ejecutarQuery(query, params);
    return result.map((row: any) => ({
      centro_costo: row.CENTRO_COSTO,
      cuenta_contable: row.CUENTA_CONTABLE,
      descripcion_cuenta: '',
      saldo_fisc_local: parseFloat(row.saldo_fisc_local) || 0,
      saldo_fisc_dolar: parseFloat(row.saldo_fisc_dolar) || 0,
      saldo_corp_local: parseFloat(row.saldo_corp_local) || 0,
      saldo_corp_dolar: parseFloat(row.saldo_corp_dolar) || 0,
      saldo_fisc_und: parseFloat(row.saldo_fisc_und) || 0,
      saldo_corp_und: parseFloat(row.saldo_corp_und) || 0,
      debito_fisc_local: parseFloat(row.debito_fisc_local) || 0,
      credito_fisc_local: parseFloat(row.credito_fisc_local) || 0,
      debito_fisc_dolar: parseFloat(row.debito_fisc_dolar) || 0,
      credito_fisc_dolar: parseFloat(row.credito_fisc_dolar) || 0,
      debito_corp_local: parseFloat(row.debito_corp_local) || 0,
      credito_corp_local: parseFloat(row.credito_corp_local) || 0,
      debito_corp_dolar: parseFloat(row.debito_corp_dolar) || 0,
      credito_corp_dolar: parseFloat(row.credito_corp_dolar) || 0,
      debito_fisc_und: parseFloat(row.debito_fisc_und) || 0,
      credito_fisc_und: parseFloat(row.credito_fisc_und) || 0,
      debito_corp_und: parseFloat(row.debito_corp_und) || 0,
      credito_corp_und: parseFloat(row.credito_corp_und) || 0,
    }));
  }
}
