import { MovimientoContable, MovimientoContableCreate, MovimientoContableUpdate, MovimientoContableFilter } from '../entities/MovimientoContable';

export interface IMovimientoContableService {
  getAllMovimientosContables(): Promise<MovimientoContable[]>;
  getMovimientoContableById(id: number): Promise<MovimientoContable | null>;
  getMovimientosContablesByFilter(filter: MovimientoContableFilter): Promise<MovimientoContable[]>;
  createMovimientoContable(movimientoContableData: MovimientoContableCreate): Promise<MovimientoContable>;
  updateMovimientoContable(movimientoContableData: MovimientoContableUpdate): Promise<MovimientoContable>;
  deleteMovimientoContable(id: number): Promise<boolean>;
  getMovimientosContablesByTipo(tipo: string): Promise<MovimientoContable[]>;
  getMovimientosContablesByCentroCosto(centroCostoId: number): Promise<MovimientoContable[]>;
} 