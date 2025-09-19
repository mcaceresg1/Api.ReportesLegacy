import { injectable } from "inversify";
import { IVentasGeneralesOficonRepository } from "../../domain/repositories/IVentasGeneralesOficonRepository";
import {
  VentasGeneralesOficon,
  VentasGeneralesOficonRequest,
} from "../../domain/entities/VentasGeneralesOficon";
import { oficonSequelize } from "../database/config/oficon-database";
import { QueryTypes } from "sequelize";

@injectable()
export class VentasGeneralesOficonRepository
  implements IVentasGeneralesOficonRepository
{
  async generarReporteVentasGeneralesOficon(
    request: VentasGeneralesOficonRequest
  ): Promise<VentasGeneralesOficon[]> {
    try {
      console.log("🔍 VentasGeneralesOficonRepository - Iniciando consulta");
      console.log("📋 Parámetros recibidos:", request);

      const query = `
        EXEC SP_TXMVTO_CNTB_Q21 
        @ISCO_EMPR = :ISCO_EMPR,
        @ISCA_WHER_LOCA = :ISCA_WHER_LOCA,
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
          ISCA_WHER_LOCA:
            " And TXMVTO_CNTB.TI_AUXI_EMPR in ( 'P','R','T','V' ) And TXMVTO_CNTB.TI_DOCU in ( 'ABO','APE','BD','BOL','CHE','DEP','FXP','ME','NCB','NCC','NDC','OC','RHP','RP','RSP','RST','RXA','TCK','VOU' )",
          INNU_ANNO: request.INNU_ANNO,
          INNU_MESE_INIC: request.INNU_MESE_INIC,
          INNU_MESE_FINA: request.INNU_MESE_FINA,
          ISTI_REPO: request.ISTI_REPO || "ANA",
          ISTI_ORDE_REPO: request.ISTI_ORDE_REPO || "FEC",
          ISTI_INFO: request.ISTI_INFO || "ORI",
        },
        type: QueryTypes.SELECT,
      });

      const data = Array.isArray(results) ? results : [];
      console.log(
        `✅ VentasGeneralesOficonRepository - Consulta exitosa. Registros: ${data.length}`
      );
      return data as VentasGeneralesOficon[];
    } catch (error) {
      console.error(
        "Error en VentasGeneralesOficonRepository.generarReporteVentasGeneralesOficon:",
        error
      );
      throw new Error(
        `Error al generar reporte de ventas generales OFICON: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}
