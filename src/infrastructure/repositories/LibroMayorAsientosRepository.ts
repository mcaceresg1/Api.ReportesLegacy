import { injectable } from 'inversify';
import { QueryTypes } from 'sequelize';
import { exactusSequelize } from '../database/config/exactus-database';
import { ILibroMayorAsientosRepository } from '../../domain/repositories/ILibroMayorAsientosRepository';
import { LibroMayorAsientos, LibroMayorAsientosRequest, LibroMayorAsientosResponse, FiltroAsientosResponse } from '../../domain/entities/LibroMayorAsientos';
import * as XLSX from 'xlsx';

@injectable()
export class LibroMayorAsientosRepository implements ILibroMayorAsientosRepository {

  /**
   * Obtiene los filtros disponibles (asientos y referencias)
   */
  async obtenerFiltros(conjunto: string): Promise<FiltroAsientosResponse> {
    try {
      const query = `
        SELECT DISTINCT asiento, referencia 
        FROM ${conjunto}.mayor(NOLOCK)
        ORDER BY 1 ASC
      `;

      const resultado = await exactusSequelize.query(query, { type: QueryTypes.SELECT });
      
      return {
        success: true,
        data: resultado as { asiento: string; referencia: string }[],
        message: 'Filtros obtenidos exitosamente'
      };

    } catch (error) {
      console.error('Error al obtener filtros de asientos:', error);
      return {
        success: false,
        data: [],
        message: 'Error al obtener filtros'
      };
    }
  }

  /**
   * Genera el reporte de Libro Mayor Asientos
   */
  async generarReporteAsientos(request: LibroMayorAsientosRequest): Promise<LibroMayorAsientosResponse> {
    try {
      // Primero crear una tabla temporal para almacenar los resultados
      const createTempTableQuery = `
        IF OBJECT_ID('tempdb..#TEMP_ASIENTOS') IS NOT NULL DROP TABLE #TEMP_ASIENTOS;
        
        CREATE TABLE #TEMP_ASIENTOS (
          asiento VARCHAR(20),
          fuente VARCHAR(10),
          fecha DATETIME,
          nit VARCHAR(20),
          debito_local DECIMAL(18,2),
          credito_local DECIMAL(18,2),
          debito_dolar DECIMAL(18,2),
          credito_dolar DECIMAL(18,2),
          referencia VARCHAR(100),
          tipo_asiento VARCHAR(10),
          cuenta_contable VARCHAR(20),
          descripcion VARCHAR(150),
          centro_costo VARCHAR(20),
          descripcion_centro_costo VARCHAR(150)
        );
      `;

      await exactusSequelize.query(createTempTableQuery);

      // Insertar datos en la tabla temporal usando el query principal
      const insertQuery = `
        INSERT INTO #TEMP_ASIENTOS
        SELECT 
          M.asiento, 
          M.fuente, 
          M.fecha, 
          M.nit, 
          M.debito_local, 
          M.credito_local,
          M.debito_dolar, 
          M.credito_dolar, 
          M.referencia, 
          M.tipo_asiento,
          M.cuenta_contable, 
          CTA.descripcion, 
          M.centro_costo, 
          CC.descripcion
        FROM ${request.conjunto}.mayor M
        JOIN ${request.conjunto}.cuenta_contable CTA ON M.cuenta_contable = CTA.cuenta_contable 
        JOIN ${request.conjunto}.centro_costo CC ON M.centro_costo = CC.centro_costo
        WHERE 1=1
        ${request.asiento ? `AND M.asiento = '${request.asiento}'` : ''}
        ${request.referencia ? `AND M.referencia LIKE '%${request.referencia}%'` : ''}
        ORDER BY M.asiento, M.fecha
      `;

      await exactusSequelize.query(insertQuery);

      // Obtener el total de registros
      const countQuery = `SELECT COUNT(*) as total FROM #TEMP_ASIENTOS`;
      const countResult = await exactusSequelize.query(countQuery, { type: QueryTypes.SELECT });
      const total = (countResult[0] as any).total;

      // Obtener datos paginados
      const offset = ((request.page || 1) - 1) * (request.limit || 25);
      const selectQuery = `
        SELECT * FROM #TEMP_ASIENTOS
        ORDER BY asiento, fecha
        OFFSET ${offset} ROWS
        FETCH NEXT ${request.limit || 25} ROWS ONLY
      `;

      const resultado = await exactusSequelize.query(selectQuery, { type: QueryTypes.SELECT });

      // Limpiar tabla temporal
      await exactusSequelize.query('DROP TABLE #TEMP_ASIENTOS');

      const totalPages = Math.ceil(total / (request.limit || 25));
      const currentPage = request.page || 1;

      return {
        success: true,
        data: resultado as LibroMayorAsientos[],
        pagination: {
          page: currentPage,
          limit: request.limit || 25,
          total,
          totalPages,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1
        },
        message: 'Reporte generado exitosamente'
      };

    } catch (error) {
      console.error('Error al generar reporte de asientos:', error);
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
        message: 'Error al generar reporte'
      };
    }
  }

  /**
   * Obtiene los datos paginados del reporte
   */
  async obtenerAsientos(request: LibroMayorAsientosRequest): Promise<LibroMayorAsientosResponse> {
    return await this.generarReporteAsientos(request);
  }

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(request: LibroMayorAsientosRequest): Promise<Buffer> {
    try {
      // Obtener todos los datos sin paginación para el Excel
      const allDataRequest = { ...request, page: 1, limit: 999999 };
      const response = await this.generarReporteAsientos(allDataRequest);

      if (!response.success || !response.data.length) {
        throw new Error('No hay datos para exportar');
      }

      // Crear workbook y worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(response.data);

      // Configurar columnas
      const columnWidths = [
        { wch: 15 }, // asiento
        { wch: 10 }, // fuente
        { wch: 12 }, // fecha
        { wch: 15 }, // nit
        { wch: 15 }, // debito_local
        { wch: 15 }, // credito_local
        { wch: 15 }, // debito_dolar
        { wch: 15 }, // credito_dolar
        { wch: 20 }, // referencia
        { wch: 12 }, // tipo_asiento
        { wch: 20 }, // cuenta_contable
        { wch: 30 }, // descripcion
        { wch: 15 }, // centro_costo
        { wch: 30 }  // descripcion_centro_costo
      ];

      worksheet['!cols'] = columnWidths;

      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Libro Mayor Asientos');

      // Generar buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      return buffer;

    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      throw error;
    }
  }

  /**
   * Exporta el reporte a PDF
   */
  async exportarPDF(request: LibroMayorAsientosRequest): Promise<Buffer> {
    try {
      // Obtener todos los datos sin paginación para el PDF
      const allDataRequest = { ...request, page: 1, limit: 999999 };
      const response = await this.generarReporteAsientos(allDataRequest);

      if (!response.success || !response.data.length) {
        throw new Error('No hay datos para exportar');
      }

      // Por ahora retornamos un buffer vacío ya que la generación de PDF
      // requiere implementación adicional con librerías como puppeteer o similar
      // TODO: Implementar generación de PDF
      return Buffer.from('PDF no implementado aún');

    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      throw error;
    }
  }
}
