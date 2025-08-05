import { injectable } from 'inversify';
import { Op, fn, col } from 'sequelize';
import { IMovimientoContableRepository } from '../../domain/repositories/IMovimientoContableRepository';
import { MovimientoContable, MovimientoContableCreate, MovimientoContableUpdate, MovimientoContableFilter } from '../../domain/entities/MovimientoContable';
import { MovimientoContableModel } from '../database/models/MovimientoContableModel';
import { CentroCostoModel } from '../database/models/CentroCostoModel';

@injectable()
export class MovimientoContableRepository implements IMovimientoContableRepository {
  async findAll(): Promise<MovimientoContable[]> {
    const movimientosContables = await MovimientoContableModel.findAll({
      include: [{
        model: CentroCostoModel,
        as: 'centroCosto',
        attributes: ['id', 'codigo', 'descripcion']
      }],
      order: [['tipo', 'ASC'], ['cuenta', 'ASC']]
    });
    return movimientosContables.map(this.mapToEntity);
  }

  async findById(id: number): Promise<MovimientoContable | null> {
    const movimientoContable = await MovimientoContableModel.findByPk(id, {
      include: [{
        model: CentroCostoModel,
        as: 'centroCosto',
        attributes: ['id', 'codigo', 'descripcion']
      }]
    });
    return movimientoContable ? this.mapToEntity(movimientoContable) : null;
  }

  async findByFilter(filter: MovimientoContableFilter): Promise<MovimientoContable[]> {
    const { Op } = require('sequelize');
    const whereClause: any = {};
    const includeClause: any = [{
      model: CentroCostoModel,
      as: 'centroCosto',
      attributes: ['id', 'codigo', 'descripcion']
    }];

    // También incluir la relación con Compania si está disponible
    try {
      const { CompaniaModel } = require('../database/models/CompaniaModel');
      includeClause.push({
        model: CompaniaModel,
        as: 'compania',
        attributes: ['id', 'codigo', 'nombre']
      });
    } catch (error) {
      console.log('No se pudo incluir la relación con Compania:', error.message);
    }

    console.log('Filtro recibido en repositorio:', filter);

    if (filter.compania_id) {
      whereClause.compania_id = filter.compania_id;
      console.log('Filtro por compañía aplicado:', filter.compania_id);
    }

    if (filter.tipo) {
      whereClause.tipo = { [Op.like]: `%${filter.tipo}%` };
    }

    if (filter.cuenta) {
      whereClause.cuenta = { [Op.like]: `%${filter.cuenta}%` };
    }

    if (filter.descripcion) {
      whereClause.descripcion = { [Op.like]: `%${filter.descripcion}%` };
    }

    if (filter.centro_costo_id) {
      whereClause.centro_costo_id = filter.centro_costo_id;
    }

    // Filtros por período
    if (filter.periodoDesde || filter.periodoHasta) {
      whereClause.createdAt = {};
      
      if (filter.periodoDesde) {
        whereClause.createdAt[Op.gte] = new Date(filter.periodoDesde);
      }
      
      if (filter.periodoHasta) {
        // Añadir un día para incluir la fecha de fin
        const fechaHasta = new Date(filter.periodoHasta);
        fechaHasta.setDate(fechaHasta.getDate() + 1);
        whereClause.createdAt[Op.lt] = fechaHasta;
      }
    }

    // Filtros por centro de costo
    if (filter.centro_costo_codigo || filter.centro_costo_descripcion) {
      const centroCostoWhere: any = {};
      
      if (filter.centro_costo_codigo) {
        centroCostoWhere.codigo = { [Op.like]: `%${filter.centro_costo_codigo}%` };
      }
      
      if (filter.centro_costo_descripcion) {
        centroCostoWhere.descripcion = { [Op.like]: `%${filter.centro_costo_descripcion}%` };
      }
      
      includeClause[0] = {
        model: CentroCostoModel,
        as: 'centroCosto',
        attributes: ['id', 'codigo', 'descripcion'],
        where: centroCostoWhere
      };
    }

    console.log('Where clause final:', whereClause);
    console.log('Include clause final:', includeClause);
    
    const movimientosContables = await MovimientoContableModel.findAll({
      where: whereClause,
      include: includeClause,
      order: [['tipo', 'ASC'], ['cuenta', 'ASC']]
    });
    
    console.log('Movimientos contables encontrados en repositorio:', movimientosContables.length);
    
    // Verificar si los movimientos tienen compania_id
    const movimientosConCompania = movimientosContables.filter(m => m.compania_id);
    console.log('Movimientos con compania_id:', movimientosConCompania.length);
    
    return movimientosContables.map(this.mapToEntity);
  }

  async create(movimientoContable: MovimientoContableCreate): Promise<MovimientoContable> {
    const createdMovimientoContable = await MovimientoContableModel.create(movimientoContable);
    return this.mapToEntity(createdMovimientoContable);
  }

  async update(id: number, movimientoContable: MovimientoContableUpdate): Promise<MovimientoContable | null> {
    const [updatedRows] = await MovimientoContableModel.update(movimientoContable, {
      where: { id }
    });
    
    if (updatedRows === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await MovimientoContableModel.destroy({
      where: { id }
    });
    
    return deletedRows > 0;
  }

  async getByTipo(tipo: string): Promise<MovimientoContable[]> {
    const movimientosContables = await MovimientoContableModel.findAll({
      where: { tipo },
      include: [{
        model: CentroCostoModel,
        as: 'centroCosto',
        attributes: ['id', 'codigo', 'descripcion']
      }],
      order: [['cuenta', 'ASC']]
    });
    
    return movimientosContables.map(this.mapToEntity);
  }

  async getByCentroCosto(centroCostoId: number): Promise<MovimientoContable[]> {
    const movimientosContables = await MovimientoContableModel.findAll({
      where: { centro_costo_id: centroCostoId },
      include: [{
        model: CentroCostoModel,
        as: 'centroCosto',
        attributes: ['id', 'codigo', 'descripcion']
      }],
      order: [['tipo', 'ASC'], ['cuenta', 'ASC']]
    });
    
    return movimientosContables.map(this.mapToEntity);
  }

  private mapToEntity(model: MovimientoContableModel): MovimientoContable {
    // Use dataValues to ensure we get the actual data
    const data: any = model.dataValues || model.toJSON();
    const result: MovimientoContable = {
      id: data.id,
      cuenta: data.cuenta,
      descripcion: data.descripcion,
      tipo: data.tipo,
      centro_costo_id: data.centro_costo_id,
      centro_costo_codigo: data.centroCosto?.codigo,
      centro_costo_descripcion: data.centroCosto?.descripcion,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };

    if (data.centroCosto) {
      result.centroCosto = {
        id: data.centroCosto.id,
        codigo: data.centroCosto.codigo,
        descripcion: data.centroCosto.descripcion
      };
    }

    return result;
  }

  // Método para actualizar movimientos contables sin compania_id
  async updateMovimientosWithoutCompania(companiaId: number = 1): Promise<void> {
    try {
      const result = await MovimientoContableModel.update(
        { compania_id: companiaId },
        { 
          where: { 
            compania_id: null 
          } 
        }
      );
      console.log(`Movimientos contables actualizados con compania_id ${companiaId}:`, result[0]);
    } catch (error) {
      console.error('Error actualizando movimientos contables:', error);
    }
  }
} 