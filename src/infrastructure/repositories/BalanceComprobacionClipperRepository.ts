import { injectable } from "inversify";
import { QueryTypes } from "sequelize";
import { IBalanceComprobacionClipperRepository } from "../../domain/repositories/IBalanceComprobacionClipperRepository";
import { ClipperBalanceComprobacion } from "../../domain/entities/BalanceCmprobacionClipper";
import { clipperGPCDatabases } from "../database/config/clipper-gpc-database";

@injectable()
export class BalanceComprobacionClipperRepository
  implements IBalanceComprobacionClipperRepository
{
  private getDatabase(baseDatos: string) {
    const db = clipperGPCDatabases[baseDatos];
    if (!db) {
      throw new Error(`Base de datos '${baseDatos}' no encontrada`);
    }
    return db;
  }

  /**
   * Obtiene los datos del Balance de Comprobación desde Clipper
   * @param baseDatos Nombre de la base de datos Clipper a utilizar (bdclipperGPC, bdclipperGPC2, etc.)
   * @returns Lista de registros del balance de comprobación
   */
  async obtenerBalanceComprobacionClipper(
    baseDatos: string
  ): Promise<ClipperBalanceComprobacion[]> {
    try {
      const sequelize = this.getDatabase(baseDatos);

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
        FROM PCGR WITH (NOLOCK)
        ORDER BY CUENTA
      `;

      const result = await sequelize.query<ClipperBalanceComprobacion>(query, {
        type: QueryTypes.SELECT,
      });

      return result.map((row: any) => ({
        cuenta: row.CUENTA || "",
        nombre: row.NOMBRE || "",
        saldoAcumuladoDebe: parseFloat(row.saldoAcumuladoDebe) || 0,
        saldoAcumuladoHaber: parseFloat(row.saldoAcumuladoHaber) || 0,
        movimientoMesDebe: parseFloat(row.movimientoMesDebe) || 0,
        movimientoMesHaber: parseFloat(row.movimientoMesHaber) || 0,
        saldoActualDebe: parseFloat(row.saldoActualDebe) || 0,
        saldoActualHaber: parseFloat(row.saldoActualHaber) || 0,
      }));
    } catch (error) {
      console.error(
        "Error en BalanceComprobacionClipperRepository.obtenerBalanceComprobacionClipper:",
        error
      );
      throw new Error(
        `Error al obtener balance de comprobación clipper: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}
