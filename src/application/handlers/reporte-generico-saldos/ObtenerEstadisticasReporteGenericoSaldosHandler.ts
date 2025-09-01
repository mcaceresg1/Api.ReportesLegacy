import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { ObtenerEstadisticasReporteGenericoSaldosQuery } from "../../queries/reporte-generico-saldos/ObtenerEstadisticasReporteGenericoSaldosQuery";
import { IReporteGenericoSaldosService } from "../../../domain/services/IReporteGenericoSaldosService";
import { EstadisticasReporteGenericoSaldos } from "../../../domain/entities/ReporteGenericoSaldos";

@injectable()
export class ObtenerEstadisticasReporteGenericoSaldosHandler
  implements
    IQueryHandler<
      ObtenerEstadisticasReporteGenericoSaldosQuery,
      EstadisticasReporteGenericoSaldos
    >
{
  constructor(
    @inject("IReporteGenericoSaldosService")
    private reporteGenericoSaldosService: IReporteGenericoSaldosService
  ) {}

  async handle(
    query: ObtenerEstadisticasReporteGenericoSaldosQuery
  ): Promise<EstadisticasReporteGenericoSaldos> {
    const resultado =
      await this.reporteGenericoSaldosService.obtenerEstadisticas(
        query.filtros.conjunto,
        query.filtros
      );
    return resultado;
  }
}
