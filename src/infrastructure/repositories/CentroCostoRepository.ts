import { injectable } from 'inversify';
import { ICentroCostoRepository } from '../../domain/repositories/ICentroCostoRepository';
import { CentroCosto } from '../../domain/entities/CentroCosto';
import { DynamicModelFactory, CentroCostoModel } from '../database/models/DynamicModel';

@injectable()
export class CentroCostoRepository implements ICentroCostoRepository {
  async getCentrosCostoByConjunto(conjunto: string): Promise<CentroCosto[]> {
    try {
      const CentroCostoModel = DynamicModelFactory.createCentroCostoModel(conjunto);
      const centrosCosto = await CentroCostoModel.findAll({
        order: [['CENTRO_COSTO', 'ASC']],
      });
      return centrosCosto.map(centroCosto => centroCosto.toJSON() as CentroCosto);
    } catch (error) {
      console.error('Error al obtener centros costo por conjunto:', error);
      throw new Error('Error al obtener centros costo por conjunto');
    }
  }

  async getCentroCostoByCodigo(conjunto: string, codigo: string): Promise<CentroCosto | null> {
    try {
      const CentroCostoModel = DynamicModelFactory.createCentroCostoModel(conjunto);
      const centroCosto = await CentroCostoModel.findByPk(codigo);
      return centroCosto ? centroCosto.toJSON() as CentroCosto : null;
    } catch (error) {
      console.error('Error al obtener centro costo por código:', error);
      throw new Error('Error al obtener centro costo por código');
    }
  }

  async getCentrosCostoByTipo(conjunto: string, tipo: string): Promise<CentroCosto[]> {
    try {
      const CentroCostoModel = DynamicModelFactory.createCentroCostoModel(conjunto);
      const centrosCosto = await CentroCostoModel.findAll({
        where: {
          TIPO: tipo
        },
        order: [['CENTRO_COSTO', 'ASC']],
      });
      return centrosCosto.map(centroCosto => centroCosto.toJSON() as CentroCosto);
    } catch (error) {
      console.error('Error al obtener centros costo por tipo:', error);
      throw new Error('Error al obtener centros costo por tipo');
    }
  }

  async getCentrosCostoActivos(conjunto: string): Promise<CentroCosto[]> {
    try {
      const CentroCostoModel = DynamicModelFactory.createCentroCostoModel(conjunto);
      const centrosCosto = await CentroCostoModel.findAll({
        where: {
          ESTADO: 'A'
        },
        order: [['CENTRO_COSTO', 'ASC']],
      });
      return centrosCosto.map(centroCosto => centroCosto.toJSON() as CentroCosto);
    } catch (error) {
      console.error('Error al obtener centros costo activos:', error);
      throw new Error('Error al obtener centros costo activos');
    }
  }
}
