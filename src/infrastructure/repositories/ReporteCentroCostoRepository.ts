import { injectable } from 'inversify';
import { exactusSequelize } from '../database/config/exactus-database';
import { IReporteCentroCostoRepository } from '../../domain/repositories/IReporteCentroCostoRepository';
import { FiltroCuentaContable, ReporteCentroCosto, DetalleCuentaContable } from '../../domain/entities/ReporteCentroCosto';
import * as XLSX from 'xlsx';

@injectable()
export class ReporteCentroCostoRepository implements IReporteCentroCostoRepository {
  /**
   * Obtiene el filtro de cuentas contables
   */
  async obtenerFiltroCuentasContables(conjunto: string): Promise<FiltroCuentaContable[]> {
    try {
      const query = `
        SELECT 
          A.cuenta_contable,
          A.descripcion,
          A.Uso_restringido
        FROM ${conjunto}.cuenta_contable A(NOLOCK)
        ORDER BY 1 ASC
      `;

      const [results] = await exactusSequelize.query(query);
      return results as FiltroCuentaContable[];
    } catch (error) {
      console.error('Error obteniendo filtro de cuentas contables:', error);
      throw new Error(`Error al obtener filtro de cuentas contables: ${error}`);
    }
  }

  /**
   * Obtiene el detalle de una cuenta contable específica
   */
  async obtenerDetalleCuentaContable(conjunto: string, cuentaContable: string): Promise<DetalleCuentaContable | null> {
    try {
      const query = `
        SELECT 
          descripcion,
          descripcion_ifrs,
          origen_conversion,
          conversion,
          acepta_datos,
          usa_centro_costo,
          tipo_cambio,
          acepta_unidades,
          unidad,
          uso_restringido,
          maneja_tercero
        FROM ${conjunto}.cuenta_contable (NOLOCK)
        WHERE cuenta_contable = :cuentaContable
      `;

      const [results] = await exactusSequelize.query(query, {
        replacements: { cuentaContable }
      });

      const result = results as DetalleCuentaContable[];
      return result.length > 0 ? result[0] || null : null;
    } catch (error) {
      console.error('Error obteniendo detalle de cuenta contable:', error);
      throw new Error(`Error al obtener detalle de cuenta contable: ${error}`);
    }
  }

