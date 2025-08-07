import { injectable } from 'inversify';
import { ICuentaContableRepository } from '../../domain/repositories/ICuentaContableRepository';
import { CuentaContable } from '../../domain/entities/CuentaContable';
import { DynamicModelFactory, CuentaContableModel } from '../database/models/DynamicModel';
import { Op } from 'sequelize';

@injectable()
export class CuentaContableRepository implements ICuentaContableRepository {
  // Campos principales para optimizar consultas
  private readonly camposPrincipales = [
    'CUENTA_CONTABLE', 'SECCION_CUENTA', 'UNIDAD', 'DESCRIPCION', 'TIPO',
    'TIPO_DETALLADO', 'TIPO_OAF', 'SALDO_NORMAL', 'CONVERSION', 'TIPO_CAMBIO',
    'ACEPTA_DATOS', 'CONSOLIDA', 'USA_CENTRO_COSTO', 'NOTAS', 'USUARIO',
    'FECHA_HORA', 'USUARIO_ULT_MOD', 'FCH_HORA_ULT_MOD', 'ACEPTA_UNIDADES',
    'USO_RESTRINGIDO', 'ORIGEN_CONVERSION', 'RUBRO_FLUJO_DEBITO', 'RUBRO_FLUJO_CREDITO',
    'INCLUIR_REP_CP', 'INCLUIR_REP_CB', 'ENTIDAD_FINANCIERA_CB', 'INCLUIR_REP_CC',
    'VALIDA_PRESUP_CR', 'CUENTA_PDT', 'PARTE_SIGNIFICATIVA_PDT', 'CUENTA_IFRS',
    'USA_CONTA_ELECTRO', 'VERSION', 'FECHA_INI_CE', 'FECHA_FIN_CE', 'COD_AGRUPADOR',
    'DESC_COD_AGRUP', 'SUB_CTA_DE', 'DESC_SUB_CTA', 'NIVEL', 'MANEJA_TERCERO',
    'DESCRIPCION_IFRS'
  ];

  async getCuentasContablesByConjunto(conjunto: string, limit: number = 100, offset: number = 0): Promise<CuentaContable[]> {
    try {
      // Limpiar caché para asegurar que se use la configuración más reciente
      DynamicModelFactory.clearCache();
      const CuentaContableModel = DynamicModelFactory.createCuentaContableModel(conjunto);
      const cuentasContables = await CuentaContableModel.findAll({
        attributes: this.camposPrincipales,
        order: [['CUENTA_CONTABLE', 'ASC']],
        limit,
        offset,
      });
      return cuentasContables.map(cuentaContable => cuentaContable.toJSON() as CuentaContable);
    } catch (error) {
      console.error('Error al obtener cuentas contables por conjunto:', error);
      throw new Error('Error al obtener cuentas contables por conjunto');
    }
  }

  async getCuentaContableByCodigo(conjunto: string, codigo: string): Promise<CuentaContable | null> {
    try {
      const CuentaContableModel = DynamicModelFactory.createCuentaContableModel(conjunto);
      const cuentaContable = await CuentaContableModel.findByPk(codigo, {
        attributes: this.camposPrincipales,
      });
      return cuentaContable ? cuentaContable.toJSON() as CuentaContable : null;
    } catch (error) {
      console.error('Error al obtener cuenta contable por código:', error);
      throw new Error('Error al obtener cuenta contable por código');
    }
  }

  async getCuentasContablesByTipo(conjunto: string, tipo: string, limit: number = 100, offset: number = 0): Promise<CuentaContable[]> {
    try {
      const CuentaContableModel = DynamicModelFactory.createCuentaContableModel(conjunto);
      const cuentasContables = await CuentaContableModel.findAll({
        attributes: this.camposPrincipales,
        where: {
          TIPO: tipo
        },
        order: [['CUENTA_CONTABLE', 'ASC']],
        limit,
        offset,
      });
      return cuentasContables.map(cuentaContable => cuentaContable.toJSON() as CuentaContable);
    } catch (error) {
      console.error('Error al obtener cuentas contables por tipo:', error);
      throw new Error('Error al obtener cuentas contables por tipo');
    }
  }

  async getCuentasContablesActivas(conjunto: string, limit: number = 100, offset: number = 0): Promise<CuentaContable[]> {
    try {
      const CuentaContableModel = DynamicModelFactory.createCuentaContableModel(conjunto);
      const cuentasContables = await CuentaContableModel.findAll({
        attributes: this.camposPrincipales,
        where: {
          ACEPTA_DATOS: true
        },
        order: [['CUENTA_CONTABLE', 'ASC']],
        limit,
        offset,
      });
      return cuentasContables.map(cuentaContable => cuentaContable.toJSON() as CuentaContable);
    } catch (error) {
      console.error('Error al obtener cuentas contables activas:', error);
      throw new Error('Error al obtener cuentas contables activas');
    }
  }

  async getCuentasContablesByConjuntoCount(conjunto: string): Promise<number> {
    try {
      const CuentaContableModel = DynamicModelFactory.createCuentaContableModel(conjunto);
      return await CuentaContableModel.count();
    } catch (error) {
      console.error('Error al obtener conteo de cuentas contables por conjunto:', error);
      throw new Error('Error al obtener conteo de cuentas contables por conjunto');
    }
  }

  async getCuentasContablesByTipoCount(conjunto: string, tipo: string): Promise<number> {
    try {
      const CuentaContableModel = DynamicModelFactory.createCuentaContableModel(conjunto);
      return await CuentaContableModel.count({
        where: {
          TIPO: tipo
        }
      });
    } catch (error) {
      console.error('Error al obtener conteo de cuentas contables por tipo:', error);
      throw new Error('Error al obtener conteo de cuentas contables por tipo');
    }
  }

  async getCuentasContablesActivasCount(conjunto: string): Promise<number> {
    try {
      const CuentaContableModel = DynamicModelFactory.createCuentaContableModel(conjunto);
      return await CuentaContableModel.count({
        where: {
          ACEPTA_DATOS: true
        }
      });
    } catch (error) {
      console.error('Error al obtener conteo de cuentas contables activas:', error);
      throw new Error('Error al obtener conteo de cuentas contables activas');
    }
  }
}
