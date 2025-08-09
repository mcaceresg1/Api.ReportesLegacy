import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ITipoAsientoRepository } from '../../domain/repositories/ITipoAsientoRepository';

@injectable()
export class TipoAsientoController {
  constructor(@inject('ITipoAsientoRepository') private repo: ITipoAsientoRepository) {}

  /**
   * @swagger
   * components:
   *   schemas:
   *     TipoAsiento:
   *       type: object
   *       properties:
   *         TIPO_ASIENTO:
   *           type: string
   *           example: "01"
   *         DESCRIPCION:
   *           type: string
   *           example: "Normal"
   */
  /**
   * @swagger
   * /api/tipos-asiento/{conjunto}:
   *   get:
   *     summary: Lista tipos de asiento
   *     tags: [Exactus]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 1000
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *     responses:
   *       200:
   *         description: Lista de tipos de asiento
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 count:
   *                   type: integer
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/TipoAsiento'
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const limit = parseInt((req.query['limit'] as string) || '1000', 10);
      const offset = parseInt((req.query['offset'] as string) || '0', 10);
      if (!conjunto) {
        res.status(400).json({ success: false, message: 'conjunto requerido' });
        return;
      }
      const data = await this.repo.listar(conjunto, limit, offset);
      res.json({ success: true, count: data.length, data });
    } catch (error) {
      console.error('TipoAsientoController.listar error:', error);
      res.status(500).json({ success: false, message: 'Error al listar tipos de asiento', error: error instanceof Error ? error.message : 'Error' });
    }
  }
}


