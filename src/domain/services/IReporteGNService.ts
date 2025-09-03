import {
  FiltrosReporteAccionesDePersonal,
  FiltrosReporteAnualizado,
  FiltrosReporteContratos,
  FiltrosReportePrestamoCtaCte,
  FiltrosReporteRolDeVacaciones,
  RespuestaReporteAccionesDePersonal,
  RespuestaReporteAnualizado,
  RespuestaReporteContratos,
  RespuestaReportePrestamoCtaCte,
  RespuestaReporteRolDeVacaciones,
} from "../entities/ReporteGN";

export interface IReporteGNService {
  getAccionesDePersonal(
    filtros: FiltrosReporteAccionesDePersonal
  ): Promise<RespuestaReporteAccionesDePersonal | undefined>;

  getContratos(
    filtros: FiltrosReporteContratos
  ): Promise<RespuestaReporteContratos | undefined>;

  getRolDeVacaciones(
    filtros: FiltrosReporteRolDeVacaciones
  ): Promise<RespuestaReporteRolDeVacaciones | undefined>;

  getAnualizado(
    filtros: FiltrosReporteAnualizado
  ): Promise<RespuestaReporteAnualizado | undefined>;

  getPrestamoCtaCte(
    filtros: FiltrosReportePrestamoCtaCte
  ): Promise<RespuestaReportePrestamoCtaCte | undefined>;
}
