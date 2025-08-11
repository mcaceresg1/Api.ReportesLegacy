import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IReporteAsientosSinDimensionRepository } from '../../domain/repositories/IReporteAsientosSinDimensionRepository';

/**
 * @swagger
 * components:
 *   schemas:
 *     ReporteAsientosSinDimension:
 *       type: object
 *       properties:
 *         asiento:
 *           type: string
 *           description: Número de asiento contable
 *         consecutivo:
 *           type: number
 *           description: Consecutivo del asiento
 *         fechaAsiento:
 *           type: string
 *           format: date-time
 *           description: Fecha del asiento
 *         origen:
 *           type: string
 *           description: Origen del asiento
 *         usuarioCreacion:
 *           type: string
 *           description: Usuario que creó el asiento
 *         fuente:
 *           type: string
 *           description: Fuente del asiento
 *         referencia:
 *           type: string
 *           description: Referencia del asiento
 *         montoLocal:
 *           type: number
 *           description: Monto en moneda local
 *         montoDolar:
 *           type: number
 *           description: Monto en dólares
 *         cuentaContable:
 *           type: string
 *           description: Cuenta contable
 *         centroCosto:
 *           type: string
 *           description: Centro de costo
 *         rowOrderBy:
 *           type: number
 *           description: Orden de la fila
 */

@injectable()
export class ReporteAsientosSinDimensionController {
  constructor(
    @inject('IReporteAsientosSinDimensionRepository') private readonly reporteAsientosSinDimensionRepository: IReporteAsientosSinDimensionRepository
  ) {}

