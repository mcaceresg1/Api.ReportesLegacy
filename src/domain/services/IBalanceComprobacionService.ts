import {
  BalanceComprobacion,
  BalanceComprobacionFiltros,
  BalanceComprobacionResponse,
} from "../entities/BalanceComprobacion";

/**
 * Interfaz del servicio para Balance de Comprobación
 * Define los contratos para la lógica de negocio del reporte de Balance de Comprobación
 */
export interface IBalanceComprobacionService {
  /**
   * Genera el reporte de Balance de Comprobación
   * @param conjunto Código del conjunto contable
   * @param usuario Usuario que genera el reporte
   * @param fechaInicio Fecha de inicio del período
   * @param fechaFin Fecha de fin del período
   * @param contabilidad Tipo de contabilidad ('F', 'A', 'F,A')
   * @param tipoReporte Tipo de reporte ('Preliminar', 'Oficial')
   * @param moneda Moneda del reporte
   * @param origen Origen de los datos
   * @param nivelAnalisis Nivel de análisis
   * @param realizarAnalisisAsientos Realizar análisis de asientos
   * @param cuentaDesde Cuenta contable desde
   * @param cuentaHasta Cuenta contable hasta
   * @param libroElectronico Libro electrónico
   * @param campoLibroElectronico Campo libro electrónico
   * @param versionLibroElectronico Versión libro electrónico
   * @param excluirAsientoCierre Excluir asiento de cierre
   * @param soloMostrarNivelSeleccionado Solo mostrar nivel seleccionado
   * @param considerarAsientoApertura Considerar asiento de apertura
   * @param asientoDesde Asiento desde
   * @param asientoHasta Asiento hasta
   * @param agrupacionDesde Agrupación desde
   * @param agrupacionHasta Agrupación hasta
   * @param tiposSeleccionados Tipos de asiento seleccionados
   * @param desglosarPorTipoEnExcel Desglosar por tipo en Excel
   * @param formatoCuentaContable Formato cuenta contable
   * @param formatoCentroCosto Formato centro de costo
   * @param analisisCentroCosto Análisis centro de costo
   * @param ordenamientoCentroCosto Ordenamiento centro de costo
   * @param dimensionAdicional Dimensión adicional
   * @param tituloPrincipal Título principal
   * @param titulo2 Título 2
   * @param titulo3 Título 3
   * @param titulo4 Título 4
   */
  generarReporteBalanceComprobacion(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad?: string,
    tipoReporte?: string,
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
  ): Promise<void>;

  /**
   * Obtiene los datos del Balance de Comprobación con filtros y paginación
   * @param conjunto Código del conjunto contable
   * @param filtros Filtros para la consulta
   * @returns Respuesta paginada con los datos del reporte
   */
  obtenerBalanceComprobacion(
    conjunto: string,
    filtros: BalanceComprobacionFiltros
  ): Promise<BalanceComprobacionResponse>;

  /**
   * Exporta el Balance de Comprobación a Excel
   * @param conjunto Código del conjunto contable
   * @param usuario Usuario que exporta
   * @param fechaInicio Fecha de inicio del período
   * @param fechaFin Fecha de fin del período
   * @param contabilidad Tipo de contabilidad
   * @param tipoReporte Tipo de reporte
   * @param limit Límite de registros a exportar
   * @param moneda Moneda del reporte
   * @param origen Origen de los datos
   * @param nivelAnalisis Nivel de análisis
   * @param realizarAnalisisAsientos Realizar análisis de asientos
   * @param cuentaDesde Cuenta contable desde
   * @param cuentaHasta Cuenta contable hasta
   * @param libroElectronico Libro electrónico
   * @param campoLibroElectronico Campo libro electrónico
   * @param versionLibroElectronico Versión libro electrónico
   * @param excluirAsientoCierre Excluir asiento de cierre
   * @param soloMostrarNivelSeleccionado Solo mostrar nivel seleccionado
   * @param considerarAsientoApertura Considerar asiento de apertura
   * @param asientoDesde Asiento desde
   * @param asientoHasta Asiento hasta
   * @param agrupacionDesde Agrupación desde
   * @param agrupacionHasta Agrupación hasta
   * @param tiposSeleccionados Tipos de asiento seleccionados
   * @param desglosarPorTipoEnExcel Desglosar por tipo en Excel
   * @param formatoCuentaContable Formato cuenta contable
   * @param formatoCentroCosto Formato centro de costo
   * @param analisisCentroCosto Análisis centro de costo
   * @param ordenamientoCentroCosto Ordenamiento centro de costo
   * @param dimensionAdicional Dimensión adicional
   * @param tituloPrincipal Título principal
   * @param titulo2 Título 2
   * @param titulo3 Título 3
   * @param titulo4 Título 4
   * @returns Buffer del archivo Excel
   */
  exportarExcel(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad?: string,
    tipoReporte?: string,
    limit?: number,
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
  ): Promise<Buffer>;
}
