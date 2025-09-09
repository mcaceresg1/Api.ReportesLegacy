import { injectable } from "inversify";
import { QueryTypes } from "sequelize";
import { IBalanceGeneralClipperRepository } from "../../domain/repositories/IBalanceGeneralClipperRepository";
import { ClipperBalanceGeneral } from "../../domain/entities/BalanceGeneralClipper";
import { clipperGPCDatabases } from "../database/config/clipper-gpc-database";

@injectable()
export class BalanceGeneralClipperRepository
  implements IBalanceGeneralClipperRepository
{
  /**
   * Obtiene el balance general por nivel
   * @param bdClipperGPC Nombre de la base de datos Clipper GPC a utilizar
   * @param nivel Nivel de las cuentas contables
   * @returns Lista de registros del balance general por nivel
   */
  async obtenerBalanceGeneralPorNivel(
    bdClipperGPC: string,
    nivel: number
  ): Promise<ClipperBalanceGeneral[]> {
    try {
      const sequelize = clipperGPCDatabases[bdClipperGPC];
      if (!sequelize)
        throw new Error(`Base de datos "${bdClipperGPC}" no configurada.`);

      const query = `
        SELECT  
          CUENTA,  
          NOMBRE,    
          -- SALDOS ACUMULADOS (Enero a Noviembre)  
          TRY_CAST(DEBE_01 AS DECIMAL(18,2)) +  
          TRY_CAST(DEBE_02 AS DECIMAL(18,2)) +  
          TRY_CAST(DEBE_03 AS DECIMAL(18,2)) +  
          TRY_CAST(DEBE_04 AS DECIMAL(18,2)) +  
          TRY_CAST(DEBE_05 AS DECIMAL(18,2)) +  
          TRY_CAST(DEBE_06 AS DECIMAL(18,2)) +  
          TRY_CAST(DEBE_07 AS DECIMAL(18,2)) +  
          TRY_CAST(DEBE_08 AS DECIMAL(18,2)) +  
          TRY_CAST(DEBE_09 AS DECIMAL(18,2)) +  
          TRY_CAST(DEBE_10 AS DECIMAL(18,2)) +  
          TRY_CAST(DEBE_11 AS DECIMAL(18,2)) AS saldoAcumuladoDebe,    
          TRY_CAST(HABER01 AS DECIMAL(18,2)) +  
          TRY_CAST(HABER02 AS DECIMAL(18,2)) +  
          TRY_CAST(HABER03 AS DECIMAL(18,2)) +  
          TRY_CAST(HABER04 AS DECIMAL(18,2)) +  
          TRY_CAST(HABER05 AS DECIMAL(18,2)) +  
          TRY_CAST(HABER06 AS DECIMAL(18,2)) +  
          TRY_CAST(HABER07 AS DECIMAL(18,2)) +  
          TRY_CAST(HABER08 AS DECIMAL(18,2)) +  
          TRY_CAST(HABER09 AS DECIMAL(18,2)) +  
          TRY_CAST(HABER10 AS DECIMAL(18,2)) +  
          TRY_CAST(HABER11 AS DECIMAL(18,2)) AS saldoAcumuladoHaber,    
          -- MOVIMIENTO DEL MES (Diciembre)  
          TRY_CAST(DEBE_12 AS DECIMAL(18,2)) AS movimientoMesDebe,  
          TRY_CAST(HABER12 AS DECIMAL(18,2)) AS movimientoMesHaber,    
          -- SALDOS ACTUALES  
          (    
            TRY_CAST(DEBE_01 AS DECIMAL(18,2)) + TRY_CAST(DEBE_02 AS DECIMAL(18,2)) +    
            TRY_CAST(DEBE_03 AS DECIMAL(18,2)) + TRY_CAST(DEBE_04 AS DECIMAL(18,2)) +    
            TRY_CAST(DEBE_05 AS DECIMAL(18,2)) + TRY_CAST(DEBE_06 AS DECIMAL(18,2)) +    
            TRY_CAST(DEBE_07 AS DECIMAL(18,2)) + TRY_CAST(DEBE_08 AS DECIMAL(18,2)) +    
            TRY_CAST(DEBE_09 AS DECIMAL(18,2)) + TRY_CAST(DEBE_10 AS DECIMAL(18,2)) +    
            TRY_CAST(DEBE_11 AS DECIMAL(18,2)) + TRY_CAST(DEBE_12 AS DECIMAL(18,2))  
          ) AS saldoActualDebe,    
          (    
            TRY_CAST(HABER01 AS DECIMAL(18,2)) + TRY_CAST(HABER02 AS DECIMAL(18,2)) +    
            TRY_CAST(HABER03 AS DECIMAL(18,2)) + TRY_CAST(HABER04 AS DECIMAL(18,2)) +    
            TRY_CAST(HABER05 AS DECIMAL(18,2)) + TRY_CAST(HABER06 AS DECIMAL(18,2)) +    
            TRY_CAST(HABER07 AS DECIMAL(18,2)) + TRY_CAST(HABER08 AS DECIMAL(18,2)) +    
            TRY_CAST(HABER09 AS DECIMAL(18,2)) + TRY_CAST(HABER10 AS DECIMAL(18,2)) +    
            TRY_CAST(HABER11 AS DECIMAL(18,2)) + TRY_CAST(HABER12 AS DECIMAL(18,2))  
          ) AS saldoActualHaber  
        FROM PCGR  
        WHERE NIVEL = :nivel  
        ORDER BY CUENTA
      `;

      const resultado = await sequelize.query(query, {
        replacements: { nivel },
        type: QueryTypes.SELECT,
      });

      return resultado as ClipperBalanceGeneral[];
    } catch (error) {
      console.error(
        `Error en BalanceGeneralClipperRepository.obtenerBalanceGeneralPorNivel:`,
        error
      );
      throw error;
    }
  }

  /**
   * Obtiene el balance general por mes y nivel
   * @param bdClipperGPC Nombre de la base de datos Clipper GPC a utilizar
   * @param mes Mes contable a consultar (1-12)
   * @param nivel Nivel de las cuentas contables
   * @returns Lista de registros del balance general por mes y nivel
   */
  async obtenerBalanceGeneralPorMesYNivel(
    bdClipperGPC: string,
    mes: number,
    nivel: number
  ): Promise<ClipperBalanceGeneral[]> {
    try {
      const sequelize = clipperGPCDatabases[bdClipperGPC];
      if (!sequelize)
        throw new Error(`Base de datos "${bdClipperGPC}" no configurada.`);

      const query = `
        SELECT     
          p.CUENTA,    
          p.NOMBRE,      
          -- =========================    
          -- SALDOS ACUMULADOS (enero a mes-1)    
          -- =========================    
          (        
            SELECT SUM(v.Debe)        
            FROM (VALUES            
              (1, TRY_CAST(p.DEBE_01 AS DECIMAL(18,2))),            
              (2, TRY_CAST(p.DEBE_02 AS DECIMAL(18,2))),            
              (3, TRY_CAST(p.DEBE_03 AS DECIMAL(18,2))),            
              (4, TRY_CAST(p.DEBE_04 AS DECIMAL(18,2))),            
              (5, TRY_CAST(p.DEBE_05 AS DECIMAL(18,2))),            
              (6, TRY_CAST(p.DEBE_06 AS DECIMAL(18,2))),            
              (7, TRY_CAST(p.DEBE_07 AS DECIMAL(18,2))),            
              (8, TRY_CAST(p.DEBE_08 AS DECIMAL(18,2))),            
              (9, TRY_CAST(p.DEBE_09 AS DECIMAL(18,2))),            
              (10, TRY_CAST(p.DEBE_10 AS DECIMAL(18,2))),            
              (11, TRY_CAST(p.DEBE_11 AS DECIMAL(18,2))),            
              (12, TRY_CAST(p.DEBE_12 AS DECIMAL(18,2)))        
            ) v(Mes, Debe)        
            WHERE v.Mes < :mes    
          ) AS saldoAcumuladoDebe,      
          (        
            SELECT SUM(v.Haber)        
            FROM (VALUES            
              (1, TRY_CAST(p.HABER01 AS DECIMAL(18,2))),            
              (2, TRY_CAST(p.HABER02 AS DECIMAL(18,2))),            
              (3, TRY_CAST(p.HABER03 AS DECIMAL(18,2))),            
              (4, TRY_CAST(p.HABER04 AS DECIMAL(18,2))),            
              (5, TRY_CAST(p.HABER05 AS DECIMAL(18,2))),            
              (6, TRY_CAST(p.HABER06 AS DECIMAL(18,2))),            
              (7, TRY_CAST(p.HABER07 AS DECIMAL(18,2))),            
              (8, TRY_CAST(p.HABER08 AS DECIMAL(18,2))),            
              (9, TRY_CAST(p.HABER09 AS DECIMAL(18,2))),            
              (10, TRY_CAST(p.HABER10 AS DECIMAL(18,2))),            
              (11, TRY_CAST(p.HABER11 AS DECIMAL(18,2))),            
              (12, TRY_CAST(p.HABER12 AS DECIMAL(18,2)))        
            ) v(Mes, Haber)        
            WHERE v.Mes < :mes    
          ) AS saldoAcumuladoHaber,      
          -- =========================    
          -- MOVIMIENTO DEL MES    
          -- =========================    
          (CASE :mes        
            WHEN 1 THEN TRY_CAST(p.DEBE_01 AS DECIMAL(18,2))        
            WHEN 2 THEN TRY_CAST(p.DEBE_02 AS DECIMAL(18,2))        
            WHEN 3 THEN TRY_CAST(p.DEBE_03 AS DECIMAL(18,2))        
            WHEN 4 THEN TRY_CAST(p.DEBE_04 AS DECIMAL(18,2))        
            WHEN 5 THEN TRY_CAST(p.DEBE_05 AS DECIMAL(18,2))        
            WHEN 6 THEN TRY_CAST(p.DEBE_06 AS DECIMAL(18,2))        
            WHEN 7 THEN TRY_CAST(p.DEBE_07 AS DECIMAL(18,2))        
            WHEN 8 THEN TRY_CAST(p.DEBE_08 AS DECIMAL(18,2))        
            WHEN 9 THEN TRY_CAST(p.DEBE_09 AS DECIMAL(18,2))        
            WHEN 10 THEN TRY_CAST(p.DEBE_10 AS DECIMAL(18,2))        
            WHEN 11 THEN TRY_CAST(p.DEBE_11 AS DECIMAL(18,2))        
            WHEN 12 THEN TRY_CAST(p.DEBE_12 AS DECIMAL(18,2))    
          END) AS movimientoMesDebe,      
          (CASE :mes        
            WHEN 1 THEN TRY_CAST(p.HABER01 AS DECIMAL(18,2))        
            WHEN 2 THEN TRY_CAST(p.HABER02 AS DECIMAL(18,2))        
            WHEN 3 THEN TRY_CAST(p.HABER03 AS DECIMAL(18,2))        
            WHEN 4 THEN TRY_CAST(p.HABER04 AS DECIMAL(18,2))        
            WHEN 5 THEN TRY_CAST(p.HABER05 AS DECIMAL(18,2))        
            WHEN 6 THEN TRY_CAST(p.HABER06 AS DECIMAL(18,2))        
            WHEN 7 THEN TRY_CAST(p.HABER07 AS DECIMAL(18,2))        
            WHEN 8 THEN TRY_CAST(p.HABER08 AS DECIMAL(18,2))        
            WHEN 9 THEN TRY_CAST(p.HABER09 AS DECIMAL(18,2))        
            WHEN 10 THEN TRY_CAST(p.HABER10 AS DECIMAL(18,2))        
            WHEN 11 THEN TRY_CAST(p.HABER11 AS DECIMAL(18,2))        
            WHEN 12 THEN TRY_CAST(p.HABER12 AS DECIMAL(18,2))    
          END) AS movimientoMesHaber,      
          -- =========================    
          -- SALDOS ACTUALES (Acum + Mes)    
          -- =========================    
          (        
            SELECT SUM(v.Debe)        
            FROM (VALUES            
              (1, TRY_CAST(p.DEBE_01 AS DECIMAL(18,2))),            
              (2, TRY_CAST(p.DEBE_02 AS DECIMAL(18,2))),            
              (3, TRY_CAST(p.DEBE_03 AS DECIMAL(18,2))),            
              (4, TRY_CAST(p.DEBE_04 AS DECIMAL(18,2))),            
              (5, TRY_CAST(p.DEBE_05 AS DECIMAL(18,2))),            
              (6, TRY_CAST(p.DEBE_06 AS DECIMAL(18,2))),            
              (7, TRY_CAST(p.DEBE_07 AS DECIMAL(18,2))),            
              (8, TRY_CAST(p.DEBE_08 AS DECIMAL(18,2))),            
              (9, TRY_CAST(p.DEBE_09 AS DECIMAL(18,2))),            
              (10, TRY_CAST(p.DEBE_10 AS DECIMAL(18,2))),            
              (11, TRY_CAST(p.DEBE_11 AS DECIMAL(18,2))),            
              (12, TRY_CAST(p.DEBE_12 AS DECIMAL(18,2)))        
            ) v(Mes, Debe)        
            WHERE v.Mes <= :mes    
          ) AS saldoActualDebe,      
          (        
            SELECT SUM(v.Haber)        
            FROM (VALUES            
              (1, TRY_CAST(p.HABER01 AS DECIMAL(18,2))),            
              (2, TRY_CAST(p.HABER02 AS DECIMAL(18,2))),            
              (3, TRY_CAST(p.HABER03 AS DECIMAL(18,2))),            
              (4, TRY_CAST(p.HABER04 AS DECIMAL(18,2))),            
              (5, TRY_CAST(p.HABER05 AS DECIMAL(18,2))),            
              (6, TRY_CAST(p.HABER06 AS DECIMAL(18,2))),            
              (7, TRY_CAST(p.HABER07 AS DECIMAL(18,2))),            
              (8, TRY_CAST(p.HABER08 AS DECIMAL(18,2))),            
              (9, TRY_CAST(p.HABER09 AS DECIMAL(18,2))),            
              (10, TRY_CAST(p.HABER10 AS DECIMAL(18,2))),            
              (11, TRY_CAST(p.HABER11 AS DECIMAL(18,2))),            
              (12, TRY_CAST(p.HABER12 AS DECIMAL(18,2)))        
            ) v(Mes, Haber)        
            WHERE v.Mes <= :mes    
          ) AS saldoActualHaber  
        FROM PCGR p  
        WHERE p.NIVEL = :nivel  
        ORDER BY p.CUENTA
      `;

      const resultado = await sequelize.query(query, {
        replacements: { mes, nivel },
        type: QueryTypes.SELECT,
      });

      return resultado as ClipperBalanceGeneral[];
    } catch (error) {
      console.error(
        `Error en BalanceGeneralClipperRepository.obtenerBalanceGeneralPorMesYNivel:`,
        error
      );
      throw error;
    }
  }
}
