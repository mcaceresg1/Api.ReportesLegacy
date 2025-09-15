import { injectable } from 'inversify';
import { IMovimientoContableRepository } from '../../domain/repositories/IMovimientoContableRepository';
import { MovimientoContable } from '../../domain/entities/MovimientoContable';
import { DynamicModelFactory } from '../database/models/DynamicModel';
import { QueryTypes, Op } from 'sequelize';
import { exactusSequelize } from '../database/config/exactus-database';
import * as XLSX from 'xlsx';

@injectable()
export class MovimientoContableRepository implements IMovimientoContableRepository {
  
  async generarReporteMovimientos(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    limit: number = 100,
    offset: number = 0
  ): Promise<{ data: MovimientoContable[], total: number }> {
    try {
      // Primero limpiar datos anteriores del usuario
      await exactusSequelize.query(
        `DELETE FROM ${conjunto}.REPCG_MOV_CUENTA WHERE USUARIO = '${usuario}'`,
        { type: QueryTypes.DELETE }
      );

      // Query para generar el reporte basado en los queries proporcionados
      const query = `
        INSERT INTO ${conjunto}.REPCG_MOV_CUENTA (
          USUARIO, CUENTA_CONTABLE, DESCRIPCION_CUENTA_CONTABLE, ASIENTO, TIPO, 
          DOCUMENTO, REFERENCIA, DEBITO_LOCAL, DEBITO_DOLAR, CREDITO_LOCAL, 
          CREDITO_DOLAR, CENTRO_COSTO, DESCRIPCION_CENTRO_COSTO, TIPO_ASIENTO, 
          FECHA, ACEPTA_DATOS, CONSECUTIVO, NIT, RAZON_SOCIAL, FUENTE, NOTAS, 
          U_FLUJO_EFECTIVO, U_PATRIMONIO_NETO, U_REP_REF
        )
        SELECT 
          '${usuario}' as USUARIO,
          SUBSTRING(M.CUENTA_CONTABLE, 1, 2) as CUENTA_CONTABLE,
          CC.DESCRIPCION as DESCRIPCION_CUENTA_CONTABLE,
          M.ASIENTO,
          CASE 
            WHEN A.ORIGEN IN ('CP', 'CB', 'CC', 'CJ', 'IC', 'FA') 
            THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 1, 3) 
            ELSE '' 
          END as TIPO,
          CASE 
            WHEN A.ORIGEN IN ('FA') 
            THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 5, 20)
            WHEN A.ORIGEN IN ('CP', 'CB', 'CC', 'CJ', 'IC') 
            THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 4, 20)
            ELSE '' 
          END as DOCUMENTO,
          M.REFERENCIA,
          M.DEBITO_LOCAL,
          M.DEBITO_DOLAR,
          M.CREDITO_LOCAL,
          M.CREDITO_DOLAR,
          M.CENTRO_COSTO,
          C.DESCRIPCION as DESCRIPCION_CENTRO_COSTO,
          A.TIPO_ASIENTO,
          A.FECHA,
          CASE CC.ACEPTA_DATOS WHEN 'N' THEN 0 ELSE 1 END as ACEPTA_DATOS,
          M.CONSECUTIVO,
          M.NIT,
          N.RAZON_SOCIAL,
          M.FUENTE,
          A.NOTAS,
          M.U_FLUJO_EFECTIVO,
          M.U_PATRIMONIO_NETO,
          M.U_REP_REF
        FROM ${conjunto}.DIARIO M
        INNER JOIN ${conjunto}.ASIENTO_DE_DIARIO A ON M.ASIENTO = A.ASIENTO
        INNER JOIN ${conjunto}.NIT N ON M.NIT = N.NIT
        INNER JOIN ${conjunto}.CUENTA_CONTABLE CC ON CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'
        INNER JOIN ${conjunto}.CENTRO_COSTO C ON C.CENTRO_COSTO = M.CENTRO_COSTO
        WHERE A.CONTABILIDAD IN ('F', 'A')
        AND A.FECHA BETWEEN '${fechaInicio.toISOString()}' AND '${fechaFin.toISOString()}'
        
        UNION ALL
        
        SELECT 
          '${usuario}' as USUARIO,
          SUBSTRING(M.CUENTA_CONTABLE, 1, 2) as CUENTA_CONTABLE,
          CC.DESCRIPCION as DESCRIPCION_CUENTA_CONTABLE,
          M.ASIENTO,
          CASE 
            WHEN A.ORIGEN IN ('CP', 'CB', 'CC', 'CJ', 'IC', 'FA') 
            THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 1, 3) 
            ELSE '' 
          END as TIPO,
          CASE 
            WHEN A.ORIGEN IN ('FA') 
            THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 5, 20)
            WHEN A.ORIGEN IN ('CP', 'CB', 'CC', 'CJ', 'IC') 
            THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 4, 20)
            ELSE '' 
          END as DOCUMENTO,
          M.REFERENCIA,
          M.DEBITO_LOCAL,
          M.DEBITO_DOLAR,
          M.CREDITO_LOCAL,
          M.CREDITO_DOLAR,
          M.CENTRO_COSTO,
          C.DESCRIPCION as DESCRIPCION_CENTRO_COSTO,
          A.TIPO_ASIENTO,
          A.FECHA,
          CASE CC.ACEPTA_DATOS WHEN 'N' THEN 0 ELSE 1 END as ACEPTA_DATOS,
          M.CONSECUTIVO,
          M.NIT,
          N.RAZON_SOCIAL,
          M.FUENTE,
          A.NOTAS,
          M.U_FLUJO_EFECTIVO,
          M.U_PATRIMONIO_NETO,
          M.U_REP_REF
        FROM ${conjunto}.MAYOR M
        INNER JOIN ${conjunto}.ASIENTO_MAYORIZADO A ON M.ASIENTO = A.ASIENTO
        INNER JOIN ${conjunto}.NIT N ON M.NIT = N.NIT
        INNER JOIN ${conjunto}.CUENTA_CONTABLE CC ON CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'
        INNER JOIN ${conjunto}.CENTRO_COSTO C ON C.CENTRO_COSTO = M.CENTRO_COSTO
        WHERE A.CONTABILIDAD IN ('F', 'A')
        AND A.FECHA BETWEEN '${fechaInicio.toISOString()}' AND '${fechaFin.toISOString()}'
      `;

      // Ejecutar el query de inserción
      await exactusSequelize.query(query, { type: QueryTypes.INSERT });

      // Obtener el total de registros
      const totalResult = await exactusSequelize.query(
        `SELECT COUNT(*) as total FROM ${conjunto}.REPCG_MOV_CUENTA WHERE USUARIO = '${usuario}'`,
        { type: QueryTypes.SELECT }
      );
      const total = (totalResult[0] as any).total;

      // Consultar los datos con paginación
      const MovimientoContableModel = DynamicModelFactory.createMovimientoContableModel(conjunto);
      const movimientos = await MovimientoContableModel.findAll({
        attributes: [
          'USUARIO', 'CUENTA_CONTABLE', 'DESCRIPCION_CUENTA_CONTABLE', 'ASIENTO', 'TIPO',
          'DOCUMENTO', 'REFERENCIA', 'DEBITO_LOCAL', 'DEBITO_DOLAR', 'CREDITO_LOCAL',
          'CREDITO_DOLAR', 'CENTRO_COSTO', 'DESCRIPCION_CENTRO_COSTO', 'TIPO_ASIENTO',
          'FECHA', 'ACEPTA_DATOS', 'CONSECUTIVO', 'NIT', 'RAZON_SOCIAL', 'FUENTE',
          'NOTAS', 'U_FLUJO_EFECTIVO', 'U_PATRIMONIO_NETO', 'U_REP_REF'
        ],
        where: {
          USUARIO: usuario
        },
        order: [['FECHA', 'ASC'], ['ASIENTO', 'ASC']],
        limit,
        offset,
      });

      return {
        data: movimientos.map(movimiento => movimiento.toJSON() as MovimientoContable),
        total
      };
    } catch (error) {
      console.error('Error al generar reporte de movimientos:', error);
      throw new Error('Error al generar reporte de movimientos');
    }
  }

