import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IGananciasPerdidasClipperService } from "../../domain/services/IGananciasPerdidasClipperService";
import {
  ClipperEstadoGananciasYResultados,
  FiltrosGananciasPerdidasClipper,
} from "../../domain/entities/GananciasPerdidasClipper";

/**
 * @swagger
 * tags:
 *   - name: Clipper - Ganancias y Pérdidas
 *     description: Endpoints del módulo de Ganancias y Pérdidas desde Clipper
 */
@injectable()
export class GananciasPerdidasClipperController {
  constructor(
    @inject("IGananciasPerdidasClipperService")
    private readonly gananciasPerdidasService: IGananciasPerdidasClipperService
  ) {}

  /**
   * @swagger
   * /api/ganancias-perdidas-clipper/{bdClipperGPC}:
   *   get:
   *     summary: Obtener estado de ganancias y pérdidas desde Clipper
   *     tags: [Clipper - Ganancias y Pérdidas]
   *     description: "Retorna el estado de ganancias y pérdidas con conceptos como ventas, costos, gastos e ingresos desde la base de datos Clipper GPC para un período específico."
   *     parameters:
   *       - in: path
   *         name: bdClipperGPC
   *         required: true
   *         schema:
   *           type: string
   *           enum: [bdclipperGPC, bdclipperGPC1]
   *           example: "bdclipperGPC"
   *         description: "Nombre de la base de datos Clipper GPC"
   *       - in: query
   *         name: periodoDesde
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 12
   *           example: 1
   *         description: "Mes de inicio del período (1-12)"
   *       - in: query
   *         name: periodoHasta
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 12
   *           example: 12
   *         description: "Mes de fin del período (1-12)"
   *     responses:
   *       200:
   *         description: Estado de ganancias y pérdidas obtenido exitosamente
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
   *                   example: "Estado de ganancias y pérdidas clipper obtenido exitosamente"
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ClipperEstadoGananciasYResultados'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *       400:
   *         description: Parámetros inválidos
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
   *                   example: "El parámetro 'bdClipperGPC' es obligatorio"
   *                 error:
   *                   type: string
   *                   example: "Parámetro requerido faltante"
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
   *                   example: "Error al obtener estado de ganancias y pérdidas clipper"
   *                 error:
   *                   type: string
   *                   example: "Error de conexión a la base de datos"
   */
  async obtenerGananciasPerdidasClipper(
    req: Request,
    res: Response
  ): Promise<void> {
    const { bdClipperGPC } = req.params;
    const { periodoDesde, periodoHasta } = req.query;

    if (!bdClipperGPC || typeof bdClipperGPC !== "string") {
      res.status(400).json({
        success: false,
        message: "El parámetro 'bdClipperGPC' es obligatorio",
        data: null,
      });
      return;
    }

    if (!periodoDesde || !periodoHasta) {
      res.status(400).json({
        success: false,
        message:
          "Los parámetros 'periodoDesde' y 'periodoHasta' son obligatorios",
        data: null,
      });
      return;
    }

    try {
      const filtros: FiltrosGananciasPerdidasClipper = {
        periodoDesde: parseInt(periodoDesde as string),
        periodoHasta: parseInt(periodoHasta as string),
      };

      const resultado =
        await this.gananciasPerdidasService.obtenerGananciasPerdidasClipper(
          bdClipperGPC,
          filtros
        );

      res.json({
        success: true,
        message: "Estado de ganancias y pérdidas clipper obtenido exitosamente",
        data: resultado,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(
        "GananciasPerdidasClipperController.obtenerGananciasPerdidasClipper - Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Error al obtener estado de ganancias y pérdidas clipper",
        error: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * @swagger
   * /api/ganancias-perdidas-clipper/info:
   *   get:
   *     summary: Obtener información del endpoint
   *     tags: [Clipper - Ganancias y Pérdidas]
   *     description: "Retorna información detallada sobre el endpoint de Ganancias y Pérdidas Clipper, incluyendo parámetros, estructura de datos y métodos disponibles."
   *     responses:
   *       200:
   *         description: Información del endpoint obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     endpoint:
   *                       type: string
   *                       example: "Ganancias y Pérdidas Clipper"
   *                     description:
   *                       type: string
   *                       example: "Obtiene los datos del estado de ganancias y pérdidas desde la base de datos Clipper"
   *                     version:
   *                       type: string
   *                       example: "1.0.0"
   *                     methods:
   *                       type: object
   *                       properties:
   *                         GET:
   *                           type: object
   *                           properties:
   *                             "/?bdClipperGPC=bdclipperGPC":
   *                               type: string
   *                               example: "Obtiene todos los registros del estado de ganancias y pérdidas clipper"
   *                             "/info":
   *                               type: string
   *                               example: "Obtiene información sobre este endpoint"
   *                     parameters:
   *                       type: object
   *                       properties:
   *                         bdClipperGPC:
   *                           type: string
   *                           example: "string - Nombre de la base de datos Clipper GPC (requerido). Valores disponibles: bdclipperGPC, bdclipperGPC1"
   *                     dataStructure:
   *                       type: object
   *                       properties:
   *                         concepto:
   *                           type: string
   *                           example: "string - Concepto del estado de ganancias y pérdidas (ej. VENTAS, GASTOS ADMINISTRATIVOS)"
   *                         monto:
   *                           type: string
   *                           example: "string - Monto formateado con formato N2 (ej. 6,110,267.20)"
   *                         orden:
   *                           type: string
   *                           example: "number - Orden de presentación en el reporte"
   *                     timestamp:
   *                       type: string
   *                       format: date-time
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
   *                   example: "Error al obtener información del endpoint"
   *                 error:
   *                   type: string
   *                   example: "Error interno del servidor"
   */
  async obtenerInfo(req: Request, res: Response): Promise<void> {
    try {
      const info = {
        endpoint: "Ganancias y Pérdidas Clipper",
        description:
          "Obtiene los datos del estado de ganancias y pérdidas desde la base de datos Clipper",
        version: "1.0.0",
        methods: {
          GET: {
            "/?bdClipperGPC=bdclipperGPC":
              "Obtiene todos los registros del estado de ganancias y pérdidas clipper",
            "/info": "Obtiene información sobre este endpoint",
          },
        },
        parameters: {
          bdClipperGPC:
            "string - Nombre de la base de datos Clipper GPC (requerido). Valores disponibles: bdclipperGPC, bdclipperGPC1",
          periodoDesde:
            "integer - Mes de inicio del período (requerido). Valores: 1-12",
          periodoHasta:
            "integer - Mes de fin del período (requerido). Valores: 1-12",
        },
        dataStructure: {
          concepto:
            "string - Concepto del estado de ganancias y pérdidas (ej. VENTAS, GASTOS ADMINISTRATIVOS)",
          monto: "string - Monto formateado con formato N2 (ej. 6,110,267.20)",
          orden: "number - Orden de presentación en el reporte",
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json({
        success: true,
        data: info,
      });
    } catch (error) {
      console.error(
        "Error en GananciasPerdidasClipperController.obtenerInfo:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Error al obtener información del endpoint",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
