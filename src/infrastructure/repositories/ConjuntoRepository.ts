import { injectable } from 'inversify';
import { IConjuntoRepository } from '../../domain/repositories/IConjuntoRepository';
import { Conjunto } from '../../domain/entities/Conjunto';
import ConjuntoModel from '../database/models/ConjuntoModel';
import { Op } from 'sequelize';

@injectable()
export class ConjuntoRepository implements IConjuntoRepository {
  // Campos principales para optimizar consultas
  private readonly camposPrincipales = [
    'CONJUNTO', 'NOMBRE', 'DIREC1', 'DIREC2', 'TELEFONO', 'LOGO',
    'DOBLE_MONEDA', 'DOBLE_CONTABILIDAD', 'INVENTARIO_DOLAR', 'USA_LOTES',
    'USAR_CENTROS_COSTO', 'CONSOLIDA', 'ES_PRINCIPAL', 'PAIS', 'NIT'
  ];

  async getAllConjuntos(limit: number = 100, offset: number = 0): Promise<Conjunto[]> {
    try {
      const conjuntos = await ConjuntoModel.findAll({
        attributes: this.camposPrincipales,
        order: [['NOMBRE', 'ASC']],
        limit,
        offset,
      });
      return conjuntos.map(conjunto => conjunto.toJSON() as Conjunto);
    } catch (error) {
      console.error('Error al obtener conjuntos:', error);
      throw new Error('Error al obtener conjuntos');
    }
  }

  async getConjuntoByCodigo(codigo: string): Promise<Conjunto | null> {
    try {
      const conjunto = await ConjuntoModel.findByPk(codigo, {
        attributes: this.camposPrincipales,
      });
      return conjunto ? conjunto.toJSON() as Conjunto : null;
    } catch (error) {
      console.error('Error al obtener conjunto por código:', error);
      throw new Error('Error al obtener conjunto por código');
    }
  }

  async getConjuntosActivos(limit: number = 100, offset: number = 0): Promise<Conjunto[]> {
    try {
      const conjuntos = await ConjuntoModel.findAll({
        attributes: this.camposPrincipales,
        where: {
          [Op.or]: [
            { ES_PRINCIPAL: 'S' },
            { ES_PRINCIPAL: { [Op.is]: undefined } }
          ]
        },
        order: [['NOMBRE', 'ASC']],
        limit,
        offset,
      });
      return conjuntos.map(conjunto => conjunto.toJSON() as Conjunto);
    } catch (error) {
      console.error('Error al obtener conjuntos activos:', error);
      throw new Error('Error al obtener conjuntos activos');
    }
  }

  async getConjuntosCount(): Promise<number> {
    try {
      return await ConjuntoModel.count();
    } catch (error) {
      console.error('Error al obtener conteo de conjuntos:', error);
      throw new Error('Error al obtener conteo de conjuntos');
    }
  }

  async getConjuntosActivosCount(): Promise<number> {
    try {
      return await ConjuntoModel.count({
        where: {
          [Op.or]: [
            { ES_PRINCIPAL: 'S' },
            { ES_PRINCIPAL: { [Op.is]: undefined } }
          ]
        }
      });
    } catch (error) {
      console.error('Error al obtener conteo de conjuntos activos:', error);
      throw new Error('Error al obtener conteo de conjuntos activos');
    }
  }
}
