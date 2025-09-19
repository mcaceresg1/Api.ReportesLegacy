import { injectable, inject } from "inversify";
import { IPlanillaAnualizadaOfliplanService } from "../../domain/services/IPlanillaAnualizadaOfliplanService";
import { IPlanillaAnualizadaOfliplanRepository } from "../../domain/repositories/IPlanillaAnualizadaOfliplanRepository";
import {
  PlanillaAnualizadaOfliplan,
  PlanillaAnualizadaOfliplanRequest,
} from "../../domain/entities/PlanillaAnualizadaOfliplan";

@injectable()
export class PlanillaAnualizadaOfliplanService
  implements IPlanillaAnualizadaOfliplanService
{
  constructor(
    @inject("IPlanillaAnualizadaOfliplanRepository")
    private readonly planillaAnualizadaOfliplanRepository: IPlanillaAnualizadaOfliplanRepository
  ) {}

  async generarReportePlanillaAnualizadaOfliplan(
    request: PlanillaAnualizadaOfliplanRequest
  ): Promise<PlanillaAnualizadaOfliplan[]> {
    try {
      console.log(
        "🔍 PlanillaAnualizadaOfliplanService - Iniciando generación de reporte"
      );
      console.log("📋 Parámetros recibidos:", request);

      const result =
        await this.planillaAnualizadaOfliplanRepository.generarReportePlanillaAnualizadaOfliplan(
          request
        );

      console.log(
        `✅ PlanillaAnualizadaOfliplanService - Reporte generado exitosamente. Registros: ${result.length}`
      );
      return result;
    } catch (error) {
      console.error(
        "Error en PlanillaAnualizadaOfliplanService.generarReportePlanillaAnualizadaOfliplan:",
        error
      );
      throw error;
    }
  }
}
