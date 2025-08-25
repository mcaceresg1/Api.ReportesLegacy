import { Request, Response } from 'express';
import { ReporteClipperService } from '../../application/services/ReporteCliperService';
import { inject, injectable } from 'inversify';
import { IReporteClipperService } from '../../domain/services/IReporteClipperService';

/**
 * @swagger
 * components:
 *   schemas:
 *     ContratoClipper:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         cliente:
 *           type: string
 *         servicio:
 *           type: string
 *         monto:
 *           type: number
 *         fecha:
 *           type: string
 *           format: date
 */
@injectable()
export class ClipperController {
  constructor(
    @inject('IReporteClipperService')
    private readonly clipperService: IReporteClipperService
  ) {}

   /**
   * @swagger
   * /api/reporte-clipper/{ruta}/contratos:
   *   get:
   *     summary: Obtener contratos por sede
   *     description: Retorna contratos para la sede indicada (clipper-lurin, clipper-tacna, clipper-lima)
   *     tags: [Clipper]
   *     parameters:
   *       - in: path
   *         name: ruta
   *         required: true
   *         schema:
   *           type: string
   *           enum: [clipper-lurin, clipper-tacna, clipper-lima]
   *         description: Ruta de la sede
   *     responses:
   *       200:
   *         description: Contratos obtenidos exitosamente
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
   *                     $ref: '#/components/schemas/ContratoClipper'
   *                 message:
   *                   type: string
   *                   example: Consulta exitosa
   *       400:
   *         description: Ruta inválida
   *       500:
   *         description: Error interno del servidor
   */

  async obtenerContratos(req: Request, res: Response): Promise<void> {
    console.log('Ruta llamada:', req.originalUrl);
    console.log('Parámetros:', req.params);
  
    try {
      const ruta = req.params['ruta'];
      console.log(ruta);
      const rutasValidas = ['clipper-lurin', 'clipper-tacna', 'clipper-lima'];

      if (!ruta || !['clipper-lurin', 'clipper-tacna', 'clipper-lima'].includes(ruta)) {
        res.status(400).json({
          success: false,
          message: 'Ruta no válida',
          data: [],
        });
        return;
      }
      
      const data = await this.clipperService.obtenerContratos(ruta);

      res.json({
        success: true,
        message: 'Consulta exitosa',
        data,
      });
    } catch (error) {
      console.error('❌ Error en ClipperController.obtenerContratos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno',
        error: error instanceof Error ? error.message : 'Error desconocido',
        data: [],
      });
    }
  }
}
