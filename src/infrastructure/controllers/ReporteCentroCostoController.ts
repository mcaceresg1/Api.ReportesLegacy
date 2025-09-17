import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IReporteCentroCostoRepository } from '../../domain/repositories/IReporteCentroCostoRepository';

/**
 * @swagger
 * components:
 *   schemas:
 *     FiltroCuentaContable:
 *       type: object
 *       properties:
 *         cuenta_contable:
 *           type: string
 *           description: Código de la cuenta contable
 *         descripcion:
 *           type: string
 *           description: Descripción de la cuenta contable
 *         uso_restringido:
 *           type: boolean
 *           description: Indica si la cuenta tiene uso restringido
 *     DetalleCuentaContable:
 *       type: object
 *       properties:
 *         descripcion:
 *           type: string
 *           description: Descripción de la cuenta contable
 *         descripcion_ifrs:
 *           type: string
 *           description: Descripción IFRS de la cuenta
 *         origen_conversion:
 *           type: string
 *           description: Origen de conversión
 *         conversion:
 *           type: string
 *           description: Tipo de conversión
 *         acepta_datos:
 *           type: boolean
 *           description: Indica si acepta datos
 *         usa_centro_costo:
 *           type: boolean
 *           description: Indica si usa centro de costo
 *         tipo_cambio:
 *           type: string
 *           description: Tipo de cambio
 *         acepta_unidades:
 *           type: boolean
 *           description: Indica si acepta unidades
 *         unidad:
 *           type: string
 *           description: Unidad de medida
 *         uso_restringido:
 *           type: boolean
 *           description: Indica si tiene uso restringido
 *         maneja_tercero:
 *           type: boolean
 *           description: Indica si maneja terceros
 *     ReporteCentroCosto:
 *       type: object
 *       properties:
 *         centro_costo:
 *           type: string
 *           description: Código del centro de costo
 *         descripcion:
 *           type: string
 *           description: Descripción del centro de costo
 *         acepta_datos:
 *           type: boolean
 *           description: Indica si acepta datos
 */

@injectable()
export class ReporteCentroCostoController {
  constructor(
    @inject('IReporteCentroCostoRepository') private reporteCentroCostoRepository: IReporteCentroCostoRepository
  ) {}

  /**
   * @swagger
   * /api/reporte-centro-costo/{conjunto}/filtro-cuentas-contables:
   *   get:
   *     summary: Obtiene el filtro de cuentas contables para el reporte de centro de costos
   *     tags: [Reporte Centro Costo]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *     responses:
   *       200:
   *         description: Lista de cuentas contables para filtro
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
   *                     $ref: '#/components/schemas/FiltroCuentaContable'
   *       400:
   *         description: Error en los parámetros
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerFiltroCuentasContables(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const cuentasContables = await this.reporteCentroCostoRepository.obtenerFiltroCuentasContables(conjunto);

      res.json({
        success: true,
        data: cuentasContables
      });
    } catch (error) {
      console.error('Error en obtenerFiltroCuentasContables:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-centro-costo/{conjunto}/detalle-cuenta-contable/{cuentaContable}:
   *   get:
   *     summary: Obtiene el detalle de una cuenta contable específica
   *     tags: [Reporte Centro Costo]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *       - in: path
   *         name: cuentaContable
   *         required: true
   *         schema:
   *           type: string
   *         description: Código de la cuenta contable
   *     responses:
   *       200:
   *         description: Detalle de la cuenta contable
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/DetalleCuentaContable'
   *       400:
   *         description: Error en los parámetros
   *       404:
   *         description: Cuenta contable no encontrada
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerDetalleCuentaContable(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, cuentaContable } = req.params;

      if (!conjunto || !cuentaContable) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros conjunto y cuentaContable son requeridos'
        });
        return;
      }

      const detalle = await this.reporteCentroCostoRepository.obtenerDetalleCuentaContable(conjunto, cuentaContable);

      if (!detalle) {
        res.status(404).json({
          success: false,
          message: 'Cuenta contable no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        data: detalle
      });
    } catch (error) {
      console.error('Error en obtenerDetalleCuentaContable:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-centro-costo/{conjunto}/centros-costo/{cuentaContable}:
   *   get:
   *     summary: Obtiene los centros de costo asociados a una cuenta contable
   *     tags: [Reporte Centro Costo]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *       - in: path
   *         name: cuentaContable
   *         required: true
   *         schema:
   *           type: string
   *         description: Código de la cuenta contable
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Número de registros por página
   *     responses:
   *       200:
   *         description: Lista de centros de costo paginados
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
   *                     $ref: '#/components/schemas/ReporteCentroCosto'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     totalRecords:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   *                     hasNextPage:
   *                       type: boolean
   *                     hasPrevPage:
   *                       type: boolean
   *       400:
   *         description: Error en los parámetros
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerCentrosCostoPorCuentaContable(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, cuentaContable } = req.params;
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;

      if (!conjunto || !cuentaContable) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros conjunto y cuentaContable son requeridos'
        });
        return;
      }

      if (page < 1 || limit < 1) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros page y limit deben ser números positivos'
        });
        return;
      }

      const result = await this.reporteCentroCostoRepository.obtenerCentrosCostoPorCuentaContable(
        conjunto,
        cuentaContable,
        page,
        limit
      );

      res.json({
        success: result.success,
        data: result.data,
        pagination: result.pagination,
        message: result.message
      });
    } catch (error) {
      console.error('Error en obtenerCentrosCostoPorCuentaContable:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-centro-costo/{conjunto}/{cuentaContable}/exportar-excel:
   *   post:
   *     summary: Exportar Reporte de Centros de Costo a Excel
   *     description: Exporta el reporte de centros de costo a formato Excel
   *     tags: [Reporte Centro Costo]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Código del conjunto contable"
   *         schema: { type: string }
   *       - in: path
   *         name: cuentaContable
   *         required: true
   *         description: "Código de la cuenta contable"
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: "Archivo Excel generado exitosamente"
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: "Parámetros inválidos o faltantes"
   *       500:
   *         description: "Error interno del servidor"
   */
  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, cuentaContable } = req.params;

      if (!conjunto || !cuentaContable) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros conjunto y cuentaContable son requeridos'
        });
        return;
      }

      // Generar Excel usando el repositorio
      const excelBuffer = await this.reporteCentroCostoRepository.exportarExcel(conjunto, cuentaContable);

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="centros-costo-${conjunto}-${cuentaContable}-${new Date().toISOString().split('T')[0]}.xlsx"`);
      
      res.send(excelBuffer);
    } catch (error) {
      console.error('Error al exportar Excel en ReporteCentroCostoController:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar Excel',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
