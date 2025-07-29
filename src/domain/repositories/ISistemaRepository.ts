import { Sistema, SistemaCreate, SistemaUpdate } from '../entities/Sistema';

export interface ISistemaRepository {
  findAll(): Promise<Sistema[]>;
  findById(id: number): Promise<Sistema | null>;
  create(sistema: SistemaCreate): Promise<Sistema>;
  update(id: number, sistema: SistemaUpdate): Promise<Sistema | null>;
  delete(id: number): Promise<boolean>;
  getRolesBySistema(sistemaId: number): Promise<any[]>;
} 