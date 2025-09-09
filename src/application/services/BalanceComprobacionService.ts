import { injectable, inject } from "inversify";
import { IBalanceComprobacionService } from "../../domain/services/IBalanceComprobacionService";
import { IBalanceComprobacionRepository } from "../../domain/repositories/IBalanceComprobacionRepository";
import {
  BalanceComprobacion,
  BalanceComprobacionFiltros,
  BalanceComprobacionResponse,
} from "../../domain/entities/BalanceComprobacion";

@injectable()
export class BalanceComprobacionService implements IBalanceComprobacionService {
  constructor(
    @inject("IBalanceComprobacionRepository")
    private balanceComprobacionRepository: IBalanceComprobacionRepository
  ) {}

  /**
   * Genera el reporte de Balance de Comprobación
   */
  async generarReporteBalanceComprobacion(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad: string = "F,A",
    tipoReporte: string = "Preliminar",
    moneda?: string,
    origen?: string,
    nivelAnalisis?: number,
    realizarAnalisisAsientos?: boolean,
    cuentaDesde?: string,
    cuentaHasta?: string,
    libroElectronico?: boolean,
    campoLibroElectronico?: string,
    versionLibroElectronico?: string,
    excluirAsientoCierre?: boolean,
    soloMostrarNivelSeleccionado?: boolean,
    considerarAsientoApertura?: boolean,
    asientoDesde?: number,
    asientoHasta?: number,
    agrupacionDesde?: number,
    agrupacionHasta?: number,
    tiposSeleccionados?: string[],
    desglosarPorTipoEnExcel?: boolean,
    formatoCuentaContable?: string,
    formatoCentroCosto?: string,
    analisisCentroCosto?: string,
    ordenamientoCentroCosto?: string,
    dimensionAdicional?: string,
    tituloPrincipal?: string,
    titulo2?: string,
    titulo3?: string,
    titulo4?: string
  ): Promise<void> {
    try {
      // Validaciones de negocio
      this.validarParametrosGeneracion(
        conjunto,
        usuario,
        fechaInicio,
        fechaFin
      );

      // Delegar al repositorio
      await this.balanceComprobacionRepository.generarReporteBalanceComprobacion(
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoReporte
      );
    } catch (error) {
      console.error(
        "Error en BalanceComprobacionService.generarReporteBalanceComprobacion:",
        error
      );
      throw error;
    }
  }

  /**
   * Obtiene los datos del Balance de Comprobación con filtros y paginación
   */
  async obtenerBalanceComprobacion(
    conjunto: string,
    filtros: BalanceComprobacionFiltros
  ): Promise<BalanceComprobacionResponse> {
    try {
      // Validaciones de negocio
      this.validarFiltros(filtros);

      // Aplicar valores por defecto
      const filtrosConDefaults = this.aplicarValoresPorDefecto(filtros);

      // Delegar al repositorio
      return await this.balanceComprobacionRepository.obtenerBalanceComprobacion(
        conjunto,
        filtrosConDefaults
      );
    } catch (error) {
      console.error(
        "Error en BalanceComprobacionService.obtenerBalanceComprobacion:",
        error
      );
      throw error;
    }
  }

  /**
   * Exporta el Balance de Comprobación a Excel
   */
  async exportarExcel(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad: string = "F,A",
    tipoReporte: string = "Preliminar",
    limit: number = 10000,
    moneda?: string,
    origen?: string,
    nivelAnalisis?: number,
    realizarAnalisisAsientos?: boolean,
    cuentaDesde?: string,
    cuentaHasta?: string,
    libroElectronico?: boolean,
    campoLibroElectronico?: string,
    versionLibroElectronico?: string,
    excluirAsientoCierre?: boolean,
    soloMostrarNivelSeleccionado?: boolean,
    considerarAsientoApertura?: boolean,
    asientoDesde?: number,
    asientoHasta?: number,
    agrupacionDesde?: number,
    agrupacionHasta?: number,
    tiposSeleccionados?: string[],
    desglosarPorTipoEnExcel?: boolean,
    formatoCuentaContable?: string,
    formatoCentroCosto?: string,
    analisisCentroCosto?: string,
    ordenamientoCentroCosto?: string,
    dimensionAdicional?: string,
    tituloPrincipal?: string,
    titulo2?: string,
    titulo3?: string,
    titulo4?: string
  ): Promise<Buffer> {
    try {
      // Validaciones de negocio
      this.validarParametrosGeneracion(
        conjunto,
        usuario,
        fechaInicio,
        fechaFin
      );
      this.validarLimiteExportacion(limit);

      // Delegar al repositorio
      return await this.balanceComprobacionRepository.exportarExcel(
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoReporte,
        limit
      );
    } catch (error) {
      console.error(
        "Error en BalanceComprobacionService.exportarExcel:",
        error
      );
      throw error;
    }
  }

