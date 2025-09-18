import { injectable } from "inversify";
import { IBalanceComprobacionOficonRepository } from "../../domain/repositories/IBalanceComprobacionOficonRepository";
import {
  BalanceComprobacionOficon,
  BalanceComprobacionOficonRequest,
} from "../../domain/entities/BalanceComprobacionOficon";
import { oficonSequelize } from "../database/config/oficon-database";
import { QueryTypes } from "sequelize";

@injectable()
export class BalanceComprobacionOficonRepository
  implements IBalanceComprobacionOficonRepository
{
  async generarReporteBalanceComprobacionOficon(
    request: BalanceComprobacionOficonRequest
  ): Promise<BalanceComprobacionOficon[]> {
    try {
      console.log(
        "🔍 BalanceComprobacionOficonRepository - Iniciando consulta"
      );
      console.log("📋 Parámetros recibidos:", request);

      const query = `
        EXEC SP_TASALD_EMPR_Q01 
        @ISCO_EMPR = :ISCO_EMPR,
        @INNU_CNTB_EMPR = :INNU_CNTB_EMPR,
        @INNU_ANNO = :INNU_ANNO,
        @INNU_MESE = :INNU_MESE,
        @ISTI_BALA = :ISTI_BALA,
        @ISST_QUIE = :ISST_QUIE,
        @INNV_PRES = :INNV_PRES,
        @ISCO_CNTA_INIC = '',
        @ISCO_CNTA_FINA = '',
        @INNU_DGTO = :INNU_DGTO,
        @ISTI_PRES = :ISTI_PRES,
        @ISTI_MONT = :ISTI_MONT
      `;

      const results = await oficonSequelize.query(query, {
        replacements: {
          ISCO_EMPR: request.ISCO_EMPR,
          INNU_CNTB_EMPR: request.INNV_PRES || 1,
          INNU_ANNO: request.INNU_ANNO,
          INNU_MESE: request.INNU_MESE,
          ISTI_BALA: request.ISTI_BALA || "M",
          ISST_QUIE: request.ISST_QUIE || "N",
          INNV_PRES: request.INNV_PRES || 1,
          INNU_DGTO: request.INNU_DGTO || 2,
          ISTI_PRES: request.ISTI_PRES || "REP",
          ISTI_MONT: request.ISTI_MONT || "M",
        },
        type: QueryTypes.SELECT,
      });

      const data = Array.isArray(results) ? results : [];
      console.log(
        `✅ BalanceComprobacionOficonRepository - Consulta exitosa. Registros: ${data.length}`
      );
      return data as BalanceComprobacionOficon[];
    } catch (error) {
      console.error(
        "Error en BalanceComprobacionOficonRepository.generarReporteBalanceComprobacionOficon:",
        error
      );
      throw new Error(
        `Error al generar reporte de balance comprobación OFICON: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}
