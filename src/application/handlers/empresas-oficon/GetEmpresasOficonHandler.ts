import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { GetEmpresasOficonQuery } from "../../queries/empresas-oficon/GetEmpresasOficonQuery";
import { IEmpresasOficonRepository } from "../../../domain/repositories/IEmpresasOficonRepository";
import { TYPES } from "../../../infrastructure/container/types";
import {
  EmpresaOficon,
  EmpresasOficonResponse,
} from "../../../domain/entities/EmpresaOficon";

@injectable()
export class GetEmpresasOficonHandler
  implements IQueryHandler<GetEmpresasOficonQuery, EmpresasOficonResponse>
{
  constructor(
    @inject(TYPES.IEmpresasOficonRepository)
    private readonly empresasOficonRepository: IEmpresasOficonRepository
  ) {}

  async handle(query: GetEmpresasOficonQuery): Promise<EmpresasOficonResponse> {
    try {
      console.log("🏢 [HANDLER] Ejecutando consulta de empresas OFICON");

      const empresas = await this.empresasOficonRepository.getEmpresas();

      console.log("🏢 [HANDLER] Empresas obtenidas:", {
        total: empresas.length,
        empresas: empresas.slice(0, 3), // Log first 3 for debugging
      });

      return {
        success: true,
        data: empresas,
        message: "Empresas obtenidas exitosamente",
      };
    } catch (error) {
      console.error("❌ [HANDLER] Error al obtener empresas:", error);

      return {
        success: false,
        data: [],
        message:
          error instanceof Error ? error.message : "Error interno del servidor",
      };
    }
  }
}
