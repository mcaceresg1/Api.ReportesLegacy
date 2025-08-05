import { Compania, CompaniaCreate, CompaniaUpdate, CompaniaFilter } from '../entities/Compania';

export interface ICompaniaRepository {
  findAll(): Promise<Compania[]>;
  findById(id: number): Promise<Compania | null>;
  findByCodigo(codigo: string): Promise<Compania | null>;
  findByFilter(filter: CompaniaFilter): Promise<Compania[]>;
  create(companiaData: CompaniaCreate): Promise<Compania>;
  update(id: number, companiaData: CompaniaUpdate): Promise<Compania | null>;
  delete(id: number): Promise<boolean>;
  findActivas(): Promise<Compania[]>;
} 