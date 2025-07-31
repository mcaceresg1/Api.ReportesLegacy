import { CentroCosto, CentroCostoCreate, CentroCostoUpdate, CentroCostoFilter } from '../entities/CentroCosto';

export interface ICentroCostoRepository {
  findAll(): Promise<CentroCosto[]>;
  findById(id: number): Promise<CentroCosto | null>;
  findByFilter(filter: CentroCostoFilter): Promise<CentroCosto[]>;
  create(centroCosto: CentroCostoCreate): Promise<CentroCosto>;
  update(id: number, centroCosto: CentroCostoUpdate): Promise<CentroCosto | null>;
  delete(id: number): Promise<boolean>;
  findByCodigo(codigo: string): Promise<CentroCosto | null>;
  findActivos(): Promise<CentroCosto[]>;
} 