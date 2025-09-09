import { IQuery } from "../../../domain/cqrs/IQuery";
import { ExportarLibroMayorAsientosExcelParams } from "../../../domain/entities/LibroMayorAsientos";
import { v4 as uuid } from "uuid";

/**
 * Query para exportar el Libro Mayor Asientos a Excel
 * Implementa el patrón Query del CQRS para operaciones de lectura
 */
export class ExportarLibroMayorAsientosExcelQuery implements IQuery {
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(
    public readonly conjunto: string,
    public readonly filtros: ExportarLibroMayorAsientosExcelParams
  ) {}
}





