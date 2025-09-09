import {
  FiltrosBoletaDePago,
  FiltrosReporteAccionesDePersonal,
  FiltrosReporteAnualizado,
  FiltrosReporteContratos,
  FiltrosReportePrestamoCtaCte,
  FiltrosReportePrestamos,
  FiltrosReporteRolDeVacaciones,
  RespuestaReporteAccionesDePersonal,
  RespuestaReporteAnualizado,
  RespuestaReporteBoletasDePago,
  RespuestaReporteContratos,
  RespuestaReportePrestamoCtaCte,
  RespuestaReportePrestamos,
  RespuestaReporteRolDeVacaciones,
} from "../entities/ReporteGN";

export interface IReporteGNService {
  getAccionesDePersonal(
    conjunto: string,
    filtros: FiltrosReporteAccionesDePersonal
  ): Promise<RespuestaReporteAccionesDePersonal | undefined>;

  getContratos(
    conjunto: string,
    filtros: FiltrosReporteContratos
  ): Promise<RespuestaReporteContratos | undefined>;

  getPrestamos(
    conjunto: string,
    filtros: FiltrosReportePrestamos
  ): Promise<RespuestaReportePrestamos | undefined>;

  getRolDeVacaciones(
    conjunto: string,
    filtros: FiltrosReporteRolDeVacaciones
  ): Promise<RespuestaReporteRolDeVacaciones | undefined>;

  getPrestamoCtaCte(
    conjunto: string,
    filtros: FiltrosReportePrestamoCtaCte
  ): Promise<RespuestaReportePrestamoCtaCte | undefined>;

  getReporteAnualizado(
    conjunto: string,
    filtros: FiltrosReporteAnualizado
  ): Promise<RespuestaReporteAnualizado | undefined>;

  getBoletaDePago(
    conjunto: string,
    filtros: FiltrosBoletaDePago
  ): Promise<RespuestaReporteBoletasDePago | undefined>;
}
