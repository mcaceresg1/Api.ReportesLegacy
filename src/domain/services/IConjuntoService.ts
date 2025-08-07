import { Conjunto } from '../entities/Conjunto';

export interface IConjuntoService {
  getAllConjuntos(): Promise<Conjunto[]>;
  getConjuntoByCodigo(codigo: string): Promise<Conjunto | null>;
  getConjuntosActivos(): Promise<Conjunto[]>;
}
