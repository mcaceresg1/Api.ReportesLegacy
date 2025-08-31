import { ILibroMayorContabilidadRepository } from '../../domain/repositories/ILibroMayorContabilidadRepository';
import { LibroMayorContabilidad, FiltrosLibroMayorContabilidad } from '../../domain/entities/LibroMayorContabilidad';
import { inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { DatabaseConnection } from '../database/DatabaseConnection';
import { QueryResult } from 'pg';

@injectable()
export class LibroMayorContabilidadRepository implements ILibroMayorContabilidadRepository {
  constructor(
    @inject(TYPES.DatabaseConnection)
    private readonly dbConnection: DatabaseConnection
  ) {}

  // Métodos básicos CRUD
  async getAll(): Promise<LibroMayorContabilidad[]> {
    try {
      const query = `
        SELECT * FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        ORDER BY PERIODO_CONTABLE, CUENTA_CONTABLE, TIPO_LINEA, FECHA, ASIENTO
      `;
      
      const result = await this.dbConnection.query(query);
      return this.mapResultToEntity(result.rows);
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<LibroMayorContabilidad | null> {
    try {
      const query = `
        SELECT * FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        WHERE ROW_ORDER_BY = $1
      `;
      
      const result = await this.dbConnection.query(query, [id]);
      const rows = this.mapResultToEntity(result.rows);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error en getById:', error);
      throw error;
    }
  }

  async create(entity: LibroMayorContabilidad): Promise<LibroMayorContabilidad> {
    try {
      const query = `
        INSERT INTO PRLTRA.R_XML_8DDC3925E54E9CF (
          SALDO_ACREEDOR_DOLAR, CREDITO_DOLAR_MAYOR, CORRELATIVO_ASIENTO,
          SALDO_DEUDOR_DOLAR, DEBITO_DOLAR_MAYOR, CUENTA_CONTABLE,
          SALDO_ACREEDOR, CREDITO_DOLAR, CREDITO_LOCAL, SALDO_DEUDOR,
          DEBITO_DOLAR, DEBITO_LOCAL, CENTRO_COSTO, TIPO_ASIENTO,
          DESCRIPCION, CONSECUTIVO, REFERENCIA, NIT_NOMBRE, DOCUMENTO,
          CREDITO, ASIENTO, DEBITO, FECHA, TIPO, NIT, FUENTE
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
        RETURNING *
      `;
      
      const values = [
        entity.saldoAcreedorDolar, entity.creditoDolarMayor, entity.correlativoAsiento,
        entity.saldoDeudorDolar, entity.debitoDolarMayor, entity.cuentaContable,
        entity.saldoAcreedor, entity.creditoDolar, entity.creditoLocal, entity.saldoDeudor,
        entity.debitoDolar, entity.debitoLocal, entity.centroCosto, entity.tipoAsiento,
        entity.descripcion, entity.consecutivo, entity.referencia, entity.nitNombre, entity.documento,
        entity.credito, entity.asiento, entity.debito, entity.fecha, entity.tipo, entity.nit, entity.fuente
      ];
      
      const result = await this.dbConnection.query(query, values);
      const rows = this.mapResultToEntity(result.rows);
      return rows[0];
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async update(id: number, entity: Partial<LibroMayorContabilidad>): Promise<LibroMayorContabilidad> {
    try {
      const setClause: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      // Construir dinámicamente la cláusula SET
      Object.entries(entity).forEach(([key, value]) => {
        if (value !== undefined) {
          const dbColumn = this.mapEntityFieldToDbColumn(key);
          if (dbColumn) {
            setClause.push(`${dbColumn} = $${paramIndex}`);
            values.push(value);
            paramIndex++;
          }
        }
      });

      if (setClause.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      values.push(id);
      const query = `
        UPDATE PRLTRA.R_XML_8DDC3925E54E9CF 
        SET ${setClause.join(', ')}
        WHERE ROW_ORDER_BY = $${paramIndex}
        RETURNING *
      `;
      
      const result = await this.dbConnection.query(query, values);
      const rows = this.mapResultToEntity(result.rows);
      return rows[0];
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `
        DELETE FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        WHERE ROW_ORDER_BY = $1
      `;
      
      const result = await this.dbConnection.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }

  // Métodos específicos del negocio
  async generarReporte(
    usuario: string, 
    filtros: FiltrosLibroMayorContabilidad, 
    fechaInicial: string, 
    fechaFinal: string
  ): Promise<number> {
    try {
      // Limpiar reporte anterior del usuario
      await this.limpiarReporte(usuario);

      // Ejecutar el procedimiento de generación del reporte
      const query = `
        EXEC PRLTRA.RP_XML_8DDC3925E54E9CF 
        @usuario = $1, 
        @fechaInicial = $2, 
        @fechaFinal = $3
      `;
      
      const result = await this.dbConnection.query(query, [usuario, fechaInicial, fechaFinal]);
      
      // Obtener el número de registros generados
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        WHERE USUARIO = $1
      `;
      
      const countResult = await this.dbConnection.query(countQuery, [usuario]);
      return parseInt(countResult.rows[0].total);
    } catch (error) {
      console.error('Error en generarReporte:', error);
      throw error;
    }
  }

  async limpiarReporte(usuario: string): Promise<number> {
    try {
      const query = `
        DELETE FROM PRLTRA.REPCG_MAYOR 
        WHERE USUARIO = $1
      `;
      
      const result = await this.dbConnection.query(query, [usuario]);
      return result.rowCount;
    } catch (error) {
      console.error('Error en limpiarReporte:', error);
      throw error;
    }
  }

  async obtenerReporteGenerado(usuario: string): Promise<LibroMayorContabilidad[]> {
    try {
      const query = `
        SELECT * FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        WHERE USUARIO = $1
        ORDER BY PERIODO_CONTABLE, CUENTA_CONTABLE, TIPO_LINEA, FECHA, ASIENTO
      `;
      
      const result = await this.dbConnection.query(query, [usuario]);
      return this.mapResultToEntity(result.rows);
    } catch (error) {
      console.error('Error en obtenerReporteGenerado:', error);
      throw error;
    }
  }

  // Métodos de consulta con filtros
  async getByFiltros(
    filtros: FiltrosLibroMayorContabilidad, 
    page: number = 1, 
    limit: number = 50
  ): Promise<{
    data: LibroMayorContabilidad[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const offset = (page - 1) * limit;
      
      // Construir la consulta base
      let baseQuery = `
        FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        WHERE 1=1
      `;
      
      const whereConditions: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      // Aplicar filtros
      if (filtros.fechaInicial) {
        whereConditions.push(`FECHA >= $${paramIndex}`);
        values.push(new Date(filtros.fechaInicial));
        paramIndex++;
      }

      if (filtros.fechaFinal) {
        whereConditions.push(`FECHA <= $${paramIndex}`);
        values.push(new Date(filtros.fechaFinal));
        paramIndex++;
      }

      if (filtros.cuentaContableDesde) {
        whereConditions.push(`CUENTA_CONTABLE >= $${paramIndex}`);
        values.push(filtros.cuentaContableDesde);
        paramIndex++;
      }

      if (filtros.cuentaContableHasta) {
        whereConditions.push(`CUENTA_CONTABLE <= $${paramIndex}`);
        values.push(filtros.cuentaContableHasta);
        paramIndex++;
      }

      if (filtros.centroCostoDesde) {
        whereConditions.push(`CENTRO_COSTO >= $${paramIndex}`);
        values.push(filtros.centroCostoDesde);
        paramIndex++;
      }

      if (filtros.centroCostoHasta) {
        whereConditions.push(`CENTRO_COSTO <= $${paramIndex}`);
        values.push(filtros.centroCostoHasta);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        baseQuery += ` AND ${whereConditions.join(' AND ')}`;
      }

      // Consulta para contar total
      const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
      const countResult = await this.dbConnection.query(countQuery, values);
      const total = parseInt(countResult.rows[0].total);

      // Consulta para obtener datos paginados
      const dataQuery = `
        SELECT * ${baseQuery}
        ORDER BY PERIODO_CONTABLE, CUENTA_CONTABLE, TIPO_LINEA, FECHA, ASIENTO
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      values.push(limit, offset);
      const dataResult = await this.dbConnection.query(dataQuery, values);
      const data = this.mapResultToEntity(dataResult.rows);

      return {
        data,
        total,
        page,
        limit
      };
    } catch (error) {
      console.error('Error en getByFiltros:', error);
      throw error;
    }
  }

  // Métodos de consulta específicos
  async getByCuentaContable(cuentaContable: string): Promise<LibroMayorContabilidad[]> {
    try {
      const query = `
        SELECT * FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        WHERE CUENTA_CONTABLE = $1
        ORDER BY FECHA, ASIENTO
      `;
      
      const result = await this.dbConnection.query(query, [cuentaContable]);
      return this.mapResultToEntity(result.rows);
    } catch (error) {
      console.error('Error en getByCuentaContable:', error);
      throw error;
    }
  }

  async getByCentroCosto(centroCosto: string): Promise<LibroMayorContabilidad[]> {
    try {
      const query = `
        SELECT * FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        WHERE CENTRO_COSTO = $1
        ORDER BY FECHA, ASIENTO
      `;
      
      const result = await this.dbConnection.query(query, [centroCosto]);
      return this.mapResultToEntity(result.rows);
    } catch (error) {
      console.error('Error en getByCentroCosto:', error);
      throw error;
    }
  }

  async getByFechaRange(fechaInicial: Date, fechaFinal: Date): Promise<LibroMayorContabilidad[]> {
    try {
      const query = `
        SELECT * FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        WHERE FECHA >= $1 AND FECHA <= $2
        ORDER BY FECHA, CUENTA_CONTABLE, ASIENTO
      `;
      
      const result = await this.dbConnection.query(query, [fechaInicial, fechaFinal]);
      return this.mapResultToEntity(result.rows);
    } catch (error) {
      console.error('Error en getByFechaRange:', error);
      throw error;
    }
  }

  async getByAsiento(asiento: string): Promise<LibroMayorContabilidad[]> {
    try {
      const query = `
        SELECT * FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        WHERE ASIENTO = $1
        ORDER BY FECHA, CUENTA_CONTABLE
      `;
      
      const result = await this.dbConnection.query(query, [asiento]);
      return this.mapResultToEntity(result.rows);
    } catch (error) {
      console.error('Error en getByAsiento:', error);
      throw error;
    }
  }

  async getByNIT(nit: string): Promise<LibroMayorContabilidad[]> {
    try {
      const query = `
        SELECT * FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        WHERE NIT = $1
        ORDER BY FECHA, ASIENTO
      `;
      
      const result = await this.dbConnection.query(query, [nit]);
      return this.mapResultToEntity(result.rows);
    } catch (error) {
      console.error('Error en getByNIT:', error);
      throw error;
    }
  }

  // Métodos de agregación
  async getSaldosPorCuenta(fechaInicial: Date, fechaFinal: Date): Promise<any[]> {
    try {
      const query = `
        SELECT 
          CUENTA_CONTABLE,
          SUM(SALDO_DEUDOR) as saldo_deudor_total,
          SUM(SALDO_ACREEDOR) as saldo_acreedor_total,
          SUM(SALDO_DEUDOR_DOLAR) as saldo_deudor_dolar_total,
          SUM(SALDO_ACREEDOR_DOLAR) as saldo_acreedor_dolar_total
        FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        WHERE FECHA >= $1 AND FECHA <= $2
        GROUP BY CUENTA_CONTABLE
        ORDER BY CUENTA_CONTABLE
      `;
      
      const result = await this.dbConnection.query(query, [fechaInicial, fechaFinal]);
      return result.rows;
    } catch (error) {
      console.error('Error en getSaldosPorCuenta:', error);
      throw error;
    }
  }

  async getSaldosPorCentroCosto(fechaInicial: Date, fechaFinal: Date): Promise<any[]> {
    try {
      const query = `
        SELECT 
          CENTRO_COSTO,
          SUM(SALDO_DEUDOR) as saldo_deudor_total,
          SUM(SALDO_ACREEDOR) as saldo_acreedor_total,
          SUM(SALDO_DEUDOR_DOLAR) as saldo_deudor_dolar_total,
          SUM(SALDO_ACREEDOR_DOLAR) as saldo_acreedor_dolar_total
        FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        WHERE FECHA >= $1 AND FECHA <= $2
        GROUP BY CENTRO_COSTO
        ORDER BY CENTRO_COSTO
      `;
      
      const result = await this.dbConnection.query(query, [fechaInicial, fechaFinal]);
      return result.rows;
    } catch (error) {
      console.error('Error en getSaldosPorCentroCosto:', error);
      throw error;
    }
  }

  async getResumenPorPeriodo(fechaInicial: Date, fechaFinal: Date): Promise<any[]> {
    try {
      const query = `
        SELECT 
          PERIODO_CONTABLE,
          COUNT(*) as total_registros,
          SUM(DEBITO_LOCAL) as total_debito_local,
          SUM(CREDITO_LOCAL) as total_credito_local,
          SUM(DEBITO_DOLAR) as total_debito_dolar,
          SUM(CREDITO_DOLAR) as total_credito_dolar
        FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        WHERE FECHA >= $1 AND FECHA <= $2
        GROUP BY PERIODO_CONTABLE
        ORDER BY PERIODO_CONTABLE
      `;
      
      const result = await this.dbConnection.query(query, [fechaInicial, fechaFinal]);
      return result.rows;
    } catch (error) {
      console.error('Error en getResumenPorPeriodo:', error);
      throw error;
    }
  }

  // Métodos de exportación
  async exportarReporte(filtros: FiltrosLibroMayorContabilidad, formato: string): Promise<Buffer> {
    try {
      // Obtener datos con filtros
      const { data } = await this.getByFiltros(filtros, 1, 1000000); // Sin límite para exportación
      
      // Convertir a formato solicitado
      if (formato.toLowerCase() === 'csv') {
        return this.convertToCSV(data);
      } else if (formato.toLowerCase() === 'json') {
        return Buffer.from(JSON.stringify(data, null, 2));
      } else {
        throw new Error(`Formato de exportación no soportado: ${formato}`);
      }
    } catch (error) {
      console.error('Error en exportarReporte:', error);
      throw error;
    }
  }

  // Métodos auxiliares
  private mapResultToEntity(rows: any[]): LibroMayorContabilidad[] {
    return rows.map(row => ({
      id: row.row_order_by,
      saldoAcreedorDolar: parseFloat(row.saldo_acreedor_dolar) || 0,
      creditoDolarMayor: parseFloat(row.credito_dolar_mayor) || 0,
      saldoDeudorDolar: parseFloat(row.saldo_deudor_dolar) || 0,
      debitoDolarMayor: parseFloat(row.debito_dolar_mayor) || 0,
      saldoAcreedor: parseFloat(row.saldo_acreedor) || 0,
      creditoDolar: parseFloat(row.credito_dolar) || 0,
      creditoLocal: parseFloat(row.credito_local) || 0,
      saldoDeudor: parseFloat(row.saldo_deudor) || 0,
      debitoDolar: parseFloat(row.debito_dolar) || 0,
      debitoLocal: parseFloat(row.debito_local) || 0,
      cuentaContable: row.cuenta_contable || '',
      centroCosto: row.centro_costo || '',
      tipoAsiento: row.tipo_asiento || '',
      descripcion: row.descripcion || '',
      consecutivo: parseInt(row.consecutivo) || 0,
      referencia: row.referencia || '',
      nitNombre: row.nit_nombre || '',
      documento: row.documento || '',
      credito: parseFloat(row.credito) || 0,
      asiento: row.asiento || '',
      debito: parseFloat(row.debito) || 0,
      fecha: new Date(row.fecha),
      tipo: row.tipo || '',
      nit: row.nit || '',
      fuente: row.fuente || '',
      periodoContable: row.periodo_contable ? new Date(row.periodo_contable) : undefined,
      correlativoAsiento: row.correlativo_asiento,
      tipoLinea: parseInt(row.tipo_linea) || undefined,
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
    }));
  }

  private mapEntityFieldToDbColumn(field: string): string | null {
    const fieldMapping: { [key: string]: string } = {
      saldoAcreedorDolar: 'SALDO_ACREEDOR_DOLAR',
      creditoDolarMayor: 'CREDITO_DOLAR_MAYOR',
      saldoDeudorDolar: 'SALDO_DEUDOR_DOLAR',
      debitoDolarMayor: 'DEBITO_DOLAR_MAYOR',
      saldoAcreedor: 'SALDO_ACREEDOR',
      creditoDolar: 'CREDITO_DOLAR',
      creditoLocal: 'CREDITO_LOCAL',
      saldoDeudor: 'SALDO_DEUDOR',
      debitoDolar: 'DEBITO_DOLAR',
      debitoLocal: 'DEBITO_LOCAL',
      cuentaContable: 'CUENTA_CONTABLE',
      centroCosto: 'CENTRO_COSTO',
      tipoAsiento: 'TIPO_ASIENTO',
      descripcion: 'DESCRIPCION',
      consecutivo: 'CONSECUTIVO',
      referencia: 'REFERENCIA',
      nitNombre: 'NIT_NOMBRE',
      documento: 'DOCUMENTO',
      credito: 'CREDITO',
      asiento: 'ASIENTO',
      debito: 'DEBITO',
      fecha: 'FECHA',
      tipo: 'TIPO',
      nit: 'NIT',
      fuente: 'FUENTE'
    };

    return fieldMapping[field] || null;
  }

  private convertToCSV(data: LibroMayorContabilidad[]): Buffer {
    if (data.length === 0) {
      return Buffer.from('');
    }

    const headers = Object.keys(data[0]).filter(key => key !== 'id');
    const csvRows = [headers.join(',')];

    data.forEach(item => {
      const row = headers.map(header => {
        const value = (item as any)[header];
        if (value === null || value === undefined) {
          return '';
        }
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      });
      csvRows.push(row.join(','));
    });

    return Buffer.from(csvRows.join('\n'));
  }
}
