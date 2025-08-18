import { injectable } from 'inversify';
import { IReporteCuentaContableModificadaRepository } from '../../domain/repositories/IReporteCuentaContableModificadaRepository';
import { ReporteCuentaContableModificada } from '../../domain/entities/ReporteCuentaContableModificada';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';
import * as XLSX from 'xlsx';

@injectable()
export class ReporteCuentaContableModificadaRepository implements IReporteCuentaContableModificadaRepository {
  async obtenerCuentasContablesModificadas(
    conjunto: string,
    fechaInicio?: Date,
    fechaFin?: Date
  ): Promise<ReporteCuentaContableModificada[]> {
    try {
      let whereClause = '1 = 1';
      const replacements: any = {};

      if (fechaInicio && fechaFin) {
        whereClause += ' AND (cc.fecha_hora BETWEEN :fechaInicio AND :fechaFin OR cc.fch_hora_ult_mod BETWEEN :fechaInicio AND :fechaFin)';
        replacements.fechaInicio = fechaInicio;
        replacements.fechaFin = fechaFin;
      }

      const query = `
        SELECT 
          cc.cuenta_contable as "CuentaContable",
          cc.descripcion as "CuentaContableDesc",
          cc.usuario as "UsuarioCreacion",
          uc.nombre as "UsuarioCreacionDesc",
          cc.fecha_hora as "FechaCreacion",
          cc.usuario_ult_mod as "UsuarioModificacion",
          um.nombre as "UsuarioModificacionDesc",
          cc.fch_hora_ult_mod as "FechaModificacion"
        FROM ${conjunto}.cuenta_contable cc WITH (NOLOCK)
        LEFT OUTER JOIN ERPADMIN.usuario uc WITH (NOLOCK)
          ON cc.usuario = uc.usuario
        LEFT OUTER JOIN ERPADMIN.usuario um WITH (NOLOCK)
          ON cc.usuario_ult_mod = um.usuario
        WHERE ${whereClause}
        ORDER BY cc.cuenta_contable ASC
      `;

      const resultados = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements
      });

      return resultados as ReporteCuentaContableModificada[];
    } catch (error) {
      console.error('Error al obtener cuentas contables modificadas:', error);
      throw new Error('Error al obtener cuentas contables modificadas');
    }
  }

  async exportarExcel(conjunto: string, fechaInicio?: Date, fechaFin?: Date): Promise<Buffer> {
    try {
      console.log(`Generando Excel de cuentas contables modificadas para conjunto ${conjunto}`);
      
      // Obtener todos los datos para el Excel
      const cuentas = await this.obtenerCuentasContablesModificadas(conjunto, fechaInicio, fechaFin);
      
      // Preparar los datos para Excel
      const excelData = cuentas.map(item => ({
        'Cuenta Contable': item.CuentaContable || '',
        'Descripción': item.CuentaContableDesc || '',
        'Usuario Creación': item.UsuarioCreacion || '',
        'Nombre Usuario Creación': item.UsuarioCreacionDesc || '',
        'Fecha Creación': item.FechaCreacion ? new Date(item.FechaCreacion).toLocaleDateString('es-ES') : '',
        'Usuario Modificación': item.UsuarioModificacion || '',
        'Nombre Usuario Modificación': item.UsuarioModificacionDesc || '',
        'Fecha Modificación': item.FechaModificacion ? new Date(item.FechaModificacion).toLocaleDateString('es-ES') : ''
      }));

      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Crear la hoja principal con los datos
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 20 }, // Cuenta Contable
        { wch: 40 }, // Descripción
        { wch: 20 }, // Usuario Creación
        { wch: 30 }, // Nombre Usuario Creación
        { wch: 15 }, // Fecha Creación
        { wch: 20 }, // Usuario Modificación
        { wch: 30 }, // Nombre Usuario Modificación
        { wch: 15 }  // Fecha Modificación
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Cuentas Contables Modificadas');
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log('Archivo Excel de cuentas contables modificadas generado exitosamente');
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel de cuentas contables modificadas:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
