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
   * /api/ganancias-perdidas-clipper/{baseDatos}:
   *   get:
   *     summary: Obtener estado de ganancias y pérdidas desde Clipper
   *     tags: [Clipper - Ganancias y Pérdidas]
   *     description: "Retorna el estado de ganancias y pérdidas con conceptos como ventas, costos, gastos e ingresos desde la base de datos Clipper seleccionada para un período específico."
   *     parameters:
   *       - in: path
   *         name: baseDatos
   *         required: true
   *         schema:
   *           type: string
   *           enum: [bdclipperGPC, bdclipperGPC2, bdclipperGPC3, bdclipperGPC4, bdclipperGPC5, bdclipperGPC6, bdclipperGPC7, bdclipperGPC8, bdclipperGPC9]
   *           example: "bdclipperGPC"
   *         description: "Nombre de la base de datos Clipper a utilizar. Opciones disponibles: ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC), PRUEBA (bdclipperGPC2), PARQUE DEL RECUERDO (bdclipperGPC3), MISION CEMENTERIO CATOLICO (bdclipperGPC4), PARQUE DEL RECUERDO (bdclipperGPC5), ASOCIACION CIVIL SAN JUAN BAUTISTA (bdclipperGPC6), MISION CEMENTERIO CATOLICO (bdclipperGPC7), COPIA DE ACSJB 01 (bdclipperGPC8), COPIA DE ACSJB 02 (bdclipperGPC9)"
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
    const { baseDatos } = req.params;
    const { periodoDesde, periodoHasta } = req.query;

    if (!baseDatos || typeof baseDatos !== "string") {
      res.status(400).json({
        success: false,
        message: "El parámetro 'baseDatos' es obligatorio",
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
          baseDatos,
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
}
