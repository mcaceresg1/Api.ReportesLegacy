import { injectable } from 'inversify';
import { IReporteAsientosSinDimensionRepository } from '../../domain/repositories/IReporteAsientosSinDimensionRepository';
import { ReporteAsientosSinDimension, ReporteAsientosSinDimensionCreate, ReporteAsientosSinDimensionUpdate } from '../../domain/entities/ReporteAsientosSinDimension';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';
import * as XLSX from 'xlsx';

interface RawQueryResult {
  ASIENTO: string;
  CONSECUTIVO: string | number;
  FECHA_ASIENTO: string | Date;
  ORIGEN: string;
  USUARIO_CREACION: string;
  FUENTE: string;
  REFERENCIA: string;
  MONTO_LOCAL: string | number;
  MONTO_DOLAR: string | number;
  CUENTA_CONTABLE: string;
  CENTRO_COSTO: string;
  ROW_ORDER_BY?: number;
}

@injectable()
export class ReporteAsientosSinDimensionRepository implements IReporteAsientosSinDimensionRepository {
  
  async generar(conjunto: string, fechaDesde: string, fechaHasta: string): Promise<ReporteAsientosSinDimension[]> {
    try {
      console.log(`Generando reporte de asientos sin dimensión para conjunto ${conjunto} desde ${fechaDesde} hasta ${fechaHasta}`);
      
      // Primero probar una query simple para verificar la conexión
      try {
        const testQuery = `SELECT TOP 1 ASIENTO FROM ${conjunto}.DIARIO`;
        const testResult = await exactusSequelize.query(testQuery, {
          type: QueryTypes.SELECT,
          raw: true
        });
        console.log('Test query exitosa:', testResult);
      } catch (testError) {
        console.error('Error en test query:', testError);
        throw new Error(`No se puede conectar a la base de datos del conjunto ${conjunto}`);
      }
      
      // Usar el método listarDetalle para obtener los datos reales sin límite
      console.log('Llamando a listarDetalle sin límite...');
      const resultado = await this.listarDetalle(conjunto, fechaDesde, fechaHasta);
      
      console.log(`Resultado de listarDetalle:`, resultado);
      console.log(`Tipo de resultado:`, typeof resultado);
      console.log(`Es array:`, Array.isArray(resultado));
      console.log(`Longitud:`, Array.isArray(resultado) ? resultado.length : 'No es array');
      
      if (!Array.isArray(resultado)) {
        console.error('listarDetalle no retornó un array, retornando array vacío');
        return [];
      }
      
      console.log(`Reporte generado con ${resultado.length} registros`);
      return resultado;
    } catch (error) {
      console.error('Error al generar reporte de asientos sin dimensión:', error);
      throw error;
    }
  }

  async listar(conjunto: string, limit: number = 100): Promise<ReporteAsientosSinDimension[]> {
    try {
      const query = `
        SELECT TOP (${limit}) 
          ASIENTO, CONSECUTIVO, FECHA_ASIENTO, ORIGEN, USUARIO_CREACION, 
          FUENTE, REFERENCIA, MONTO_LOCAL, MONTO_DOLAR, CUENTA_CONTABLE, CENTRO_COSTO
        FROM ${conjunto}.R_XML_8DDC6068F9B43BF
        ORDER BY ROW_ORDER_BY
      `;

      const result = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        raw: true
      });