  /**
   * Valida los parámetros para la generación del reporte
   */
  private validarParametrosGeneracion(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date
  ): void {
    if (!conjunto || conjunto.trim() === "") {
      throw new Error("El código del conjunto contable es obligatorio");
    }

    if (!usuario || usuario.trim() === "") {
      throw new Error("El usuario es obligatorio");
    }

    if (
      !fechaInicio ||
      !(fechaInicio instanceof Date) ||
      isNaN(fechaInicio.getTime())
    ) {
      throw new Error("La fecha de inicio debe ser una fecha válida");
    }

    if (!fechaFin || !(fechaFin instanceof Date) || isNaN(fechaFin.getTime())) {
      throw new Error("La fecha de fin debe ser una fecha válida");
    }

    if (fechaInicio > fechaFin) {
      throw new Error(
        "La fecha de inicio no puede ser mayor que la fecha de fin"
      );
    }

    // Validar que las fechas no sean muy antiguas o futuras
    const fechaMinima = new Date("1900-01-01");
    const fechaMaxima = new Date("2100-12-31");

    if (fechaInicio < fechaMinima || fechaInicio > fechaMaxima) {
      throw new Error("La fecha de inicio debe estar entre 1900 y 2100");
    }

    if (fechaFin < fechaMinima || fechaFin > fechaMaxima) {
      throw new Error("La fecha de fin debe estar entre 1900 y 2100");
    }
  }

  /**
   * Valida los filtros de consulta
   */
  private validarFiltros(filtros: BalanceComprobacionFiltros): void {
    if (!filtros.conjunto || filtros.conjunto.trim() === "") {
      throw new Error("El código del conjunto contable es obligatorio");
    }

    if (!filtros.usuario || filtros.usuario.trim() === "") {
      throw new Error("El usuario es obligatorio");
    }

    if (
      !filtros.fechaInicio ||
      !(filtros.fechaInicio instanceof Date) ||
      isNaN(filtros.fechaInicio.getTime())
    ) {
      throw new Error("La fecha de inicio debe ser una fecha válida");
    }

    if (
      !filtros.fechaFin ||
      !(filtros.fechaFin instanceof Date) ||
      isNaN(filtros.fechaFin.getTime())
    ) {
      throw new Error("La fecha de fin debe ser una fecha válida");
    }

    if (filtros.fechaInicio > filtros.fechaFin) {
      throw new Error(
        "La fecha de inicio no puede ser mayor que la fecha de fin"
      );
    }

    if (filtros.page && filtros.page < 1) {
      throw new Error("El número de página debe ser mayor a 0");
    }

    if (filtros.limit && (filtros.limit < 1 || filtros.limit > 1000)) {
      throw new Error("El límite debe estar entre 1 y 1000");
    }
  }

  /**
   * Valida el límite para exportación
   */
  private validarLimiteExportacion(limit: number): void {
    if (limit < 1 || limit > 50000) {
      throw new Error("El límite de exportación debe estar entre 1 y 50000");
    }
  }

  /**
   * Aplica valores por defecto a los filtros
   */
  private aplicarValoresPorDefecto(
    filtros: BalanceComprobacionFiltros
  ): BalanceComprobacionFiltros {
    return {
      ...filtros,
      contabilidad: filtros.contabilidad || "F,A",
      tipoReporte: filtros.tipoReporte || "Preliminar",
      limit: filtros.limit || 25,
      page: filtros.page || 1,
      offset:
        filtros.offset || ((filtros.page || 1) - 1) * (filtros.limit || 25),
    };
  }
}
