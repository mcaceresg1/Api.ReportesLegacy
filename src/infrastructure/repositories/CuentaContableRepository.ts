import { injectable } from 'inversify';
import { ICuentaContableRepository } from '../../domain/repositories/ICuentaContableRepository';
import { CuentaContable } from '../../domain/entities/CuentaContable';
import { DynamicModelFactory, CuentaContableModel } from '../database/models/DynamicModel';
import { Op } from 'sequelize';

@injectable()
export class CuentaContableRepository implements ICuentaContableRepository {
  async getCuentasContablesByConjunto(conjunto: string): Promise<CuentaContable[]> {
    try {
      const CuentaContableModel = DynamicModelFactory.createCuentaContableModel(conjunto);
      const cuentasContables = await CuentaContableModel.findAll({
        order: [['CUENTA_CONTABLE', 'ASC']],
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
      const cuentaContable = await CuentaContableModel.findByPk(codigo);
      return cuentaContable ? cuentaContable.toJSON() as CuentaContable : null;
    } catch (error) {
      console.error('Error al obtener cuenta contable por código:', error);
      throw new Error('Error al obtener cuenta contable por código');
    }
  }

  async getCuentasContablesByTipo(conjunto: string, tipo: string): Promise<CuentaContable[]> {
    try {
      const CuentaContableModel = DynamicModelFactory.createCuentaContableModel(conjunto);
      const cuentasContables = await CuentaContableModel.findAll({
        where: {
          TIPO: tipo
        },
        order: [['CUENTA_CONTABLE', 'ASC']],
      });
      return cuentasContables.map(cuentaContable => cuentaContable.toJSON() as CuentaContable);
    } catch (error) {
      console.error('Error al obtener cuentas contables por tipo:', error);
      throw new Error('Error al obtener cuentas contables por tipo');
    }
  }

  async getCuentasContablesActivas(conjunto: string): Promise<CuentaContable[]> {
    try {
      const CuentaContableModel = DynamicModelFactory.createCuentaContableModel(conjunto);
      const cuentasContables = await CuentaContableModel.findAll({
        where: {
          ACEPTA_DATOS: true
        },
        order: [['CUENTA_CONTABLE', 'ASC']],
      });
      return cuentasContables.map(cuentaContable => cuentaContable.toJSON() as CuentaContable);
    } catch (error) {
      console.error('Error al obtener cuentas contables activas:', error);
      throw new Error('Error al obtener cuentas contables activas');
    }
  }
}
