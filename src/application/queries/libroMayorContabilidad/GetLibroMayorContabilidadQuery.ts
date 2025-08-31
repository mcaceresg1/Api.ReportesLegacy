import { IQuery } from '../../../domain/cqrs/IQuery';
import { FiltrosLibroMayorContabilidad } from '../../../domain/entities/LibroMayorContabilidad';

export class GetLibroMayorContabilidadQuery implements IQuery {
  constructor(
    public readonly filtros: FiltrosLibroMayorContabilidad,
    public readonly page?: number,
    public readonly limit?: number
  ) {}
}

export class GetLibroMayorContabilidadByIdQuery implements IQuery {
  constructor(
    public readonly id: number
  ) {}
}

export class GetLibroMayorContabilidadByFiltrosQuery implements IQuery {
  constructor(
    public readonly filtros: FiltrosLibroMayorContabilidad,
    public readonly page?: number,
    public readonly limit?: number
  ) {}
}

export class GetLibroMayorContabilidadByCuentaContableQuery implements IQuery {
  constructor(
    public readonly cuentaContable: string
  ) {}
}

export class GetLibroMayorContabilidadByCentroCostoQuery implements IQuery {
  constructor(
    public readonly centroCosto: string
  ) {}
}

export class GetLibroMayorContabilidadByFechaRangeQuery implements IQuery {
  constructor(
    public readonly fechaInicial: Date,
    public readonly fechaFinal: Date
  ) {}
}

export class GetLibroMayorContabilidadByAsientoQuery implements IQuery {
  constructor(
    public readonly asiento: string
  ) {}
}

export class GetLibroMayorContabilidadByNITQuery implements IQuery {
  constructor(
    public readonly nit: string
  ) {}
}

export class GetSaldosPorCuentaQuery implements IQuery {
  constructor(
    public readonly fechaInicial: Date,
    public readonly fechaFinal: Date
  ) {}
}

export class GetSaldosPorCentroCostoQuery implements IQuery {
  constructor(
    public readonly fechaInicial: Date,
    public readonly fechaFinal: Date
  ) {}
}

export class GetResumenPorPeriodoQuery implements IQuery {
  constructor(
    public readonly fechaInicial: Date,
    public readonly fechaFinal: Date
  ) {}
}
