import { injectable } from 'inversify';
import { QueryTypes, Op } from 'sequelize';
import { ILibroMayorRepository } from '../../domain/repositories/ILibroMayorRepository';
import { LibroMayor, LibroMayorFiltros, LibroMayorResponse } from '../../domain/entities/LibroMayor';
import { exactusSequelize } from '../database/config/exactus-database';
import * as XLSX from 'xlsx';

@injectable()
export class LibroMayorRepository implements ILibroMayorRepository {
  
  async generarReporte(filtros: LibroMayorFiltros): Promise<LibroMayorResponse> {
    try {
      console.log('🔍 Iniciando generarReporte LibroMayor con filtros:', JSON.stringify(filtros, null, 2));
      
      const { conjunto, usuario, fechaDesde, fechaHasta, cuentaContableDesde, cuentaContableHasta, saldoAntesCierre, page = 1, limit = 25 } = filtros;
      
      console.log('📊 Parámetros extraídos:', { conjunto, usuario, fechaDesde, fechaHasta, cuentaContableDesde, cuentaContableHasta, saldoAntesCierre, page, limit });
      
      // Construir la consulta de manera más simple y segura
      let query = `
        WITH LibroMayorData AS (
          SELECT 
            may.cuenta_contable as cuentaContable,
            may.centro_costo as centroCosto,
            cta.acepta_datos as aceptaDatos,
            cta.descripcion as descripcion,
            cta.saldo_normal as saldoNormal,
            CONVERT(VARCHAR(10), may.FECHA, 23) as fecha,
            am.fecha_creacion as fechaCreacion,
            'asiento' as tipo,
            SUM(may.debito_local) as debitoLocal,
            SUM(may.credito_local) as creditoLocal,
            0 as saldoInicialLocal,
            0 as saldoFinalLocal
          FROM ${conjunto}.mayor may
          JOIN ${conjunto}.asiento_mayorizado am ON may.ASIENTO = am.ASIENTO
          JOIN ${conjunto}.cuenta_contable cta ON may.cuenta_contable = cta.cuenta_contable
          WHERE may.fecha >= @fechaDesde 
            AND may.fecha <= @fechaHasta
            AND may.contabilidad IN ('F', 'A')
            AND cta.tipo_detallado IN ('A','P','T','I','G','O')`;

      // Agregar filtros de cuenta contable solo si están presentes
      if (cuentaContableDesde) {
        query += `\n            AND may.cuenta_contable >= @cuentaContableDesde`;
      }
      
      if (cuentaContableHasta) {
        query += `\n            AND may.cuenta_contable <= @cuentaContableHasta`;
      }

      query += `
          GROUP BY may.centro_costo, cta.acepta_datos, cta.SALDO_NORMAL, 
                   CONVERT(VARCHAR(10), may.FECHA, 23), am.fecha_creacion, may.cuenta_contable
          
          UNION ALL
          
          SELECT 
            cta.cuenta_contable as cuentaContable,
            '' as centroCosto,
            cta.acepta_datos as aceptaDatos,
            cta.descripcion as descripcion,
            cta.saldo_normal as saldoNormal,
            '1980-1-1' as fecha,
            '1980-1-1' as fechaCreacion,
            '' as tipo,
            0 as debitoLocal,
            0 as creditoLocal,
            0 as saldoInicialLocal,
            0 as saldoFinalLocal
          FROM ${conjunto}.cuenta_contable cta
          WHERE cta.cuenta_contable IN (
            SELECT may.cuenta_contable
            FROM ${conjunto}.mayor may
            WHERE may.cuenta_contable NOT IN (
              SELECT may.cuenta_contable 
              FROM ${conjunto}.mayor may
              WHERE may.contabilidad IN ('F', 'A')
                AND may.fecha >= @fechaDesde 
                AND may.fecha <= @fechaHasta
            )
            AND may.fecha < @fechaDesde
          )
          AND cta.tipo_detallado IN ('A','P','T','I','G','O')
        )
        SELECT 
          cuentaContable,
          centroCosto,
          descripcion,
          saldoNormal,
          fecha,
          fechaCreacion,
          tipo,
          debitoLocal,
          creditoLocal,
          saldoInicialLocal,
          saldoFinalLocal
        FROM LibroMayorData
        ORDER BY cuentaContable, fecha, tipo
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `;

      const offset = (page - 1) * limit;
      
      // Construir replacements solo con los parámetros que se usan
      const replacements: any = {
        fechaDesde,
        fechaHasta,
        offset,
        limit
      };

      if (cuentaContableDesde) {
        replacements.cuentaContableDesde = cuentaContableDesde;
      }
      
      if (cuentaContableHasta) {
        replacements.cuentaContableHasta = cuentaContableHasta;
      }
      
      console.log('🔧 Query SQL generado:', query);
      console.log('🔧 Replacements:', JSON.stringify(replacements, null, 2));
      console.log('🔧 Conjunto:', conjunto);

      console.log('📡 Ejecutando query principal...');
      const data = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements
      });
      console.log('✅ Query principal ejecutado exitosamente. Registros obtenidos:', data.length);

