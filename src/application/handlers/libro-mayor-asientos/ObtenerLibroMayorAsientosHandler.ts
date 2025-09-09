import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { ObtenerLibroMayorAsientosQuery } from "../../queries/libro-mayor-asientos/ObtenerLibroMayorAsientosQuery";
import { ILibroMayorAsientosService } from "../../../domain/services/ILibroMayorAsientosService";
import { LibroMayorAsientosResponse } from "../../../domain/entities/LibroMayorAsientos";

@injectable()
export class ObtenerLibroMayorAsientosHandler
  implements IQueryHandler<ObtenerLibroMayorAsientosQuery, LibroMayorAsientosResponse>
{
  constructor(
    @inject("ILibroMayorAsientosService")
    private libroMayorAsientosService: ILibroMayorAsientosService
  ) {}

  async handle(
    query: ObtenerLibroMayorAsientosQuery
  ): Promise<LibroMayorAsientosResponse> {
    console.log("Ejecutando query ObtenerLibroMayorAsientosQuery");

    const resultado = await this.libroMayorAsientosService.obtenerAsientos(
      query.conjunto,
      query.filtros
    );

    console.log("Query ObtenerLibroMayorAsientosQuery ejecutada exitosamente");
    return resultado;
  }
}





