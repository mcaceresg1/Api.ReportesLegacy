import { MovimientoContable, MovimientoContableResponse } from '../entities/MovimientoContable';

export interface IMovimientoContableRepository {
  generarReporteMovimientos(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    page?: number,
    limit?: number
  ): Promise<MovimientoContableResponse>;
  
  obtenerMovimientosPorUsuario(
    conjunto: string,
    usuario: string,
    page?: number,
    limit?: number
  ): Promise<MovimientoContableResponse>;
  
  obtenerMovimientosPorCentroCosto(
    conjunto: string,
    centroCosto: string,
    page?: number,
    limit?: number
  ): Promise<MovimientoContableResponse>;
  
  obtenerMovimientosPorCuentaContable(
    conjunto: string,
    cuentaContable: string,
    page?: number,
    limit?: number
  ): Promise<MovimientoContableResponse>;
  
  getMovimientosCount(
    conjunto: string,
    usuario: string,
    fechaInicio?: Date,
    fechaFin?: Date
  ): Promise<number>;

  exportarExcel(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    limit?: number
  ): Promise<Buffer>;
}
