import { inject, injectable } from "inversify";
import { HmisContratoLista, HmisReporte } from "../../domain/entities/HmisReporte";
import { IReporteHmisService } from "../../domain/services/IReporteHmisService";
import { IReporteHmisRepository } from "../../domain/repositories/IReporteHmisRepository";
import { hmisDatabases } from "../../infrastructure/database/config/hmis-database";

@injectable()
export class ReporteHmisService implements IReporteHmisService {
  constructor(
    @inject("IReporteHmisRepository")
    private readonly hmisRepo: IReporteHmisRepository
  ) {}


  /**
   * Obtiene todos los contratos desde HMIS
   * @param dbAlias Alias de la base de datos (ej: 'bdhmis', 'bdhmis1')
   * @param contrato Número de contrato
   */
  async obtenerContratosId(
    dbAlias: keyof typeof hmisDatabases,
    contrato: string
  ): Promise<HmisReporte[]> {
    return await this.hmisRepo.obtenerContratosId(dbAlias,contrato );
  }
 /**
   * Obtiene todos los contratos
   * @param dbAlias Alias de la base de datos (ej: 'bdhmis', 'bdhmis1')
   */
 async obtenerListaContratos(
  dbAlias: keyof typeof hmisDatabases
): Promise<HmisContratoLista[]> {
  return await this.hmisRepo.obtenerListaContratos(dbAlias);
}


  

}
