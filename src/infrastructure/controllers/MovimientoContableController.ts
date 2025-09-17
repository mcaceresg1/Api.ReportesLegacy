import { Request, Response } from 'express';
import { IMovimientoContableRepository } from '../../domain/repositories/IMovimientoContableRepository';

/**
 * @swagger
 * components:
 *   schemas:
 *     MovimientoContable:
 *       type: object
 *       properties:
 *         USUARIO:
 *           type: string
 *           description: Usuario que generó el reporte
 *         CUENTA_CONTABLE:
 *           type: string
 *           description: Código de la cuenta contable
 *         DESCRIPCION_CUENTA_CONTABLE:
 *           type: string
 *           description: Descripción de la cuenta contable
 *         ASIENTO:
 *           type: string
 *           description: Número de asiento
 *         TIPO:
 *           type: string
 *           description: Tipo de documento
 *         DOCUMENTO:
 *           type: string
 *           description: Número de documento
 *         REFERENCIA:
 *           type: string
 *           description: Referencia del movimiento
 *         DEBITO_LOCAL:
 *           type: number
 *           format: decimal
 *           description: Débito en moneda local
 *         DEBITO_DOLAR:
 *           type: number
 *           format: decimal
 *           description: Débito en dólares
 *         CREDITO_LOCAL:
 *           type: number
 *           format: decimal
 *           description: Crédito en moneda local
 *         CREDITO_DOLAR:
 *           type: number
 *           format: decimal
 *           description: Crédito en dólares
 *         CENTRO_COSTO:
 *           type: string
 *           description: Código del centro de costo
 *         DESCRIPCION_CENTRO_COSTO:
 *           type: string
 *           description: Descripción del centro de costo
 *         TIPO_ASIENTO:
 *           type: string
 *           description: Tipo de asiento
 *         FECHA:
 *           type: string
 *           format: date-time
 *           description: Fecha del movimiento
 *         ACEPTA_DATOS:
 *           type: boolean
 *           description: Indica si la cuenta acepta datos
 *         CONSECUTIVO:
 *           type: integer
 *           description: Número consecutivo
 *         NIT:
 *           type: string
 *           description: NIT del tercero
 *         RAZON_SOCIAL:
 *           type: string
 *           description: Razón social del tercero
 *         FUENTE:
 *           type: string
 *           description: Fuente del movimiento
 *         NOTAS:
 *           type: string
 *           description: Notas del asiento
 *         U_FLUJO_EFECTIVO:
 *           type: string
 *           description: Unidad de flujo de efectivo
 *         U_PATRIMONIO_NETO:
 *           type: string
 *           description: Unidad de patrimonio neto
 *         U_REP_REF:
 *           type: string
 *           description: Unidad de reporte de referencia
 */

export class MovimientoContableController {
  constructor(
    private movimientoContableRepository: IMovimientoContableRepository
  ) {}

