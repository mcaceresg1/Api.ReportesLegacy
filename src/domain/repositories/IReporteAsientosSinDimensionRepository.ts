import { ReporteAsientosSinDimension, ReporteAsientosSinDimensionCreate, ReporteAsientosSinDimensionUpdate } from '../entities/ReporteAsientosSinDimension';

export interface IReporteAsientosSinDimensionRepository {
  generar(conjunto: string, fechaDesde: string, fechaHasta: string): Promise<ReporteAsientosSinDimension[]>;
  listar(conjunto: string, limit?: number): Promise<ReporteAsientosSinDimension[]>;
  listarDetalle(conjunto: string, fechaDesde: string, fechaHasta: string, limit?: number): Promise<ReporteAsientosSinDimension[]>;
  getById(conjunto: string, id: number): Promise<ReporteAsientosSinDimension | null>;
  create(conjunto: string, entity: ReporteAsientosSinDimensionCreate): Promise<ReporteAsientosSinDimension>;
  update(conjunto: string, id: number, entity: ReporteAsientosSinDimensionUpdate): Promise<ReporteAsientosSinDimension>;
  delete(conjunto: string, id: number): Promise<boolean>;
}
