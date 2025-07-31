import { injectable } from 'inversify';
import { Op } from 'sequelize';
import { ICentroCostoRepository } from '../../domain/repositories/ICentroCostoRepository';
import { CentroCosto, CentroCostoCreate, CentroCostoUpdate, CentroCostoFilter } from '../../domain/entities/CentroCosto';
import { CentroCostoModel } from '../database/models/CentroCostoModel';

@injectable()
export class CentroCostoRepository implements ICentroCostoRepository {
  async findAll(): Promise<CentroCosto[]> {
    const models = await CentroCostoModel.findAll({
      order: [['codigo', 'ASC']]
    });
    return models.map(model => this.mapToEntity(model));
  }

  async findById(id: number): Promise<CentroCosto | null> {
    const model = await CentroCostoModel.findByPk(id);
    return model ? this.mapToEntity(model) : null;
  }

  async findByFilter(filter: CentroCostoFilter): Promise<CentroCosto[]> {
    const whereClause: any = {};

    if (filter.codigo) {
      whereClause.codigo = { [Op.like]: `%${filter.codigo}%` };
    }

    if (filter.descripcion) {
      whereClause.descripcion = { [Op.like]: `%${filter.descripcion}%` };
    }

    if (filter.activo !== undefined) {
      whereClause.activo = filter.activo;
    }

    const models = await CentroCostoModel.findAll({
      where: whereClause,
      order: [['codigo', 'ASC']]
    });

    return models.map(model => this.mapToEntity(model));
  }

  async create(centroCosto: CentroCostoCreate): Promise<CentroCosto> {
    const model = await CentroCostoModel.create({
      codigo: centroCosto.codigo,
      descripcion: centroCosto.descripcion,
      activo: centroCosto.activo !== undefined ? centroCosto.activo : true
    });
    return this.mapToEntity(model);
  }

  async update(id: number, centroCosto: CentroCostoUpdate): Promise<CentroCosto | null> {
    const model = await CentroCostoModel.findByPk(id);
    if (!model) {
      return null;
    }

    const updateData: any = {};
    if (centroCosto.codigo !== undefined) updateData.codigo = centroCosto.codigo;
    if (centroCosto.descripcion !== undefined) updateData.descripcion = centroCosto.descripcion;
    if (centroCosto.activo !== undefined) updateData.activo = centroCosto.activo;

    await model.update(updateData);
    return this.mapToEntity(model);
  }

  async delete(id: number): Promise<boolean> {
    const model = await CentroCostoModel.findByPk(id);
    if (!model) {
      return false;
    }
    await model.destroy();
    return true;
  }

  async findByCodigo(codigo: string): Promise<CentroCosto | null> {
    const model = await CentroCostoModel.findOne({
      where: { codigo }
    });
    return model ? this.mapToEntity(model) : null;
  }

  async findActivos(): Promise<CentroCosto[]> {
    const models = await CentroCostoModel.findAll({
      where: { activo: true },
      order: [['codigo', 'ASC']]
    });
    return models.map(model => this.mapToEntity(model));
  }

  private mapToEntity(model: CentroCostoModel): CentroCosto {
    const data = model.dataValues || model.toJSON();
    const result: CentroCosto = {
      id: data.id,
      codigo: data.codigo,
      descripcion: data.descripcion,
      activo: data.activo
    };

    if (data.createdAt) {
      result.createdAt = data.createdAt;
    }

    if (data.updatedAt) {
      result.updatedAt = data.updatedAt;
    }

    return result;
  }
} 