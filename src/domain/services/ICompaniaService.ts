import { Compania, CompaniaCreate, CompaniaUpdate, CompaniaFilter } from '../entities/Compania';

export interface ICompaniaService {
  getAllCompanias(): Promise<Compania[]>;
  getCompaniaById(id: number): Promise<Compania | null>;
  getCompaniaByCodigo(codigo: string): Promise<Compania | null>;
  getCompaniasByFilter(filter: CompaniaFilter): Promise<Compania[]>;
  createCompania(companiaData: CompaniaCreate): Promise<Compania>;
  updateCompania(companiaData: CompaniaUpdate): Promise<Compania>;
  deleteCompania(id: number): Promise<boolean>;
  getCompaniasActivas(): Promise<Compania[]>;
} 