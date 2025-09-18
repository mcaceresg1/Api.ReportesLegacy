import { injectable } from "inversify";
import { IRegistroComprasOficonRepository } from "../../domain/repositories/IRegistroComprasOficonRepository";
import {
  RegistroComprasOficon,
  RegistroComprasOficonRequest,
} from "../../domain/entities/RegistroComprasOficon";
import { oficonSequelize } from "../database/config/oficon-database";
import { QueryTypes } from "sequelize";

@injectable()
export class RegistroComprasOficonRepository
  implements IRegistroComprasOficonRepository
{
  async generarReporteRegistroComprasOficon(
    request: RegistroComprasOficonRequest
  ): Promise<RegistroComprasOficon[]> {
    try {
      console.log("🔍 RegistroComprasOficonRepository - Iniciando consulta");
      console.log("📋 Parámetros recibidos:", request);

      const query = `
        EXEC SP_TXMVTO_CNTB_Q20 
        @ISCO_EMPR = :ISCO_EMPR,
        @ISCA_WHER_LOCA = '',
        @INNU_CNTB_EMPR = 1,
        @INNU_ANNO = :INNU_ANNO,
        @INNU_MESE_INIC = :INNU_MESE_INIC,
        @INNU_MESE_FINA = :INNU_MESE_FINA,
        @ISTI_REPO = :ISTI_REPO,
        @ISTI_ORDE_REPO = :ISTI_ORDE_REPO,
        @ISTI_INFO = :ISTI_INFO
      `;

      const results = await oficonSequelize.query(query, {
        replacements: {
          ISCO_EMPR: request.ISCO_EMPR,
          INNU_ANNO: request.INNU_ANNO,
          INNU_MESE_INIC: request.INNU_MESE_INIC,
          INNU_MESE_FINA: request.INNU_MESE_FINA,
          ISTI_REPO: request.ISTI_REPO,
          ISTI_ORDE_REPO: request.ISTI_ORDE_REPO,
          ISTI_INFO: request.ISTI_INFO,
        },
        type: QueryTypes.SELECT,
      });

      const data = Array.isArray(results) ? results : [];
      console.log(
        `✅ RegistroComprasOficonRepository - Consulta exitosa. Registros: ${data.length}`
      );
      return data as RegistroComprasOficon[];
    } catch (error) {
      console.error(
        "Error en RegistroComprasOficonRepository.generarReporteRegistroComprasOficon:",
        error
      );
      throw new Error(
        `Error al generar reporte de registro compras OFICON: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}
