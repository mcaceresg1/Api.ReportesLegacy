import { hmisDatabases } from "../../infrastructure/database/config/hmis-database";
import { HmisContratoLista, HmisReporte } from "../entities/HmisReporte";

export interface IReporteHmisRepository {
  /**
   * Obtiene la lista de bases de datos disponibles
   */
  getAvailableDatabases(): string[];

  /**
   * Valida si una base de datos existe
   * @param dbAlias Alias de la base de datos a validar
   */
  isValidDatabase(dbAlias: string): boolean;

  /**
   * Obtiene información detallada de las bases de datos disponibles
   */
  getDatabasesInfo(): Array<{
    alias: string;
    name: string;
    description: string;
  }>;

  /**
   * Verifica el estado de conexión de todas las bases de datos
   */
  verificarConexiones(): Promise<
    Array<{
      alias: string;
      name: string;
      status: "connected" | "error";
      error?: string;
    }>
  >;

  /**
   * Obtiene todos los contratos por contrato
   * @param dbAlias Alias de la base de datos (ej: 'bdhmis', 'bdhmisAQP', 'bdhmisICA', 'bdhmisPIURA', 'bdhmisTACNA')
   * @param contrato Número de contrato
   */
  obtenerContratosId(
    dbAlias: keyof typeof hmisDatabases,
    contrato: string
  ): Promise<HmisReporte[]>;

  /**
   * Obtiene todos los contratos
   * @param dbAlias Alias de la base de datos (ej: 'bdhmis', 'bdhmisAQP', 'bdhmisICA', 'bdhmisPIURA', 'bdhmisTACNA')
   * @param limit Límite de registros
   * @param offset Desplazamiento
   */
  obtenerListaContratos(
    dbAlias: keyof typeof hmisDatabases,
    limit?: number,
    offset?: number
  ): Promise<HmisContratoLista[]>;
}
