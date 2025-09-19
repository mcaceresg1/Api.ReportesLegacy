import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { GetVentasGeneralesOficonQuery } from "../../queries/ventas-generales-oficon/GetVentasGeneralesOficonQuery";
import { IVentasGeneralesOficonService } from "../../../domain/services/IVentasGeneralesOficonService";
import { VentasGeneralesOficon } from "../../../domain/entities/VentasGeneralesOficon";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/container/types";

@injectable()
export class GetVentasGeneralesOficonHandler
  implements
    IQueryHandler<GetVentasGeneralesOficonQuery, VentasGeneralesOficon[]>
{
  constructor(
    @inject(TYPES.IVentasGeneralesOficonService)
    private readonly ventasGeneralesOficonService: IVentasGeneralesOficonService
  ) {}

  async handle(
    query: GetVentasGeneralesOficonQuery
  ): Promise<VentasGeneralesOficon[]> {
    return await this.ventasGeneralesOficonService.generarReporteVentasGeneralesOficon(
      query.request
    );
  }
}