  /**
   * Obtiene los centros de costo asociados a una cuenta contable
   */
  async obtenerCentrosCostoPorCuentaContable(
    conjunto: string, 
    cuentaContable: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    success: boolean;
    data: ReporteCentroCosto[];
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
    try {
      const offset = (page - 1) * limit;

      // Query para obtener el total de registros
      const countQuery = `
        SELECT COUNT(DISTINCT CC.centro_costo) as total
        FROM ${conjunto}.centro_costo CC(NOLOCK), ${conjunto}.centro_cuenta CNTCTA(NOLOCK)
        WHERE CNTCTA.centro_costo = CC.centro_costo 
        AND CNTCTA.cuenta_contable = :cuentaContable
      `;

      const [countResults] = await exactusSequelize.query(countQuery, {
        replacements: { cuentaContable }
      });

      const totalRecords = (countResults as any[])[0]?.total || 0;

      // Query para obtener los datos paginados
      const dataQuery = `
        SELECT DISTINCT 
          CC.centro_costo,
          CC.descripcion,
          CC.acepta_datos
        FROM ${conjunto}.centro_costo AS CC WITH (NOLOCK)
        INNER JOIN ${conjunto}.centro_cuenta AS CNTCTA WITH (NOLOCK)
          ON CNTCTA.centro_costo = CC.centro_costo
        WHERE CNTCTA.cuenta_contable = :cuentaContable
        ORDER BY CC.centro_costo ASC
        OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
      `;

      const [dataResults] = await exactusSequelize.query(dataQuery, {
        replacements: { 
          cuentaContable,
          offset,
          limit
        }
      });

      const totalPages = Math.ceil(totalRecords / limit);

      return {
        success: true,
        data: dataResults as ReporteCentroCosto[],
        pagination: {
          page,
          limit,
          total: totalRecords,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        message: "Datos obtenidos exitosamente"
      };
    } catch (error) {
      console.error('Error obteniendo centros de costo por cuenta contable:', error);
      throw new Error(`Error al obtener centros de costo por cuenta contable: ${error}`);
    }
  }

  /**
   * Obtiene el conteo total de centros de costo para una cuenta contable
   */
  async obtenerCentrosCostoCount(conjunto: string, cuentaContable: string): Promise<number> {
    try {
      const query = `
        SELECT COUNT(DISTINCT CC.centro_costo) as total
        FROM ${conjunto}.centro_costo CC(NOLOCK), ${conjunto}.centro_cuenta CNTCTA(NOLOCK)
        WHERE CNTCTA.centro_costo = CC.centro_costo 
        AND CNTCTA.cuenta_contable = :cuentaContable
      `;

      const [results] = await exactusSequelize.query(query, {
        replacements: { cuentaContable }
      });

      return (results as any[])[0]?.total || 0;
    } catch (error) {
      console.error('Error obteniendo conteo de centros de costo:', error);
      throw new Error(`Error al obtener conteo de centros de costo: ${error}`);
    }
  }

  async exportarExcel(conjunto: string, cuentaContable: string): Promise<Buffer> {
    try {
      console.log(`Generando Excel de centros de costo para conjunto ${conjunto}, cuenta ${cuentaContable}`);
      
      // Obtener todos los datos para el Excel
      const resultado = await this.obtenerCentrosCostoPorCuentaContable(conjunto, cuentaContable, 1, 10000);
      const centrosCosto = resultado.data;
      
      // Preparar los datos para Excel
      const excelData = centrosCosto.map(item => ({
        'Centro Costo': item.centro_costo || '',
        'Descripción': item.descripcion || '',
        'Acepta Datos': item.acepta_datos ? 'Sí' : 'No'
      }));

      // Agregar información de la cuenta contable
      const detalleCuenta = await this.obtenerDetalleCuentaContable(conjunto, cuentaContable);
      
      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Hoja 1: Centros de Costo
      const worksheet1 = XLSX.utils.json_to_sheet(excelData);
      
      // Configurar el ancho de las columnas
      const columnWidths1 = [
        { wch: 20 }, // Centro Costo
        { wch: 40 }, // Descripción
        { wch: 15 }  // Acepta Datos
      ];
      
      worksheet1['!cols'] = columnWidths1;
      XLSX.utils.book_append_sheet(workbook, worksheet1, 'Centros de Costo');
      
      // Hoja 2: Información de la Cuenta
      if (detalleCuenta) {
        const cuentaData = [{
          'Cuenta Contable': cuentaContable,
          'Descripción': detalleCuenta.descripcion || '',
          'Descripción IFRS': detalleCuenta.descripcion_ifrs || '',
          'Origen Conversión': detalleCuenta.origen_conversion || '',
          'Conversión': detalleCuenta.conversion || '',
          'Acepta Datos': detalleCuenta.acepta_datos ? 'Sí' : 'No',
          'Usa Centro Costo': detalleCuenta.usa_centro_costo ? 'Sí' : 'No',
          'Tipo Cambio': detalleCuenta.tipo_cambio || '',
          'Acepta Unidades': detalleCuenta.acepta_unidades ? 'Sí' : 'No',
          'Unidad': detalleCuenta.unidad || '',
          'Uso Restringido': detalleCuenta.uso_restringido ? 'Sí' : 'No',
          'Maneja Tercero': detalleCuenta.maneja_tercero ? 'Sí' : 'No'
        }];
        
        const worksheet2 = XLSX.utils.json_to_sheet(cuentaData);
        
        const columnWidths2 = [
          { wch: 20 }, // Cuenta Contable
          { wch: 40 }, // Descripción
          { wch: 30 }, // Descripción IFRS
          { wch: 20 }, // Origen Conversión
          { wch: 15 }, // Conversión
          { wch: 15 }, // Acepta Datos
          { wch: 20 }, // Usa Centro Costo
          { wch: 15 }, // Tipo Cambio
          { wch: 20 }, // Acepta Unidades
          { wch: 15 }, // Unidad
          { wch: 20 }, // Uso Restringido
          { wch: 20 }  // Maneja Tercero
        ];
        
        worksheet2['!cols'] = columnWidths2;
        XLSX.utils.book_append_sheet(workbook, worksheet2, 'Información Cuenta');
      }
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log('Archivo Excel de centros de costo generado exitosamente');
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel de centros de costo:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
