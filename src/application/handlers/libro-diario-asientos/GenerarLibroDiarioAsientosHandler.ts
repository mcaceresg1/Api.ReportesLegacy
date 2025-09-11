import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { GenerarLibroDiarioAsientosQuery } from "../../queries/libro-diario-asientos/GenerarLibroDiarioAsientosQuery";
import { LibroDiarioAsientosResponse } from "../../../domain/entities/LibroDiarioAsientos";
import { ILibroDiarioAsientosService } from "../../../domain/services/ILibroDiarioAsientosService";

/**
 * Handler para generar el reporte de Libro Diario Asientos
 */
@injectable()
export class GenerarLibroDiarioAsientosHandler
  implements IQueryHandler<GenerarLibroDiarioAsientosQuery, LibroDiarioAsientosResponse>
{
  constructor(
    @inject("ILibroDiarioAsientosService")
    private readonly libroDiarioAsientosService: ILibroDiarioAsientosService
  ) {}

  async handle(query: GenerarLibroDiarioAsientosQuery): Promise<LibroDiarioAsientosResponse> {
    return await this.libroDiarioAsientosService.generarReporte(
      query.conjunto,
      query.filtros
    );
  }
}
