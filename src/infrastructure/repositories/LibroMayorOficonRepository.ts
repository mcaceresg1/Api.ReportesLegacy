import { injectable } from "inversify";
import { ILibroMayorOficonRepository } from "../../domain/repositories/ILibroMayorOficonRepository";
import {
  LibroMayorOficon,
  LibroMayorOficonRequest,
} from "../../domain/entities/LibroMayorOficon";
import { oficonSequelize } from "../database/config/oficon-database";
import { QueryTypes } from "sequelize";

@injectable()
export class LibroMayorOficonRepository implements ILibroMayorOficonRepository {
  async generarReporteLibroMayorOficon(
    request: LibroMayorOficonRequest
  ): Promise<LibroMayorOficon[]> {
    try {
      // Ejecutar el stored procedure con valores fijos
      const results = await oficonSequelize.query(
        "EXEC [dbo].[SP_TXMVTO_CNTB_Q13] @ISCO_EMPR = :ISCO_EMPR, @INNU_CNTB_EMPR = 1, @INNU_ANNO = :INNU_ANNO, @INNU_MESE_INIC = :INNU_MESE_INIC, @INNU_MESE_FINA = :INNU_MESE_FINA, @ISCO_MONE = :ISCO_MONE, @ISCO_UNID_CNTB = '', @ISCO_OPRC_CNTB = '', @ISCO_CNTA_EMP1 = '', @ISCO_CNTA_EMP2 = '', @ISTI_AUXI_EMPR = '', @ISCO_AUXI_EMP1 = '', @ISCO_AUXI_EMP2 = '', @INNV_INFO_CNTA = 7, @ISTI_REPO = :ISTI_REPO, @ISNO_USUA = 'EDGAR RAMIREZ', @ISCA_WHER = ' And TXMVTO_CNTB.CO_AUXI_EMPR in ( ''00000000041'',''00011332749'',''00067907'',''00068627'',''0010007'' )'",
        {
          replacements: {
            ISCO_EMPR: request.ISCO_EMPR,
            INNU_ANNO: request.INNU_ANNO,
            INNU_MESE_INIC: request.INNU_MESE_INIC,
            INNU_MESE_FINA: request.INNU_MESE_FINA,
            ISCO_MONE: request.ISCO_MONE,
            ISTI_REPO: request.ISTI_REPO,
          },
          type: QueryTypes.SELECT,
        }
      );

      return results as LibroMayorOficon[];
    } catch (error) {
      console.error(
        "Error en LibroMayorOficonRepository.generarReporteLibroMayorOficon:",
        error
      );
      throw new Error(
        `Error al generar reporte de libro mayor OFICON: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}