  /**
   * @swagger
   * /api/reporte-asientos-sin-dimension/{conjunto}/generar:
   *   post:
   *     summary: Generar reporte de asientos sin dimensión
   *     tags: [ReporteAsientosSinDimension]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fechaDesde
   *               - fechaHasta
   *             properties:
   *               fechaDesde:
   *                 type: string
   *                 format: date
   *                 description: Fecha desde (YYYY-MM-DD)
   *               fechaHasta:
   *                 type: string
   *                 format: date
   *                 description: Fecha hasta (YYYY-MM-DD)
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
   *                 message:
   *                   type: string
   *                 data:
   *                   type: boolean
   *       400:
   *         description: Error en los parámetros
   *       500:
   *         description: Error interno del servidor
   */
  async generar(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { fechaDesde, fechaHasta } = req.body;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      if (!fechaDesde || !fechaHasta) {
        res.status(400).json({
          success: false,
          message: 'Las fechas desde y hasta son requeridas'
        });
        return;
      }

      const resultado = await this.reporteAsientosSinDimensionRepository.generar(
        conjunto,
        fechaDesde,
        fechaHasta
      );

      res.json({
        success: true,
        message: 'Reporte generado correctamente',
        data: resultado
      });
    } catch (error) {
      console.error('Error al generar reporte de asientos sin dimensión:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar reporte de asientos sin dimensión',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-asientos-sin-dimension/{conjunto}/listar:
   *   get:
   *     summary: Listar reporte de asientos sin dimensión
   *     tags: [ReporteAsientosSinDimension]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *         description: Límite de registros
   *     responses:
   *       200:
   *         description: Lista de asientos sin dimensión
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ReporteAsientosSinDimension'
   *       500:
   *         description: Error interno del servidor
   */
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { limit = 100 } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const asientos = await this.reporteAsientosSinDimensionRepository.listar(
        conjunto,
        Number(limit)
      );

      res.json({
        success: true,
        message: 'Asientos sin dimensión listados correctamente',
        data: asientos
      });
    } catch (error) {
      console.error('Error al listar asientos sin dimensión:', error);
      res.status(500).json({
        success: false,
        message: 'Error al listar asientos sin dimensión',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-asientos-sin-dimension/{conjunto}/detalle:
   *   get:
   *     summary: Obtener detalle de asientos sin dimensión
   *     tags: [ReporteAsientosSinDimension]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *       - in: query
   *         name: fechaDesde
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha desde (YYYY-MM-DD)
   *       - in: query
   *         name: fechaHasta
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha hasta (YYYY-MM-DD)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *         description: Límite de registros
   *     responses:
   *       200:
   *         description: Detalle de asientos sin dimensión
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ReporteAsientosSinDimension'
   *       400:
   *         description: Error en los parámetros
   *       500:
   *         description: Error interno del servidor
   */
  async listarDetalle(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { fechaDesde, fechaHasta, limit = 100 } = req.body;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      if (!fechaDesde || !fechaHasta) {
        res.status(400).json({
          success: false,
          message: 'Las fechas desde y hasta son requeridas'
        });
        return;
      }

      const asientos = await this.reporteAsientosSinDimensionRepository.listarDetalle(
        conjunto,
        fechaDesde as string,
        fechaHasta as string,
        Number(limit)
      );

      res.json({
        success: true,
        message: 'Detalle de asientos sin dimensión listado correctamente',
        data: asientos
      });
    } catch (error) {
      console.error('Error al listar detalle de asientos sin dimensión:', error);
      res.status(500).json({
        success: false,
        message: 'Error al listar detalle de asientos sin dimensión',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-asientos-sin-dimension/{conjunto}/{id}:
   *   get:
   *     summary: Obtener asiento sin dimensión por ID
   *     tags: [ReporteAsientosSinDimension]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del asiento
   *     responses:
   *       200:
   *         description: Asiento sin dimensión encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/ReporteAsientosSinDimension'
   *       404:
   *         description: Asiento no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, id } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'El parámetro id es requerido'
        });
        return;
      }

      const asientoId = parseInt(id);
      if (isNaN(asientoId)) {
        res.status(400).json({
          success: false,
          message: 'El parámetro id debe ser un número válido'
        });
        return;
      }

      const asiento = await this.reporteAsientosSinDimensionRepository.getById(
        conjunto,
        asientoId
      );

      if (!asiento) {
        res.status(404).json({
          success: false,
          message: 'Asiento sin dimensión no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Asiento sin dimensión obtenido correctamente',
        data: asiento
      });
    } catch (error) {
      console.error('Error al obtener asiento sin dimensión por ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener asiento sin dimensión por ID',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const entityData = req.body;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      if (!entityData) {
        res.status(400).json({
          success: false,
          message: 'Los datos del asiento son requeridos'
        });
        return;
      }

      const asiento = await this.reporteAsientosSinDimensionRepository.create(
        conjunto,
        entityData
      );

      res.status(201).json({
        success: true,
        message: 'Asiento sin dimensión creado correctamente',
        data: asiento
      });
    } catch (error) {
      console.error('Error al crear asiento sin dimensión:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear asiento sin dimensión',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, id } = req.params;
      const entityData = req.body;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'El parámetro id es requerido'
        });
        return;
      }

      const asientoId = parseInt(id);
      if (isNaN(asientoId)) {
        res.status(400).json({
          success: false,
          message: 'El parámetro id debe ser un número válido'
        });
        return;
      }

      if (!entityData) {
        res.status(400).json({
          success: false,
          message: 'Los datos del asiento son requeridos'
        });
        return;
      }

      const asiento = await this.reporteAsientosSinDimensionRepository.update(
        conjunto,
        asientoId,
        entityData
      );

      res.json({
        success: true,
        message: 'Asiento sin dimensión actualizado correctamente',
        data: asiento
      });
    } catch (error) {
      console.error('Error al actualizar asiento sin dimensión:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar asiento sin dimensión',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, id } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'El parámetro id es requerido'
        });
        return;
      }

      const asientoId = parseInt(id);
      if (isNaN(asientoId)) {
        res.status(400).json({
          success: false,
          message: 'El parámetro id debe ser un número válido'
        });
        return;
      }

      const resultado = await this.reporteAsientosSinDimensionRepository.delete(
        conjunto,
        asientoId
      );

      if (resultado) {
        res.json({
          success: true,
          message: 'Asiento sin dimensión eliminado correctamente'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Asiento sin dimensión no encontrado'
        });
      }
    } catch (error) {
      console.error('Error al eliminar asiento sin dimensión:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar asiento sin dimensión',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
