import { IQuery } from "../../../domain/cqrs/IQuery";
import { LibroDiarioAsientosFiltros } from "../../../domain/entities/LibroDiarioAsientos";
import { v4 as uuid } from "uuid";

/**
 * Query para obtener los datos del Libro Diario Asientos
 */
export class ObtenerLibroDiarioAsientosQuery implements IQuery {
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(
    public readonly conjunto: string,
    public readonly filtros: LibroDiarioAsientosFiltros
  ) {}
}
