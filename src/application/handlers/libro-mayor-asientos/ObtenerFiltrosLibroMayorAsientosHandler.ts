import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { ObtenerFiltrosLibroMayorAsientosQuery } from "../../queries/libro-mayor-asientos/ObtenerFiltrosLibroMayorAsientosQuery";
import { ILibroMayorAsientosService } from "../../../domain/services/ILibroMayorAsientosService";

@injectable()
export class ObtenerFiltrosLibroMayorAsientosHandler
  implements IQueryHandler<ObtenerFiltrosLibroMayorAsientosQuery, { asiento: string; referencia: string }[]>
{
  constructor(
    @inject("ILibroMayorAsientosService")
    private libroMayorAsientosService: ILibroMayorAsientosService
  ) {}

  async handle(
    query: ObtenerFiltrosLibroMayorAsientosQuery
  ): Promise<{ asiento: string; referencia: string }[]> {
    console.log("Ejecutando query ObtenerFiltrosLibroMayorAsientosQuery");

    const resultado = await this.libroMayorAsientosService.obtenerFiltros(
      query.conjunto
    );

    console.log("Query ObtenerFiltrosLibroMayorAsientosQuery ejecutada exitosamente");
    return resultado;
  }
}





