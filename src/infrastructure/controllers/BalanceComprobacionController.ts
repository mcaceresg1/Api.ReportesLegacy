import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { IBalanceComprobacionService } from "../../domain/services/IBalanceComprobacionService";
import {
  BalanceComprobacionFiltros,
  BalanceComprobacionResponse,
} from "../../domain/entities/BalanceComprobacion";

@injectable()
export class BalanceComprobacionController {
  constructor(
    @inject("IBalanceComprobacionService")
    private balanceComprobacionService: IBalanceComprobacionService
  ) {}

  /**
   * Health check endpoint
   */
  async health(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: "Servicio de Balance de Comprobación funcionando correctamente",
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Genera el reporte de Balance de Comprobación
   * @swagger
   * /api/balance-comprobacion/generar:
   *   post:
   *     tags:
   *       - Balance de Comprobación
   *     summary: Genera el reporte de Balance de Comprobación
   *     description: Ejecuta el proceso para generar el reporte de Balance de Comprobación combinando datos de SALDO, MAYOR, DIARIO y CUENTA_CONTABLE
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - conjunto
   *               - usuario
   *               - fechaInicio
   *               - fechaFin
   *             properties:
   *               conjunto:
   *                 type: string
   *                 description: Código del conjunto contable
   *                 example: "001"
   *               usuario:
   *                 type: string
   *                 description: Usuario que genera el reporte
   *                 example: "ADMIN"
   *               fechaInicio:
   *                 type: string
   *                 format: date
   *                 description: Fecha de inicio del período
   *                 example: "2024-01-01"
   *               fechaFin:
   *                 type: string
   *                 format: date
   *                 description: Fecha de fin del período
   *                 example: "2024-12-31"
   *               contabilidad:
   *                 type: string
   *                 description: Tipo de contabilidad
   *                 enum: ["F", "A", "F,A"]
   *                 default: "F,A"
   *                 example: "F"
   *               tipoReporte:
   *                 type: string
   *                 description: Tipo de reporte
   *                 enum: ["Preliminar", "Oficial"]
   *                 default: "Preliminar"
   *                 example: "Preliminar"
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Reporte de Balance de Comprobación generado exitosamente"
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const {
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoReporte,
        // Filtros generales
        moneda,
        origen,
        nivelAnalisis,
        realizarAnalisisAsientos,
        cuentaDesde,
        cuentaHasta,
        libroElectronico,
        campoLibroElectronico,
        versionLibroElectronico,
        // Filtros de asientos
        excluirAsientoCierre,
        soloMostrarNivelSeleccionado,
        considerarAsientoApertura,
        asientoDesde,
        asientoHasta,
        agrupacionDesde,
        agrupacionHasta,
        // Tipos de asiento
        tiposSeleccionados,
        desglosarPorTipoEnExcel,
        // Cuenta contable
        formatoCuentaContable,
        // Centro de costo
        formatoCentroCosto,
        analisisCentroCosto,
        ordenamientoCentroCosto,
        // Dimensión
        dimensionAdicional,
        // Títulos
        tituloPrincipal,
        titulo2,
        titulo3,
        titulo4,
      } = req.body;

      // Validaciones
      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message:
            "Los campos conjunto, usuario, fechaInicio y fechaFin son obligatorios",
        });
        return;
      }

      // Validar fechas
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);

      if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
        res.status(400).json({
          success: false,
          message: "Las fechas deben tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (fechaInicioDate > fechaFinDate) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio no puede ser mayor que la fecha de fin",
        });
        return;
      }

      // Usar el servicio
      await this.balanceComprobacionService.generarReporteBalanceComprobacion(
        conjunto as string,
        usuario as string,
        fechaInicioDate,
        fechaFinDate,
        contabilidad || "F,A",
        tipoReporte || "Preliminar"
      );

      res.status(200).json({
        success: true,
        message: "Reporte de Balance de Comprobación generado exitosamente",
      });
    } catch (error) {
      console.error("Error en generarReporte:", error);
      res.status(500).json({
        success: false,
        message: "Error al generar el reporte de Balance de Comprobación",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Obtiene los datos del Balance de Comprobación con filtros y paginación
   * @swagger
   * /api/balance-comprobacion/obtener:
   *   get:
   *     tags:
   *       - Balance de Comprobación
   *     summary: Obtiene los datos del Balance de Comprobación
   *     description: Recupera los datos del reporte con filtros opcionales y paginación
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "001"
   *       - in: query
   *         name: usuario
   *         required: true
   *         schema:
   *           type: string
   *         description: Usuario propietario del reporte
   *         example: "ADMIN"
   *       - in: query
   *         name: fechaInicio
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio del período
   *         example: "2024-01-01"
   *       - in: query
   *         name: fechaFin
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin del período
   *         example: "2024-12-31"
   *       - in: query
   *         name: cuentaContable
   *         schema:
   *           type: string
   *         description: Filtro por cuenta contable (búsqueda parcial)
   *         example: "1105"
   *       - in: query
   *         name: centroCosto
   *         schema:
   *           type: string
   *         description: Filtro por centro de costo (búsqueda parcial)
   *         example: "001"
   *       - in: query
   *         name: tipo
   *         schema:
   *           type: string
   *         description: Filtro por tipo de cuenta
   *         example: "ACTIVO"
   *       - in: query
   *         name: tipoDetallado
   *         schema:
   *           type: string
   *         description: Filtro por tipo detallado
   *         example: "ACTIVO_CORRIENTE"
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: string
   *         description: Tipo de contabilidad
   *         enum: ["F", "A", "F,A"]
   *         default: "F,A"
   *         example: "F"
   *       - in: query
   *         name: tipoReporte
   *         schema:
   *           type: string
   *         description: Tipo de reporte
   *         enum: ["Preliminar", "Oficial"]
   *         default: "Preliminar"
   *         example: "Preliminar"
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Número de página
   *         example: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 1000
   *         description: Registros por página
   *         example: 25
   *     responses:
   *       200:
   *         description: Datos obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Balance de Comprobación obtenido exitosamente"
   *                 data:
   *                   $ref: '#/components/schemas/BalanceComprobacionResponse'
   *                 paginacion:
   *                   type: object
   *                   properties:
   *                     pagina:
   *                       type: integer
   *                       example: 1
   *                     porPagina:
   *                       type: integer
   *                       example: 25
   *                     total:
   *                       type: integer
   *                       example: 150
   *                     totalPaginas:
   *                       type: integer
   *                       example: 6
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerBalanceComprobacion(req: Request, res: Response): Promise<void> {
    try {
      const {
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoReporte,
        // Filtros generales
        moneda,
        origen,
        nivelAnalisis,
        realizarAnalisisAsientos,
        cuentaDesde,
        cuentaHasta,
        libroElectronico,
        campoLibroElectronico,
        versionLibroElectronico,
        // Filtros de asientos
        excluirAsientoCierre,
        soloMostrarNivelSeleccionado,
        considerarAsientoApertura,
        asientoDesde,
        asientoHasta,
        agrupacionDesde,
        agrupacionHasta,
        // Tipos de asiento
        tiposSeleccionados,
        desglosarPorTipoEnExcel,
        // Cuenta contable
        formatoCuentaContable,
        // Centro de costo
        formatoCentroCosto,
        analisisCentroCosto,
        ordenamientoCentroCosto,
        // Dimensión
        dimensionAdicional,
        // Títulos
        tituloPrincipal,
        titulo2,
        titulo3,
        titulo4,
        // Paginación
        page,
        limit,
      } = req.query;

      // Validaciones
      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message:
            "Los parámetros conjunto, usuario, fechaInicio y fechaFin son obligatorios",
        });
        return;
      }

      // Validar y convertir fechas
      const fechaInicioDate = new Date(fechaInicio as string);
      const fechaFinDate = new Date(fechaFin as string);

      if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
        res.status(400).json({
          success: false,
          message: "Las fechas deben tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      // Validar y convertir paginación
      const pageNum = page ? parseInt(page as string, 10) : 1;
      const limitNum = limit ? parseInt(limit as string, 10) : 25;

      if (pageNum < 1 || limitNum < 1 || limitNum > 1000) {
        res.status(400).json({
          success: false,
          message:
            "La página debe ser >= 1 y el límite debe estar entre 1 y 1000",
        });
        return;
      }

      const offset = (pageNum - 1) * limitNum;

      // Preparar filtros
      const filtros: BalanceComprobacionFiltros = {
        conjunto: conjunto as string,
        usuario: usuario as string,
        fechaInicio: fechaInicioDate,
        fechaFin: fechaFinDate,
        contabilidad: contabilidad as string,
        tipoReporte: tipoReporte as string,
        // Filtros generales
        ...(moneda && { moneda: moneda as string }),
        ...(origen && { origen: origen as string }),
        ...(nivelAnalisis && { nivelAnalisis: parseInt(nivelAnalisis as string, 10) }),
        ...(realizarAnalisisAsientos && { realizarAnalisisAsientos: realizarAnalisisAsientos === 'true' }),
        ...(cuentaDesde && { cuentaDesde: cuentaDesde as string }),
        ...(cuentaHasta && { cuentaHasta: cuentaHasta as string }),
        ...(libroElectronico && { libroElectronico: libroElectronico === 'true' }),
        ...(campoLibroElectronico && { campoLibroElectronico: campoLibroElectronico as string }),
        ...(versionLibroElectronico && { versionLibroElectronico: versionLibroElectronico as string }),
        // Filtros de asientos
        ...(excluirAsientoCierre && { excluirAsientoCierre: excluirAsientoCierre === 'true' }),
        ...(soloMostrarNivelSeleccionado && { soloMostrarNivelSeleccionado: soloMostrarNivelSeleccionado === 'true' }),
        ...(considerarAsientoApertura && { considerarAsientoApertura: considerarAsientoApertura === 'true' }),
        ...(asientoDesde && { asientoDesde: parseInt(asientoDesde as string, 10) }),
        ...(asientoHasta && { asientoHasta: parseInt(asientoHasta as string, 10) }),
        ...(agrupacionDesde && { agrupacionDesde: parseInt(agrupacionDesde as string, 10) }),
        ...(agrupacionHasta && { agrupacionHasta: parseInt(agrupacionHasta as string, 10) }),
        // Tipos de asiento
        ...(tiposSeleccionados && { tiposSeleccionados: (tiposSeleccionados as string).split(',') }),
        ...(desglosarPorTipoEnExcel && { desglosarPorTipoEnExcel: desglosarPorTipoEnExcel === 'true' }),
        // Cuenta contable
        ...(formatoCuentaContable && { formatoCuentaContable: formatoCuentaContable as string }),
        // Centro de costo
        ...(formatoCentroCosto && { formatoCentroCosto: formatoCentroCosto as string }),
        ...(analisisCentroCosto && { analisisCentroCosto: analisisCentroCosto as string }),
        ...(ordenamientoCentroCosto && { ordenamientoCentroCosto: ordenamientoCentroCosto as string }),
        // Dimensión
        ...(dimensionAdicional && { dimensionAdicional: dimensionAdicional as string }),
        // Títulos
        ...(tituloPrincipal && { tituloPrincipal: tituloPrincipal as string }),
        ...(titulo2 && { titulo2: titulo2 as string }),
        ...(titulo3 && { titulo3: titulo3 as string }),
        ...(titulo4 && { titulo4: titulo4 as string }),
        // Paginación
        limit: limitNum,
        offset,
      };

      // Usar el servicio
      const resultado =
        await this.balanceComprobacionService.obtenerBalanceComprobacion(
          conjunto as string,
          filtros
        );

      res.status(200).json({
        success: resultado.success,
        message: resultado.message,
        data: resultado.data,
        pagination: resultado.pagination,
      });
    } catch (error) {
      console.error("Error en obtenerBalanceComprobacion:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener el Balance de Comprobación",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Exporta el Balance de Comprobación a Excel
   * @swagger
   * /api/balance-comprobacion/exportar-excel:
   *   get:
   *     tags:
   *       - Balance de Comprobación
   *     summary: Exporta el Balance de Comprobación a Excel
   *     description: Genera y descarga un archivo Excel con los datos del Balance de Comprobación
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "001"
   *       - in: query
   *         name: usuario
   *         required: true
   *         schema:
   *           type: string
   *         description: Usuario que exporta
   *         example: "ADMIN"
   *       - in: query
   *         name: fechaInicio
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio del período
   *         example: "2024-01-01"
   *       - in: query
   *         name: fechaFin
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin del período
   *         example: "2024-12-31"
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: string
   *         description: Tipo de contabilidad
   *         enum: ["F", "A", "F,A"]
   *         default: "F,A"
   *         example: "F"
   *       - in: query
   *         name: tipoReporte
   *         schema:
   *           type: string
   *         description: Tipo de reporte
   *         enum: ["Preliminar", "Oficial"]
   *         default: "Preliminar"
   *         example: "Preliminar"
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 50000
   *         description: Límite de registros a exportar
   *         example: 10000
   *     responses:
   *       200:
   *         description: Archivo Excel generado exitosamente
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const {
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoReporte,
        limit,
        // Filtros generales
        moneda,
        origen,
        nivelAnalisis,
        realizarAnalisisAsientos,
        cuentaDesde,
        cuentaHasta,
        libroElectronico,
        campoLibroElectronico,
        versionLibroElectronico,
        // Filtros de asientos
        excluirAsientoCierre,
        soloMostrarNivelSeleccionado,
        considerarAsientoApertura,
        asientoDesde,
        asientoHasta,
        agrupacionDesde,
        agrupacionHasta,
        // Tipos de asiento
        tiposSeleccionados,
        desglosarPorTipoEnExcel,
        // Cuenta contable
        formatoCuentaContable,
        // Centro de costo
        formatoCentroCosto,
        analisisCentroCosto,
        ordenamientoCentroCosto,
        // Dimensión
        dimensionAdicional,
        // Títulos
        tituloPrincipal,
        titulo2,
        titulo3,
        titulo4,
      } = req.query;

      // Validaciones
      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message:
            "Los parámetros conjunto, usuario, fechaInicio y fechaFin son obligatorios",
        });
        return;
      }

      // Validar fechas
      const fechaInicioDate = new Date(fechaInicio as string);
      const fechaFinDate = new Date(fechaFin as string);

      if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
        res.status(400).json({
          success: false,
          message: "Las fechas deben tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      // Validar límite
      const limitNum = limit ? parseInt(limit as string, 10) : 10000;
      if (limitNum < 1 || limitNum > 50000) {
        res.status(400).json({
          success: false,
          message: "El límite debe estar entre 1 y 50000",
        });
        return;
      }

      // Usar el servicio
      const excelBuffer = await this.balanceComprobacionService.exportarExcel(
        conjunto as string,
        usuario as string,
        fechaInicioDate,
        fechaFinDate,
        contabilidad as string,
        tipoReporte as string,
        limitNum,
        // Filtros generales
        moneda as string,
        origen as string,
        nivelAnalisis ? parseInt(nivelAnalisis as string, 10) : undefined,
        realizarAnalisisAsientos === 'true',
        cuentaDesde as string,
        cuentaHasta as string,
        libroElectronico === 'true',
        campoLibroElectronico as string,
        versionLibroElectronico as string,
        // Filtros de asientos
        excluirAsientoCierre === 'true',
        soloMostrarNivelSeleccionado === 'true',
        considerarAsientoApertura === 'true',
        asientoDesde ? parseInt(asientoDesde as string, 10) : undefined,
        asientoHasta ? parseInt(asientoHasta as string, 10) : undefined,
        agrupacionDesde ? parseInt(agrupacionDesde as string, 10) : undefined,
        agrupacionHasta ? parseInt(agrupacionHasta as string, 10) : undefined,
        // Tipos de asiento
        tiposSeleccionados ? (tiposSeleccionados as string).split(',') : undefined,
        desglosarPorTipoEnExcel === 'true',
        // Cuenta contable
        formatoCuentaContable as string,
        // Centro de costo
        formatoCentroCosto as string,
        analisisCentroCosto as string,
        ordenamientoCentroCosto as string,
        // Dimensión
        dimensionAdicional as string,
        // Títulos
        tituloPrincipal as string,
        titulo2 as string,
        titulo3 as string,
        titulo4 as string
      );

      // Configurar headers para descarga
      const fileName = `balance-comprobacion-${conjunto}-${fechaInicio}-${fechaFin}.xlsx`;
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Length", excelBuffer.length);

      // Enviar archivo
      res.send(excelBuffer);
    } catch (error) {
      console.error("Error en exportarExcel:", error);
      res.status(500).json({
        success: false,
        message: "Error al exportar Balance de Comprobación a Excel",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
