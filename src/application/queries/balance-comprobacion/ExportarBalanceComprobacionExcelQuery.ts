import { IQuery } from "../../../domain/cqrs/IQuery";
import { v4 as uuid } from "uuid";

/**
 * Query para exportar el Balance de Comprobación a Excel
 * Implementa el patrón Query del CQRS para operaciones de lectura
 */
export class ExportarBalanceComprobacionExcelQuery implements IQuery {
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(
    public readonly conjunto: string,
    public readonly usuario: string,
    public readonly fechaInicio: Date,
    public readonly fechaFin: Date,
    public readonly contabilidad?: string,
    public readonly tipoReporte?: string,
    public readonly limit?: number
  ) {}
}
