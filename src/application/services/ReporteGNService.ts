import { inject, injectable } from "inversify";
import { IReporteGNService } from "../../domain/services/IReporteGNService";
import { IReporteGNRepository } from "../../domain/repositories/IReporteGNRepository";
import {
  FiltrosReporteAccionesDePersonal,
  FiltrosReporteAnualizado,
  FiltrosReporteContratos,
  FiltrosReportePrestamoCtaCte,
  FiltrosReporteRolDeVacaciones,
  GNAccionDePersonal,
  GNContrato,
  RespuestaReporteAccionesDePersonal,
  RespuestaReporteAnualizado,
  RespuestaReporteContratos,
  RespuestaReportePrestamoCtaCte,
  RespuestaReporteRolDeVacaciones,
} from "../../domain/entities/ReporteGN";

@injectable()
export class ReporteGNService implements IReporteGNService {
  constructor(
    @inject("IReporteGNRepository")
    private reporteGNRepository: IReporteGNRepository
  ) {}
  async getAccionesDePersonal(
    filtros: FiltrosReporteAccionesDePersonal
  ): Promise<RespuestaReporteAccionesDePersonal | undefined> {
    return this.reporteGNRepository.getAccionesDePersonal(filtros);
  }
  async getContratos(
    filtros: FiltrosReporteContratos
  ): Promise<RespuestaReporteContratos | undefined> {
    return this.reporteGNRepository.getContratos(filtros);
  }
  async getRolDeVacaciones(
    filtros: FiltrosReporteRolDeVacaciones
  ): Promise<RespuestaReporteRolDeVacaciones | undefined> {
    return this.reporteGNRepository.getRolDeVacaciones(filtros);
  }
  async getAnualizado(
    filtros: FiltrosReporteAnualizado
  ): Promise<RespuestaReporteAnualizado | undefined> {
    return this.reporteGNRepository.getAnualizado(filtros);
  }
  async getPrestamoCtaCte(
    filtros: FiltrosReportePrestamoCtaCte
  ): Promise<RespuestaReportePrestamoCtaCte | undefined> {
    return this.reporteGNRepository.getPrestamoCtaCte(filtros);
  }
}
