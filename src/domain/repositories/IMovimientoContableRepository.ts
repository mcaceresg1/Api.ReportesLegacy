import { MovimientoContable } from '../entities/MovimientoContable';

export interface IMovimientoContableRepository {
  generarReporteMovimientos(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    limit?: number,
    offset?: number
  ): Promise<MovimientoContable[]>;
  
  obtenerMovimientosPorUsuario(
    conjunto: string,
    usuario: string,
    limit?: number,
    offset?: number
  ): Promise<MovimientoContable[]>;
  
  obtenerMovimientosPorCentroCosto(
    conjunto: string,
    centroCosto: string,
    limit?: number,
    offset?: number
  ): Promise<MovimientoContable[]>;
  
  obtenerMovimientosPorCuentaContable(
    conjunto: string,
    cuentaContable: string,
    limit?: number,
    offset?: number
  ): Promise<MovimientoContable[]>;
  
  getMovimientosCount(
    conjunto: string,
    usuario: string,
    fechaInicio?: Date,
    fechaFin?: Date
  ): Promise<number>;
}
