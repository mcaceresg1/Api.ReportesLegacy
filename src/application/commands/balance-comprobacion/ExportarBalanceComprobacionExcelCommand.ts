import { ICommand } from "../../../domain/cqrs/ICommand";
import { v4 as uuid } from "uuid";

/**
 * Comando para exportar el Balance de Comprobación a Excel
 * Implementa el patrón Command del CQRS para operaciones de escritura
 */
export class ExportarBalanceComprobacionExcelCommand implements ICommand {
  readonly commandId = uuid();
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
