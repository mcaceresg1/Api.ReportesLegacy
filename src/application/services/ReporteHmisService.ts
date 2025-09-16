import { inject, injectable } from "inversify";
import {
  HmisContratoLista,
  HmisReporte,
} from "../../domain/entities/HmisReporte";
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
   * Obtiene la lista de bases de datos disponibles
   */
  getAvailableDatabases(): string[] {
    return this.hmisRepo.getAvailableDatabases();
  }

  /**
   * Valida si una base de datos existe
   * @param dbAlias Alias de la base de datos a validar
   */
  isValidDatabase(dbAlias: string): boolean {
    return this.hmisRepo.isValidDatabase(dbAlias);
  }

  /**
   * Obtiene información detallada de las bases de datos disponibles
   */
  getDatabasesInfo(): Array<{
    alias: string;
    name: string;
    description: string;
  }> {
    return this.hmisRepo.getDatabasesInfo();
  }

  async verificarConexiones(): Promise<
    Array<{
      alias: string;
      name: string;
      status: "connected" | "error";
      error?: string;
    }>
  > {
    return this.hmisRepo.verificarConexiones();
  }

  /**
   * Obtiene todos los contratos desde HMIS
   * @param dbAlias Alias de la base de datos (ej: 'bdhmis', 'bdhmisAQP', 'bdhmisICA', 'bdhmisPIURA', 'bdhmisTACNA')
   * @param contrato Número de contrato
   */
  async obtenerContratosId(
    dbAlias: keyof typeof hmisDatabases,
    contrato: string
  ): Promise<HmisReporte[]> {
    return await this.hmisRepo.obtenerContratosId(dbAlias, contrato);
  }

  /**
   * Obtiene todos los contratos
   * @param dbAlias Alias de la base de datos (ej: 'bdhmis', 'bdhmisAQP', 'bdhmisICA', 'bdhmisPIURA', 'bdhmisTACNA')
   * @param limit Límite de registros
   * @param offset Desplazamiento
   */
  async obtenerListaContratos(
    dbAlias: keyof typeof hmisDatabases,
    limit: number = 100,
    offset: number = 0
  ): Promise<HmisContratoLista[]> {
    return await this.hmisRepo.obtenerListaContratos(dbAlias, limit, offset);
  }
}