  /**
   * @swagger
   * /api/movimientos/{conjunto}/generar-reporte:
   *   post:
   *     summary: Generar reporte de movimientos contables
   *     description: Genera un reporte de movimientos contables para un conjunto específico
   *     tags: [Movimientos Contables]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - usuario
   *               - fechaInicio
   *               - fechaFin
   *             properties:
   *               usuario:
   *                 type: string
   *                 description: Usuario que genera el reporte
   *               fechaInicio:
   *                 type: string
   *                 format: date
   *                 description: Fecha de inicio del reporte
   *               fechaFin:
   *                 type: string
   *                 format: date
   *                 description: Fecha de fin del reporte
   *               limit:
   *                 type: integer
   *                 default: 100
   *                 description: Número máximo de registros a retornar
   *               offset:
   *                 type: integer
   *                 default: 0
   *                 description: Número de registros a omitir
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
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/MovimientoContable'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     limit:
   *                       type: integer
   *                       example: 100
   *                     offset:
   *                       type: integer
   *                       example: 0
   *                     total:
   *                       type: integer
   *                       example: 1500
   *                 message:
   *                   type: string
   *                   example: Reporte generado exitosamente
   *       400:
   *         description: Parámetros requeridos
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
   *                   example: Usuario, fechaInicio y fechaFin son requeridos
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
   *                   example: Error al generar reporte
   */
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { usuario, fechaInicio, fechaFin, page = 1, limit = 100 } = req.body;
      
      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          data: [],
          pagination: {
            page: 1,
            limit: 0,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          },
          message: 'Conjunto, usuario, fechaInicio y fechaFin son requeridos'
        });
        return;
      }

      const maxLimit = 1000;
      const validatedLimit = Math.min(limit, maxLimit);
      const validatedPage = Math.max(page, 1);

      const result = await this.movimientoContableRepository.generarReporteMovimientos(
        conjunto,
        usuario,
        new Date(fechaInicio),
        new Date(fechaFin),
        validatedPage,
        validatedLimit
      );
      
      res.json(result);
    } catch (error) {
      console.error('Error en MovimientoContableController.generarReporte:', error);
      res.status(500).json({
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: 'Error al generar reporte',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/movimientos/{conjunto}/por-usuario/{usuario}:
   *   get:
   *     summary: Obtener movimientos por usuario
   *     description: Retorna los movimientos contables generados por un usuario específico
   *     tags: [Movimientos Contables]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
   *       - in: path
   *         name: usuario
   *         required: true
   *         schema:
   *           type: string
   *         description: Usuario que generó los movimientos
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
   *     responses:
   *       200:
   *         description: Movimientos obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/MovimientoContable'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     limit:
   *                       type: integer
   *                       example: 100
   *                     offset:
   *                       type: integer
   *                       example: 0
   *                     total:
   *                       type: integer
   *                       example: 500
   *                 message:
   *                   type: string
   *                   example: Movimientos obtenidos exitosamente
   *       400:
   *         description: Parámetros requeridos
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
   *                   example: Conjunto y usuario son requeridos
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
   *                   example: Error al obtener movimientos
   */
  async obtenerMovimientosPorUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, usuario } = req.params;
      const page = parseInt(req.query["page"] as string) || 1;
      const limit = parseInt(req.query["limit"] as string) || 100;
      
      if (!conjunto || !usuario) {
        res.status(400).json({
          success: false,
          data: [],
          pagination: {
            page: 1,
            limit: 0,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          },
          message: 'Conjunto y usuario son requeridos'
        });
        return;
      }

      const maxLimit = 1000;
      const validatedLimit = Math.min(limit, maxLimit);
      const validatedPage = Math.max(page, 1);

      const result = await this.movimientoContableRepository.obtenerMovimientosPorUsuario(
        conjunto,
        usuario,
        validatedPage,
        validatedLimit
      );
      
      res.json(result);
    } catch (error) {
      console.error('Error en MovimientoContableController.obtenerMovimientosPorUsuario:', error);
      res.status(500).json({
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: 'Error al obtener movimientos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/movimientos/{conjunto}/por-centro-costo/{centroCosto}:
   *   get:
   *     summary: Obtener movimientos por centro de costo
   *     description: Retorna los movimientos contables filtrados por centro de costo
   *     tags: [Movimientos Contables]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
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
   *     responses:
   *       200:
   *         description: Movimientos obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/MovimientoContable'
   *                 message:
   *                   type: string
   *                   example: Movimientos obtenidos exitosamente
   *       400:
   *         description: Parámetros requeridos
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
   *                   example: Conjunto y centroCosto son requeridos
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
   *                   example: Error al obtener movimientos
   */
  async obtenerMovimientosPorCentroCosto(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, centroCosto } = req.params;
      const page = parseInt(req.query["page"] as string) || 1;
      const limit = parseInt(req.query["limit"] as string) || 100;
      
      if (!conjunto || !centroCosto) {
        res.status(400).json({
          success: false,
          data: [],
          pagination: {
            page: 1,
            limit: 0,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          },
          message: 'Conjunto y centroCosto son requeridos'
        });
        return;
      }

      const maxLimit = 1000;
      const validatedLimit = Math.min(limit, maxLimit);
      const validatedPage = Math.max(page, 1);

      const result = await this.movimientoContableRepository.obtenerMovimientosPorCentroCosto(
        conjunto,
        centroCosto,
        validatedPage,
        validatedLimit
      );
      
      res.json(result);
    } catch (error) {
      console.error('Error en MovimientoContableController.obtenerMovimientosPorCentroCosto:', error);
      res.status(500).json({
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: 'Error al obtener movimientos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/movimientos/{conjunto}/por-cuenta-contable/{cuentaContable}:
   *   get:
   *     summary: Obtener movimientos por cuenta contable
   *     description: Retorna los movimientos contables filtrados por cuenta contable
   *     tags: [Movimientos Contables]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
   *       - in: path
   *         name: cuentaContable
   *         required: true
   *         schema:
   *           type: string
   *         description: Código de la cuenta contable
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
   *     responses:
   *       200:
   *         description: Movimientos obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/MovimientoContable'
   *                 message:
   *                   type: string
   *                   example: Movimientos obtenidos exitosamente
   *       400:
   *         description: Parámetros requeridos
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
   *                   example: Conjunto y cuentaContable son requeridos
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
   *                   example: Error al obtener movimientos
   */
  async obtenerMovimientosPorCuentaContable(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, cuentaContable } = req.params;
      const page = parseInt(req.query["page"] as string) || 1;
      const limit = parseInt(req.query["limit"] as string) || 100;
      
      if (!conjunto || !cuentaContable) {
        res.status(400).json({
          success: false,
          data: [],
          pagination: {
            page: 1,
            limit: 0,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          },
          message: 'Conjunto y cuentaContable son requeridos'
        });
        return;
      }

      const maxLimit = 1000;
      const validatedLimit = Math.min(limit, maxLimit);
      const validatedPage = Math.max(page, 1);

      const result = await this.movimientoContableRepository.obtenerMovimientosPorCuentaContable(
        conjunto,
        cuentaContable,
        validatedPage,
        validatedLimit
      );
      
      res.json(result);
    } catch (error) {
      console.error('Error en MovimientoContableController.obtenerMovimientosPorCuentaContable:', error);
      res.status(500).json({
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: 'Error al obtener movimientos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { usuario, fechaInicio, fechaFin, contabilidad, limit = 1000 } = req.query;

      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Faltan parámetros requeridos: conjunto, usuario, fechaInicio, fechaFin'
        });
        return;
      }

      const fechaInicioDate = new Date(fechaInicio as string);
      const fechaFinDate = new Date(fechaFin as string);

      const buffer = await this.movimientoContableRepository.exportarExcel(
        conjunto as string,
        usuario as string,
        fechaInicioDate,
        fechaFinDate,
        Number(limit)
      );

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="movimientos_contables_${conjunto}_${new Date().toISOString().split('T')[0]}.xlsx"`);
      res.send(buffer);

    } catch (error) {
      console.error('Error al exportar movimientos contables a Excel:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar movimientos contables a Excel',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
