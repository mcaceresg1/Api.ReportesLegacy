import { Conjunto } from '../entities/Conjunto';

export interface IConjuntoService {
  getAllConjuntos(limit?: number, offset?: number): Promise<Conjunto[]>;
  getConjuntoByCodigo(codigo: string): Promise<Conjunto | null>;
  getConjuntosActivos(limit?: number, offset?: number): Promise<Conjunto[]>;
  getConjuntosCount(): Promise<number>;
  getConjuntosActivosCount(): Promise<number>;
}
