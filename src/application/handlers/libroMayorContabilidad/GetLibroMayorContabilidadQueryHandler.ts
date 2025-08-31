import { IQueryHandler } from '../../../domain/cqrs/IQueryHandler';
import { 
  GetLibroMayorContabilidadQuery,
  GetLibroMayorContabilidadByIdQuery,
  GetLibroMayorContabilidadByFiltrosQuery,
  GetLibroMayorContabilidadByCuentaContableQuery,
  GetLibroMayorContabilidadByCentroCostoQuery,
  GetLibroMayorContabilidadByFechaRangeQuery,
  GetLibroMayorContabilidadByAsientoQuery,
  GetLibroMayorContabilidadByNITQuery,
  GetSaldosPorCuentaQuery,
  GetSaldosPorCentroCostoQuery,
  GetResumenPorPeriodoQuery
} from '../../queries/libroMayorContabilidad/GetLibroMayorContabilidadQuery';
import { ILibroMayorContabilidadService } from '../../../domain/services/ILibroMayorContabilidadService';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/container/types';

@injectable()
export class GetLibroMayorContabilidadQueryHandler implements 
  IQueryHandler<GetLibroMayorContabilidadQuery, any>,
  IQueryHandler<GetLibroMayorContabilidadByIdQuery, any>,
  IQueryHandler<GetLibroMayorContabilidadByFiltrosQuery, any>,
  IQueryHandler<GetLibroMayorContabilidadByCuentaContableQuery, any>,
  IQueryHandler<GetLibroMayorContabilidadByCentroCostoQuery, any>,
  IQueryHandler<GetLibroMayorContabilidadByFechaRangeQuery, any>,
  IQueryHandler<GetLibroMayorContabilidadByAsientoQuery, any>,
  IQueryHandler<GetLibroMayorContabilidadByNITQuery, any>,
  IQueryHandler<GetSaldosPorCuentaQuery, any>,
  IQueryHandler<GetSaldosPorCentroCostoQuery, any>,
  IQueryHandler<GetResumenPorPeriodoQuery, any> {
  
  constructor(
    @inject(TYPES.LibroMayorContabilidadService)
    private readonly libroMayorContabilidadService: ILibroMayorContabilidadService
  ) {}

  async execute(query: any): Promise<any> {
    try {
      if (query instanceof GetLibroMayorContabilidadQuery) {
        return await this.libroMayorContabilidadService.getLibrosMayorByFiltros(
          query.filtros,
          query.page,
          query.limit
        );
      }
      
      if (query instanceof GetLibroMayorContabilidadByIdQuery) {
        return await this.libroMayorContabilidadService.getLibroMayorById(query.id);
      }
      
      if (query instanceof GetLibroMayorContabilidadByFiltrosQuery) {
        return await this.libroMayorContabilidadService.getLibrosMayorByFiltros(
          query.filtros,
          query.page,
          query.limit
        );
      }
      
      if (query instanceof GetLibroMayorContabilidadByCuentaContableQuery) {
        return await this.libroMayorContabilidadService.getLibrosMayorByCuentaContable(
          query.cuentaContable
        );
      }
      
      if (query instanceof GetLibroMayorContabilidadByCentroCostoQuery) {
        return await this.libroMayorContabilidadService.getLibrosMayorByCentroCosto(
          query.centroCosto
        );
      }
      
      if (query instanceof GetLibroMayorContabilidadByFechaRangeQuery) {
        return await this.libroMayorContabilidadService.getLibrosMayorByFechaRange(
          query.fechaInicial,
          query.fechaFinal
        );
      }
      
      if (query instanceof GetLibroMayorContabilidadByAsientoQuery) {
        return await this.libroMayorContabilidadService.getLibrosMayorByAsiento(
          query.asiento
        );
      }
      
      if (query instanceof GetLibroMayorContabilidadByNITQuery) {
        return await this.libroMayorContabilidadService.getLibrosMayorByNIT(
          query.nit
        );
      }
      
      if (query instanceof GetSaldosPorCuentaQuery) {
        return await this.libroMayorContabilidadService.getSaldosPorCuenta(
          query.fechaInicial,
          query.fechaFinal
        );
      }
      
      if (query instanceof GetSaldosPorCentroCostoQuery) {
        return await this.libroMayorContabilidadService.getSaldosPorCentroCosto(
          query.fechaInicial,
          query.fechaFinal
        );
      }
      
      if (query instanceof GetResumenPorPeriodoQuery) {
        return await this.libroMayorContabilidadService.getResumenPorPeriodo(
          query.fechaInicial,
          query.fechaFinal
        );
      }
      
      throw new Error('Query no reconocida');
    } catch (error) {
      console.error('Error en GetLibroMayorContabilidadQueryHandler:', error);
      throw error;
    }
  }
}
