import { injectable } from 'inversify';
import { IReporteComparativoCentrosCostoRepository } from '../../domain/repositories/IReporteComparativoCentrosCostoRepository';
import { ReporteComparativoCentrosCosto, FiltrosComparativoCentrosCosto } from '../../domain/entities/ReporteComparativoCentrosCosto';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';
import * as XLSX from 'xlsx';

@injectable()
export class ReporteComparativoCentrosCostoRepository implements IReporteComparativoCentrosCostoRepository {
  
  async obtenerComparativoCentrosCosto(
    conjunto: string,
    filtros: FiltrosComparativoCentrosCosto
  ): Promise<ReporteComparativoCentrosCosto[]> {
    try {
      // Implementación básica del método
      const query = `
        SELECT TOP 100
          CC.centro_costo as CentroCosto,
          CC.descripcion as Descripcion,
          CC.acepta_datos as AceptaDatos,
          CC.tipo as Tipo
        FROM ${conjunto}.centro_costo CC WITH (NOLOCK)
        ORDER BY CC.centro_costo ASC
      `;
      
      const resultados = await exactusSequelize.query(query, { 
        type: QueryTypes.SELECT 
      });
      
      return resultados as ReporteComparativoCentrosCosto[];
    } catch (error) {
      console.error('Error al obtener comparativo de centros de costo:', error);
      throw new Error('Error al obtener comparativo de centros de costo');
    }
  }

  async exportarExcel(conjunto: string, filtros: FiltrosComparativoCentrosCosto): Promise<Buffer> {
    try {
      console.log(`Generando Excel de comparativo de centros de costo para conjunto ${conjunto}`);
      
      // Obtener todos los datos para el Excel
      const datos = await this.obtenerComparativoCentrosCosto(conjunto, filtros);
      
      // Preparar los datos para Excel
      const excelData = datos.map(item => ({
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
