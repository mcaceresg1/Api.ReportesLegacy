import { injectable } from 'inversify';
import { IConjuntoRepository } from '../../domain/repositories/IConjuntoRepository';
import { Conjunto } from '../../domain/entities/Conjunto';
import { exactusSequelize } from '../database/config/exactus-database';

@injectable()
export class ConjuntoRepository implements IConjuntoRepository {
  // Campos específicos para optimizar consultas - solo los necesarios
  private readonly camposPrincipales = [
    'CONJUNTO', 'NOMBRE', 'DIREC1', 'DIREC2', 'TELEFONO', 'LOGO'
  ];

  async getAllConjuntos(limit: number = 100, offset: number = 0): Promise<Conjunto[]> {
    try {
      // Usar consulta SQL directa para seleccionar solo los campos necesarios
      const [results] = await exactusSequelize.query(`
        SELECT CONJUNTO, NOMBRE, DIREC1, DIREC2, TELEFONO, LOGO
        FROM ERPADMIN.CONJUNTO
        ORDER BY NOMBRE ASC
        OFFSET :offset ROWS
        FETCH NEXT :limit ROWS ONLY
      `, {
        replacements: { limit, offset },
        type: 'SELECT'
      });
      
      return results as Conjunto[];
    } catch (error) {
      console.error('Error al obtener conjuntos:', error);
      throw new Error('Error al obtener conjuntos');
    }
  }

  async getConjuntoByCodigo(codigo: string): Promise<Conjunto | null> {
    try {
      // Usar consulta SQL directa para seleccionar solo los campos necesarios
      const [results] = await exactusSequelize.query(`
        SELECT CONJUNTO, NOMBRE, DIREC1, DIREC2, TELEFONO, LOGO
        FROM ERPADMIN.CONJUNTO
        WHERE CONJUNTO = :codigo
      `, {
        replacements: { codigo },
        type: 'SELECT'
      });
      
      return results.length > 0 ? results[0] as Conjunto : null;
    } catch (error) {
      console.error('Error al obtener conjunto por código:', error);
      throw new Error('Error al obtener conjunto por código');
    }
  }

  async getConjuntosActivos(limit: number = 100, offset: number = 0): Promise<Conjunto[]> {
    try {
      // Usar consulta SQL directa para seleccionar solo los campos necesarios
      const [results] = await exactusSequelize.query(`
        SELECT CONJUNTO, NOMBRE, DIREC1, DIREC2, TELEFONO, LOGO
        FROM ERPADMIN.CONJUNTO
        ORDER BY NOMBRE ASC
        OFFSET :offset ROWS
        FETCH NEXT :limit ROWS ONLY
      `, {
        replacements: { limit, offset },
        type: 'SELECT'
      });
      
      return results as Conjunto[];
    } catch (error) {
      console.error('Error al obtener conjuntos activos:', error);
      throw new Error('Error al obtener conjuntos activos');
    }
  }

  async getConjuntosCount(): Promise<number> {
    try {
      const [results] = await exactusSequelize.query(`
        SELECT COUNT(*) as total FROM ERPADMIN.CONJUNTO
      `, {
        type: 'SELECT'
      });
      
      return (results as any)[0].total;
    } catch (error) {
      console.error('Error al obtener conteo de conjuntos:', error);
      throw new Error('Error al obtener conteo de conjuntos');
    }
  }

  async getConjuntosActivosCount(): Promise<number> {
    try {
      // Como no tenemos ES_PRINCIPAL en la entidad simplificada,
      // retornamos el conteo total
      const [results] = await exactusSequelize.query(`
        SELECT COUNT(*) as total FROM ERPADMIN.CONJUNTO
      `, {
        type: 'SELECT'
      });
      
      return (results as any)[0].total;
    } catch (error) {
      console.error('Error al obtener conteo de conjuntos activos:', error);
      throw new Error('Error al obtener conteo de conjuntos activos');
    }
  }
}
