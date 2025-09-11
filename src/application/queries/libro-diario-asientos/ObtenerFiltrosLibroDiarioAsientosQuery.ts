import { IQuery } from "../../../domain/cqrs/IQuery";
import { v4 as uuid } from "uuid";

/**
 * Query para obtener los filtros disponibles del Libro Diario Asientos
 */
export class ObtenerFiltrosLibroDiarioAsientosQuery implements IQuery {
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(
    public readonly conjunto: string
  ) {}
}