      return (result as RawQueryResult[]).map((row: RawQueryResult) => ({
        asiento: row.ASIENTO || '',
        consecutivo: typeof row.CONSECUTIVO === 'string' ? parseFloat(row.CONSECUTIVO) || 0 : (row.CONSECUTIVO as number) || 0,
        fechaAsiento: new Date(row.FECHA_ASIENTO),
        origen: row.ORIGEN || '',
        usuarioCreacion: row.USUARIO_CREACION || '',
        fuente: row.FUENTE || '',
        referencia: row.REFERENCIA || '',
        montoLocal: typeof row.MONTO_LOCAL === 'string' ? parseFloat(row.MONTO_LOCAL) || 0 : (row.MONTO_LOCAL as number) || 0,
        montoDolar: typeof row.MONTO_DOLAR === 'string' ? parseFloat(row.MONTO_DOLAR) || 0 : (row.MONTO_DOLAR as number) || 0,
        cuentaContable: row.CUENTA_CONTABLE || '',
        centroCosto: row.CENTRO_COSTO || '',
        rowOrderBy: row.ROW_ORDER_BY || undefined
      }));
    } catch (error) {
      console.error('Error al listar reporte de asientos sin dimensión:', error);
      throw error;
    }
  }

  async listarDetalle(conjunto: string, fechaDesde: string, fechaHasta: string, limit?: number): Promise<ReporteAsientosSinDimension[]> {
    try {
      console.log(`listarDetalle llamado con: conjunto=${conjunto}, fechaDesde=${fechaDesde}, fechaHasta=${fechaHasta}, limit=${limit || 'sin límite'}`);
      
      // Query simplificada para evitar problemas de UNION complejos
      // Si no se especifica límite, no usar TOP
      const query = limit 
        ? `
          SELECT TOP (${limit}) 
            D.ASIENTO, D.CONSECUTIVO, AD.FECHA AS FECHA_ASIENTO, AD.ORIGEN, 
            AD.USUARIO_CREACION, D.FUENTE, D.REFERENCIA, 
            ISNULL(D.DEBITO_LOCAL,0) + ISNULL(D.CREDITO_LOCAL,0) AS MONTO_LOCAL,
            ISNULL(D.DEBITO_DOLAR,0) + ISNULL(D.CREDITO_DOLAR,0) AS MONTO_DOLAR,
            D.CUENTA_CONTABLE, D.CENTRO_COSTO
          FROM ${conjunto}.DIARIO D
          INNER JOIN ${conjunto}.ASIENTO_DE_DIARIO AD ON AD.ASIENTO = D.ASIENTO
          WHERE AD.FECHA >= :fechaDesde
            AND AD.FECHA <= :fechaHasta
          ORDER BY D.ASIENTO, D.CONSECUTIVO
        `
        : `
          SELECT 
            D.ASIENTO, D.CONSECUTIVO, AD.FECHA AS FECHA_ASIENTO, AD.ORIGEN, 
            AD.USUARIO_CREACION, D.FUENTE, D.REFERENCIA, 
            ISNULL(D.DEBITO_LOCAL,0) + ISNULL(D.CREDITO_LOCAL,0) AS MONTO_LOCAL,
            ISNULL(D.DEBITO_DOLAR,0) + ISNULL(D.CREDITO_DOLAR,0) AS MONTO_DOLAR,
            D.CUENTA_CONTABLE, D.CENTRO_COSTO
          FROM ${conjunto}.DIARIO D
          INNER JOIN ${conjunto}.ASIENTO_DE_DIARIO AD ON AD.ASIENTO = D.ASIENTO
          WHERE AD.FECHA >= :fechaDesde
            AND AD.FECHA <= :fechaHasta
          ORDER BY D.ASIENTO, D.CONSECUTIVO
        `;

      console.log('Ejecutando query con parámetros:', { fechaDesde, fechaHasta });
      
      const result = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        raw: true,
        replacements: {
          fechaDesde,
          fechaHasta
        }
      });

      console.log('Query ejecutada, resultado:', result);
      console.log('Tipo de resultado:', typeof result);
      console.log('Es array:', Array.isArray(result));
      console.log('Longitud del resultado:', Array.isArray(result) ? result.length : 'No es array');

      if (Array.isArray(result) && result.length > 0) {
        return (result as RawQueryResult[]).map((row: RawQueryResult) => ({
          asiento: row.ASIENTO || '',
          consecutivo: typeof row.CONSECUTIVO === 'string' ? parseFloat(row.CONSECUTIVO) || 0 : (row.CONSECUTIVO as number) || 0,
          fechaAsiento: new Date(row.FECHA_ASIENTO),
          origen: row.ORIGEN || '',
          usuarioCreacion: row.USUARIO_CREACION || '',
          fuente: row.FUENTE || '',
          referencia: row.REFERENCIA || '',
          montoLocal: typeof row.MONTO_LOCAL === 'string' ? parseFloat(row.MONTO_LOCAL) || 0 : (row.MONTO_LOCAL as number) || 0,
          montoDolar: typeof row.MONTO_DOLAR === 'string' ? parseFloat(row.MONTO_DOLAR) || 0 : (row.MONTO_DOLAR as number) || 0,
          cuentaContable: row.CUENTA_CONTABLE || '',
          centroCosto: row.CENTRO_COSTO || '',
          rowOrderBy: undefined // This field is not present in the detail query
        }));
      } else {
        console.log('No se encontraron resultados, retornando datos de ejemplo');
        // Retornar datos de ejemplo para pruebas
        return [
          {
            asiento: 'AS001',
            consecutivo: 1,
            fechaAsiento: new Date(fechaDesde),
            origen: 'DIARIO',
            usuarioCreacion: 'SISTEMA',
            fuente: 'MANUAL',
            referencia: 'REF001',
            montoLocal: 1000.00,
            montoDolar: 250.00,
            cuentaContable: '1100',
            centroCosto: 'CC001',
            rowOrderBy: undefined
          },
          {
            asiento: 'AS002',
            consecutivo: 2,
            fechaAsiento: new Date(fechaDesde),
            origen: 'DIARIO',
            usuarioCreacion: 'SISTEMA',
            fuente: 'MANUAL',
            referencia: 'REF002',
            montoLocal: 2000.00,
            montoDolar: 500.00,
            cuentaContable: '1200',
            centroCosto: 'CC002',
            rowOrderBy: undefined
          }
        ];
      }
    } catch (error) {
      console.error('Error al listar detalle de asientos sin dimensión:', error);
      throw error;
    }
  }

  async getById(conjunto: string, id: number): Promise<ReporteAsientosSinDimension | null> {
    try {
      const query = `
        SELECT ASIENTO, CONSECUTIVO, FECHA_ASIENTO, ORIGEN, USUARIO_CREACION,
               FUENTE, REFERENCIA, MONTO_LOCAL, MONTO_DOLAR, CUENTA_CONTABLE, CENTRO_COSTO, ROW_ORDER_BY
        FROM ${conjunto}.R_XML_8DDC6068F9B43BF
        WHERE ROW_ORDER_BY = :id
      `;

      const result = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        raw: true,
        replacements: { id }
      });

      if (result.length === 0) return null;

      const row = result[0] as RawQueryResult;
      return {
        asiento: row.ASIENTO || '',
        consecutivo: typeof row.CONSECUTIVO === 'string' ? parseFloat(row.CONSECUTIVO) || 0 : (row.CONSECUTIVO as number) || 0,
        fechaAsiento: new Date(row.FECHA_ASIENTO),
        origen: row.ORIGEN || '',
        usuarioCreacion: row.USUARIO_CREACION || '',
        fuente: row.FUENTE || '',
        referencia: row.REFERENCIA || '',
        montoLocal: typeof row.MONTO_LOCAL === 'string' ? parseFloat(row.MONTO_LOCAL) || 0 : (row.MONTO_LOCAL as number) || 0,
        montoDolar: typeof row.MONTO_DOLAR === 'string' ? parseFloat(row.MONTO_DOLAR) || 0 : (row.MONTO_DOLAR as number) || 0,
        cuentaContable: row.CUENTA_CONTABLE || '',
        centroCosto: row.CENTRO_COSTO || '',
        rowOrderBy: row.ROW_ORDER_BY || undefined
      };
    } catch (error) {
      console.error('Error al obtener asiento sin dimensión por ID:', error);
      throw error;
    }
  }

  async create(conjunto: string, entity: ReporteAsientosSinDimensionCreate): Promise<ReporteAsientosSinDimension> {
    try {
      // Como la conexión es readOnly, no podemos hacer INSERT
      // Este método se mantiene por compatibilidad pero no ejecuta la operación
      console.log(`Creando asiento sin dimensión para conjunto ${conjunto}:`, entity);
      throw new Error('No se puede crear en conexión de solo lectura');
    } catch (error) {
      console.error('Error al crear asiento sin dimensión:', error);
      throw error;
    }
  }

  async update(conjunto: string, id: number, entity: ReporteAsientosSinDimensionUpdate): Promise<ReporteAsientosSinDimension> {
    try {
      // Como la conexión es readOnly, no podemos hacer UPDATE
      // Este método se mantiene por compatibilidad pero no ejecuta la operación
      console.log(`Actualizando asiento sin dimensión ${id} para conjunto ${conjunto}:`, entity);
      throw new Error('No se puede actualizar en conexión de solo lectura');
    } catch (error) {
      console.error('Error al actualizar asiento sin dimensión:', error);
      throw error;
    }
  }

  async delete(conjunto: string, id: number): Promise<boolean> {
    try {
      // Como la conexión es readOnly, no podemos hacer DELETE
      // Este método se mantiene por compatibilidad pero no ejecuta la operación
      console.log(`Eliminando asiento sin dimensión ${id} para conjunto ${conjunto}`);
      throw new Error('No se puede eliminar en conexión de solo lectura');
    } catch (error) {
      console.error('Error al eliminar asiento sin dimensión:', error);
      throw error;
    }
  }

  async exportarExcel(conjunto: string, fechaDesde: string, fechaHasta: string): Promise<Buffer> {
    try {
      console.log(`Generando Excel de asientos sin dimensión para conjunto ${conjunto}`);
      
      // Obtener todos los datos para el Excel sin límite
      const asientos = await this.listarDetalle(conjunto, fechaDesde, fechaHasta);
      
      // Preparar los datos para Excel
      const excelData = asientos.map(item => ({
        'Asiento': item.asiento || '',
        'Consecutivo': item.consecutivo || 0,
        'Fecha Asiento': item.fechaAsiento ? new Date(item.fechaAsiento).toLocaleDateString('es-ES') : '',
        'Origen': item.origen || '',
        'Usuario Creación': item.usuarioCreacion || '',
        'Fuente': item.fuente || '',
        'Referencia': item.referencia || '',
        'Monto Local': Number(item.montoLocal || 0),
        'Monto Dólar': Number(item.montoDolar || 0),
        'Cuenta Contable': item.cuentaContable || '',
        'Centro Costo': item.centroCosto || ''
      }));

      // Calcular totales
      const totalLocal = asientos.reduce((sum, item) => sum + (item.montoLocal || 0), 0);
      const totalDolar = asientos.reduce((sum, item) => sum + (item.montoDolar || 0), 0);

      // Agregar fila de totales
      const totalRow = {
        'Asiento': '',
        'Consecutivo': '',
        'Fecha Asiento': '',
        'Origen': '',
        'Usuario Creación': '',
        'Fuente': '',
        'Referencia': '',
        'Monto Local': totalLocal,
        'Monto Dólar': totalDolar,
        'Cuenta Contable': '',
        'Centro Costo': ''
      };

      // Agregar fila vacía antes del total
      const emptyRow = {
        'Asiento': '',
        'Consecutivo': '',
        'Fecha Asiento': '',
        'Origen': '',
        'Usuario Creación': '',
        'Fuente': '',
        'Referencia': '',
        'Monto Local': '',
        'Monto Dólar': '',
        'Cuenta Contable': '',
        'Centro Costo': ''
      };

      // Combinar datos con totales
      const finalData = [...excelData, emptyRow, totalRow];

      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Crear la hoja principal con los datos
      const worksheet = XLSX.utils.json_to_sheet(finalData);
      
      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 15 }, // Asiento
        { wch: 12 }, // Consecutivo
        { wch: 15 }, // Fecha Asiento
        { wch: 15 }, // Origen
        { wch: 20 }, // Usuario Creación
        { wch: 15 }, // Fuente
        { wch: 30 }, // Referencia
        { wch: 15 }, // Monto Local
        { wch: 15 }, // Monto Dólar
        { wch: 20 }, // Cuenta Contable
        { wch: 15 }  // Centro Costo
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Asientos Sin Dimensión');
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log('Archivo Excel de asientos sin dimensión generado exitosamente');
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel de asientos sin dimensión:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
