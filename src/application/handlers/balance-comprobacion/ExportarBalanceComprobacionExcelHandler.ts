import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { ExportarBalanceComprobacionExcelQuery } from "../../queries/balance-comprobacion/ExportarBalanceComprobacionExcelQuery";
import { IBalanceComprobacionService } from "../../../domain/services/IBalanceComprobacionService";

@injectable()
export class ExportarBalanceComprobacionExcelHandler
  implements IQueryHandler<ExportarBalanceComprobacionExcelQuery, Buffer>
{
  constructor(
    @inject("IBalanceComprobacionService")
    private balanceComprobacionService: IBalanceComprobacionService
  ) {}

  async handle(query: ExportarBalanceComprobacionExcelQuery): Promise<Buffer> {
    console.log("Ejecutando query ExportarBalanceComprobacionExcelQuery");

    const resultado = await this.balanceComprobacionService.exportarExcel(
      query.conjunto,
      query.usuario,
      query.fechaInicio,
      query.fechaFin,
      query.contabilidad,
      query.tipoReporte,
      query.limit
    );

    console.log(
      "Query ExportarBalanceComprobacionExcelQuery ejecutada exitosamente"
    );
    return resultado;
  }
}
