import { ReporteGastosDestinoItem, ReporteGastosDestinoResult } from '../entities/ReporteGastosDestino';

export interface IReporteGastosDestinoRepository {
  generar(conjunto: string, fechaInicio: Date, fechaFin: Date): Promise<void>;
  listar(conjunto: string, limit?: number, offset?: number): Promise<ReporteGastosDestinoResult>;
  count(conjunto: string): Promise<number>;
  limpiarPorRango?(conjunto: string): Promise<void>;
}


