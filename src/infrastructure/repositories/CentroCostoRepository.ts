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

  async getCentrosCostoByConjunto(conjunto: string, page: number = 1, limit: number = 25): Promise<{
    success: boolean;
    data: CentroCosto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    message: string;
  }> {
    try {
      const offset = (page - 1) * limit;
      
      const CentroCostoModel = DynamicModelFactory.createCentroCostoModel(conjunto);
      
      // Obtener total de registros
      const total = await CentroCostoModel.count();
      
      // Obtener datos paginados
      const centrosCosto = await CentroCostoModel.findAll({
        attributes: this.camposPrincipales,
        order: [['CENTRO_COSTO', 'ASC']],
        limit,
        offset,
      });
      
      const totalPages = Math.ceil(total / limit);
      
      return {
        success: true,
        data: centrosCosto.map(centroCosto => centroCosto.toJSON() as CentroCosto),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        message: "Datos obtenidos exitosamente",
      };
    } catch (error) {
      console.error('Error al obtener centros costo por conjunto:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 25,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        message: `Error al obtener centros costo por conjunto: ${error}`,
      };
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

  async getCentrosCostoByTipo(conjunto: string, tipo: string, page: number = 1, limit: number = 25): Promise<{
    success: boolean;
    data: CentroCosto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    message: string;
  }> {
    try {
      const offset = (page - 1) * limit;
      
      const CentroCostoModel = DynamicModelFactory.createCentroCostoModel(conjunto);
      
      // Obtener total de registros
      const total = await CentroCostoModel.count({
        where: {
          TIPO: tipo
        }
      });
      
      // Obtener datos paginados
      const centrosCosto = await CentroCostoModel.findAll({
        attributes: this.camposPrincipales,
        where: {
          TIPO: tipo
        },
        order: [['CENTRO_COSTO', 'ASC']],
        limit,
        offset,
      });
      
      const totalPages = Math.ceil(total / limit);
      
      return {
        success: true,
        data: centrosCosto.map(centroCosto => centroCosto.toJSON() as CentroCosto),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        message: "Datos obtenidos exitosamente",
      };
    } catch (error) {
      console.error('Error al obtener centros costo por tipo:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 25,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        message: `Error al obtener centros costo por tipo: ${error}`,
      };
    }
  }

  async getCentrosCostoActivos(conjunto: string, page: number = 1, limit: number = 25): Promise<{
    success: boolean;
    data: CentroCosto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    message: string;
  }> {
    try {
      const offset = (page - 1) * limit;
      
      const CentroCostoModel = DynamicModelFactory.createCentroCostoModel(conjunto);
      
      // Obtener total de registros
      const total = await CentroCostoModel.count({
        where: {
          ACEPTA_DATOS: true
        }
      });
      
      // Obtener datos paginados
      const centrosCosto = await CentroCostoModel.findAll({
        attributes: this.camposPrincipales,
        where: {
          ACEPTA_DATOS: true
        },
        order: [['CENTRO_COSTO', 'ASC']],
        limit,
        offset,
      });
      
      const totalPages = Math.ceil(total / limit);
      
      return {
        success: true,
        data: centrosCosto.map(centroCosto => centroCosto.toJSON() as CentroCosto),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        message: "Datos obtenidos exitosamente",
      };
    } catch (error) {
      console.error('Error al obtener centros costo activos:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 25,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        message: `Error al obtener centros costo activos: ${error}`,
      };
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