      // Query para obtener el total - también construido de manera simple
      let countQuery = `
        SELECT COUNT(*) as total
        FROM (
          SELECT 
            may.cuenta_contable
          FROM ${conjunto}.mayor may
          JOIN ${conjunto}.asiento_mayorizado am ON may.ASIENTO = am.ASIENTO
          JOIN ${conjunto}.cuenta_contable cta ON may.cuenta_contable = cta.cuenta_contable
          WHERE may.fecha >= @fechaDesde 
            AND may.fecha <= @fechaHasta
            AND may.contabilidad IN ('F', 'A')
            AND cta.tipo_detallado IN ('A','P','T','I','G','O')`;

      if (cuentaContableDesde) {
        countQuery += `\n            AND may.cuenta_contable >= @cuentaContableDesde`;
      }
      
      if (cuentaContableHasta) {
        countQuery += `\n            AND may.cuenta_contable <= @cuentaContableHasta`;
      }

      countQuery += `
          GROUP BY may.centro_costo, cta.acepta_datos, cta.SALDO_NORMAL, 
                   CONVERT(VARCHAR(10), may.FECHA, 23), am.fecha_creacion, may.cuenta_contable
          
          UNION ALL
          
          SELECT 
            cta.cuenta_contable
          FROM ${conjunto}.cuenta_contable cta
          WHERE cta.cuenta_contable IN (
            SELECT may.cuenta_contable
            FROM ${conjunto}.mayor may
            WHERE may.cuenta_contable NOT IN (
              SELECT may.cuenta_contable 
              FROM ${conjunto}.mayor may
              WHERE may.contabilidad IN ('F', 'A')
                AND may.fecha >= @fechaDesde 
                AND may.fecha <= @fechaHasta
            )
            AND may.fecha < @fechaDesde
          )
          AND cta.tipo_detallado IN ('A','P','T','I','G','O')
        ) as totalData
      `;

      console.log('📡 Ejecutando query de conteo...');
      const totalResult = await exactusSequelize.query(countQuery, {
        type: QueryTypes.SELECT,
        replacements
      });
      console.log('✅ Query de conteo ejecutado exitosamente. Resultado:', totalResult);

      const total = (totalResult[0] as any).total;
      const totalPages = Math.ceil(total / limit);
      
      console.log('📊 Cálculos finales:', { total, totalPages, page, limit });

      const response = {
        success: true,
        message: 'Reporte generado exitosamente',
        data: data as LibroMayor[],
        total,
        page,
        limit,
        totalPages
      };
      
      console.log('🎉 Respuesta final generada:', { success: response.success, total: response.total, dataLength: response.data.length });
      return response;

    } catch (error) {
      console.error('❌ Error en generarReporte LibroMayor:', error);
      console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error constructor:', error?.constructor?.name);
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ Error message:', errorMessage);
      
      throw new Error(`Error al generar reporte de Libro Mayor: ${errorMessage}`);
    }
  }

  async obtenerLibroMayor(filtros: LibroMayorFiltros): Promise<LibroMayorResponse> {
    return this.generarReporte(filtros);
  }

  async exportarExcel(filtros: LibroMayorFiltros): Promise<Buffer> {
    try {
      const response = await this.generarReporte({ ...filtros, page: 1, limit: 1000000 }); // Sin límite para exportar todo
      
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(response.data.map(item => ({
        'Cuenta Contable': item.cuentaContable,
        'Centro Costo': item.centroCosto,
        'Descripción': item.descripcion,
        'Saldo Normal': item.saldoNormal,
        'Fecha': item.fecha,
        'Fecha Creación': item.fechaCreacion,
        'Tipo': item.tipo,
        'Débito Local': item.debitoLocal,
        'Crédito Local': item.creditoLocal,
        'Saldo Inicial Local': item.saldoInicialLocal,
        'Saldo Final Local': item.saldoFinalLocal
      })));

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Libro Mayor');
      
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      return buffer;

    } catch (error) {
      console.error('Error en exportarExcel LibroMayor:', error);
      throw new Error(`Error al exportar Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async exportarPDF(filtros: LibroMayorFiltros): Promise<Buffer> {
    try {
      const response = await this.generarReporte({ ...filtros, page: 1, limit: 1000000 }); // Sin límite para exportar todo
      
      // Por ahora retornamos un buffer vacío, se puede implementar PDF más adelante
      const pdfContent = `Libro Mayor - ${filtros.conjunto}\nPeríodo: ${filtros.fechaDesde} - ${filtros.fechaHasta}\n\n`;
      
      const dataContent = response.data.map(item => 
        `${item.cuentaContable} | ${item.centroCosto} | ${item.descripcion} | ${item.debitoLocal} | ${item.creditoLocal}`
      ).join('\n');
      
      return Buffer.from(pdfContent + dataContent, 'utf-8');

    } catch (error) {
      console.error('Error en exportarPDF LibroMayor:', error);
      throw new Error(`Error al exportar PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
