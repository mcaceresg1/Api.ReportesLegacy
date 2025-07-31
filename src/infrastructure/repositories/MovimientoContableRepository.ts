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

    const movimientosContables = await MovimientoContableModel.findAll({
      where: whereClause,
      include: includeClause,
      order: [['tipo', 'ASC'], ['cuenta', 'ASC']]
    });
    
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
} 