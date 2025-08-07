import { IConjuntoService } from '../../domain/services/IConjuntoService';
import { IConjuntoRepository } from '../../domain/repositories/IConjuntoRepository';
import { Conjunto } from '../../domain/entities/Conjunto';

export class ConjuntoService implements IConjuntoService {
  constructor(private conjuntoRepository: IConjuntoRepository) {}

  async getAllConjuntos(): Promise<Conjunto[]> {
    try {
      return await this.conjuntoRepository.getAllConjuntos();
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

  async getConjuntosActivos(): Promise<Conjunto[]> {
    try {
      return await this.conjuntoRepository.getConjuntosActivos();
    } catch (error) {
      console.error('Error en ConjuntoService.getConjuntosActivos:', error);
      throw new Error('Error al obtener conjuntos activos');
    }
  }
}
