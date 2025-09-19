import { injectable } from "inversify";
import { IEmpresasOfliplanRepository } from "../../domain/repositories/IEmpresasOfliplanRepository";
import { EmpresaOfliplan } from "../../domain/entities/EmpresaOfliplan";
import { ofliplanSequelize } from "../database/config/ofliplan-database";
import { QueryTypes } from "sequelize";

@injectable()
export class EmpresasOfliplanRepository implements IEmpresasOfliplanRepository {
  async getEmpresas(): Promise<EmpresaOfliplan[]> {
    try {
      console.log("🏢 [REPOSITORY] Ejecutando consulta de empresas OFIPLAN");

      const query = `
        SELECT 
          CO_EMPR, 
          DE_NOMB 
        FROM 
          [dbo].[TMEMPR]
        ORDER BY 
          CO_EMPR
      `;

      const result = await ofliplanSequelize.query(query, {
        type: QueryTypes.SELECT,
      });

      console.log("🏢 [REPOSITORY] Consulta ejecutada exitosamente:", {
        totalEmpresas: result.length,
      });

      return result as EmpresaOfliplan[];
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
