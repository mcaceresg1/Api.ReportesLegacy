import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { GetEmpresasOfliplanQuery } from "../../queries/empresas-ofliplan/GetEmpresasOfliplanQuery";
import { IEmpresasOfliplanRepository } from "../../../domain/repositories/IEmpresasOfliplanRepository";
import { TYPES } from "../../../infrastructure/container/types";
import { EmpresasOfliplanResponse } from "../../../domain/entities/EmpresaOfliplan";

@injectable()
export class GetEmpresasOfliplanHandler
  implements IQueryHandler<GetEmpresasOfliplanQuery, EmpresasOfliplanResponse>
{
  constructor(
    @inject(TYPES.IEmpresasOfliplanRepository)
    private readonly empresasOfliplanRepository: IEmpresasOfliplanRepository
  ) {}

  async handle(
    query: GetEmpresasOfliplanQuery
  ): Promise<EmpresasOfliplanResponse> {
    try {
      console.log("🏢 [HANDLER] Procesando consulta de empresas OFIPLAN");

      const empresas = await this.empresasOfliplanRepository.getEmpresas();

      const response: EmpresasOfliplanResponse = {
        success: true,
        data: empresas,
        message: "Empresas obtenidas exitosamente",
      };

      console.log("🏢 [HANDLER] Consulta procesada exitosamente:", {
        totalEmpresas: empresas.length,
      });

      return response;
    } catch (error) {
      console.error(
        "❌ [HANDLER] Error al procesar consulta de empresas:",
        error
      );

      const errorResponse: EmpresasOfliplanResponse = {
        success: false,
        data: [],
        message:
          error instanceof Error
            ? error.message
            : "Error al obtener las empresas",
      };

      return errorResponse;
    }
  }
}
