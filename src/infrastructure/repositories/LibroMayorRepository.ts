import { injectable } from 'inversify';
import { ILibroMayorRepository } from '../../domain/repositories/ILibroMayorRepository';
import { LibroMayor, LibroMayorFiltros, LibroMayorResponse } from '../../domain/entities/LibroMayor';
import { DynamicModelFactory } from '../database/models/DynamicModel';
import { QueryTypes, Op } from 'sequelize';
import { exactusSequelize } from '../database/config/exactus-database';
import * as XLSX from 'xlsx';

@injectable()
export class LibroMayorRepository implements ILibroMayorRepository {
  
  async generarReporteLibroMayor(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date
  ): Promise<void> {
    try {
      console.log(`Generando reporte libro mayor para conjunto ${conjunto}, usuario ${usuario}`);
      
      // 1. Limpiar datos temporales del usuario
      await this.limpiarDatosTemporales(conjunto, usuario);
      
      // 2. Generar reporte usando las nuevas queries optimizadas
      const queryReporte = `
        SELECT 
          may.cuenta_contable,
          may.centro_costo,
          0 as tipo_linea,
          cta.acepta_datos,
          max(cta.descripcion) as descripcion,
          cta.saldo_normal,
          '' as asiento,
          convert(varchar(10), may.FECHA, 23) as fecha,
          am.fecha_creacion,
          'asiento' as origen,
          sum(may.debito_local) as debito_local,
          sum(may.credito_local) as credito_local,
          sum(may.debito_dolar) as debito_dolar,
          sum(may.credito_dolar) as credito_dolar,
          '${usuario}' as usuario
        FROM ${conjunto}.mayor may
        JOIN ${conjunto}.asiento_mayorizado am ON may.ASIENTO = am.ASIENTO
        JOIN ${conjunto}.cuenta_contable cta ON may.cuenta_contable = cta.cuenta_contable
        WHERE may.fecha >= '${fechaInicio.toISOString().split('T')[0]} 00:00:00.000'
        AND may.fecha <= '${fechaFin.toISOString().split('T')[0]} 23:59:59.998'
        AND may.contabilidad IN ('F', 'A')
        AND cta.tipo_detallado IN ('A','P','T','I','G','O')
        GROUP BY may.centro_costo, cta.acepta_datos, cta.SALDO_NORMAL, 
                 convert(varchar(10), may.FECHA, 23), am.fecha_creacion, may.cuenta_contable

        UNION

        SELECT 
          cta.cuenta_contable,
          '' as centro_costo,
          0 as tipo_linea,
          cta.acepta_datos,
          cta.descripcion,
          cta.saldo_normal,
          '' as asiento,
          '1980-1-1' as fecha,
          '1980-1-1' as fecha_creacion,
          '' as origen,
          0 as debito_local,
          0 as credito_local,
          0 as debito_dolar,
          0 as credito_dolar,
          '${usuario}' as usuario
        FROM ${conjunto}.cuenta_contable cta
        WHERE cta.cuenta_contable IN (
          SELECT may.cuenta_contable
          FROM ${conjunto}.mayor may
          WHERE may.cuenta_contable NOT IN (
            SELECT may.cuenta_contable 
            FROM ${conjunto}.mayor may 
            WHERE may.contabilidad IN ('F', 'A')
            AND may.fecha >= '${fechaInicio.toISOString().split('T')[0]} 00:00:00.000'
            AND may.fecha <= '${fechaFin.toISOString().split('T')[0]} 23:59:59.998'
          )
          AND may.fecha < '${fechaInicio.toISOString().split('T')[0]} 00:00:00.000'
        )
        AND cta.tipo_detallado IN ('A','P','T','I','G','O')
        
        ORDER BY 1, 8, 10, 3
      `;
      
      // 3. Ejecutar la query principal
      const resultados = await exactusSequelize.query(queryReporte, { type: QueryTypes.SELECT });
      
      // 4. Insertar resultados en la tabla temporal
      for (const row of resultados as any[]) {
        const queryInsert = `
          INSERT INTO ${conjunto}.REPCG_MAYOR (
            CUENTA_CONTABLE, CENTRO_COSTO, TIPO_LINEA, ACEPTA_DATOS, DESCRIPCION,
            SALDO_NORMAL, ASIENTO, FECHA, FECHA_CREACION, ORIGEN,
            DEBITO_LOCAL, CREDITO_LOCAL, DEBITO_DOLAR, CREDITO_DOLAR, USUARIO
          ) VALUES (
            '${row.cuenta_contable}', '${row.centro_costo}', ${row.tipo_linea}, ${row.acepta_datos},
            '${row.descripcion?.replace(/'/g, "''") || ''}', '${row.saldo_normal}', '${row.asiento}',
            '${row.fecha}', '${row.fecha_creacion}', '${row.origen}',
            ${row.debito_local || 0}, ${row.credito_local || 0},
            ${row.debito_dolar || 0}, ${row.credito_dolar || 0}, '${usuario}'
          )
        `;
        
        await exactusSequelize.query(queryInsert, { type: QueryTypes.INSERT });
      }
      
      // 5. Insertar en tabla final de resultados
      const queryInsertarResultados = `
        INSERT INTO ${conjunto}.R_XML_8DDC3925E54E9CF (
          PERIODO_CONTABLE, CUENTA_CONTABLE, DESCRIPCION, ASIENTO, TIPO, DOCUMENTO, REFERENCIA,  
          DEBITO_LOCAL, DEBITO_DOLAR_MAYOR, CREDITO_LOCAL, CREDITO_DOLAR_MAYOR, SALDO_DEUDOR, 
          SALDO_DEUDOR_DOLAR, SALDO_ACREEDOR, SALDO_ACREEDOR_DOLAR, CENTRO_COSTO, TIPO_ASIENTO, 
          FECHA, NIT, NIT_NOMBRE, FUENTE, CONSECUTIVO, CORRELATIVO_ASIENTO, TIPO_LINEA
        )
        SELECT 
          '${fechaInicio.getFullYear()}' as PERIODO_CONTABLE,
          CUENTA_CONTABLE,
          DESCRIPCION,
          ASIENTO,
          ORIGEN as TIPO,
          '' as DOCUMENTO,
          '' as REFERENCIA,
          DEBITO_LOCAL,
          DEBITO_DOLAR as DEBITO_DOLAR_MAYOR,
          CREDITO_LOCAL,
          CREDITO_DOLAR as CREDITO_DOLAR_MAYOR,
          CASE WHEN SALDO_NORMAL = 'D' THEN DEBITO_LOCAL - CREDITO_LOCAL ELSE 0 END as SALDO_DEUDOR,
          CASE WHEN SALDO_NORMAL = 'D' THEN DEBITO_DOLAR - CREDITO_DOLAR ELSE 0 END as SALDO_DEUDOR_DOLAR,
          CASE WHEN SALDO_NORMAL = 'A' THEN CREDITO_LOCAL - DEBITO_LOCAL ELSE 0 END as SALDO_ACREEDOR,
          CASE WHEN SALDO_NORMAL = 'A' THEN CREDITO_DOLAR - DEBITO_DOLAR ELSE 0 END as SALDO_ACREEDOR_DOLAR,
          CENTRO_COSTO,
          '' as TIPO_ASIENTO,
          FECHA,
          '' as NIT,
          '' as NIT_NOMBRE,
          '' as FUENTE,
          0 as CONSECUTIVO,
          0 as CORRELATIVO_ASIENTO,
          TIPO_LINEA
        FROM ${conjunto}.REPCG_MAYOR  
        WHERE USUARIO = '${usuario}'
      `;
      
      await exactusSequelize.query(queryInsertarResultados, { type: QueryTypes.INSERT });
      
      console.log('Reporte libro mayor generado exitosamente usando queries optimizadas');
      
    } catch (error) {
      console.error('Error al generar reporte libro mayor:', error);
      throw new Error(`Error al generar reporte libro mayor: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async obtenerLibroMayor(filtros: LibroMayorFiltros): Promise<LibroMayorResponse> {
    try {
      const { limit = 100, offset = 0 } = filtros;
      
      // Verificar si existe la tabla temporal
      const tablaExiste = await this.verificarTablaExiste(filtros.conjunto);
      if (!tablaExiste) {
        console.warn(`La tabla temporal no existe para el conjunto ${filtros.conjunto}. Retornando datos vacíos.`);
        return {
          data: [],
          total: 0,
          pagina: Math.floor(offset / limit) + 1,
          porPagina: limit,
          totalPaginas: 0
        };
      }
      
      // Obtener total de registros
      const total = await this.obtenerTotalRegistros(
        filtros.conjunto,
        filtros.usuario,
        filtros.fechaInicio,
        filtros.fechaFin
      );
      
      // Construir condiciones WHERE
      const whereConditions: any = {
        USUARIO: filtros.usuario
      };
      
      if (filtros.cuentaContable) {
        whereConditions.CUENTA_CONTABLE = { [Op.like]: `%${filtros.cuentaContable}%` };
      }
      
      if (filtros.centroCosto) {
        whereConditions.CENTRO_COSTO = { [Op.like]: `%${filtros.centroCosto}%` };
      }
      
      if (filtros.nit) {
        whereConditions.NIT = { [Op.like]: `%${filtros.nit}%` };
      }
      
      if (filtros.tipoAsiento) {
        whereConditions.TIPO_ASIENTO = { [Op.like]: `%${filtros.tipoAsiento}%` };
      }
      
      // Consultar datos
      const query = `
        SELECT 
          ISNULL(SALDO_ACREEDOR_DOLAR, 0) SALDO_ACREEDOR_DOLAR,
          ISNULL(CREDITO_DOLAR_MAYOR, 0) CREDITO_DOLAR_MAYOR,
          ISNULL(CORRELATIVO_ASIENTO, '') CORRELATIVO_ASIENTO,
          ISNULL(SALDO_DEUDOR_DOLAR, 0) SALDO_DEUDOR_DOLAR,
          ISNULL(DEBITO_DOLAR_MAYOR, 0) DEBITO_DOLAR_MAYOR,
          ISNULL(CUENTA_CONTABLE, '') CUENTA_CONTABLE,
          ISNULL(SALDO_ACREEDOR, 0) SALDO_ACREEDOR,
          ISNULL(CREDITO_DOLAR, 0) CREDITO_DOLAR,
          ISNULL(CREDITO_LOCAL, 0) CREDITO_LOCAL,
          ISNULL(SALDO_DEUDOR, 0) SALDO_DEUDOR,
          ISNULL(DEBITO_DOLAR, 0) DEBITO_DOLAR,
          ISNULL(DEBITO_LOCAL, 0) DEBITO_LOCAL,
          ISNULL(CENTRO_COSTO, '') CENTRO_COSTO,
          ISNULL(TIPO_ASIENTO, '') TIPO_ASIENTO,
          ISNULL(DESCRIPCION, '') DESCRIPCION,
          ISNULL(CONSECUTIVO, 0) CONSECUTIVO,
          ISNULL(REFERENCIA, '') REFERENCIA,
          ISNULL(NIT_NOMBRE, '') NIT_NOMBRE,
          ISNULL(DOCUMENTO, '') DOCUMENTO,
          ISNULL(CREDITO, 0) CREDITO,
          ISNULL(ASIENTO, '') ASIENTO,
          ISNULL(DEBITO, 0) DEBITO,
          FECHA,
          ISNULL(TIPO, '') TIPO,
          ISNULL(NIT, '') NIT,
          ISNULL(FUENTE, '') FUENTE
        FROM ${filtros.conjunto}.R_XML_8DDC3925E54E9CF 
        WHERE USUARIO = '${filtros.usuario}'
        ${filtros.cuentaContable ? `AND CUENTA_CONTABLE LIKE '%${filtros.cuentaContable}%'` : ''}
        ${filtros.centroCosto ? `AND CENTRO_COSTO LIKE '%${filtros.centroCosto}%'` : ''}
        ${filtros.nit ? `AND NIT LIKE '%${filtros.nit}%'` : ''}
        ${filtros.tipoAsiento ? `AND TIPO_ASIENTO LIKE '%${filtros.tipoAsiento}%'` : ''}
        ORDER BY PERIODO_CONTABLE, CUENTA_CONTABLE, TIPO_LINEA, FECHA, ASIENTO
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY
      `;
      
      const resultados = await exactusSequelize.query(query, { type: QueryTypes.SELECT });
      
      const data = resultados.map((row: any) => ({
        CUENTA_CONTABLE: row.CUENTA_CONTABLE,
        DESCRIPCION: row.DESCRIPCION,
        ASIENTO: row.ASIENTO,
        TIPO: row.TIPO,
        DOCUMENTO: row.DOCUMENTO,
        REFERENCIA: row.REFERENCIA,
        SALDO_DEUDOR: Number(row.SALDO_DEUDOR),
        SALDO_ACREEDOR: Number(row.SALDO_ACREEDOR),
        DEBITO_LOCAL: Number(row.DEBITO_LOCAL),
        CREDITO_LOCAL: Number(row.CREDITO_LOCAL),
        SALDO_DEUDOR_DOLAR: Number(row.SALDO_DEUDOR_DOLAR),
        SALDO_ACREEDOR_DOLAR: Number(row.SALDO_ACREEDOR_DOLAR),
        DEBITO_DOLAR: Number(row.DEBITO_DOLAR),
        CREDITO_DOLAR: Number(row.CREDITO_DOLAR),
        DEBITO_DOLAR_MAYOR: Number(row.DEBITO_DOLAR_MAYOR),
        CREDITO_DOLAR_MAYOR: Number(row.CREDITO_DOLAR_MAYOR),
        CENTRO_COSTO: row.CENTRO_COSTO,
        TIPO_ASIENTO: row.TIPO_ASIENTO,
        FECHA: new Date(row.FECHA),
        CONSECUTIVO: Number(row.CONSECUTIVO),
        CORRELATIVO_ASIENTO: row.CORRELATIVO_ASIENTO,
        TIPO_LINEA: Number(row.TIPO_LINEA),
        NIT: row.NIT,
        NIT_NOMBRE: row.NIT_NOMBRE,
        FUENTE: row.FUENTE
      })) as LibroMayor[];
      
      const totalPaginas = Math.ceil(total / limit);
      const pagina = Math.floor(offset / limit) + 1;
      
      return {
        data,
        total,
        pagina,
        porPagina: limit,
        totalPaginas
      };
      
    } catch (error) {
      console.error('Error al obtener libro mayor:', error);
      throw new Error(`Error al obtener libro mayor: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async obtenerTotalRegistros(
    conjunto: string,
    usuario: string,
    fechaInicio?: Date,
    fechaFin?: Date
  ): Promise<number> {
    try {
      const query = `
        SELECT COUNT(*) as total
        FROM ${conjunto}.R_XML_8DDC3925E54E9CF 
        WHERE USUARIO = '${usuario}'
      `;
      
      const resultado = await exactusSequelize.query(query, { type: QueryTypes.SELECT });
      const first = Array.isArray(resultado) ? (resultado as any[])[0] : undefined;
      return Number(first?.total || 0);
      
    } catch (error) {
      console.error('Error al obtener total de registros:', error);
      return 0;
    }
  }

  async limpiarDatosTemporales(conjunto: string, usuario: string): Promise<void> {
    try {
      // Limpiar tabla temporal REPCG_MAYOR
      const queryLimpiarMayor = `DELETE FROM ${conjunto}.REPCG_MAYOR WHERE USUARIO = '${usuario}'`;
      await exactusSequelize.query(queryLimpiarMayor, { type: QueryTypes.DELETE });
      
      // Limpiar tabla de resultados R_XML_8DDC3925E54E9CF
      const queryLimpiarResultados = `DELETE FROM ${conjunto}.R_XML_8DDC3925E54E9CF WHERE USUARIO = '${usuario}'`;
      await exactusSequelize.query(queryLimpiarResultados, { type: QueryTypes.DELETE });
      
      console.log(`Datos temporales limpiados para usuario ${usuario}`);
      
    } catch (error) {
      console.error('Error al limpiar datos temporales:', error);
      throw new Error(`Error al limpiar datos temporales: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async obtenerPeriodoContableReciente(conjunto: string, fechaLimite: Date): Promise<Date | null> {
    try {
      const query = `
        SELECT MAX(FECHA_FINAL) as fecha_final
        FROM ${conjunto}.PERIODO_CONTABLE 
        WHERE CONTABILIDAD = 'F'            
        AND FECHA_FINAL < '${fechaLimite.toISOString().split('T')[0]}'
      `;
      
      const resultado = await exactusSequelize.query(query, { type: QueryTypes.SELECT });
      const first = Array.isArray(resultado) ? (resultado as any[])[0] : undefined;
      const fecha = first?.fecha_final;
      
      return fecha ? new Date(fecha) : null;
      
    } catch (error) {
      console.error('Error al obtener período contable reciente:', error);
      return null;
    }
  }

  async actualizarPeriodosContables(conjunto: string, usuario: string): Promise<void> {
    try {
      const query = `
        UPDATE ${conjunto}.REPCG_MAYOR  	
        SET PERIODO_CONTABLE = ( 
          SELECT MIN(FECHA_FINAL) 
          FROM ${conjunto}.PERIODO_CONTABLE P  
          WHERE P.CONTABILIDAD IN ('A', 'F')  
          AND ${conjunto}.REPCG_MAYOR.FECHA < P.FECHA_FINAL + 1 
        )	  	
        WHERE USUARIO = '${usuario}'
      `;
      
      await exactusSequelize.query(query, { type: QueryTypes.UPDATE });
      console.log('Períodos contables actualizados');
      
    } catch (error) {
      console.error('Error al actualizar períodos contables:', error);
      throw new Error(`Error al actualizar períodos contables: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async exportarExcel(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    limit: number = 1000
  ): Promise<Buffer> {
    try {
      console.log(`Generando Excel del libro mayor para conjunto ${conjunto}, usuario ${usuario}`);
      
      // Generar el reporte completo
      await this.generarReporteLibroMayor(conjunto, usuario, fechaInicio, fechaFin);
      
      // Obtener todos los datos para el Excel
      const filtros: LibroMayorFiltros = {
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        limit,
        offset: 0
      };
      
      const resultado = await this.obtenerLibroMayor(filtros);
      
      // Preparar los datos para Excel
      const excelData = resultado.data.map(item => ({
        'Cuenta Contable': item.CUENTA_CONTABLE || '',
        'Descripción': item.DESCRIPCION || '',
        'Asiento': item.ASIENTO || '',
        'Tipo': item.TIPO || '',
        'Documento': item.DOCUMENTO || '',
        'Referencia': item.REFERENCIA || '',
        'Débito Local': Number(item.DEBITO_LOCAL || 0),
        'Débito Dólar': Number(item.DEBITO_DOLAR || 0),
        'Crédito Local': Number(item.CREDITO_LOCAL || 0),
        'Crédito Dólar': Number(item.CREDITO_DOLAR || 0),
        'Saldo Deudor': Number(item.SALDO_DEUDOR || 0),
        'Saldo Deudor Dólar': Number(item.SALDO_DEUDOR_DOLAR || 0),
        'Saldo Acreedor': Number(item.SALDO_ACREEDOR || 0),
        'Saldo Acreedor Dólar': Number(item.SALDO_ACREEDOR_DOLAR || 0),
        'Centro Costo': item.CENTRO_COSTO || '',
        'Tipo Asiento': item.TIPO_ASIENTO || '',
        'Fecha': item.FECHA ? new Date(item.FECHA).toLocaleDateString('es-ES') : '',
        'NIT': item.NIT || '',
        'Razón Social': item.NIT_NOMBRE || '',
        'Fuente': item.FUENTE || '',
        'Consecutivo': item.CONSECUTIVO || '',
        'Tipo Línea': item.TIPO_LINEA || ''
      }));

      // Calcular totales
      const totalDebitoLocal = resultado.data.reduce((sum, item) => sum + (item.DEBITO_LOCAL || 0), 0);
      const totalDebitoDolar = resultado.data.reduce((sum, item) => sum + (item.DEBITO_DOLAR || 0), 0);
      const totalCreditoLocal = resultado.data.reduce((sum, item) => sum + (item.CREDITO_LOCAL || 0), 0);
      const totalCreditoDolar = resultado.data.reduce((sum, item) => sum + (item.CREDITO_DOLAR || 0), 0);

      // Agregar fila de totales
      const totalRow = {
        'Cuenta Contable': '',
        'Descripción': '',
        'Asiento': '',
        'Tipo': '',
        'Documento': '',
        'Referencia': '',
        'Débito Local': totalDebitoLocal,
        'Débito Dólar': totalDebitoDolar,
        'Crédito Local': totalCreditoLocal,
        'Crédito Dólar': totalCreditoDolar,
        'Saldo Deudor': '',
        'Saldo Deudor Dólar': '',
        'Saldo Acreedor': '',
        'Saldo Acreedor Dólar': '',
        'Centro Costo': '',
        'Tipo Asiento': '',
        'Fecha': '',
        'NIT': '',
        'Razón Social': '',
        'Fuente': '',
        'Consecutivo': '',
        'Tipo Línea': 'TOTAL GENERAL'
      };

      // Combinar datos con totales
      const finalData = [...excelData, totalRow];

      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Crear la hoja principal con los datos
      const worksheet = XLSX.utils.json_to_sheet(finalData);
      
      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 20 }, // Cuenta Contable
        { wch: 40 }, // Descripción
        { wch: 15 }, // Asiento
        { wch: 10 }, // Tipo
        { wch: 15 }, // Documento
        { wch: 30 }, // Referencia
        { wch: 15 }, // Débito Local
        { wch: 15 }, // Débito Dólar
        { wch: 15 }, // Crédito Local
        { wch: 15 }, // Crédito Dólar
        { wch: 15 }, // Saldo Deudor
        { wch: 15 }, // Saldo Deudor Dólar
        { wch: 15 }, // Saldo Acreedor
        { wch: 15 }, // Saldo Acreedor Dólar
        { wch: 15 }, // Centro Costo
        { wch: 15 }, // Tipo Asiento
        { wch: 12 }, // Fecha
        { wch: 15 }, // NIT
        { wch: 30 }, // Razón Social
        { wch: 15 }, // Fuente
        { wch: 12 }, // Consecutivo
        { wch: 12 }  // Tipo Línea
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Libro Mayor');
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log('Archivo Excel del libro mayor generado exitosamente');
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel del libro mayor:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtiene las cuentas contables para el filtro
   */
  async obtenerCuentasContables(conjunto: string): Promise<any[]> {
    try {
      const query = `
        SELECT cuenta_contable 
        FROM ${conjunto}.cuenta_contable
        ORDER BY cuenta_contable
      `;
      
      const resultado = await exactusSequelize.query(query, { type: QueryTypes.SELECT });
      return resultado as any[];
      
    } catch (error) {
      console.error('Error al obtener cuentas contables:', error);
      return [];
    }
  }

  /**
   * Verifica si existe la tabla temporal para el conjunto especificado
   */
  private async verificarTablaExiste(conjunto: string): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = '${conjunto}' 
        AND TABLE_NAME = 'R_XML_8DDC3925E54E9CF'
      `;
      
      const resultado = await exactusSequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      return resultado[0]?.count > 0;
      
    } catch (error) {
      console.error('Error al verificar existencia de tabla temporal:', error);
      return false;
    }
  }
}
