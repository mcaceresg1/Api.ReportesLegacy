import { IQuery } from "../../../domain/cqrs/IQuery";
import { v4 as uuid } from "uuid";
import { FiltrosReporteGenericoSaldos } from "../../../domain/entities/ReporteGenericoSaldos";

export class ObtenerReporteGenericoSaldosQuery implements IQuery {
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly filtros: FiltrosReporteGenericoSaldos) {}
}
