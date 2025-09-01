import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { ObtenerReporteGenericoSaldosQuery } from "../../queries/reporte-generico-saldos/ObtenerReporteGenericoSaldosQuery";
import { IReporteGenericoSaldosService } from "../../../domain/services/IReporteGenericoSaldosService";
import { ReporteGenericoSaldosResponse } from "../../../domain/entities/ReporteGenericoSaldos";

@injectable()
export class ObtenerReporteGenericoSaldosHandler
  implements
    IQueryHandler<
      ObtenerReporteGenericoSaldosQuery,
      ReporteGenericoSaldosResponse
    >
{
  constructor(
    @inject("IReporteGenericoSaldosService")
    private reporteGenericoSaldosService: IReporteGenericoSaldosService
  ) {}

  async handle(
    query: ObtenerReporteGenericoSaldosQuery
  ): Promise<ReporteGenericoSaldosResponse> {
    const resultado =
      await this.reporteGenericoSaldosService.obtenerReporteGenericoSaldos(
        query.filtros.conjunto,
        query.filtros
      );
    return resultado;
  }
}
