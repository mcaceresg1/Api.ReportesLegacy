import { injectable } from 'inversify';
import { ICentroCostoRepository } from '../../domain/repositories/ICentroCostoRepository';
import { CentroCosto } from '../../domain/entities/CentroCosto';
import { DynamicModelFactory } from '../database/models/DynamicModel';

@injectable()
export class CentroCostoRepository implements ICentroCostoRepository {
  // Campos principales para optimizar consultas
  private readonly camposPrincipales = [
    'CENTRO_COSTO', 'DESCRIPCION', 'ACEPTA_DATOS', 'TIPO'
  ];

  async getCentrosCostoByConjunto(conjunto: string, limit: number = 100, offset: number = 0): Promise<CentroCosto[]> {
    try {
      const CentroCostoModel = DynamicModelFactory.createCentroCostoModel(conjunto);
      const centrosCosto = await CentroCostoModel.findAll({
        attributes: this.camposPrincipales,
        order: [['CENTRO_COSTO', 'ASC']],
        limit,
        offset,
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
      const centroCosto = await CentroCostoModel.findByPk(codigo, {
        attributes: this.camposPrincipales,
      });
      return centroCosto ? centroCosto.toJSON() as CentroCosto : null;
    } catch (error) {
      console.error('Error al obtener centro costo por código:', error);
      throw new Error('Error al obtener centro costo por código');
    }
  }

  async getCentrosCostoByTipo(conjunto: string, tipo: string, limit: number = 100, offset: number = 0): Promise<CentroCosto[]> {
    try {
      const CentroCostoModel = DynamicModelFactory.createCentroCostoModel(conjunto);
      const centrosCosto = await CentroCostoModel.findAll({
        attributes: this.camposPrincipales,
        where: {
          TIPO: tipo
        },
        order: [['CENTRO_COSTO', 'ASC']],
        limit,
        offset,
      });
      return centrosCosto.map(centroCosto => centroCosto.toJSON() as CentroCosto);
    } catch (error) {
      console.error('Error al obtener centros costo por tipo:', error);
      throw new Error('Error al obtener centros costo por tipo');
    }
  }

  async getCentrosCostoActivos(conjunto: string, limit: number = 100, offset: number = 0): Promise<CentroCosto[]> {
    try {
      const CentroCostoModel = DynamicModelFactory.createCentroCostoModel(conjunto);
      const centrosCosto = await CentroCostoModel.findAll({
        attributes: this.camposPrincipales,
        where: {
          ACEPTA_DATOS: true
        },
        order: [['CENTRO_COSTO', 'ASC']],
        limit,
        offset,
      });
      return centrosCosto.map(centroCosto => centroCosto.toJSON() as CentroCosto);
    } catch (error) {
      console.error('Error al obtener centros costo activos:', error);
      throw new Error('Error al obtener centros costo activos');
    }
  }

  async getCentrosCostoByConjuntoCount(conjunto: string): Promise<number> {
    try {
      const CentroCostoModel = DynamicModelFactory.createCentroCostoModel(conjunto);
      return await CentroCostoModel.count();
    } catch (error) {
      console.error('Error al obtener conteo de centros costo por conjunto:', error);
      throw new Error('Error al obtener conteo de centros costo por conjunto');
    }
  }

  async getCentrosCostoByTipoCount(conjunto: string, tipo: string): Promise<number> {
    try {
      const CentroCostoModel = DynamicModelFactory.createCentroCostoModel(conjunto);
      return await CentroCostoModel.count({
        where: {
          TIPO: tipo
        }
      });
    } catch (error) {
      console.error('Error al obtener conteo de centros costo por tipo:', error);
      throw new Error('Error al obtener conteo de centros costo por tipo');
    }
  }

  async getCentrosCostoActivosCount(conjunto: string): Promise<number> {
    try {
      const CentroCostoModel = DynamicModelFactory.createCentroCostoModel(conjunto);
      return await CentroCostoModel.count({
        where: {
          ACEPTA_DATOS: true
        }
      });
    } catch (error) {
      console.error('Error al obtener conteo de centros costo activos:', error);
      throw new Error('Error al obtener conteo de centros costo activos');
    }
  }
}
