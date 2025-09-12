
import { injectable, inject } from 'inversify';
import {
  ExportarAccionesDePersonalExcelParams,
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
} from "../../domain/entities/ReporteGN";

@injectable()
export interface IReporteGNService {
  getAccionesDePersonal(
    conjunto: string,
    filtros: FiltrosReporteAccionesDePersonal,
  ): Promise<RespuestaReporteAccionesDePersonal | undefined>;

  getContratos(
    conjunto: string,
    filtros: FiltrosReporteContratos,
  ): Promise<RespuestaReporteContratos | undefined>;

  getPrestamos(
    conjunto: string,
    filtros: FiltrosReportePrestamos,
  ): Promise<RespuestaReportePrestamos | undefined>;

  getRolDeVacaciones(
    conjunto: string,
    filtros: FiltrosReporteRolDeVacaciones,
  ): Promise<RespuestaReporteRolDeVacaciones | undefined>;

  getPrestamoCtaCte(
    conjunto: string,
    filtros: FiltrosReportePrestamoCtaCte,
  ): Promise<RespuestaReportePrestamoCtaCte | undefined>;

  getReporteAnualizado(
    conjunto: string,
    filtros: FiltrosReporteAnualizado,
  ): Promise<RespuestaReporteAnualizado | undefined>;

  getBoletaDePago(
    conjunto: string,
    filtros: FiltrosBoletaDePago,
  ): Promise<RespuestaReporteBoletasDePago | undefined>;

  exportarAccionesDePersonalExcel(
    conjunto: string,
    filtros: FiltrosReporteAccionesDePersonal,
  ): Promise<Buffer>;

  exportarContratosExcel(
    conjunto: string,
    filtros: FiltrosReporteContratos,
  ): Promise<Buffer>;

  exportarRolDeVacacionesExcel(
    conjunto: string,
    filtros: FiltrosReporteRolDeVacaciones,
  ): Promise<Buffer>;

  exportarAnualizadoExcel(
    conjunto: string,
    filtros: FiltrosReporteAnualizado,
  ): Promise<Buffer>;

  exportarPrestamosExcel(
    conjunto: string,
    filtros: FiltrosReportePrestamos,
  ): Promise<Buffer>;

  exportarPrestamoCtaCteExcel(
    conjunto: string,
    filtros: FiltrosReportePrestamoCtaCte,
  ): Promise<Buffer>;

  exportarBoletaDePagoExcel(
    conjunto: string,
    filtros: FiltrosBoletaDePago,
  ): Promise<Buffer>;
}
