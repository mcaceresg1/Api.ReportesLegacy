import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ITipoAsientoRepository } from '../../domain/repositories/ITipoAsientoRepository';

@injectable()
export class TipoAsientoController {
  constructor(@inject('ITipoAsientoRepository') private repo: ITipoAsientoRepository) {}

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
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al listar tipos de asiento', error: error instanceof Error ? error.message : 'Error' });
    }
  }
}


