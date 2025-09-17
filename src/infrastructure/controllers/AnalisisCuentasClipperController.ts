import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IAnalisisCuentasClipperService } from "../../domain/services/IAnalisisCuentasClipperService";
import {
  AnalisisCuentasClipperFiltros,
  AnalisisCuentasRangoClipperFiltros,
  AnalisisCuentasFechasClipperFiltros,
  AnalisisCuentasVencimientoClipperFiltros,
} from "../../domain/entities/AnalisisCuentasClipper";

/**
 * @swagger
 * tags:
 *   - name: Clipper - Análisis de Cuentas
 *     description: Endpoints del módulo de Análisis de Cuentas desde Clipper
 */
/**
 * Controlador para Análisis de Cuentas Clipper
 * Maneja las peticiones HTTP para el reporte
 */
@injectable()
export class AnalisisCuentasClipperController {
  constructor(
    @inject("IAnalisisCuentasClipperService")
    private readonly analisisCuentasClipperService: IAnalisisCuentasClipperService
  ) {}

  /**
   * @swagger
   * /api/analisis-cuentas-clipper:
   *   get:
   *     summary: Obtener reporte de análisis de cuentas clipper
   *     tags: [Clipper - Análisis de Cuentas]
   *     description: "Obtiene el reporte de análisis de cuentas con filtros desde la base de datos Clipper GPC."
   *     parameters:
   *       - in: query
   *         name: baseDatos
   *         required: true
   *         schema:
   *           type: string
   *           enum: [bdclipperGPC, bdclipperGPC2, bdclipperGPC3, bdclipperGPC4, bdclipperGPC5, bdclipperGPC6, bdclipperGPC7, bdclipperGPC8, bdclipperGPC9]
   *           example: "bdclipperGPC"
   *         description: "Nombre de la base de datos Clipper GPC. Opciones disponibles: ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC), PRUEBA (bdclipperGPC2), PARQUE DEL RECUERDO (bdclipperGPC3), MISION CEMENTERIO CATOLICO (bdclipperGPC4), PARQUE DEL RECUERDO (bdclipperGPC5), ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC6), MISION CEMENTERIO CATOLICO (bdclipperGPC7), COPIA DE ACSJB 01 (bdclipperGPC8), COPIA DE ACSJB 02 (bdclipperGPC9)"
   *       - in: query
   *         name: mes
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 12
   *           example: 12
   *         description: "Mes del reporte (1-12)"
   *       - in: query
   *         name: nivel
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 3
   *           example: 2
   *         description: "Nivel de la cuenta (1-3)"
   *       - in: query
   *         name: cuenta
   *         required: false
   *         schema:
   *           type: string
   *           example: "1010101"
   *         description: "Código de cuenta específica"
   *     responses:
   *       200:
   *         description: Reporte obtenido exitosamente
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
   *                   example: "Reporte generado exitosamente"
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       cuenta:
   *                         type: string
   *                         example: "1010101"
   *                       nombre:
   *                         type: string
   *                         example: "Caja General"
   *                       saldo_anterior:
   *                         type: string
   *                         example: "1,000.00"
   *                       debe_mes:
   *                         type: string
   *                         example: "500.00"
   *                       haber_mes:
   *                         type: string
   *                         example: "200.00"
   *                       saldo_final:
   *                         type: string
   *                         example: "1,300.00"
   *       400:
   *         description: Error de validación
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerReporte(req: Request, res: Response): Promise<void> {
    try {
      const filtros: AnalisisCuentasClipperFiltros = {
        baseDatos: req.query["baseDatos"] as string,
        mes: parseInt(req.query["mes"] as string),
        nivel: parseInt(req.query["nivel"] as string),
        cuenta: req.query["cuenta"] as string,
      };

      const result =
        await this.analisisCuentasClipperService.obtenerReporteAnalisisCuentasClipper(
          filtros
        );
      res.json(result);
    } catch (error) {
      console.error("Error en obtenerReporte:", error);
      res.status(500).json({
        success: false,
        data: [],
        message:
          error instanceof Error ? error.message : "Error interno del servidor",
      });
    }
  }

  /**
   * @swagger
   * /api/analisis-cuentas-clipper/rango:
   *   get:
   *     summary: Obtener reporte de análisis de cuentas por rango clipper
   *     tags: [Clipper - Análisis de Cuentas]
   *     description: "Obtiene el reporte de análisis de cuentas por rango desde la base de datos Clipper GPC usando la tabla VOUCHER."
   *     parameters:
   *       - in: query
   *         name: baseDatos
   *         required: true
   *         schema:
   *           type: string
   *           enum: [bdclipperGPC, bdclipperGPC2, bdclipperGPC3, bdclipperGPC4, bdclipperGPC5, bdclipperGPC6, bdclipperGPC7, bdclipperGPC8, bdclipperGPC9]
   *           example: "bdclipperGPC"
   *         description: "Nombre de la base de datos Clipper GPC. Opciones disponibles: ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC), PRUEBA (bdclipperGPC2), PARQUE DEL RECUERDO (bdclipperGPC3), MISION CEMENTERIO CATOLICO (bdclipperGPC4), PARQUE DEL RECUERDO (bdclipperGPC5), ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC6), MISION CEMENTERIO CATOLICO (bdclipperGPC7), COPIA DE ACSJB 01 (bdclipperGPC8), COPIA DE ACSJB 02 (bdclipperGPC9)"
   *       - in: query
   *         name: cuentaDesde
   *         required: true
   *         schema:
   *           type: string
   *           example: "101010001"
   *         description: "Código de cuenta de inicio del rango"
   *       - in: query
   *         name: cuentaHasta
   *         required: true
   *         schema:
   *           type: string
   *           example: "980600001"
   *         description: "Código de cuenta final del rango"
   *     responses:
   *       200:
   *         description: Reporte obtenido exitosamente
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
   *                   example: "Reporte de análisis por rango generado exitosamente"
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       CUENTA:
   *                         type: string
   *                         example: "101010001"
   *                         description: "Código de la cuenta contable"
   *                       NOMBRE:
   *                         type: string
   *                         example: "Caja General"
   *                         description: "Nombre de la cuenta contable"
   *                       DEBE:
   *                         type: string
   *                         example: "1,234.56"
   *                         description: "Suma total de movimientos deudores"
   *                       HABER:
   *                         type: string
   *                         example: "789.12"
   *                         description: "Suma total de movimientos acreedores"
   *       400:
   *         description: Error de validación
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "El parámetro 'baseDatos' es requerido"
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Error interno del servidor"
   *                 error:
   *                   type: string
   *                   example: "Error al obtener el reporte por rango: Base de datos no encontrada"
   */
  async obtenerReporteAnalisisCuentaRangoClipper(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { baseDatos, cuentaDesde, cuentaHasta } = req.query;

      // Validar parámetros requeridos
      if (!baseDatos) {
        res.status(400).json({
          success: false,
          message: "El parámetro 'baseDatos' es requerido",
        });
        return;
      }

      if (!cuentaDesde) {
        res.status(400).json({
          success: false,
          message: "El parámetro 'cuentaDesde' es requerido",
        });
        return;
      }

      if (!cuentaHasta) {
        res.status(400).json({
          success: false,
          message: "El parámetro 'cuentaHasta' es requerido",
        });
        return;
      }

      // Crear filtros
      const filtros: AnalisisCuentasRangoClipperFiltros = {
        baseDatos: baseDatos as string,
        cuentaDesde: cuentaDesde as string,
        cuentaHasta: cuentaHasta as string,
      };

      console.log(
        "Solicitud de reporte de análisis por rango recibida:",
        filtros
      );

      // Obtener el reporte
      const resultado =
        await this.analisisCuentasClipperService.obtenerReporteAnalisisCuentaRangoClipper(
          filtros
        );

      console.log(
        `Reporte de análisis por rango generado exitosamente. Registros: ${resultado.data.length}`
      );

      res.json(resultado);
    } catch (error) {
      console.error("Error en AnalisisCuentasRangoClipperController:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * @swagger
   * /api/analisis-cuentas-clipper/fechas:
   *   get:
   *     summary: Obtener reporte de análisis de cuentas por fechas clipper
   *     tags: [Clipper - Análisis de Cuentas]
   *     description: "Obtiene el reporte de análisis de cuentas por rango de fechas desde la base de datos Clipper GPC usando la tabla VOUCHER."
   *     parameters:
   *       - in: query
   *         name: baseDatos
   *         required: true
   *         schema:
   *           type: string
   *           enum: [bdclipperGPC, bdclipperGPC2, bdclipperGPC3, bdclipperGPC4, bdclipperGPC5, bdclipperGPC6, bdclipperGPC7, bdclipperGPC8, bdclipperGPC9]
   *           example: "bdclipperGPC"
   *         description: "Nombre de la base de datos Clipper GPC. Opciones disponibles: ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC), PRUEBA (bdclipperGPC2), PARQUE DEL RECUERDO (bdclipperGPC3), MISION CEMENTERIO CATOLICO (bdclipperGPC4), PARQUE DEL RECUERDO (bdclipperGPC5), ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC6), MISION CEMENTERIO CATOLICO (bdclipperGPC7), COPIA DE ACSJB 01 (bdclipperGPC8), COPIA DE ACSJB 02 (bdclipperGPC9)"
   *       - in: query
   *         name: fechaDesde
   *         required: true
   *         schema:
   *           type: string
   *           pattern: '^\d{2}/\d{2}/\d{4}$'
   *           example: "01/01/2000"
   *         description: "Fecha de inicio del rango (formato DD/MM/YYYY)"
   *       - in: query
   *         name: fechaHasta
   *         required: true
   *         schema:
   *           type: string
   *           pattern: '^\d{2}/\d{2}/\d{4}$'
   *           example: "31/12/2000"
   *         description: "Fecha final del rango (formato DD/MM/YYYY)"
   *     responses:
   *       200:
   *         description: Reporte obtenido exitosamente
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
   *                   example: "Reporte de análisis por fechas generado exitosamente"
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       CUENTA:
   *                         type: string
   *                         example: "101010001"
   *                         description: "Código de la cuenta contable"
   *                       NOMBRE:
   *                         type: string
   *                         example: "Caja General"
   *                         description: "Nombre de la cuenta contable"
   *                       DEBE:
   *                         type: string
   *                         example: "1,234.56"
   *                         description: "Suma total de movimientos deudores en el período"
   *                       HABER:
   *                         type: string
   *                         example: "789.12"
   *                         description: "Suma total de movimientos acreedores en el período"
   *       400:
   *         description: Error de validación
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "El parámetro 'baseDatos' es requerido"
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Error interno del servidor"
   *                 error:
   *                   type: string
   *                   example: "Error al obtener el reporte por fechas: Base de datos no encontrada"
   */
  async obtenerReporteAnalisisCuentasFechasClipper(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { baseDatos, fechaDesde, fechaHasta } = req.query;

      // Validar parámetros requeridos
      if (!baseDatos) {
        res.status(400).json({
          success: false,
          message: "El parámetro 'baseDatos' es requerido",
        });
        return;
      }

      if (!fechaDesde) {
        res.status(400).json({
          success: false,
          message: "El parámetro 'fechaDesde' es requerido",
        });
        return;
      }

      if (!fechaHasta) {
        res.status(400).json({
          success: false,
          message: "El parámetro 'fechaHasta' es requerido",
        });
        return;
      }

      // Crear filtros
      const filtros: AnalisisCuentasFechasClipperFiltros = {
        baseDatos: baseDatos as string,
        fechaDesde: fechaDesde as string,
        fechaHasta: fechaHasta as string,
      };

      console.log(
        "Solicitud de reporte de análisis por fechas recibida:",
        filtros
      );

      // Obtener el reporte
      const resultado =
        await this.analisisCuentasClipperService.obtenerReporteAnalisisCuentasFechasClipper(
          filtros
        );

      console.log(
        `Reporte de análisis por fechas generado exitosamente. Registros: ${resultado.data.length}`
      );

      res.json(resultado);
    } catch (error) {
      console.error("Error en AnalisisCuentasFechasClipperController:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * @swagger
   * /api/analisis-cuentas-clipper/vencimiento:
   *   get:
   *     summary: Obtener reporte de análisis de cuentas por fecha de vencimiento clipper
   *     tags: [Clipper - Análisis de Cuentas]
   *     description: "Obtiene el reporte de análisis de cuentas por fecha de vencimiento desde la base de datos Clipper GPC usando la tabla VOUCHER."
   *     parameters:
   *       - in: query
   *         name: baseDatos
   *         required: true
   *         schema:
   *           type: string
   *           enum: [bdclipperGPC, bdclipperGPC2, bdclipperGPC3, bdclipperGPC4, bdclipperGPC5, bdclipperGPC6, bdclipperGPC7, bdclipperGPC8, bdclipperGPC9]
   *           example: "bdclipperGPC"
   *         description: "Nombre de la base de datos Clipper GPC. Opciones disponibles: ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC), PRUEBA (bdclipperGPC2), PARQUE DEL RECUERDO (bdclipperGPC3), MISION CEMENTERIO CATOLICO (bdclipperGPC4), PARQUE DEL RECUERDO (bdclipperGPC5), ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC6), MISION CEMENTERIO CATOLICO (bdclipperGPC7), COPIA DE ACSJB 01 (bdclipperGPC8), COPIA DE ACSJB 02 (bdclipperGPC9)"
   *       - in: query
   *         name: cuentaDesde
   *         required: true
   *         schema:
   *           type: string
   *           example: "101010001"
   *         description: "Código de cuenta de inicio del rango"
   *       - in: query
   *         name: cuentaHasta
   *         required: true
   *         schema:
   *           type: string
   *           example: "980600001"
   *         description: "Código de cuenta final del rango"
   *       - in: query
   *         name: fechaVencimientoDesde
   *         required: true
   *         schema:
   *           type: string
   *           pattern: '^\d{2}/\d{2}/\d{4}$'
   *           example: "01/01/2000"
   *         description: "Fecha de vencimiento de inicio del rango (formato DD/MM/YYYY)"
   *       - in: query
   *         name: fechaVencimientoHasta
   *         required: true
   *         schema:
   *           type: string
   *           pattern: '^\d{2}/\d{2}/\d{4}$'
   *           example: "31/12/2000"
   *         description: "Fecha de vencimiento final del rango (formato DD/MM/YYYY)"
   *     responses:
   *       200:
   *         description: Reporte obtenido exitosamente
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
   *                   example: "Reporte de análisis por fecha de vencimiento generado exitosamente"
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       FECVEN:
   *                         type: string
   *                         example: "15/06/2000"
   *                         description: "Fecha de vencimiento del voucher"
   *                       CUENTA:
   *                         type: string
   *                         example: "101010001"
   *                         description: "Código de la cuenta contable"
   *                       NOMBRE:
   *                         type: string
   *                         example: "Caja General"
   *                         description: "Nombre de la cuenta contable"
   *                       DEBE:
   *                         type: string
   *                         example: "1,234.56"
   *                         description: "Suma total de movimientos deudores en el período de vencimiento"
   *       400:
   *         description: Error de validación
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "El parámetro 'baseDatos' es requerido"
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Error interno del servidor"
   *                 error:
   *                   type: string
   *                   example: "Error al obtener el reporte por fecha de vencimiento: Base de datos no encontrada"
   */
  async obtenerReporteAnalisisCuentasVencimientoClipper(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const {
        baseDatos,
        cuentaDesde,
        cuentaHasta,
        fechaVencimientoDesde,
        fechaVencimientoHasta,
      } = req.query;

      // Validar parámetros requeridos
      if (!baseDatos) {
        res.status(400).json({
          success: false,
          message: "El parámetro 'baseDatos' es requerido",
        });
        return;
      }

      if (!cuentaDesde) {
        res.status(400).json({
          success: false,
          message: "El parámetro 'cuentaDesde' es requerido",
        });
        return;
      }

      if (!cuentaHasta) {
        res.status(400).json({
          success: false,
          message: "El parámetro 'cuentaHasta' es requerido",
        });
        return;
      }

      if (!fechaVencimientoDesde) {
        res.status(400).json({
          success: false,
          message: "El parámetro 'fechaVencimientoDesde' es requerido",
        });
        return;
      }

      if (!fechaVencimientoHasta) {
        res.status(400).json({
          success: false,
          message: "El parámetro 'fechaVencimientoHasta' es requerido",
        });
        return;
      }

      // Crear filtros
      const filtros: AnalisisCuentasVencimientoClipperFiltros = {
        baseDatos: baseDatos as string,
        cuentaDesde: cuentaDesde as string,
        cuentaHasta: cuentaHasta as string,
        fechaVencimientoDesde: fechaVencimientoDesde as string,
        fechaVencimientoHasta: fechaVencimientoHasta as string,
      };

      console.log(
        "Solicitud de reporte de análisis por fecha de vencimiento recibida:",
        filtros
      );

      // Obtener el reporte
      const resultado =
        await this.analisisCuentasClipperService.obtenerReporteAnalisisCuentasVencimientoClipper(
          filtros
        );

      console.log(
        `Reporte de análisis por fecha de vencimiento generado exitosamente. Registros: ${resultado.data.length}`
      );

      res.json(resultado);
    } catch (error) {
      console.error(
        "Error en AnalisisCuentasVencimientoClipperController:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
