import { injectable } from "inversify";
import { Request, Response } from "express";
import { ILibroDiarioOficonService } from "../../domain/services/ILibroDiarioOficonService";
import { LibroDiarioOficonRequest } from "../../domain/entities/LibroDiarioOficon";

/**
 * @swagger
 * components:
 *   schemas:
 *     LibroDiarioOficon:
 *       type: object
 *       properties:
 *         AÑO:
 *           type: integer
 *           description: Año del movimiento contable
 *           example: 2024
 *         MES:
 *           type: integer
 *           description: Mes del movimiento contable
 *           example: 1
 *         CODIGO_UNIDAD_CONTABLE:
 *           type: string
 *           description: Código de la unidad contable
 *           example: "001"
 *         NOMBRE_UNIDAD_CONTABLE:
 *           type: string
 *           description: Nombre de la unidad contable
 *           example: "Unidad Principal"
 *         CODIGO_OPERACION_CONTABLE:
 *           type: string
 *           description: Código de la operación contable
 *           example: "007"
 *         NUMERO_ASIENTO:
 *           type: integer
 *           description: Número del asiento contable
 *           example: 1
 *         NUMERO_SECUENCIAL:
 *           type: integer
 *           description: Número secuencial del movimiento
 *           example: 1
 *         FECHA_ASIENTO_CONTABLE:
 *           type: string
 *           description: Fecha del asiento contable
 *           example: "01/01/2024"
 *         CUENTA_EMPRESA:
 *           type: string
 *           description: Código de la cuenta de la empresa
 *           example: "110101"
 *         TIPO_AUXILIAR:
 *           type: string
 *           description: Tipo de auxiliar
 *           example: "CLI"
 *         CODIGO_AUXILIAR:
 *           type: string
 *           description: Código del auxiliar
 *           example: "001"
 *         TIPO_DOCUMENTO:
 *           type: string
 *           description: Tipo de documento
 *           example: "FAC"
 *         NUMERO_DOCUMENTO:
 *           type: string
 *           description: Número del documento
 *           example: "001-001"
 *         FECHA_DOCUMENTO:
 *           type: string
 *           description: Fecha del documento
 *           example: "01/01/2024"
 *         ORDEN_SERVICIO:
 *           type: string
 *           description: Orden de servicio
 *           example: "OS001"
 *         GLOSA:
 *           type: string
 *           description: Glosa del movimiento
 *           example: "Venta de productos"
 *         IMPORTE_DEBE:
 *           type: number
 *           format: double
 *           description: Importe en debe
 *           example: 1000.00
 *         IMPORTE_HABER:
 *           type: number
 *           format: double
 *           description: Importe en haber
 *           example: 0.00
 *         IMPORTE_MOVIMIENTO_ORIGINAL:
 *           type: number
 *           format: double
 *           description: Importe del movimiento original
 *           example: 1000.00
 *         DESC_OPERACION_CONTABLE:
 *           type: string
 *           description: Descripción de la operación contable
 *           example: "Operación de Venta"
 *       required:
 *         - AÑO
 *         - MES
 *         - CODIGO_UNIDAD_CONTABLE
 *         - NOMBRE_UNIDAD_CONTABLE
 *         - CODIGO_OPERACION_CONTABLE
 *         - NUMERO_ASIENTO
 *         - NUMERO_SECUENCIAL
 *         - FECHA_ASIENTO_CONTABLE
 *         - CUENTA_EMPRESA
 *         - TIPO_AUXILIAR
 *         - CODIGO_AUXILIAR
 *         - TIPO_DOCUMENTO
 *         - NUMERO_DOCUMENTO
 *         - FECHA_DOCUMENTO
 *         - ORDEN_SERVICIO
 *         - GLOSA
 *         - IMPORTE_DEBE
 *         - IMPORTE_HABER
 *         - IMPORTE_MOVIMIENTO_ORIGINAL
 *         - DESC_OPERACION_CONTABLE
 *
 *     LibroDiarioOficonRequest:
 *       type: object
 *       properties:
 *         IDEMPRESA:
 *           type: integer
 *           description: ID de la empresa
 *           example: 1
 *         FECHAINI:
 *           type: string
 *           format: date
 *           description: Fecha inicial del rango (YYYY-MM-DD)
 *           example: "2024-01-01"
 *         FECHAFINAL:
 *           type: string
 *           format: date
 *           description: Fecha final del rango (YYYY-MM-DD)
 *           example: "2024-01-31"
 *       required:
 *         - IDEMPRESA
 *         - FECHAINI
 *         - FECHAFINAL
 *
 *     LibroDiarioOficonResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si la operación fue exitosa
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LibroDiarioOficon'
 *           description: Array de registros del libro diario
 *         totalRecords:
 *           type: integer
 *           description: Total de registros encontrados
 *           example: 1
 *         message:
 *           type: string
 *           description: Mensaje descriptivo de la operación
 *           example: "Reporte generado exitosamente. Se encontraron 1 registros."
 *       required:
 *         - success
 *         - data
 *         - message
 */

