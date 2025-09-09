import { inject, injectable } from "inversify";
import { IReporteGNService } from "../../domain/services/IReporteGNService";
import { IReporteGNRepository } from "../../domain/repositories/IReporteGNRepository";
import {
  FiltrosBoletaDePago,
  FiltrosReporteAccionesDePersonal,
  FiltrosReporteAnualizado,
  FiltrosReporteContratos,
  FiltrosReportePrestamoCtaCte,
  FiltrosReportePrestamos,
  FiltrosReporteRolDeVacaciones,
  GNAccionDePersonal,
  GNContrato,
  RespuestaReporteAccionesDePersonal,
  RespuestaReporteAnualizado,
  RespuestaReporteBoletasDePago,
  RespuestaReporteContratos,
  RespuestaReportePrestamoCtaCte,
  RespuestaReportePrestamos,
  RespuestaReporteRolDeVacaciones,
} from "../../domain/entities/ReporteGN";

@injectable()
export class ReporteGNService implements IReporteGNService {
  constructor(
    @inject("IReporteGNRepository")
    private reporteGNRepository: IReporteGNRepository
  ) {}
  async getAccionesDePersonal(
    conjunto: string,
    filtros: FiltrosReporteAccionesDePersonal
  ): Promise<RespuestaReporteAccionesDePersonal | undefined> {
    return this.reporteGNRepository.getAccionesDePersonal(conjunto, filtros);
  }
  async getContratos(
    conjunto: string,
    filtros: FiltrosReporteContratos
  ): Promise<RespuestaReporteContratos | undefined> {
    return this.reporteGNRepository.getContratos(conjunto, filtros);
  }
  async getRolDeVacaciones(
    conjunto: string,
    filtros: FiltrosReporteRolDeVacaciones
  ): Promise<RespuestaReporteRolDeVacaciones | undefined> {
    return this.reporteGNRepository.getRolDeVacaciones(conjunto, filtros);
  }
  async getReporteAnualizado(
    conjunto: string,
    filtros: FiltrosReporteAnualizado
  ): Promise<RespuestaReporteAnualizado | undefined> {
    return this.reporteGNRepository.getReporteAnualizado(conjunto, filtros);
  }
  async getPrestamos(
    conjunto: string,
    filtros: FiltrosReportePrestamos
  ): Promise<RespuestaReportePrestamos | undefined> {
    return this.reporteGNRepository.getPrestamos(conjunto, filtros);
  }
  async getPrestamoCtaCte(
    filtros: FiltrosReportePrestamoCtaCte
  ): Promise<RespuestaReportePrestamoCtaCte | undefined> {
    return this.reporteGNRepository.getPrestamoCtaCte(filtros);
  }
  async getBoletaDePago(
    conjunto: string,
    filtros: FiltrosBoletaDePago
  ): Promise<RespuestaReporteBoletasDePago | undefined> {
    return this.reporteGNRepository.getBoletaDePago(conjunto, filtros);
  }
}
