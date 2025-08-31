import { hmisDatabases } from "../../infrastructure/database/config/hmis-database";
import { HmisContratoLista, HmisReporte } from "../entities/HmisReporte";

export interface IReporteHmisRepository {
  /**
   * Obtiene todos los contratos por contrato
   * @param dbAlias Alias de la base de datos (ej: 'bdhmis', 'bdhmis1')
   * @param contrato Número de contrato
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
