import { CentroCosto, CentroCostoCreate, CentroCostoUpdate, CentroCostoFilter } from '../entities/CentroCosto';

export interface ICentroCostoService {
  getAllCentrosCostos(): Promise<CentroCosto[]>;
  getCentroCostoById(id: number): Promise<CentroCosto | null>;
  getCentrosCostosByFilter(filter: CentroCostoFilter): Promise<CentroCosto[]>;
  createCentroCosto(centroCostoData: CentroCostoCreate): Promise<CentroCosto>;
  updateCentroCosto(centroCostoData: CentroCostoUpdate): Promise<CentroCosto>;
  deleteCentroCosto(id: number): Promise<boolean>;
  getCentroCostoByCodigo(codigo: string): Promise<CentroCosto | null>;
  getCentrosCostosActivos(): Promise<CentroCosto[]>;
} 