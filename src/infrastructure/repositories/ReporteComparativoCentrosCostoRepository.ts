import { injectable } from 'inversify';
import { IReporteComparativoCentrosCostoRepository, ReporteComparativoCentrosCostoResponse } from '../../domain/repositories/IReporteComparativoCentrosCostoRepository';
import { ReporteComparativoCentrosCosto, FiltrosComparativoCentrosCosto } from '../../domain/entities/ReporteComparativoCentrosCosto';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';
import * as XLSX from 'xlsx';

@injectable()
export class ReporteComparativoCentrosCostoRepository implements IReporteComparativoCentrosCostoRepository {
  
  async obtenerComparativoCentrosCosto(
    conjunto: string,
    filtros: FiltrosComparativoCentrosCosto,
    page: number = 1,
    limit: number = 25
  ): Promise<ReporteComparativoCentrosCostoResponse> {
    try {
      // Construir condiciones WHERE dinámicas
      let whereConditions = 'WHERE 1=1';
      const replacements: any = {};

      if (filtros.centroCosto) {
        whereConditions += ' AND CC.centro_costo LIKE :centroCosto';
        replacements.centroCosto = `%${filtros.centroCosto}%`;
      }

      if (filtros.cuentaContable) {
        whereConditions += ' AND CC.cuenta_contable LIKE :cuentaContable';
        replacements.cuentaContable = `%${filtros.cuentaContable}%`;
      }

      if (filtros.nit) {
        whereConditions += ' AND CC.nit LIKE :nit';
        replacements.nit = `%${filtros.nit}%`;
      }

      if (filtros.dimension) {
        whereConditions += ' AND CC.dimension LIKE :dimension';
        replacements.dimension = `%${filtros.dimension}%`;
      }

      // Query para obtener el total de registros
      const countQuery = `
        SELECT COUNT(*) as total
        FROM ${conjunto}.centro_costo CC WITH (NOLOCK)
        ${whereConditions}
      `;

      const [countResult] = await exactusSequelize.query(countQuery, {
        type: QueryTypes.SELECT,
        replacements
      }) as [{ total: number }];

      const totalRecords = countResult?.total || 0;

      // Calcular offset para paginación
      const offset = (page - 1) * limit;

      // Query principal con paginación
      const dataQuery = `
        SELECT 
          CC.centro_costo as CentroCosto,
          CC.descripcion as Descripcion,
          CC.acepta_datos as AceptaDatos,
          CC.tipo as Tipo
        FROM ${conjunto}.centro_costo CC WITH (NOLOCK)
        ${whereConditions}
        ORDER BY CC.centro_costo ASC
        OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
      `;
      
      const resultados = await exactusSequelize.query(dataQuery, { 
        type: QueryTypes.SELECT,
        replacements
      }) as ReporteComparativoCentrosCosto[];

      const totalPages = Math.ceil(totalRecords / limit);

      return {
        success: true,
        data: resultados,
        pagination: {
          page,
          limit,
          total: totalRecords,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        message: `Comparativo de centros de costo obtenido exitosamente: ${resultados.length} de ${totalRecords} registros`
      };
    } catch (error) {
      console.error('Error al obtener comparativo de centros de costo:', error);
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
        message: `Error al obtener comparativo de centros de costo: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  async exportarExcel(conjunto: string, filtros: FiltrosComparativoCentrosCosto): Promise<Buffer> {
    try {
      console.log(`Generando Excel de comparativo de centros de costo para conjunto ${conjunto}`);
      
      // Obtener todos los datos para el Excel (sin paginación)
      const response = await this.obtenerComparativoCentrosCosto(conjunto, filtros, 1, 10000);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      // Preparar los datos para Excel
      const excelData = response.data.map(item => ({
        'Centro Costo': item.CentroCosto || '',
        'Descripción': item.Descripcion || '',
        'Acepta Datos': item.AceptaDatos ? 'Sí' : 'No',
        'Tipo': item.Tipo || ''
      }));

      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Crear la hoja principal con los datos
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 20 }, // Centro Costo
        { wch: 40 }, // Descripción
        { wch: 15 }, // Acepta Datos
        { wch: 20 }  // Tipo
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Comparativo Centros de Costo');
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log('Archivo Excel de comparativo de centros de costo generado exitosamente');
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel de comparativo de centros de costo:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
