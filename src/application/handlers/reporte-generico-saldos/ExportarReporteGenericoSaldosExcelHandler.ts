import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { ExportarReporteGenericoSaldosExcelQuery } from "../../queries/reporte-generico-saldos/ExportarReporteGenericoSaldosExcelQuery";
import { IReporteGenericoSaldosService } from "../../../domain/services/IReporteGenericoSaldosService";

@injectable()
export class ExportarReporteGenericoSaldosExcelHandler
  implements IQueryHandler<ExportarReporteGenericoSaldosExcelQuery, Buffer>
{
  constructor(
    @inject("IReporteGenericoSaldosService")
    private reporteGenericoSaldosService: IReporteGenericoSaldosService
  ) {}

  async handle(
    query: ExportarReporteGenericoSaldosExcelQuery
  ): Promise<Buffer> {
    const resultado = await this.reporteGenericoSaldosService.exportarExcel(
      query.conjunto,
      query.usuario,
      query.fechaInicio,
      query.fechaFin,
      query.contabilidad,
      query.tipoAsiento,
      query.claseAsiento,
      query.limit
    );
    return resultado;
  }
}
