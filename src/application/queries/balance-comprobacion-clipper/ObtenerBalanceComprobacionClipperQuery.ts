import { IQuery } from "../../../domain/cqrs/IQuery";
import { v4 as uuid } from "uuid";

/**
 * Query para obtener el Balance de Comprobación desde Clipper
 * Implementa el patrón CQRS para operaciones de lectura
 */
export class ObtenerBalanceComprobacionClipperQuery implements IQuery {
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly bdClipperGPC: string) {
    // Requiere el nombre de la base de datos Clipper GPC
  }
}
