import { injectable, inject } from 'inversify';
import { IConjuntoService } from '../../domain/services/IConjuntoService';
import { IConjuntoRepository } from '../../domain/repositories/IConjuntoRepository';
import { Conjunto } from '../../domain/entities/Conjunto';

@injectable()
export class ConjuntoService implements IConjuntoService {
  constructor(
    @inject('IConjuntoRepository') private conjuntoRepository: IConjuntoRepository
  ) {}

  async getAllConjuntos(limit: number = 100, offset: number = 0): Promise<Conjunto[]> {
    try {
      return await this.conjuntoRepository.getAllConjuntos(limit, offset);
    } catch (error) {
      console.error('Error en ConjuntoService.getAllConjuntos:', error);
      throw new Error('Error al obtener todos los conjuntos');
    }
  }

  async getConjuntoByCodigo(codigo: string): Promise<Conjunto | null> {
    try {
      return await this.conjuntoRepository.getConjuntoByCodigo(codigo);
    } catch (error) {
      console.error('Error en ConjuntoService.getConjuntoByCodigo:', error);
      throw new Error('Error al obtener conjunto por código');
    }
  }

  async getConjuntosActivos(limit: number = 100, offset: number = 0): Promise<Conjunto[]> {
    try {
      return await this.conjuntoRepository.getConjuntosActivos(limit, offset);
    } catch (error) {
      console.error('Error en ConjuntoService.getConjuntosActivos:', error);
      throw new Error('Error al obtener conjuntos activos');
    }
  }

  async getConjuntosCount(): Promise<number> {
    try {
      return await this.conjuntoRepository.getConjuntosCount();
    } catch (error) {
      console.error('Error en ConjuntoService.getConjuntosCount:', error);
      throw new Error('Error al obtener conteo de conjuntos');
    }
  }

  async getConjuntosActivosCount(): Promise<number> {
    try {
      return await this.conjuntoRepository.getConjuntosActivosCount();
    } catch (error) {
      console.error('Error en ConjuntoService.getConjuntosActivosCount:', error);
      throw new Error('Error al obtener conteo de conjuntos activos');
    }
  }
}
