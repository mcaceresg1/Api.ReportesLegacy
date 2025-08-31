import { hmisDatabases } from "../../infrastructure/database/config/hmis-database";
import { HmisContratoLista, HmisReporte } from "../entities/HmisReporte";

export interface IReporteHmisService {
  /**
   * Obtiene todos los contratos de una contrato específica.
   * @param dbAlias - Alias de la base de datos (ej: "bdhmis", "bdhmis1").
   * @param contrato - El contrato (ej. "12345").
   */
  obtenerContratosId(
    dbAlias: keyof typeof hmisDatabases,
    contrato: string
  ): Promise<HmisReporte[]>;

   /**
   * Obtiene todos los contratos
   * @param dbAlias Alias de la base de datos (ej: 'bdhmis', 'bdhmis1')
   */
   obtenerListaContratos(
    dbAlias: keyof typeof hmisDatabases
  ): Promise<HmisContratoLista[]>;
}
