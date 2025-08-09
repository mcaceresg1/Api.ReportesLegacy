import { Request, Response } from 'express';
import { IReporteCuentaContableRepository } from '../../domain/repositories/IReporteCuentaContableRepository';

/**
 * @swagger
 * components:
 *   schemas:
 *     FiltroCentroCosto:
 *       type: object
 *       properties:
 *         CENTRO_COSTO:
 *           type: string
 *           description: Código del centro de costo
 *         DESCRIPCION:
 *           type: string
 *           description: Descripción del centro de costo
 *     ReporteCuentaContable:
 *       type: object
 *       properties:
 *         CUENTA_CONTABLE:
 *           type: string
 *           description: Código de la cuenta contable
 *         DESCRIPCION:
 *           type: string
 *           description: Descripción de la cuenta contable
 *         TIPO:
 *           type: string
 *           description: Tipo de cuenta contable
 *         CENTRO_COSTO:
 *           type: string
 *           description: Centro de costo asociado
 *         ACEPTA_DATOS:
 *           type: boolean
 *           description: Indica si acepta datos
 */

export class ReporteCuentaContableController {
  constructor(
    private reporteCuentaContableRepository: IReporteCuentaContableRepository
  ) {}

  /**
   * @swagger
   * /api/reporte-cuenta-contable/{conjunto}/filtro-centros-costo:
   *   get:
   *     summary: Obtener filtro de centros de costo para el reporte
   *     tags: [Reporte Cuenta Contable]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *     responses:
   *       200:
   *         description: Lista de centros de costo para filtro
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/FiltroCentroCosto'
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerFiltroCentrosCosto(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }
      
      const filtros = await this.reporteCuentaContableRepository.obtenerFiltroCentrosCosto(conjunto);
      
      res.json({
        success: true,
        data: filtros
      });
    } catch (error) {
      console.error('Error en ReporteCuentaContableController.obtenerFiltroCentrosCosto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener filtro de centros de costo'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-cuenta-contable/{conjunto}/centro-costo/{centroCosto}:
   *   get:
   *     summary: Obtener información de un centro de costo específico
   *     tags: [Reporte Cuenta Contable]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *       - in: path
   *         name: centroCosto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del centro de costo
   *     responses:
   *       200:
   *         description: Información del centro de costo
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/FiltroCentroCosto'
   *       404:
   *         description: Centro de costo no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerCentroCostoPorCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, centroCosto } = req.params;
      
      if (!conjunto || !centroCosto) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros conjunto y centroCosto son requeridos'
        });
        return;
      }
      
      const centroCostoInfo = await this.reporteCuentaContableRepository.obtenerCentroCostoPorCodigo(conjunto, centroCosto);
      
      if (!centroCostoInfo) {
        res.status(404).json({
          success: false,
          message: 'Centro de costo no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        data: centroCostoInfo
      });
    } catch (error) {
      console.error('Error en ReporteCuentaContableController.obtenerCentroCostoPorCodigo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener información del centro de costo'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-cuenta-contable/{conjunto}/cuentas-contables/{centroCosto}:
   *   get:
   *     summary: Obtener cuentas contables por centro de costo
   *     tags: [Reporte Cuenta Contable]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *       - in: path
   *         name: centroCosto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del centro de costo
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *         description: Número máximo de registros a retornar
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Número de registros a omitir
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *     responses:
   *       200:
   *         description: Lista de cuentas contables
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ReporteCuentaContable'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     total:
   *                       type: integer
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerCuentasContablesPorCentroCosto(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, centroCosto } = req.params;
      const limit = Number.parseInt(req.query["limit"] as string) || 100;
      const page = Number.parseInt(req.query["page"] as string) || 1;
      const offset = (page - 1) * limit;
      
      // Validar parámetros de ruta
      if (!conjunto || !centroCosto) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros conjunto y centroCosto son requeridos'
        });
        return;
      }
      
      // Validar parámetros de query
      if (limit < 1 || limit > 1000) {
        res.status(400).json({
          success: false,
          message: 'El límite debe estar entre 1 y 1000'
        });
        return;
      }
      
      if (offset < 0) {
        res.status(400).json({
          success: false,
          message: 'El offset no puede ser negativo'
        });
        return;
      }
      
      const [cuentasContables, total] = await Promise.all([
        this.reporteCuentaContableRepository.obtenerCuentasContablesPorCentroCosto(conjunto, centroCosto, limit, offset),
        this.reporteCuentaContableRepository.obtenerCuentasContablesCount(conjunto, centroCosto)
      ]);
      
      const totalPages = Math.ceil(total / limit);
      
      res.json({
        success: true,
        data: cuentasContables,
        pagination: {
          total,
          page,
          limit,
          totalPages
        }
      });
    } catch (error) {
      console.error('Error en ReporteCuentaContableController.obtenerCuentasContablesPorCentroCosto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cuentas contables por centro de costo'
      });
    }
  }
}
