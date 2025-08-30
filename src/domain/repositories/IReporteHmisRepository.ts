import { hmisDatabases } from "../../infrastructure/database/config/hmis-database";
import { HmisReporte } from "../entities/HmisReporte";

export interface IReporteHmisRepository {
  /**
   * Obtiene todos los contratos por contrato
   * @param dbAlias Alias de la base de datos (ej: 'bdhmis', 'bdhmis1')
   * @param contrato Número de contrato
   */
  obtenerContratos(
    dbAlias: keyof typeof hmisDatabases,
    contrato: string
  ): Promise<HmisReporte[]>;
}
