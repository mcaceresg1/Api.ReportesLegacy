import { injectable, inject } from "inversify";
import { IPatrimonioNetoOficonService } from "../../domain/services/IPatrimonioNetoOficonService";
import { IPatrimonioNetoOficonRepository } from "../../domain/repositories/IPatrimonioNetoOficonRepository";
import {
  PatrimonioNetoOficon,
  PatrimonioNetoOficonRequest,
} from "../../domain/entities/PatrimonioNetoOficon";

@injectable()
export class PatrimonioNetoOficonService
  implements IPatrimonioNetoOficonService
{
  constructor(
    @inject("IPatrimonioNetoOficonRepository")
    private readonly patrimonioNetoOficonRepository: IPatrimonioNetoOficonRepository
  ) {}

  async generarReportePatrimonioNetoOficon(
    request: PatrimonioNetoOficonRequest
  ): Promise<PatrimonioNetoOficon[]> {
    try {
      console.log(
        "🔍 PatrimonioNetoOficonService - Iniciando generación de reporte"
      );
      console.log("📋 Parámetros recibidos:", request);

      const result =
        await this.patrimonioNetoOficonRepository.generarReportePatrimonioNetoOficon(
          request
        );

      console.log(
        `✅ PatrimonioNetoOficonService - Reporte generado exitosamente. Registros: ${result.length}`
      );
      return result;
    } catch (error) {
      console.error(
        "Error en PatrimonioNetoOficonService.generarReportePatrimonioNetoOficon:",
        error
      );
      throw error;
    }
  }
}
