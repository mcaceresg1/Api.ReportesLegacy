import { injectable } from 'inversify';
import { IReporteCatalogoCuentasModificadasRepository } from '../../domain/repositories/IReporteCatalogoCuentasModificadasRepository';
import { ReporteCatalogoCuentasModificadas, FiltrosCatalogoCuentasModificadas } from '../../domain/entities/ReporteCatalogoCuentasModificadas';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';
import * as XLSX from 'xlsx';

@injectable()
export class ReporteCatalogoCuentasModificadasRepository implements IReporteCatalogoCuentasModificadasRepository {
  
  async obtenerCatalogoCuentasModificadas(
    conjunto: string,
    filtros: FiltrosCatalogoCuentasModificadas
  ): Promise<ReporteCatalogoCuentasModificadas[]> {
    try {
      // Implementación básica del método
      const query = `
        SELECT TOP 100
          CC.cuenta_contable as CuentaContable,
          CC.descripcion as CuentaContableDesc,
          CC.usuario as UsuarioCreacion,
          CC.fecha_hora as FechaCreacion,
          CC.usuario_ult_mod as UsuarioModificacion,
          CC.fch_hora_ult_mod as FechaModificacion
        FROM ${conjunto}.cuenta_contable CC WITH (NOLOCK)
        WHERE CC.usuario IS NOT NULL OR CC.usuario_ult_mod IS NOT NULL
        ORDER BY CC.cuenta_contable ASC
      `;
      
      const resultados = await exactusSequelize.query(query, { 
        type: QueryTypes.SELECT 
      });
      
      return resultados as ReporteCatalogoCuentasModificadas[];
    } catch (error) {
      console.error('Error al obtener catálogo de cuentas modificadas:', error);
      throw new Error('Error al obtener catálogo de cuentas modificadas');
    }
  }

  async exportarExcel(conjunto: string, filtros: FiltrosCatalogoCuentasModificadas): Promise<Buffer> {
    try {
      console.log(`Generando Excel de catálogo de cuentas modificadas para conjunto ${conjunto}`);
      
      // Obtener todos los datos para el Excel
      const datos = await this.obtenerCatalogoCuentasModificadas(conjunto, filtros);
      
      // Preparar los datos para Excel
      const excelData = datos.map(item => ({
        'Cuenta Contable': item.CuentaContable || '',
        'Descripción': item.CuentaContableDesc || '',
        'Usuario Creación': item.UsuarioCreacion || '',
        'Fecha Creación': item.FechaCreacion ? new Date(item.FechaCreacion).toLocaleDateString('es-ES') : '',
        'Usuario Modificación': item.UsuarioModificacion || '',
        'Fecha Modificación': item.FechaModificacion ? new Date(item.FechaModificacion).toLocaleDateString('es-ES') : ''
      }));

      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Crear la hoja principal con los datos
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 25 }, // Cuenta Contable
        { wch: 50 }, // Descripción
        { wch: 20 }, // Usuario Creación
        { wch: 15 }, // Fecha Creación
        { wch: 20 }, // Usuario Modificación
        { wch: 15 }  // Fecha Modificación
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Catálogo Cuentas Modificadas');
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log('Archivo Excel de catálogo de cuentas modificadas generado exitosamente');
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel de catálogo de cuentas modificadas:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
