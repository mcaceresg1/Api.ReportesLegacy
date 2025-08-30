import { hmisDatabases } from "../../infrastructure/database/config/hmis-database";
import { HmisReporte } from "../entities/HmisReporte";

export interface IReporteHmisService {
  /**
   * Obtiene todos los contratos de una contrato específica.
   * @param dbAlias - Alias de la base de datos (ej: "bdhmis", "bdhmis1").
   * @param contrato - El contrato (ej. "12345").
   */
  obtenerContratos(
    dbAlias: keyof typeof hmisDatabases,
    contrato: string
  ): Promise<HmisReporte[]>;
}
