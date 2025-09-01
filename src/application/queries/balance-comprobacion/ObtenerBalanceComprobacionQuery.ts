import { IQuery } from "../../../domain/cqrs/IQuery";
import { BalanceComprobacionFiltros } from "../../../domain/entities/BalanceComprobacion";
import { v4 as uuid } from "uuid";

/**
 * Query para obtener los datos del Balance de Comprobación
 * Implementa el patrón Query del CQRS para operaciones de lectura
 */
export class ObtenerBalanceComprobacionQuery implements IQuery {
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly filtros: BalanceComprobacionFiltros) {}
}
