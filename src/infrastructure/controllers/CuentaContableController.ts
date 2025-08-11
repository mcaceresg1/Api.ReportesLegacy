import { Request, Response } from 'express';
import { CuentaContableService } from '../../application/services/CuentaContableService';
import { injectable } from 'inversify';

/**
 * @swagger
 * components:
 *   schemas:
 *     ReporteCuentaContableModificada:
 *       type: object
 *       properties:
 *         cuentaContable:
 *           type: string
 *           description: Código de la cuenta contable
 *         cuentaContableDesc:
 *           type: string
 *           description: Descripción de la cuenta contable
 *         usuarioCreacion:
 *           type: string
 *           description: Usuario que creó la cuenta
 *         usuarioCreacionDesc:
 *           type: string
 *           description: Nombre del usuario que creó la cuenta
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la cuenta
 *         usuarioModificacion:
 *           type: string
 *           description: Usuario que modificó la cuenta
 *         usuarioModificacionDesc:
 *           type: string
 *           description: Nombre del usuario que modificó la cuenta
 *         fechaModificacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de última modificación de la cuenta
 */

@injectable()
export class CuentaContableController {
  constructor(private cuentaContableService: CuentaContableService) {}

  /**
   * @swagger
   * /api/cuentas-contables/{conjunto}/modificadas:
   *   get:
   *     summary: Obtener reporte de cuentas contables creadas o modificadas
   *     description: Retorna un reporte de las cuentas contables que han sido creadas o modificadas en un período
   *     tags: [Cuentas Contables]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *       - in: query
   *         name: fechaInicio
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha inicial del período (YYYY-MM-DD)
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha final del período (YYYY-MM-DD)
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
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ReporteCuentaContableModificada'
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerCuentasContablesModificadas(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { fechaInicio, fechaFin } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      let fechaInicioDate: Date | undefined;
      let fechaFinDate: Date | undefined;

      if (fechaInicio && fechaFin) {
        fechaInicioDate = new Date(fechaInicio as string);
        fechaFinDate = new Date(fechaFin as string);

        if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
          res.status(400).json({
            success: false,
            message: 'Formato de fecha inválido. Use YYYY-MM-DD'
          });
          return;
        }
      }

      const reporte = await this.cuentaContableService.generarReporteCuentasContablesModificadas(
        conjunto,
        fechaInicioDate,
        fechaFinDate
      );

      res.json({
        success: true,
        data: reporte,
        message: 'Reporte generado exitosamente'
      });
    } catch (error) {
      console.error('Error en CuentaContableController.obtenerCuentasContablesModificadas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar el reporte',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
