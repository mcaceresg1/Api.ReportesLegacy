import { IQuery } from "../../../domain/cqrs/IQuery";
import { LibroMayorAsientosFiltros } from "../../../domain/entities/LibroMayorAsientos";
import { v4 as uuid } from "uuid";

/**
 * Query para obtener los datos del Libro Mayor Asientos
 * Implementa el patrón Query del CQRS para operaciones de lectura
 */
export class ObtenerLibroMayorAsientosQuery implements IQuery {
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(
    public readonly conjunto: string,
    public readonly filtros: LibroMayorAsientosFiltros
  ) {}
}






