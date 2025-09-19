import { injectable } from "inversify";
import { ILibroInventarioBalanceOficonRepository } from "../../domain/repositories/ILibroInventarioBalanceOficonRepository";
import {
  LibroInventarioBalanceOficon,
  LibroInventarioBalanceOficonRequest,
} from "../../domain/entities/LibroInventarioBalanceOficon";
import { oficonSequelize } from "../database/config/oficon-database";
import { QueryTypes } from "sequelize";

@injectable()
export class LibroInventarioBalanceOficonRepository
  implements ILibroInventarioBalanceOficonRepository
{
  async generarReporteLibroInventarioBalanceOficon(
    request: LibroInventarioBalanceOficonRequest
  ): Promise<LibroInventarioBalanceOficon[]> {
    try {
      console.log(
        "🔍 LibroInventarioBalanceOficonRepository - Iniciando consulta"
      );
      console.log("📋 Parámetros recibidos:", request);

      const query = `
        EXEC SP_TASALD_EMPR_Q26 
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
        `✅ LibroInventarioBalanceOficonRepository - Consulta exitosa. Registros: ${data.length}`
      );
      return data as LibroInventarioBalanceOficon[];
    } catch (error) {
      console.error(
        "Error en LibroInventarioBalanceOficonRepository.generarReporteLibroInventarioBalanceOficon:",
        error
      );
      throw new Error(
        `Error al generar reporte de libro inventario balance OFICON: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}