  async obtenerMovimientosPorUsuario(
    conjunto: string,
    usuario: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<MovimientoContable[]> {
    try {
      const MovimientoContableModel = DynamicModelFactory.createMovimientoContableModel(conjunto);
      const movimientos = await MovimientoContableModel.findAll({
        attributes: [
          'USUARIO', 'CUENTA_CONTABLE', 'DESCRIPCION_CUENTA_CONTABLE', 'ASIENTO', 'TIPO',
          'DOCUMENTO', 'REFERENCIA', 'DEBITO_LOCAL', 'DEBITO_DOLAR', 'CREDITO_LOCAL',
          'CREDITO_DOLAR', 'CENTRO_COSTO', 'DESCRIPCION_CENTRO_COSTO', 'TIPO_ASIENTO',
          'FECHA', 'ACEPTA_DATOS', 'CONSECUTIVO', 'NIT', 'RAZON_SOCIAL', 'FUENTE',
          'NOTAS', 'U_FLUJO_EFECTIVO', 'U_PATRIMONIO_NETO', 'U_REP_REF'
        ],
        where: {
          USUARIO: usuario
        },
        order: [['FECHA', 'DESC'], ['ASIENTO', 'ASC']],
        limit,
        offset,
      });
      return movimientos.map(movimiento => movimiento.toJSON() as MovimientoContable);
    } catch (error) {
      console.error('Error al obtener movimientos por usuario:', error);
      throw new Error('Error al obtener movimientos por usuario');
    }
  }

  async obtenerMovimientosPorCentroCosto(
    conjunto: string,
    centroCosto: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<MovimientoContable[]> {
    try {
      const MovimientoContableModel = DynamicModelFactory.createMovimientoContableModel(conjunto);
      const movimientos = await MovimientoContableModel.findAll({
        attributes: [
          'USUARIO', 'CUENTA_CONTABLE', 'DESCRIPCION_CUENTA_CONTABLE', 'ASIENTO', 'TIPO',
          'DOCUMENTO', 'REFERENCIA', 'DEBITO_LOCAL', 'DEBITO_DOLAR', 'CREDITO_LOCAL',
          'CREDITO_DOLAR', 'CENTRO_COSTO', 'DESCRIPCION_CENTRO_COSTO', 'TIPO_ASIENTO',
          'FECHA', 'ACEPTA_DATOS', 'CONSECUTIVO', 'NIT', 'RAZON_SOCIAL', 'FUENTE',
          'NOTAS', 'U_FLUJO_EFECTIVO', 'U_PATRIMONIO_NETO', 'U_REP_REF'
        ],
        where: {
          CENTRO_COSTO: centroCosto
        },
        order: [['FECHA', 'DESC'], ['ASIENTO', 'ASC']],
        limit,
        offset,
      });
      return movimientos.map(movimiento => movimiento.toJSON() as MovimientoContable);
    } catch (error) {
      console.error('Error al obtener movimientos por centro de costo:', error);
      throw new Error('Error al obtener movimientos por centro de costo');
    }
  }

  async obtenerMovimientosPorCuentaContable(
    conjunto: string,
    cuentaContable: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<MovimientoContable[]> {
    try {
      const MovimientoContableModel = DynamicModelFactory.createMovimientoContableModel(conjunto);
      const movimientos = await MovimientoContableModel.findAll({
        attributes: [
          'USUARIO', 'CUENTA_CONTABLE', 'DESCRIPCION_CUENTA_CONTABLE', 'ASIENTO', 'TIPO',
          'DOCUMENTO', 'REFERENCIA', 'DEBITO_LOCAL', 'DEBITO_DOLAR', 'CREDITO_LOCAL',
          'CREDITO_DOLAR', 'CENTRO_COSTO', 'DESCRIPCION_CENTRO_COSTO', 'TIPO_ASIENTO',
          'FECHA', 'ACEPTA_DATOS', 'CONSECUTIVO', 'NIT', 'RAZON_SOCIAL', 'FUENTE',
          'NOTAS', 'U_FLUJO_EFECTIVO', 'U_PATRIMONIO_NETO', 'U_REP_REF'
        ],
        where: {
          CUENTA_CONTABLE: cuentaContable
        },
        order: [['FECHA', 'DESC'], ['ASIENTO', 'ASC']],
        limit,
        offset,
      });
      return movimientos.map(movimiento => movimiento.toJSON() as MovimientoContable);
    } catch (error) {
      console.error('Error al obtener movimientos por cuenta contable:', error);
      throw new Error('Error al obtener movimientos por cuenta contable');
    }
  }

  async getMovimientosCount(
    conjunto: string,
    usuario: string,
    fechaInicio?: Date,
    fechaFin?: Date
  ): Promise<number> {
    try {
      const MovimientoContableModel = DynamicModelFactory.createMovimientoContableModel(conjunto);
      const whereClause: any = {
        USUARIO: usuario
      };

      if (fechaInicio && fechaFin) {
        whereClause.FECHA = {
          [Op.between]: [fechaInicio, fechaFin]
        };
      }

      return await MovimientoContableModel.count({
        where: whereClause
      });
    } catch (error) {
      console.error('Error al obtener conteo de movimientos:', error);
      throw new Error('Error al obtener conteo de movimientos');
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
      console.log(`Generando Excel de movimientos contables para conjunto ${conjunto}, usuario ${usuario}`);
      
      // Obtener todos los datos sin paginación para el Excel
      const result = await this.generarReporteMovimientos(
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        limit,
        0
      );

      // Preparar los datos para Excel
      const excelData = result.data.map(item => ({
        'Usuario': item.USUARIO || '',
        'Cuenta Contable': item.CUENTA_CONTABLE || '',
        'Descripción Cuenta': item.DESCRIPCION_CUENTA_CONTABLE || '',
        'Asiento': item.ASIENTO || '',
        'Tipo': item.TIPO || '',
        'Documento': item.DOCUMENTO || '',
        'Referencia': item.REFERENCIA || '',
        'Débito Local': Number(item.DEBITO_LOCAL || 0),
        'Débito Dólar': Number(item.DEBITO_DOLAR || 0),
        'Crédito Local': Number(item.CREDITO_LOCAL || 0),
        'Crédito Dólar': Number(item.CREDITO_DOLAR || 0),
        'Centro Costo': item.CENTRO_COSTO || '',
        'Descripción Centro Costo': item.DESCRIPCION_CENTRO_COSTO || '',
        'Tipo Asiento': item.TIPO_ASIENTO || '',
        'Fecha': item.FECHA ? new Date(item.FECHA).toLocaleDateString('es-ES') : '',
        'Acepta Datos': item.ACEPTA_DATOS ? 'Sí' : 'No',
        'Consecutivo': item.CONSECUTIVO || '',
        'NIT': item.NIT || '',
        'Razón Social': item.RAZON_SOCIAL || '',
        'Fuente': item.FUENTE || '',
        'Notas': item.NOTAS || ''
      }));

      // Calcular totales
      const totalDebitoLocal = result.data.reduce((sum, item) => sum + (item.DEBITO_LOCAL || 0), 0);
      const totalDebitoDolar = result.data.reduce((sum, item) => sum + (item.DEBITO_DOLAR || 0), 0);
      const totalCreditoLocal = result.data.reduce((sum, item) => sum + (item.CREDITO_LOCAL || 0), 0);
      const totalCreditoDolar = result.data.reduce((sum, item) => sum + (item.CREDITO_DOLAR || 0), 0);

      // Agregar fila de totales
      const totalRow = {
        'Usuario': '',
        'Cuenta Contable': '',
        'Descripción Cuenta': '',
        'Asiento': '',
        'Tipo': '',
        'Documento': '',
        'Referencia': '',
        'Débito Local': totalDebitoLocal,
        'Débito Dólar': totalDebitoDolar,
        'Crédito Local': totalCreditoLocal,
        'Crédito Dólar': totalCreditoDolar,
        'Centro Costo': '',
        'Descripción Centro Costo': '',
        'Tipo Asiento': '',
        'Fecha': '',
        'Acepta Datos': '',
        'Consecutivo': '',
        'NIT': '',
        'Razón Social': '',
        'Fuente': '',
        'Notas': 'TOTAL GENERAL'
      };

      // Agregar fila vacía antes del total
      const emptyRow = {
        'Usuario': '',
        'Cuenta Contable': '',
        'Descripción Cuenta': '',
        'Asiento': '',
        'Tipo': '',
        'Documento': '',
        'Referencia': '',
        'Débito Local': '',
        'Débito Dólar': '',
        'Crédito Local': '',
        'Crédito Dólar': '',
        'Centro Costo': '',
        'Descripción Centro Costo': '',
        'Tipo Asiento': '',
        'Fecha': '',
        'Acepta Datos': '',
        'Consecutivo': '',
        'NIT': '',
        'Razón Social': '',
        'Fuente': '',
        'Notas': ''
      };

      // Combinar datos con totales
      const finalData = [...excelData, emptyRow, totalRow];

      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Crear la hoja principal con los datos
      const worksheet = XLSX.utils.json_to_sheet(finalData);
      
      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 15 }, // Usuario
        { wch: 20 }, // Cuenta Contable
        { wch: 30 }, // Descripción Cuenta
        { wch: 15 }, // Asiento
        { wch: 10 }, // Tipo
        { wch: 15 }, // Documento
        { wch: 30 }, // Referencia
        { wch: 15 }, // Débito Local
        { wch: 15 }, // Débito Dólar
        { wch: 15 }, // Crédito Local
        { wch: 15 }, // Crédito Dólar
        { wch: 15 }, // Centro Costo
        { wch: 30 }, // Descripción Centro Costo
        { wch: 15 }, // Tipo Asiento
        { wch: 12 }, // Fecha
        { wch: 12 }, // Acepta Datos
        { wch: 12 }, // Consecutivo
        { wch: 15 }, // NIT
        { wch: 30 }, // Razón Social
        { wch: 15 }, // Fuente
        { wch: 40 }  // Notas
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimientos Contables');
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log('Archivo Excel de movimientos contables generado exitosamente');
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel de movimientos contables:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
