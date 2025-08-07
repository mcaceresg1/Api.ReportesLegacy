import { injectable } from 'inversify';
import { IMovimientoContableRepository } from '../../domain/repositories/IMovimientoContableRepository';
import { MovimientoContable } from '../../domain/entities/MovimientoContable';
import { DynamicModelFactory } from '../database/models/DynamicModel';
import { QueryTypes, Op } from 'sequelize';
import { exactusSequelize } from '../database/config/exactus-database';

@injectable()
export class MovimientoContableRepository implements IMovimientoContableRepository {
  
  async generarReporteMovimientos(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    limit: number = 100,
    offset: number = 0
  ): Promise<MovimientoContable[]> {
    try {
      // Query para generar el reporte basado en los queries proporcionados
      const query = `
        INSERT INTO ${conjunto}.REPCG_MOV_CUENTA (
          USUARIO, CUENTA_CONTABLE, DESCRIPCION_CUENTA_CONTABLE, ASIENTO, TIPO, 
          DOCUMENTO, REFERENCIA, DEBITO_LOCAL, DEBITO_DOLAR, CREDITO_LOCAL, 
          CREDITO_DOLAR, CENTRO_COSTO, DESCRIPCION_CENTRO_COSTO, TIPO_ASIENTO, 
          FECHA, ACEPTA_DATOS, CONSECUTIVO, NIT, RAZON_SOCIAL, FUENTE, NOTAS, 
          U_FLUJO_EFECTIVO, U_PATRIMONIO_NETO, U_REP_REF
        )
        SELECT 
          '${usuario}' as USUARIO,
          SUBSTRING(M.CUENTA_CONTABLE, 1, 2) as CUENTA_CONTABLE,
          CC.DESCRIPCION as DESCRIPCION_CUENTA_CONTABLE,
          M.ASIENTO,
          CASE 
            WHEN A.ORIGEN IN ('CP', 'CB', 'CC', 'CJ', 'IC', 'FA') 
            THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 1, 3) 
            ELSE '' 
          END as TIPO,
          CASE 
            WHEN A.ORIGEN IN ('FA') 
            THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 5, 20)
            WHEN A.ORIGEN IN ('CP', 'CB', 'CC', 'CJ', 'IC') 
            THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 4, 20)
            ELSE '' 
          END as DOCUMENTO,
          M.REFERENCIA,
          M.DEBITO_LOCAL,
          M.DEBITO_DOLAR,
          M.CREDITO_LOCAL,
          M.CREDITO_DOLAR,
          M.CENTRO_COSTO,
          C.DESCRIPCION as DESCRIPCION_CENTRO_COSTO,
          A.TIPO_ASIENTO,
          A.FECHA,
          CASE CC.ACEPTA_DATOS WHEN 'N' THEN 0 ELSE 1 END as ACEPTA_DATOS,
          M.CONSECUTIVO,
          M.NIT,
          N.RAZON_SOCIAL,
          M.FUENTE,
          A.NOTAS,
          M.U_FLUJO_EFECTIVO,
          M.U_PATRIMONIO_NETO,
          M.U_REP_REF
        FROM ${conjunto}.DIARIO M
        INNER JOIN ${conjunto}.ASIENTO_DE_DIARIO A ON M.ASIENTO = A.ASIENTO
        INNER JOIN ${conjunto}.NIT N ON M.NIT = N.NIT
        INNER JOIN ${conjunto}.CUENTA_CONTABLE CC ON CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'
        INNER JOIN ${conjunto}.CENTRO_COSTO C ON C.CENTRO_COSTO = M.CENTRO_COSTO
        WHERE A.CONTABILIDAD IN ('F', 'A')
        AND A.FECHA BETWEEN '${fechaInicio.toISOString()}' AND '${fechaFin.toISOString()}'
        
        UNION ALL
        
        SELECT 
          '${usuario}' as USUARIO,
          SUBSTRING(M.CUENTA_CONTABLE, 1, 2) as CUENTA_CONTABLE,
          CC.DESCRIPCION as DESCRIPCION_CUENTA_CONTABLE,
          M.ASIENTO,
          CASE 
            WHEN M.ORIGEN IN ('CP', 'CB', 'CC', 'CJ', 'IC', 'FA') 
            THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 1, 3) 
            ELSE '' 
          END as TIPO,
          CASE 
            WHEN M.ORIGEN IN ('FA') 
            THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 5, 20)
            WHEN M.ORIGEN IN ('CP', 'CB', 'CC', 'CJ', 'IC') 
            THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 4, 20)
            ELSE '' 
          END as DOCUMENTO,
          M.REFERENCIA,
          M.DEBITO_LOCAL,
          M.DEBITO_DOLAR,
          M.CREDITO_LOCAL,
          M.CREDITO_DOLAR,
          M.CENTRO_COSTO,
          C.DESCRIPCION as DESCRIPCION_CENTRO_COSTO,
          M.TIPO_ASIENTO,
          M.FECHA,
          CASE CC.ACEPTA_DATOS WHEN 'N' THEN 0 ELSE 1 END as ACEPTA_DATOS,
          M.CONSECUTIVO,
          M.NIT,
          N.RAZON_SOCIAL,
          M.FUENTE,
          A.NOTAS,
          M.U_FLUJO_EFECTIVO,
          M.U_PATRIMONIO_NETO,
          M.U_REP_REF
        FROM ${conjunto}.MAYOR M
        INNER JOIN ${conjunto}.ASIENTO_MAYORIZADO A ON M.ASIENTO = A.ASIENTO
        INNER JOIN ${conjunto}.CUENTA_CONTABLE CC ON CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'
        INNER JOIN ${conjunto}.NIT N ON M.NIT = N.NIT
        INNER JOIN ${conjunto}.CENTRO_COSTO C ON M.CENTRO_COSTO = C.CENTRO_COSTO
        WHERE M.CONTABILIDAD IN ('F', 'A')
        AND M.FECHA BETWEEN '${fechaInicio.toISOString()}' AND '${fechaFin.toISOString()}'
      `;

      // Ejecutar el query de inserción
      await exactusSequelize.query(query, { type: QueryTypes.INSERT });

      // Ahora consultar los datos insertados
      const MovimientoContableModel = DynamicModelFactory.createMovimientoContableModel(conjunto);
      const movimientos = await MovimientoContableModel.findAll({
        where: {
          USUARIO: usuario
        },
        order: [['FECHA', 'ASC'], ['ASIENTO', 'ASC']],
        limit,
        offset,
      });

      return movimientos.map(movimiento => movimiento.toJSON() as MovimientoContable);
    } catch (error) {
      console.error('Error al generar reporte de movimientos:', error);
      throw new Error('Error al generar reporte de movimientos');
    }
  }