@injectable()
export class LibroDiarioOficonController {
  constructor(
    private readonly libroDiarioOficonService: ILibroDiarioOficonService
  ) {}

  /**
   * @swagger
   * /api/libro-diario-oficon/generar-reporte:
   *   get:
   *     summary: Generar reporte de libro diario OFICON
   *     description: Genera un reporte de libro diario desde la base de datos OFICON con parámetros de query
   *     tags: [Libro Diario OFICON]
   *     parameters:
   *       - in: query
   *         name: IDEMPRESA
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la empresa
   *         example: 1
   *       - in: query
   *         name: FECHAINI
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha inicial del rango (YYYY-MM-DD)
   *         example: "2024-01-01"
   *       - in: query
   *         name: FECHAFINAL
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha final del rango (YYYY-MM-DD)
   *         example: "2024-01-31"
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LibroDiarioOficonResponse'
   *             example:
   *               success: true
   *               data:
   *                 - AÑO: 2024
   *                   MES: 1
   *                   CODIGO_UNIDAD_CONTABLE: "001"
   *                   NOMBRE_UNIDAD_CONTABLE: "Unidad Principal"
   *                   CODIGO_OPERACION_CONTABLE: "007"
   *                   NUMERO_ASIENTO: 1
   *                   NUMERO_SECUENCIAL: 1
   *                   FECHA_ASIENTO_CONTABLE: "01/01/2024"
   *                   CUENTA_EMPRESA: "110101"
   *                   TIPO_AUXILIAR: "CLI"
   *                   CODIGO_AUXILIAR: "001"
   *                   TIPO_DOCUMENTO: "FAC"
   *                   NUMERO_DOCUMENTO: "001-001"
   *                   FECHA_DOCUMENTO: "01/01/2024"
   *                   ORDEN_SERVICIO: "OS001"
   *                   GLOSA: "Venta de productos"
   *                   IMPORTE_DEBE: 1000.00
   *                   IMPORTE_HABER: 0.00
   *                   IMPORTE_MOVIMIENTO_ORIGINAL: 1000.00
   *                   DESC_OPERACION_CONTABLE: "Operación de Venta"
   *               totalRecords: 1
   *               message: "Reporte generado exitosamente. Se encontraron 1 registros."
   *       400:
   *         description: Error en los parámetros de entrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LibroDiarioOficonResponse'
   *             example:
   *               success: false
   *               data: []
   *               message: "Los parámetros IDEMPRESA, FECHAINI y FECHAFINAL son requeridos"
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
   *                 data:
   *                   type: array
   *                   example: []
   *                 error:
   *                   type: string
   *                   example: "Error desconocido"
   */
  async generarReporteLibroDiarioOficon(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { IDEMPRESA, FECHAINI, FECHAFINAL } = req.query;

      // Validar parámetros requeridos
      if (!IDEMPRESA || !FECHAINI || !FECHAFINAL) {
        res.status(400).json({
          success: false,
          message:
            "Los parámetros IDEMPRESA, FECHAINI y FECHAFINAL son requeridos",
          data: [],
        });
        return;
      }

      // Validar que IDEMPRESA sea un número
      const idEmpresa = parseInt(IDEMPRESA as string);
      if (isNaN(idEmpresa)) {
        res.status(400).json({
          success: false,
          message: "IDEMPRESA debe ser un número válido",
          data: [],
        });
        return;
      }

      const request: LibroDiarioOficonRequest = {
        IDEMPRESA: idEmpresa,
        FECHAINI: FECHAINI as string,
        FECHAFINAL: FECHAFINAL as string,
      };

      const result =
        await this.libroDiarioOficonService.generarReporteLibroDiarioOficon(
          request
        );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "Error en LibroDiarioOficonController.generarReporteLibroDiarioOficon:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        data: [],
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * @swagger
   * /api/libro-diario-oficon/generar-reporte:
   *   post:
   *     summary: Generar reporte de libro diario OFICON (POST)
   *     description: Genera un reporte de libro diario desde la base de datos OFICON con parámetros en el body
   *     tags: [Libro Diario OFICON]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LibroDiarioOficonRequest'
   *           example:
   *             IDEMPRESA: 1
   *             FECHAINI: "2024-01-01"
   *             FECHAFINAL: "2024-01-31"
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LibroDiarioOficonResponse'
   *             example:
   *               success: true
   *               data:
   *                 - AÑO: 2024
   *                   MES: 1
   *                   CODIGO_UNIDAD_CONTABLE: "001"
   *                   NOMBRE_UNIDAD_CONTABLE: "Unidad Principal"
   *                   CODIGO_OPERACION_CONTABLE: "007"
   *                   NUMERO_ASIENTO: 1
   *                   NUMERO_SECUENCIAL: 1
   *                   FECHA_ASIENTO_CONTABLE: "01/01/2024"
   *                   CUENTA_EMPRESA: "110101"
   *                   TIPO_AUXILIAR: "CLI"
   *                   CODIGO_AUXILIAR: "001"
   *                   TIPO_DOCUMENTO: "FAC"
   *                   NUMERO_DOCUMENTO: "001-001"
   *                   FECHA_DOCUMENTO: "01/01/2024"
   *                   ORDEN_SERVICIO: "OS001"
   *                   GLOSA: "Venta de productos"
   *                   IMPORTE_DEBE: 1000.00
   *                   IMPORTE_HABER: 0.00
   *                   IMPORTE_MOVIMIENTO_ORIGINAL: 1000.00
   *                   DESC_OPERACION_CONTABLE: "Operación de Venta"
   *               totalRecords: 1
   *               message: "Reporte generado exitosamente. Se encontraron 1 registros."
   *       400:
   *         description: Error en los parámetros de entrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LibroDiarioOficonResponse'
   *             example:
   *               success: false
   *               data: []
   *               message: "Los parámetros IDEMPRESA, FECHAINI y FECHAFINAL son requeridos"
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
   *                 data:
   *                   type: array
   *                   example: []
   *                 error:
   *                   type: string
   *                   example: "Error desconocido"
   */
  async generarReporteLibroDiarioOficonPost(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { IDEMPRESA, FECHAINI, FECHAFINAL } = req.body;

      // Validar parámetros requeridos
      if (!IDEMPRESA || !FECHAINI || !FECHAFINAL) {
        res.status(400).json({
          success: false,
          message:
            "Los parámetros IDEMPRESA, FECHAINI y FECHAFINAL son requeridos",
          data: [],
        });
        return;
      }

      // Validar que IDEMPRESA sea un número
      const idEmpresa = parseInt(IDEMPRESA);
      if (isNaN(idEmpresa)) {
        res.status(400).json({
          success: false,
          message: "IDEMPRESA debe ser un número válido",
          data: [],
        });
        return;
      }

      const request: LibroDiarioOficonRequest = {
        IDEMPRESA: idEmpresa,
        FECHAINI: FECHAINI,
        FECHAFINAL: FECHAFINAL,
      };

      const result =
        await this.libroDiarioOficonService.generarReporteLibroDiarioOficon(
          request
        );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "Error en LibroDiarioOficonController.generarReporteLibroDiarioOficonPost:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        data: [],
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
