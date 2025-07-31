import { MovimientoContable, MovimientoContableCreate, MovimientoContableUpdate, MovimientoContableFilter } from '../entities/MovimientoContable';

export interface IMovimientoContableRepository {
  findAll(): Promise<MovimientoContable[]>;
  findById(id: number): Promise<MovimientoContable | null>;
  findByFilter(filter: MovimientoContableFilter): Promise<MovimientoContable[]>;
  create(movimientoContable: MovimientoContableCreate): Promise<MovimientoContable>;
  update(id: number, movimientoContable: MovimientoContableUpdate): Promise<MovimientoContable | null>;
  delete(id: number): Promise<boolean>;
  getByTipo(tipo: string): Promise<MovimientoContable[]>;
  getByCentroCosto(centroCostoId: number): Promise<MovimientoContable[]>;
} 