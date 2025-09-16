import { injectable } from "inversify";
import { IReporteHmisRepository } from "../../domain/repositories/IReporteHmisRepository";
import {
  HmisReporte,
  CabeceraContratoHmis,
  InformacionContrato,
  Comisionista,
  Claims,
  ComentarioLink,
  NombreContrato,
  PropietarioContratante,
  ActividadContrato,
  AbonoContrato,
  TransaccionContrato,
  ItemContrato,
  FacilidadesContrato,
  InformacionFinancieraContrato,
  HmisContratoLista,
} from "../../domain/entities/HmisReporte";
import { hmisDatabases } from "../database/config/hmis-database";
import { QueryTypes, Sequelize } from "sequelize";

@injectable()
export class ReporteHmisRepository implements IReporteHmisRepository {
  // Método para obtener las bases de datos disponibles
  getAvailableDatabases(): string[] {
    return Object.keys(hmisDatabases);
  }

  // Método para validar si una base de datos existe
  isValidDatabase(dbAlias: string): boolean {
    return dbAlias in hmisDatabases;
  }

  // Método para verificar el estado de conexión de todas las bases de datos
  async verificarConexiones(): Promise<
    Array<{
      alias: string;
      name: string;
      status: "connected" | "error";
      error?: string;
    }>
  > {
    const results = [];

    for (const [alias, sequelizeInstance] of Object.entries(hmisDatabases)) {
      try {
        await sequelizeInstance.authenticate();
        results.push({
          alias,
          name: this.getDatabaseName(alias),
          status: "connected" as const,
        });
      } catch (error) {
        results.push({
          alias,
          name: this.getDatabaseName(alias),
          status: "error" as const,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return results;
  }

  // Método auxiliar para obtener el nombre de la base de datos
  private getDatabaseName(alias: string): string {
    const databaseInfo = {
      bdhmis: "HMIS Principal",
      bdhmisAQP: "HMIS Arequipa",
      bdhmisICA: "HMIS Ica",
      bdhmisPIURA: "HMIS Piura",
      bdhmisTACNA: "HMIS Tacna",
    };
    return databaseInfo[alias as keyof typeof databaseInfo] || alias;
  }

  // Método para obtener información detallada de las bases de datos disponibles
  getDatabasesInfo(): Array<{
    alias: string;
    name: string;
    description: string;
  }> {
    const databaseInfo = {
      bdhmis: {
        name: "HMIS Principal",
        description: "Base de datos principal HMIS",
      },
      bdhmisAQP: {
        name: "HMIS Arequipa",
        description: "Base de datos HMIS - Sede Arequipa",
      },
      bdhmisICA: {
        name: "HMIS Ica",
        description: "Base de datos HMIS - Sede Ica",
      },
      bdhmisPIURA: {
        name: "HMIS Piura",
        description: "Base de datos HMIS - Sede Piura",
      },
      bdhmisTACNA: {
        name: "HMIS Tacna",
        description: "Base de datos HMIS - Sede Tacna",
      },
    };

    return this.getAvailableDatabases().map((alias) => ({
      alias,
      name: databaseInfo[alias as keyof typeof databaseInfo]?.name || alias,
      description:
        databaseInfo[alias as keyof typeof databaseInfo]?.description ||
        `Base de datos ${alias}`,
    }));
  }

  async obtenerContratosId(
    dbAlias: keyof typeof hmisDatabases = "bdhmis",
    contrato: string
  ): Promise<HmisReporte[]> {
    // Validar que la base de datos existe
    if (!this.isValidDatabase(dbAlias)) {
      const availableDbs = this.getAvailableDatabases().join(", ");
      throw new Error(
        `Base de datos '${dbAlias}' no existe. Bases de datos disponibles: ${availableDbs}`
      );
    }

    const sequelizeInstance: Sequelize | undefined = hmisDatabases[dbAlias];
    if (!sequelizeInstance) {
      throw new Error(`No existe configuración para la BD alias: ${dbAlias}`);
    }

    // Validar conexión antes de ejecutar consultas
    try {
      await sequelizeInstance.authenticate();
      console.log(`✅ Conexión exitosa a ${dbAlias}`);
    } catch (error) {
      console.error(`❌ Error de conexión a ${dbAlias}:`, error);
      throw new Error(
        `No se pudo conectar a la base de datos ${dbAlias}. Verifique la configuración de conexión.`
      );
    }

    try {
      // 1️⃣ Cabecera contrato
      const cabecera = await sequelizeInstance.query<CabeceraContratoHmis>(
        `
        DECLARE @Sales_Contract VARCHAR(20) = :contrato;
        DECLARE @sales_id BIGINT;

        SELECT @sales_id = s.sales_id
        FROM Sales s
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;

        SELECT TOP 1
          s.Sales_Contract_Nbr AS salesContractNumber,
          r.Primary_Full_Name AS primaryFullName,
          sf.Batch_ID AS batchId,
          sf.Active AS active,
          sf.Guaranteed_Ownership AS guaranteedOwnership,
          sf.Plan_effective_dt AS planEffectiveDate,
          b.batch_nbr AS batchNumber,
          CASE WHEN b.posted = 1 THEN b.posted ELSE sf.active END AS posted
        FROM Sales s
        INNER JOIN Name r ON s.Purchaser_Name_ID = r.Name_ID
        INNER JOIN Sales_Finance sf ON s.Sales_ID = sf.Sales_ID
        INNER JOIN batch b ON sf.batch_id = b.batch_id
        WHERE s.Sales_Contract_Nbr = @Sales_Contract
        ORDER BY sf.Sales_Finance_ID DESC
        `,
        { replacements: { contrato }, type: QueryTypes.SELECT }
      );

      // 2️⃣ Informacion contrato
      const informacionContrato =
        await sequelizeInstance.query<InformacionContrato>(
          `
        DECLARE @Sales_Contract VARCHAR(20) = :contrato;
        DECLARE @sales_id BIGINT;

        SELECT @sales_id = s.sales_id
        FROM Sales s
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;

        SELECT
          s.sales_id,
          s.Sales_Contract_Nbr,
          s.Sale_Dt,
          t0.Descr AS Location_Cd,
          s.Sales_Status_Cd,
          t2.Descr AS Sales_Type_Cd,
          t1.Descr AS Sales_Need_Type_Cd,
          t3.Descr AS Lead_Src_Cd,
          t4.Descr AS Currency_Cd,
          s.Descr_01,
          s.Descr_02,
          s.Descr_03,
          s.Fund_Location_Group_Cd,
          s.Product_Location_Group_Cd,
          s.Qualified_For_Case_Volume,
          s.pre_printed_contract_nbr
        FROM Sales s
        LEFT JOIN Location t0 ON s.Location_Cd = t0.Location_Cd
        LEFT JOIN Sales_Need_Type t1 ON s.Sales_Need_Type_cd = t1.Sales_Need_Type_Cd
        LEFT JOIN Sales_Type t2 ON s.Sales_Type_Cd = t2.Sales_Type_Cd
        LEFT JOIN Lead_Src t3 ON s.Lead_Src_Cd = t3.Lead_Src_Cd
        LEFT JOIN Currency t4 ON s.Currency_Cd = t4.Currency_Cd
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract
        `,
          { replacements: { contrato }, type: QueryTypes.SELECT }
        );

      // 3️⃣ Comisionistas
      const comisionistas = await sequelizeInstance.query<Comisionista>(
        `
        DECLARE @Sales_Contract VARCHAR(20) = :contrato;
        DECLARE @sales_id BIGINT;

        SELECT @sales_id = s.sales_id
        FROM Sales s
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;

        SELECT SC.Name, SC.No
        FROM Sales_Counselor SC
        INNER JOIN Sales_Sales_Counselor SSC ON SC.Sales_Counselor_ID = SSC.Sales_Counselor_ID
        WHERE SSC.Sales_ID = @sales_id;
        `,
        { replacements: { contrato }, type: QueryTypes.SELECT }
      );

      // 4️⃣ Claims
      const claims = await sequelizeInstance.query<Claims>(
        `
        DECLARE @Sales_Contract VARCHAR(20) = :contrato;
        DECLARE @sales_id BIGINT;

        SELECT @sales_id = s.sales_id
        FROM Sales s
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;

        SELECT Sales_Claims.Due_Dt,
               Sales_Claims.Sales_ID,
               Sales_Claims.claim_cd,
               Sales_Claims.Reference_Nbr,
               Sales_Claims.Amt,
               Sales_Claims.Amt_Received,
               Sales_Claims.Received_Dt,
               Sales_Claims.Last_Update_Dt,
               Sales_Claims.Update_User_ID
        FROM Sales_Claims
        JOIN Claim ON Sales_Claims.Claim_Cd = Claim.Claim_Cd
        WHERE Sales_Claims.Sales_ID = @sales_id
          AND Claim.Numbered_Doc_Type_cd IS NULL;
        `,
        { replacements: { contrato }, type: QueryTypes.SELECT }
      );

      // 5️⃣ ComentarioLink
      const comentarioLinks = await sequelizeInstance.query<ComentarioLink>(
        `
        DECLARE @Sales_Contract VARCHAR(20) = :contrato;
        DECLARE @sales_id BIGINT;
        
        SELECT @sales_id = s.sales_id
        FROM Sales s
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;
      
        SELECT 
          Object_Sales.object_id,
          Mortuary_case.Case_nbr AS Object_Nbr,
          'Case' AS Object_type_cd,
          Name.Primary_Name_sort,
          Name.Name_ID,
          1 AS AUDFlag
        FROM Object_Sales WITH (NOLOCK)
        JOIN Mortuary_case WITH (NOLOCK) ON Object_Sales.object_id = Mortuary_case.Mortuary_case_id
        JOIN Name WITH (NOLOCK) ON Name.Name_id = Mortuary_case.Deceased_Name_id
        WHERE Object_Sales.Sales_id = @sales_id
          AND Object_Sales.object_type_cd = 'Case'
        
        UNION
        
        SELECT 
          Object_Sales.object_id,
          Purchase.Ownr_Id AS Object_Nbr,
          'Purchase' AS Object_type_cd,
          Name.Primary_Name_sort,
          Name.Name_ID,
          1 AS AUDFlag
        FROM Object_Sales WITH (NOLOCK)
        JOIN Purchase WITH (NOLOCK) ON Object_Sales.object_id = Purchase.Purchase_ID
        JOIN Name WITH (NOLOCK) ON Name.Name_id = Purchase.Owner_Name_ID
        WHERE Object_Sales.Sales_id = @sales_id
          AND Object_Sales.object_type_cd = 'Purchase'
        
        UNION
        
        SELECT 
          Object_Sales.object_id,
          Sales_Lead.Sales_Lead_Nbr AS Object_Nbr,
          'SalesLead' AS Object_type_cd,
          Name.Primary_Name_sort,
          Name.Name_ID,
          1 AS AUDFlag
        FROM Object_Sales WITH (NOLOCK)
        JOIN Sales_Lead WITH (NOLOCK) ON Object_Sales.object_id = Sales_Lead.Sales_Lead_Id
        JOIN Name WITH (NOLOCK) ON Name.Name_id = Sales_Lead.Sales_Lead_Name_Id
        WHERE Object_Sales.Sales_id = @sales_id
          AND Object_Sales.object_type_cd = 'SalesLead'
        
        UNION
        
        SELECT 
          Object_Sales.object_id,
          Work_Order.Work_Order_Nbr AS Object_Nbr,
          'WO' AS Object_type_cd,
          Name.Primary_Name_sort,
          Name.Name_ID,
          1 AS AUDFlag
        FROM Object_Sales WITH (NOLOCK)
        JOIN Work_Order WITH (NOLOCK) ON Object_Sales.object_id = Work_Order.Work_Order_ID
        JOIN Name WITH (NOLOCK) ON Name.Name_id = Work_Order.Contact_Name_Id
        WHERE Object_Sales.Sales_id = @sales_id
          AND Object_Sales.object_type_cd = 'WO'
        
        UNION
        
        SELECT 
          Object_Sales.object_id,
          Cremation.Cremation_Nbr AS Object_Nbr,
          'Cremation' AS Object_type_cd,
          Name.Primary_Name_sort,
          Name.Name_ID,
          1 AS AUDFlag
        FROM Object_Sales WITH (NOLOCK)
        JOIN Cremation WITH (NOLOCK) ON Object_Sales.object_id = Cremation.Cremation_ID
        JOIN Name WITH (NOLOCK) ON Name.Name_id = Cremation.Deceased_Name_Id
        WHERE Object_Sales.Sales_id = @sales_id
          AND Object_Sales.object_type_cd = 'Cremation'
        
        UNION
        
        SELECT 
          Object_Sales.object_id,
          Sales.Sales_Contract_Nbr AS Object_Nbr,
          'Sales' AS Object_type_cd,
          Name.Primary_Name_sort,
          Name.Name_ID,
          1 AS AUDFlag
        FROM Object_Sales WITH (NOLOCK)
        JOIN Sales WITH (NOLOCK) ON Object_Sales.object_id = Sales.Sales_ID
        JOIN Name WITH (NOLOCK) ON Name.Name_id = Sales.Purchaser_Name_ID
        WHERE Object_Sales.Sales_id = @sales_id
          AND Object_Sales.object_type_cd = 'Sales';
        `,
        {
          replacements: { contrato },
          type: QueryTypes.SELECT,
        }
      );

      const nombreContrato: NombreContrato[] =
        await sequelizeInstance.query<NombreContrato>(
          `
        DECLARE @Sales_Contract VARCHAR(20) = :contrato;
        DECLARE @sales_id BIGINT;
        DECLARE @pi_sObjectTypeCd VARCHAR(20) = 'Sales';  -- Puedes ajustar este valor si es dinámico
      
        -- Obtener el sales_id
        SELECT @sales_id = s.sales_id
        FROM Sales s
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;
      
        -- Tabla temporal para tipos de nombre
        DECLARE @ConfiguredNameTypes TABLE (
          Name_Type_CD CHAR(10),
          Name_Type_Descr VARCHAR(30),
          Display_Sequence TINYINT,
          Name_Id INT
        );
      
        -- Insertar tipos configurados
        INSERT INTO @ConfiguredNameTypes (Name_Type_CD, Name_Type_Descr, Display_Sequence, Name_Id)
        SELECT
          OTN.Name_Type_Cd,
          NT.Descr,
          OTN.Display_Sequence,
          SON.Name_Id
        FROM Object_Type_Name_Type OTN WITH (NOLOCK)
        INNER JOIN Name_Type NT WITH (NOLOCK) ON NT.Name_Type_Cd = OTN.Name_Type_Cd
        LEFT JOIN Sales_Object_Name SON ON
          SON.Name_Type_Cd = OTN.Name_Type_Cd
          AND SON.Object_Type_Cd = @pi_sObjectTypeCd
          AND SON.Object_Id = @sales_id
        WHERE OTN.Object_Type_Cd = @pi_sObjectTypeCd;
      
        -- Seleccionar los nombres configurados
        SELECT
          CNT.Name_Id,
          CNT.Name_Type_Cd,
          CNT.Name_Type_Descr,
          N.Ethnicity,
          N.Religion_Cd,
          N.Primary_Person_or_Business,
          N.Primary_Full_Name,
          N.Primary_Prefix,
          N.Primary_First_Name,
          N.Primary_Middle_Name,
          N.Primary_Last_Name,
          N.Primary_Suffix,
          N.Primary_Name_Sort,
          N.Primary_Street_Address,
          N.Primary_City,
          N.Primary_State,
          N.Primary_Zip,
          N.Send_No_Mail,
          N.Phone_1,
          N.SS_Nbr,
          N.Birth_Dt,
          N.Deceased,
          N.Death_Dt,
          N.Account_Nbr,
          N.Last_Update_Dt,
          N.Update_User_ID,
          N.Birth_State_Cd,
          N.Maiden_Name,
          N.Race,
          N.Occupation,
          N.Business,
          N.County,
          N.Education_Yrs,
          N.Gender,
          N.Birth_Dt_Partial,
          N.Death_Dt_Partial,
          N.Primary_Street_No,
          N.Primary_Street_Alpha,
          N.Primary_Street_Name,
          CNT.Display_Sequence
        FROM @ConfiguredNameTypes CNT
        LEFT JOIN Name N ON CNT.Name_Id = N.Name_Id
        ORDER BY CNT.Display_Sequence;
        `,
          {
            replacements: { contrato }, // Asegúrate de que `contrato` es string
            type: QueryTypes.SELECT,
          }
        );

      const propietarioContratante: PropietarioContratante[] =
        await sequelizeInstance.query<PropietarioContratante>(
          `
        DECLARE @Sales_Contract VARCHAR(20) = :contrato;
        DECLARE @sales_id BIGINT;
        DECLARE @pi_sObjectTypeCd VARCHAR(20) = 'Sales'; 
      
 
        SELECT @sales_id = s.sales_id
        FROM Sales s
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;

        DECLARE @ConfiguredNameTypes TABLE (
          Name_Type_CD CHAR(10),
          Name_Type_Descr VARCHAR(30),
          Display_Sequence TINYINT,
          Name_Id INT
        );
      
        INSERT INTO @ConfiguredNameTypes (Name_Type_CD, Name_Type_Descr, Display_Sequence, Name_Id)
        SELECT
          OTN.Name_Type_Cd,
          NT.Descr,
          OTN.Display_Sequence,
          SON.Name_Id
        FROM Object_Type_Name_Type OTN WITH (NOLOCK)
        INNER JOIN Name_Type NT WITH (NOLOCK) ON NT.Name_Type_Cd = OTN.Name_Type_Cd
        LEFT JOIN Sales_Object_Name SON ON
          SON.Name_Type_Cd = OTN.Name_Type_Cd
          AND SON.Object_Type_Cd = @pi_sObjectTypeCd
          AND SON.Object_Id = @sales_id
        WHERE OTN.Object_Type_Cd = @pi_sObjectTypeCd;
      
        SELECT
          CNT.Name_Id,
          CNT.Name_Type_Cd,
          CNT.Name_Type_Descr,
          N.Ethnicity,
          N.Religion_Cd,
          N.Primary_Person_or_Business,
          N.Primary_Full_Name,
          N.Primary_Prefix,
          N.Primary_First_Name,
          N.Primary_Middle_Name,
          N.Primary_Last_Name,
          N.Primary_Suffix,
          N.Primary_Name_Sort,
          N.Primary_Street_Address,
          N.Primary_City,
          N.Primary_State,
          N.Primary_Zip,
          N.Send_No_Mail,
          N.Phone_1,
          N.SS_Nbr,
          N.Birth_Dt,
          N.Deceased,
          N.Death_Dt,
          N.Account_Nbr,
          N.Last_Update_Dt,
          N.Update_User_ID,
          N.Birth_State_Cd,
          N.Maiden_Name,
          N.Race,
          N.Occupation,
          N.Business,
          N.County,
          N.Education_Yrs,
          N.Gender,
          N.Birth_Dt_Partial,
          N.Death_Dt_Partial,
          N.Primary_Street_No,
          N.Primary_Street_Alpha,
          N.Primary_Street_Name,
          CNT.Display_Sequence
        FROM @ConfiguredNameTypes CNT
        LEFT JOIN Name N ON CNT.Name_Id = N.Name_Id
        ORDER BY CNT.Display_Sequence;
        `,
          {
            replacements: { contrato }, // Asegúrate de que `contrato` es string
            type: QueryTypes.SELECT,
          }
        );

      const actividadContrato: ActividadContrato[] =
        await sequelizeInstance.query<ActividadContrato>(
          `
        DECLARE @Sales_Contract VARCHAR(20) = :contrato;
        DECLARE @sales_id BIGINT;
        DECLARE  @Primary_Name_Sort VARCHAR(200);
        DECLARE  @Name_id INTEGER;
        DECLARE  @Account_Nbr VARCHAR(20);
        SELECT @sales_id = s.sales_id
        FROM Sales s
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;
        
        SELECT @Primary_Name_Sort = r.Primary_Name_Sort,
        @Name_id = r.Name_ID,
        @Account_Nbr = r.Account_Nbr
        FROM Sales s
        INNER JOIN Name r ON s.Purchaser_Name_ID = r.Name_ID
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract; 
    
         select @Name_id AS Name_id, @Primary_Name_Sort AS Primary_Name_Sort, @Account_Nbr AS Account_Nbr
    
    
        DECLARE @li_sales_finance_id INT;
        DECLARE @li_sGLSSConst VARCHAR(10);
        DECLARE @ls_glDistrib_const VARCHAR(10) = 'S';
      
        SELECT @li_sales_finance_id = MAX(sales_finance_id)
        FROM sales_finance
        WHERE sales_id = @sales_id;
      
        SELECT @li_sGLSSConst = g.gl_distrib_evnt_gl_amt_type_id
        FROM gl_distrib_evnt_gl_amt_type g
        WHERE g.gl_distrib_evnt_cd = @ls_glDistrib_const
          AND g.gl_amt_type_cd = @ls_glDistrib_const;
      
        DECLARE @lt_temp TABLE (
          activity_date DATETIME,
          activity VARCHAR(20),
          activity_descr VARCHAR(50),
          amount DECIMAL(9,2),
          cash_receipt_nbr VARCHAR(30),
          cash_receipt_id INT,
          payment_type_descr VARCHAR(30),
          reference_nbr VARCHAR(30),
          payer_name VARCHAR(40),
          pmt_applied_amt DECIMAL(9,2),
          interest_amt DECIMAL(9,2),
          late_charge_amt DECIMAL(9,2),
          sales_cash_application_id INT,
          pmt_applied_dt DATETIME
        );
      
        -- Insert Cash Receipt / Down Payment
        INSERT INTO @lt_temp
        SELECT
          CASE WHEN sdp.Down_Pymt_Amt IS NULL THEN sca.Pmt_Applied_Dt ELSE sdp.Down_Pymt_Dt END,
          CASE WHEN sdp.Down_Pymt_Amt IS NULL THEN 'Cash Receipt' ELSE 'Down Payment' END,
          CASE WHEN sdp.Down_Pymt_Amt IS NULL
            THEN (SELECT crt.descr FROM cash_receipt_type crt WHERE crt.cash_receipt_type_cd = cr.cash_receipt_type_cd)
            ELSE (SELECT dpt.descr FROM down_payment_type dpt WHERE dpt.down_payment_type_cd = sdp.down_payment_type_cd)
          END,
          CASE WHEN sdp.Down_Pymt_Amt IS NULL THEN sca.pmt_applied_amt ELSE sdp.Down_Pymt_Amt END,
          cr.cash_receipt_nbr,
          cr.cash_receipt_id,
          (SELECT pt.descr FROM payment_type pt WHERE pt.payment_type_cd = cr.payment_type_cd),
          cr.reference_nbr,
          '',
          sca.pmt_applied_amt,
          sca.interest_amt,
          sca.late_charge_amt,
          sca.sales_cash_application_id,
          sca.pmt_applied_dt
        FROM sales_cash_application sca
        INNER JOIN cash_receipt cr ON sca.cash_receipt_id = cr.cash_receipt_id AND sca.sales_id = @sales_id
        LEFT JOIN sales_down_pymt sdp ON sdp.sales_cash_application_id = sca.sales_cash_application_id AND sdp.sales_id = @sales_id
        WHERE cr.amt <> 0.0;
      
        -- Insert Cash Receipt Adjustments
        INSERT INTO @lt_temp
        SELECT
          sa.Sales_Adjustment_Dt,
          'Cash Receipt Adj',
          (SELECT at.descr FROM adjustment_type at WHERE at.adjustment_type_cd = sa.adjustment_type_cd),
          sa.Amt,
          cr.cash_receipt_nbr,
          cr.cash_receipt_id,
          (SELECT pt.descr FROM payment_type pt WHERE pt.payment_type_cd = cr.payment_type_cd),
          cr.reference_nbr,
          '',
          sca.pmt_applied_amt,
          sca.interest_amt,
          sca.late_charge_amt,
          sca.sales_cash_application_id,
          sca.pmt_applied_dt
        FROM sales_cash_application sca
        INNER JOIN cash_receipt cr ON sca.cash_receipt_id = cr.cash_receipt_id AND sca.sales_id = @sales_id
        INNER JOIN sales_adjustment sa ON sa.sales_cash_application_id = sca.sales_cash_application_id AND sa.sales_id = @sales_id;
      
        -- Update payer_name
        UPDATE t
        SET payer_name = n.primary_name_sort
        FROM @lt_temp t
        INNER JOIN cash_receipt cr ON t.cash_receipt_id = cr.cash_receipt_id
        INNER JOIN name n ON cr.payer_name_id = n.name_id;
      
        -- Final result: Cash Receipts and Adjustments
        SELECT
          sf.amount_financed,
          @sales_id AS Sales_Id,
          t.activity_date,
          t.activity,
          t.activity_descr,
          t.amount,
          t.cash_receipt_nbr,
          t.cash_receipt_id,
          t.payment_type_descr,
          t.reference_nbr,
          t.payer_name,
          t.pmt_applied_amt,
          t.interest_amt,
          t.late_charge_amt,
          (
            SELECT tx.descr
            FROM txn_type tx
            WHERE tx.txn_type_cd = (
              SELECT sf2.txn_type_cd
              FROM sales_finance sf2
              WHERE sf2.sales_id = @sales_id
                AND sf2.sales_finance_id = (
                  SELECT MAX(sf3.sales_finance_id)
                  FROM sales_finance sf3
                  WHERE sf3.sales_id = @sales_id
                    AND sf3.Plan_Effective_Dt <= t.pmt_applied_dt
                )
            )
          ) AS txn_type,
          sf.txn_type_cd AS latest_txn_type
        FROM sales_finance sf
        CROSS JOIN @lt_temp t
        WHERE sf.sales_id = @sales_id
          AND sf.sales_finance_id = @li_sales_finance_id
      
        UNION ALL
      
        SELECT
          sf.amount_financed,
          @sales_id AS Sales_Id,
          st.txn_dt,
          'Contract ADJ',
          si.item_cd_desc,
          st.amt * -1,
          'N/A',
          0,
          'N/A',
          (
            SELECT i.location_group_cd + i.item_cd
            FROM item i
            WHERE i.item_id = si.product_item_id
          ),
          'N/A',
          0.00,
          0.00,
          0.00,
          (
            SELECT tx.descr
            FROM txn_type tx
            WHERE tx.txn_type_cd = (
              SELECT sf2.txn_type_cd
              FROM sales_finance sf2
              WHERE sf2.sales_id = s.sales_id
                AND sf2.sales_finance_id = (
                  SELECT MAX(sf3.sales_finance_id)
                  FROM sales_finance sf3
                  WHERE sf3.sales_id = s.sales_id
                    AND sf3.Plan_Effective_Dt <= st.txn_dt
                )
            )
          ) AS txn_type,
          sf.txn_type_cd AS latest_txn_type
        FROM sales s
        INNER JOIN sales_item si ON si.sales_id = s.sales_id
        INNER JOIN sales_txn st ON si.sales_item_id = st.sales_item_id
        INNER JOIN sales_finance sf ON sf.sales_id = s.sales_id AND sf.sales_finance_id = @li_sales_finance_id
        WHERE st.amt < 0.00
          AND st.gl_distrib_evnt_gl_amt_type_id = @li_sGLSSConst
          AND st.posted = 1
          AND s.sales_id = @sales_id;
        `,
          {
            replacements: { contrato },
            type: QueryTypes.SELECT,
          }
        );

      const abonoContrato: AbonoContrato[] =
        await sequelizeInstance.query<AbonoContrato>(
          `
        DECLARE @Sales_Contract VARCHAR(20) = :contrato;
        DECLARE @sales_id INT;
        DECLARE @Primary_Name_Sort VARCHAR(15);
      
        SELECT @sales_id = s.sales_id
        FROM Sales s
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;
      
        SELECT @Primary_Name_Sort = r.Primary_Name_Sort
        FROM Sales s
        INNER JOIN Name r ON s.Purchaser_Name_ID = r.Name_ID
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;
      
        EXEC dbo.Con_PaymentDetails_SalesId_View_SP 
          @pi_iSalesId = @sales_id, 
          @pi_sUserId = 'dba', 
          @pi_sPurchaserName = @Primary_Name_Sort;
      `,
          {
            replacements: { contrato }, // variable que viene del frontend
            type: QueryTypes.SELECT,
            raw: true,
          }
        );

      const transaccionContrato: TransaccionContrato[] =
        await sequelizeInstance.query<TransaccionContrato>(
          `
        DECLARE @Sales_Contract VARCHAR(20) = :contrato;
        DECLARE @sales_id INT;
      
        SELECT @sales_id = s.sales_id
        FROM Sales s
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;
      
        EXEC dbo.Con_SalesTransactionDetails_Sales_View_SP 
          @pi_iSalesId = @sales_id,
          @pi_sUserId = 'dba';
      `,
          {
            replacements: { contrato }, // Valor dinámico desde la interfaz
            type: QueryTypes.SELECT,
            raw: true,
          }
        );

      const itemContrato: ItemContrato[] =
        await sequelizeInstance.query<ItemContrato>(
          `
        DECLARE @Sales_Contract VARCHAR(20) = :contrato;
        DECLARE @sales_id INT;
      
        SELECT @sales_id = s.sales_id
        FROM Sales s
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;
      
        SELECT  
          s.Sales_Contract_Nbr,
          s.Sale_Dt,
          t2.Descr AS Sales_Type_Cd,
          s.Sales_Status_Cd,
          r.Primary_Full_Name,
          r.Primary_Street_Name,
          r.Phone_1,
          r.Primary_City + ',' + r.Primary_State AS primary_city
        FROM Sales s
        LEFT JOIN Location t0 ON s.Location_Cd = t0.Location_Cd
        LEFT JOIN Sales_Type t2 ON s.Sales_Type_Cd = t2.Sales_Type_Cd
        INNER JOIN Name r ON s.Purchaser_Name_ID = r.Name_ID
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;
      
        EXEC dbo.Con_LineItemInformation_View_SP 
          @pi_iSalesId = @sales_id,
          @pi_sUpdateUserId = 'dba';
      `,
          {
            replacements: { contrato }, // dinámico, viene desde el request
            type: QueryTypes.SELECT,
            raw: true,
          }
        );

      const facilidadesContrato: FacilidadesContrato[] =
        await sequelizeInstance.query<FacilidadesContrato>(
          `
        DECLARE @Sales_Contract VARCHAR(20) = :contrato;
        DECLARE @sales_id INT;
      
        SELECT @sales_id = s.sales_id
        FROM Sales s
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;
      
        SELECT  
          Sales_Finance.Sales_finance_id,
          Sales_Finance.Sales_Id,
          Sales_Finance.Plan_effective_dt,
          Sales_Finance.Ar_gl_acct_id,
          Sales_Finance.Terms_cd,
          Sales_Finance.Tax_structure_cd,
          Txn_Type.Descr AS txn_descr,
          Txn_Type.Type,
          Sales_Finance.Txn_type_cd,
          Sales_Finance.Interest_mthd_cd,
          Sales_Finance.Days_interest_free,
          Sales_Finance.Nbr_of_pymts,
          Sales_Finance.Due_dt,
          Sales_Finance.Pymnt_start_dt,
          Sales_Finance.Next_pymt_dt,
          Sales_Finance.Txn_dt,
          Sales_Finance.Late_charge_dollar_or_percent,
          Sales_Finance.Late_charge_value,
          Sales_Finance.Purchase_price,
          Sales_Finance.Sales_tax,
          Sales_Finance.Down_pymt,
          Sales_Finance.Discounts_credits,
          Sales_Finance.Amount_financed,
          Sales_Finance.Adjustments,
          Sales_Finance.Late_charges,
          Sales_Finance.Total_of_pymts,
          Sales_Finance.Balance_due,
          Sales_Finance.Interest_rate,
          Sales_Finance.Pymts_per_year,
          Sales_Finance.Payoff_dt,
          Sales_Finance.Pymt_amt,
          Sales_Finance.Finance_charge,
          Sales_Finance.Batch_id,
          Sales_Finance.Final_pymt_amt,
          Sales_Finance.Next_interest_dt,
          Sales_Finance.Reference_nbr,
          Sales_Finance.Override_pymt_amt,
          Sales_Finance.Authorized_sales_counselor_id,
          Sales_Finance.Credit_rating_cd,
          Sales_Finance.Batch_Control_Total,
          Sales_Finance.Cash_Gl_Acct_ID,
          Sales_Type.Capture_credit_info,
          Sales_Type.Default_Down_Payment_Type_Cd,
          Sales_Type.Stop_Contract_Cancel_balance_Due,
          Gl_Acct_A.Gl_main_acct,
          Gl_Acct_A.Gl_sub_acct,
          Gl_Acct_A.Descr,
          Sales.Sale_dt,
          Sales.Sale_entry_dt,
          Sales.Location_cd,
          Batch.Batch_Id,
          CASE 
            WHEN Batch.Posted = 1 THEN Batch.Posted 
            ELSE Sales_Finance.Active 
          END AS posted,
          Batch.Batch_nbr,
          Batch.Ready_To_Post,
          Batch.Posting_Status_Fg,
          Batch.Name,
          Terms.Tot_pmts_allow_override,
          Location.profit_ctr,
          Sales_Type.vary_ar_by_location,
          Sales_Finance.Days_Finance_charges_forgiven,
          Sales_Finance.Last_Pymt_Dt,
          Sales.Sales_Status_Cd
        FROM 
          Batch,
          Gl_Acct Gl_Acct_A,
          Sales,
          Sales_Finance,
          Sales_Type,
          Terms,
          Txn_Type,
          Location
        WHERE 
          Sales.Sales_Id = Sales_Finance.Sales_Id AND
          Batch.Batch_Id = Sales_Finance.Batch_Id AND
          Sales_Finance.Terms_Cd = Terms.Terms_Cd AND
          Sales_Type.Sales_Type_Cd = Sales.Sales_Type_Cd AND
          Sales_Finance.Ar_Gl_Acct_Id = Gl_Acct_A.Gl_Acct_Id AND
          Sales_Finance.Txn_Type_Cd = Txn_Type.Txn_Type_Cd AND
          Sales.Location_Cd = Location.Location_Cd AND
          Sales_Finance.Sales_Id = @sales_id
        ORDER BY sales_finance_id;
      `,
          {
            replacements: { contrato }, // <- este viene desde tu frontend o ruta
            type: QueryTypes.SELECT,
            raw: true,
          }
        );

      const informacionFinancieraContrato: InformacionFinancieraContrato[] =
        await sequelizeInstance.query<InformacionFinancieraContrato>(
          `
        DECLARE @Sales_Contract VARCHAR(20) = :contrato;
        DECLARE @sales_id INT;
      
        SELECT @sales_id = s.sales_id
        FROM Sales s
        WHERE LTRIM(RTRIM(s.Sales_Contract_Nbr)) = @Sales_Contract;
      
        EXEC dbo.CON_CollectionDetails_View_SP 
          @pi_iSalesId = @sales_id,
          @pi_sUpdateUserId = 'dba';
      `,
          {
            replacements: { contrato }, // <- tu variable dinámica
            type: QueryTypes.SELECT,
            raw: true,
          }
        );

      const reporte: HmisReporte = {
        CabeceraContratoHmis: cabecera[0],
        HmisContrato: [
          {
            InformacionContrato: informacionContrato.map((ic) => ({
              ...ic,
              Comisionista: comisionistas,
              Claims: claims,
              ComentarioLink: comentarioLinks,
            })),
            NombreContrato: nombreContrato ?? [],
            PropietarioContratante: propietarioContratante ?? [],
            ActividadContrato: actividadContrato ?? [],
            AbonoContrato: abonoContrato ?? [],
            TransaccionContrato: transaccionContrato ?? [],
            ItemContrato: itemContrato ?? [],
            FacilidadesContrato: facilidadesContrato ?? [],
            InformacionFinancieraContrato: informacionFinancieraContrato ?? [],
          },
        ],
      };

      return [reporte];
    } catch (error) {
      console.error("Error obteniendo contratos HMIS:", error);
      throw new Error(
        `Error al obtener contratos HMIS: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async obtenerListaContratos(
    dbAlias: keyof typeof hmisDatabases = "bdhmis",
    limit: number = 100,
    offset: number = 0
  ): Promise<HmisContratoLista[]> {
    // Validar que la base de datos existe
    if (!this.isValidDatabase(dbAlias)) {
      const availableDbs = this.getAvailableDatabases().join(", ");
      throw new Error(
        `Base de datos '${dbAlias}' no existe. Bases de datos disponibles: ${availableDbs}`
      );
    }

    const sequelizeInstance: Sequelize | undefined = hmisDatabases[dbAlias];
    if (!sequelizeInstance) {
      throw new Error(`No existe configuración para la BD alias: ${dbAlias}`);
    }

    // Validar conexión antes de ejecutar consultas
    try {
      await sequelizeInstance.authenticate();
      console.log(`✅ Conexión exitosa a ${dbAlias}`);
    } catch (error) {
      console.error(`❌ Error de conexión a ${dbAlias}:`, error);
      throw new Error(
        `No se pudo conectar a la base de datos ${dbAlias}. Verifique la configuración de conexión.`
      );
    }

    try {
      const reporte = await sequelizeInstance.query<HmisContratoLista>(
        `
        SELECT
          s.Sales_Contract_Nbr,
          r.Primary_Full_Name,
          s.Sale_Dt
        FROM Sales s
        INNER JOIN Name r ON s.Purchaser_Name_ID = r.Name_ID
        ORDER BY s.Sales_Contract_Nbr
        OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
        `,
        {
          replacements: { limit, offset },
          type: QueryTypes.SELECT,
        }
      );

      return reporte;
    } catch (error) {
      console.error("Error obteniendo lista de contratos:", error);
      throw new Error(
        `Error al obtener lista contratos: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