  async obtenerMovimientosPorUsuario(
    conjunto: string,
    usuario: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<MovimientoContable[]> {
    try {
      const MovimientoContableModel = DynamicModelFactory.createMovimientoContableModel(conjunto);
      const movimientos = await MovimientoContableModel.findAll({
        where: {
          USUARIO: usuario
        },
        order: [['FECHA', 'DESC'], ['ASIENTO', 'ASC']],
        limit,
        offset,
      });
      return movimientos.map(movimiento => movimiento.toJSON() as MovimientoContable);
    } catch (error) {
      console.error('Error al obtener movimientos por usuario:', error);
      throw new Error('Error al obtener movimientos por usuario');
    }
  }

  async obtenerMovimientosPorCentroCosto(
    conjunto: string,
    centroCosto: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<MovimientoContable[]> {
    try {
      const MovimientoContableModel = DynamicModelFactory.createMovimientoContableModel(conjunto);
      const movimientos = await MovimientoContableModel.findAll({
        where: {
          CENTRO_COSTO: centroCosto
        },
        order: [['FECHA', 'DESC'], ['ASIENTO', 'ASC']],
        limit,
        offset,
      });
      return movimientos.map(movimiento => movimiento.toJSON() as MovimientoContable);
    } catch (error) {
      console.error('Error al obtener movimientos por centro de costo:', error);
      throw new Error('Error al obtener movimientos por centro de costo');
    }
  }

  async obtenerMovimientosPorCuentaContable(
    conjunto: string,
    cuentaContable: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<MovimientoContable[]> {
    try {
      const MovimientoContableModel = DynamicModelFactory.createMovimientoContableModel(conjunto);
      const movimientos = await MovimientoContableModel.findAll({
        where: {
          CUENTA_CONTABLE: cuentaContable
        },
        order: [['FECHA', 'DESC'], ['ASIENTO', 'ASC']],
        limit,
        offset,
      });
      return movimientos.map(movimiento => movimiento.toJSON() as MovimientoContable);
    } catch (error) {
      console.error('Error al obtener movimientos por cuenta contable:', error);
      throw new Error('Error al obtener movimientos por cuenta contable');
    }
  }

  async getMovimientosCount(
    conjunto: string,
    usuario: string,
    fechaInicio?: Date,
    fechaFin?: Date
  ): Promise<number> {
    try {
      const MovimientoContableModel = DynamicModelFactory.createMovimientoContableModel(conjunto);
      const whereClause: any = {
        USUARIO: usuario
      };

      if (fechaInicio && fechaFin) {
        whereClause.FECHA = {
          [Op.between]: [fechaInicio, fechaFin]
        };
      }

      return await MovimientoContableModel.count({
        where: whereClause
      });
    } catch (error) {
      console.error('Error al obtener conteo de movimientos:', error);
      throw new Error('Error al obtener conteo de movimientos');
    }
  }
}
