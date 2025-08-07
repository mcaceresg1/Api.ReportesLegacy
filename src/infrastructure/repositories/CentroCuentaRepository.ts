import { ICentroCuentaRepository } from '../../domain/repositories/ICentroCuentaRepository';
import { CentroCuenta } from '../../domain/entities/CentroCuenta';
import { DynamicModelFactory, CentroCuentaModel } from '../database/models/DynamicModel';

export class CentroCuentaRepository implements ICentroCuentaRepository {
  async getCentrosCuentaByConjunto(conjunto: string): Promise<CentroCuenta[]> {
    try {
      const CentroCuentaModel = DynamicModelFactory.createCentroCuentaModel(conjunto);
      const centrosCuenta = await CentroCuentaModel.findAll({
        order: [['CENTRO_COSTO', 'ASC'], ['CUENTA_CONTABLE', 'ASC']],
      });
      return centrosCuenta.map(centroCuenta => centroCuenta.toJSON() as CentroCuenta);
    } catch (error) {
      console.error('Error al obtener centros cuenta por conjunto:', error);
      throw new Error('Error al obtener centros cuenta por conjunto');
    }
  }

  async getCentrosCuentaByCuenta(conjunto: string, cuentaContable: string): Promise<CentroCuenta[]> {
    try {
      const CentroCuentaModel = DynamicModelFactory.createCentroCuentaModel(conjunto);
      const centrosCuenta = await CentroCuentaModel.findAll({
        where: {
          CUENTA_CONTABLE: cuentaContable
        },
        order: [['CENTRO_COSTO', 'ASC']],
      });
      return centrosCuenta.map(centroCuenta => centroCuenta.toJSON() as CentroCuenta);
    } catch (error) {
      console.error('Error al obtener centros cuenta por cuenta:', error);
      throw new Error('Error al obtener centros cuenta por cuenta');
    }
  }

  async getCentrosCuentaByCentro(conjunto: string, centroCosto: string): Promise<CentroCuenta[]> {
    try {
      const CentroCuentaModel = DynamicModelFactory.createCentroCuentaModel(conjunto);
      const centrosCuenta = await CentroCuentaModel.findAll({
        where: {
          CENTRO_COSTO: centroCosto
        },
        order: [['CUENTA_CONTABLE', 'ASC']],
      });
      return centrosCuenta.map(centroCuenta => centroCuenta.toJSON() as CentroCuenta);
    } catch (error) {
      console.error('Error al obtener centros cuenta por centro:', error);
      throw new Error('Error al obtener centros cuenta por centro');
    }
  }
}
