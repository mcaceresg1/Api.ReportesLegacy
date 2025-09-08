import { IQuery } from "../../../domain/cqrs/IQuery";
import { v4 as uuid } from "uuid";

/**
 * Query para obtener los filtros disponibles del Libro Mayor Asientos
 * Implementa el patrón Query del CQRS para operaciones de lectura
 */
export class ObtenerFiltrosLibroMayorAsientosQuery implements IQuery {
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly conjunto: string) {}
}



