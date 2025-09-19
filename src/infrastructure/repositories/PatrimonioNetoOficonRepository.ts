import { injectable } from "inversify";
import { IPatrimonioNetoOficonRepository } from "../../domain/repositories/IPatrimonioNetoOficonRepository";
import {
  PatrimonioNetoOficon,
  PatrimonioNetoOficonRequest,
} from "../../domain/entities/PatrimonioNetoOficon";
import { oficonSequelize } from "../database/config/oficon-database";
import { QueryTypes } from "sequelize";

@injectable()
export class PatrimonioNetoOficonRepository
  implements IPatrimonioNetoOficonRepository
{
  async generarReportePatrimonioNetoOficon(
    request: PatrimonioNetoOficonRequest
  ): Promise<PatrimonioNetoOficon[]> {
    try {
      console.log("🔍 PatrimonioNetoOficonRepository - Iniciando consulta");
      console.log("📋 Parámetros recibidos:", request);

      const query = `
        EXEC SP_TXMVTO_CNTB_Q06 
        @ISCO_EMPR = :ISCO_EMPR,
        @INNU_CNTB_EMPR = 1,
        @INNU_ANNO = :INNU_ANNO,
        @INNU_MESE = :INNU_MESE
      `;

      const results = await oficonSequelize.query(query, {
        replacements: {
          ISCO_EMPR: request.ISCO_EMPR,
          INNU_ANNO: request.INNU_ANNO,
          INNU_MESE: request.INNU_MESE,
        },
        type: QueryTypes.SELECT,
      });

      const data = Array.isArray(results) ? results : [];
      console.log(
        `✅ PatrimonioNetoOficonRepository - Consulta exitosa. Registros: ${data.length}`
      );
      return data as PatrimonioNetoOficon[];
    } catch (error) {
      console.error(
        "Error en PatrimonioNetoOficonRepository.generarReportePatrimonioNetoOficon:",
        error
      );
      throw new Error(
        `Error al generar reporte de patrimonio neto OFICON: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}
