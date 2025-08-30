import { injectable } from "inversify";
import { IReporteHmisRepository } from "../../domain/repositories/IReporteHmisRepository";
import { HmisReporte, CabeceraContratoHmis } from "../../domain/entities/HmisReporte";
import { hmisDatabases } from "../database/config/hmis-database";
import { QueryTypes } from "sequelize";

@injectable()
export class ReporteHmisRepository implements IReporteHmisRepository {
  /**
   * Obtiene todos los contratos por contrato
   */
  async obtenerContratos(
    dbAlias: keyof typeof hmisDatabases = "bdhmis",
    contrato: string,
  ): Promise<HmisReporte[]> {
    try {
      const sequelizeInstance = hmisDatabases[dbAlias];

      if (!sequelizeInstance) {
        throw new Error(`No existe configuración para la BD alias: ${dbAlias}`);
      }

      // 🔹 Tu query completo
      const query = `
        DECLARE @Sales_Contract VARCHAR(20) = :contrato; --- CONTRATO
        DECLARE @pi_sObjectTypeCd VARCHAR(10);
        DECLARE @sales_id BIGINT;
        DECLARE @Primary_Name_Sort VARCHAR(200);
        DECLARE @Name_Id INTEGER;
        DECLARE @Account_Nbr VARCHAR(20);

        -- Obtener el Sales_ID del contrato
        SELECT @sales_id = s.sales_id
        FROM Sales s
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;

        SELECT DISTINCT @pi_sObjectTypeCd = Object_Type_Cd 
        FROM Sales_Object_Name 
        WHERE sales_id = @sales_id;

        SELECT 
          @Primary_Name_Sort = r.Primary_Name_Sort,
          @Name_id = r.Name_ID,
          @Account_Nbr = r.Account_Nbr
        FROM Sales s
        INNER JOIN Name r ON s.Purchaser_Name_ID = r.Name_ID
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;

        ---------------NAME---------------------------------------
        SELECT 
          s.Sales_Contract_Nbr AS salesContractNumber,
          r.Primary_Full_Name AS primaryFullName
        FROM Sales s
        INNER JOIN Name r ON s.Purchaser_Name_ID = r.Name_ID
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;

        ----------------BATCH ID----------------------------------
        SELECT  
          Sales_Finance.Batch_ID         AS batchId,
          Sales_Finance.Active           AS active,
          Sales_Finance.Guaranteed_Ownership AS guaranteedOwnership,
          Sales_Finance.Plan_effective_dt AS planEffectiveDate,
          batch.batch_nbr                AS batchNumber,
          CASE 
            WHEN batch.posted = 1 THEN batch.posted
            ELSE sales_finance.active 
          END AS posted
        FROM Sales_Finance, batch
        WHERE Sales_Finance.Sales_Finance_ID = (
          SELECT MAX(Sales_Finance.Sales_Finance_ID)
          FROM Sales_Finance
          WHERE Sales_Finance.Sales_ID = @sales_id
        )
        AND sales_finance.sales_id = @sales_id
        AND sales_finance.batch_id = batch.batch_id;
      `;

      // 🔹 Ejecutar query
      const results = await sequelizeInstance.query<CabeceraContratoHmis>(query, {
        replacements: { contrato },
        type: QueryTypes.SELECT,
      });

      // 🔹 Mapeo: devolver como arreglo de HmisReporte con CabeceraContratoHmis
      return results.map((row) => ({
        CabeceraContratoHmis: {
          salesContractNumber: row.salesContractNumber,
          primaryFullName: row.primaryFullName,
          batchId: row.batchId,
          active: row.active,
          guaranteedOwnership: row.guaranteedOwnership,
          planEffectiveDate: row.planEffectiveDate,
          batchNumber: row.batchNumber,
          posted: row.posted,
        },
      })) as HmisReporte[];
    } catch (error) {
      console.error("Error obteniendo contratos HMIS:", error);
      throw new Error(`Error al obtener contratos HMIS: ${error}`);
    }
  }
}
