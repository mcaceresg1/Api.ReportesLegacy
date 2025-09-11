import { IQuery } from "../../../domain/cqrs/IQuery";
import { GenerarLibroDiarioAsientosParams } from "../../../domain/entities/LibroDiarioAsientos";
import { v4 as uuid } from "uuid";

/**
 * Query para generar el reporte de Libro Diario Asientos
 */
export class GenerarLibroDiarioAsientosQuery implements IQuery {
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(
    public readonly conjunto: string,
    public readonly filtros: GenerarLibroDiarioAsientosParams
  ) {}
}
