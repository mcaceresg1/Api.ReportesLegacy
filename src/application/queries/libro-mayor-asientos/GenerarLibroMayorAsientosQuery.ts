import { IQuery } from "../../../domain/cqrs/IQuery";
import { GenerarLibroMayorAsientosParams } from "../../../domain/entities/LibroMayorAsientos";
import { v4 as uuid } from "uuid";

/**
 * Query para generar el reporte de Libro Mayor Asientos
 * Implementa el patrón Query del CQRS para operaciones de lectura
 */
export class GenerarLibroMayorAsientosQuery implements IQuery {
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(
    public readonly conjunto: string,
    public readonly filtros: GenerarLibroMayorAsientosParams
  ) {}
}

