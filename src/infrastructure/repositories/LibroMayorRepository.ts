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
      const { conjunto, usuario, fechaDesde, fechaHasta, cuentaContableDesde, cuentaContableHasta, saldoAntesCierre, page = 1, limit = 25 } = filtros;
      
      // Query principal basada en las queries SQL proporcionadas
      const query = `
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
            ${cuentaContableDesde ? 'AND may.cuenta_contable >= @cuentaContableDesde' : ''}
            ${cuentaContableHasta ? 'AND may.cuenta_contable <= @cuentaContableHasta' : ''}
            AND cta.tipo_detallado IN ('A','P','T','I','G','O')
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
      
      const replacements: any = {
        fechaDesde,
        fechaHasta,
        offset,
        limit
      };

      if (cuentaContableDesde) replacements.cuentaContableDesde = cuentaContableDesde;
      if (cuentaContableHasta) replacements.cuentaContableHasta = cuentaContableHasta;

      const data = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements
      });

      // Query para obtener el total
      const countQuery = `
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
            ${cuentaContableDesde ? 'AND may.cuenta_contable >= @cuentaContableDesde' : ''}
            ${cuentaContableHasta ? 'AND may.cuenta_contable <= @cuentaContableHasta' : ''}
            AND cta.tipo_detallado IN ('A','P','T','I','G','O')
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

      const totalResult = await exactusSequelize.query(countQuery, {
        type: QueryTypes.SELECT,
        replacements: {
          fechaDesde,
          fechaHasta,
          cuentaContableDesde: cuentaContableDesde || '',
          cuentaContableHasta: cuentaContableHasta || ''
        }
      });

      const total = (totalResult[0] as any).total;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        message: 'Reporte generado exitosamente',
        data: data as LibroMayor[],
        total,
        page,
        limit,
        totalPages
      };

    } catch (error) {
      console.error('Error en generarReporte LibroMayor:', error);
      throw new Error(`Error al generar reporte de Libro Mayor: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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
