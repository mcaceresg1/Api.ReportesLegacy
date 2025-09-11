import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { ObtenerFiltrosLibroDiarioAsientosQuery } from "../../queries/libro-diario-asientos/ObtenerFiltrosLibroDiarioAsientosQuery";
import { FiltrosDisponibles } from "../../../domain/entities/LibroDiarioAsientos";
import { ILibroDiarioAsientosService } from "../../../domain/services/ILibroDiarioAsientosService";

/**
 * Handler para obtener los filtros disponibles del Libro Diario Asientos
 */
@injectable()
export class ObtenerFiltrosLibroDiarioAsientosHandler
  implements IQueryHandler<ObtenerFiltrosLibroDiarioAsientosQuery, FiltrosDisponibles>
{
  constructor(
    @inject("ILibroDiarioAsientosService")
    private readonly libroDiarioAsientosService: ILibroDiarioAsientosService
  ) {}

  async handle(query: ObtenerFiltrosLibroDiarioAsientosQuery): Promise<FiltrosDisponibles> {
    return await this.libroDiarioAsientosService.obtenerFiltros(query.conjunto);
  }
}
