import { IConjuntoRepository } from '../../domain/repositories/IConjuntoRepository';
import { Conjunto } from '../../domain/entities/Conjunto';
import ConjuntoModel from '../database/models/ConjuntoModel';
import { Op } from 'sequelize';

export class ConjuntoRepository implements IConjuntoRepository {
  async getAllConjuntos(): Promise<Conjunto[]> {
    try {
      const conjuntos = await ConjuntoModel.findAll({
        order: [['NOMBRE', 'ASC']],
      });
      return conjuntos.map(conjunto => conjunto.toJSON() as Conjunto);
    } catch (error) {
      console.error('Error al obtener conjuntos:', error);
      throw new Error('Error al obtener conjuntos');
    }
  }

  async getConjuntoByCodigo(codigo: string): Promise<Conjunto | null> {
    try {
      const conjunto = await ConjuntoModel.findByPk(codigo);
      return conjunto ? conjunto.toJSON() as Conjunto : null;
    } catch (error) {
      console.error('Error al obtener conjunto por código:', error);
      throw new Error('Error al obtener conjunto por código');
    }
  }

  async getConjuntosActivos(): Promise<Conjunto[]> {
    try {
      const conjuntos = await ConjuntoModel.findAll({
        where: {
          [Op.or]: [
            { ES_PRINCIPAL: true },
            { ES_PRINCIPAL: { [Op.is]: undefined } }
          ]
        },
        order: [['NOMBRE', 'ASC']],
      });
      return conjuntos.map(conjunto => conjunto.toJSON() as Conjunto);
    } catch (error) {
      console.error('Error al obtener conjuntos activos:', error);
      throw new Error('Error al obtener conjuntos activos');
    }
  }
}
