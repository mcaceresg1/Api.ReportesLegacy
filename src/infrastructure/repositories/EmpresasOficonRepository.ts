import { injectable } from "inversify";
import { IEmpresasOficonRepository } from "../../domain/repositories/IEmpresasOficonRepository";
import { EmpresaOficon } from "../../domain/entities/EmpresaOficon";
import { oficonSequelize } from "../database/config/oficon-database";
import { QueryTypes } from "sequelize";

@injectable()
export class EmpresasOficonRepository implements IEmpresasOficonRepository {
  async getEmpresas(): Promise<EmpresaOficon[]> {
    try {
      console.log("🏢 [REPOSITORY] Ejecutando consulta de empresas OFICON");

      const query = `
        SELECT 
          CO_EMPR, 
          DE_NOMB 
        FROM 
          [dbo].[TMEMPR]
        ORDER BY 
          CO_EMPR
      `;

      const result = await oficonSequelize.query(query, {
        type: QueryTypes.SELECT,
      });

      console.log("🏢 [REPOSITORY] Consulta ejecutada exitosamente:", {
        totalEmpresas: result.length,
      });

      return result as EmpresaOficon[];
    } catch (error) {
      console.error(
        "❌ [REPOSITORY] Error al ejecutar consulta de empresas:",
        error
      );
      throw new Error(
        `Error al obtener empresas: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}
