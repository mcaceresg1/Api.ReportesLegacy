import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { ObtenerLibroDiarioAsientosQuery } from "../../queries/libro-diario-asientos/ObtenerLibroDiarioAsientosQuery";
import { LibroDiarioAsientosResponse } from "../../../domain/entities/LibroDiarioAsientos";
import { ILibroDiarioAsientosService } from "../../../domain/services/ILibroDiarioAsientosService";

/**
 * Handler para obtener los datos del Libro Diario Asientos
 */
@injectable()
export class ObtenerLibroDiarioAsientosHandler
  implements IQueryHandler<ObtenerLibroDiarioAsientosQuery, LibroDiarioAsientosResponse>
{
  constructor(
    @inject("ILibroDiarioAsientosService")
    private readonly libroDiarioAsientosService: ILibroDiarioAsientosService
  ) {}

  async handle(query: ObtenerLibroDiarioAsientosQuery): Promise<LibroDiarioAsientosResponse> {
    return await this.libroDiarioAsientosService.obtenerAsientos(
      query.conjunto,
      query.filtros
    );
  }
}
