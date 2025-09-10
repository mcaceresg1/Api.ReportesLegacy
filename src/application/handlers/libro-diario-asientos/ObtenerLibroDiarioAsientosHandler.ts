import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { ObtenerLibroDiarioAsientosQuery } from "../../queries/libro-diario-asientos/ObtenerLibroDiarioAsientosQuery";
import { ILibroDiarioAsientosService } from "../../../domain/services/ILibroDiarioAsientosService";
import { LibroDiarioAsientosResponse } from "../../../domain/entities/LibroDiarioAsientos";

@injectable()
export class ObtenerLibroDiarioAsientosHandler
  implements IQueryHandler<ObtenerLibroDiarioAsientosQuery, LibroDiarioAsientosResponse>
{
  constructor(
    @inject("ILibroDiarioAsientosService")
    private libroDiarioAsientosService: ILibroDiarioAsientosService
  ) {}

  async handle(
    query: ObtenerLibroDiarioAsientosQuery
  ): Promise<LibroDiarioAsientosResponse> {
    console.log("Ejecutando query ObtenerLibroDiarioAsientosQuery");

    const resultado = await this.libroDiarioAsientosService.obtenerAsientos(
      query.conjunto,
      query.filtros
    );

    console.log("Query ObtenerLibroDiarioAsientosQuery ejecutada exitosamente");
    return resultado;
  }
}
