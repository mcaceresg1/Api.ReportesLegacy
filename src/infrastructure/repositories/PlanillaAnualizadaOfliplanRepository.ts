import { injectable } from "inversify";
import { IPlanillaAnualizadaOfliplanRepository } from "../../domain/repositories/IPlanillaAnualizadaOfliplanRepository";
import {
  PlanillaAnualizadaOfliplan,
  PlanillaAnualizadaOfliplanRequest,
} from "../../domain/entities/PlanillaAnualizadaOfliplan";
import { ofliplanSequelize } from "../database/config/ofliplan-database";
import { QueryTypes } from "sequelize";

@injectable()
export class PlanillaAnualizadaOfliplanRepository
  implements IPlanillaAnualizadaOfliplanRepository
{
  async generarReportePlanillaAnualizadaOfliplan(
    request: PlanillaAnualizadaOfliplanRequest
  ): Promise<PlanillaAnualizadaOfliplan[]> {
    try {
      console.log(
        "🔍 PlanillaAnualizadaOfliplanRepository - Iniciando consulta SP_TMTRAB_CALC_Q04"
      );
      console.log("📋 Parámetros:", request);

      // Ejecutar el stored procedure SP_TMTRAB_CALC_Q04
      const result = await ofliplanSequelize.query(
        `EXEC SP_TMTRAB_CALC_Q04 
          @ISCO_EMPR = :ISCO_EMPR,
          @INNU_ANNO = :INNU_ANNO,
          @ISTI_ORDE = ' ORDER BY 1,2,3,4,5,6,7,8,9,10,11,12 ',
          @ISCO_WHE1 = '  And TMTRAB_CALC.CO_TRAB in ( ''06143721'',''25783212'',''32805686'')',
          @ISCO_WHE2 = '',
          @ISCO_WHE3 = '',
          @ISCO_WHE4 = '',
          @ISCO_WHE5 = '',
          @ISCO_GRUP = 'CONSULTA'`,
        {
          replacements: {
            ISCO_EMPR: request.ISCO_EMPR,
            INNU_ANNO: request.INNU_ANNO,
          },
          type: QueryTypes.SELECT,
        }
      );

      console.log(
        `✅ PlanillaAnualizadaOfliplanRepository - Consulta ejecutada exitosamente. Registros: ${result.length}`
      );

      // Mapear los resultados a la entidad
      const planillaData: PlanillaAnualizadaOfliplan[] = result.map(
        (row: any) => ({
          CO_EMPR_RPTS: row.CO_EMPR_RPTS || "",
          DE_NOMB_CORT: row.DE_NOMB_CORT || "",
          CO_UNID_RPTS: row.CO_UNID_RPTS || "",
          DE_UNID_RPTS: row.DE_UNID_RPTS || "",
          CO_PLAN_RPTS: row.CO_PLAN_RPTS || "",
          DE_TIPO_PLAN: row.DE_TIPO_PLAN || "",
          CO_TRAB_RPTS: row.CO_TRAB_RPTS || "",
          NO_TRAB_RPTS: row.NO_TRAB_RPTS || "",
          TI_CPTO_RPTS: row.TI_CPTO_RPTS || "",
          CO_CPTO_FORM: row.CO_CPTO_FORM || "",
          NU_ORDE_PRES: row.NU_ORDE_PRES || 0,
          DE_CPTO_RPTS: row.DE_CPTO_RPTS || "",
          TI_AFEC_RPTS: row.TI_AFEC_RPTS || "",
          CO_CENT_COST: row.CO_CENT_COST || "",
          DE_CENT_COST: row.DE_CENT_COST || "",
          CO_PUES_TRAB: row.CO_PUES_TRAB || "",
          DE_PUES_TRAB: row.DE_PUES_TRAB || "",
          NU_AFPS: row.NU_AFPS || 0,
          NU_ESSA: row.NU_ESSA || 0,
          CO_AFPS: row.CO_AFPS || "",
          NO_AFPS: row.NO_AFPS || "",
          NU_DATO_ENER: row.NU_DATO_ENER || 0,
          NU_DATO_FEBR: row.NU_DATO_FEBR || 0,
          NU_DATO_MARZ: row.NU_DATO_MARZ || 0,
          NU_DATO_ABRI: row.NU_DATO_ABRI || 0,
          NU_DATO_MAYO: row.NU_DATO_MAYO || 0,
          NU_DATO_JUNI: row.NU_DATO_JUNI || 0,
          NU_DATO_JULI: row.NU_DATO_JULI || 0,
          NU_DATO_AGOS: row.NU_DATO_AGOS || 0,
          NU_DATO_SETI: row.NU_DATO_SETI || 0,
          NU_DATO_OCTU: row.NU_DATO_OCTU || 0,
          NU_DATO_NOVI: row.NU_DATO_NOVI || 0,
          NU_DATO_DICI: row.NU_DATO_DICI || 0,
        })
      );

      return planillaData;
    } catch (error) {
      console.error(
        "❌ Error en PlanillaAnualizadaOfliplanRepository.generarReportePlanillaAnualizadaOfliplan:",
        error
      );
      console.error("📋 Detalles del error:", {
        message: error instanceof Error ? error.message : "Error desconocido",
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      });
      throw error;
    }
  }
}
