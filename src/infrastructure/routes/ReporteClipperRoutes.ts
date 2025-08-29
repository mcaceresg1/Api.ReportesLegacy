import { Router } from 'express';
import { ReporteClipperController } from '../controllers/ReporteClipperController';

export function createReporteClipperRoutes(): Router {
  const router = Router();
  const controller = new ReporteClipperController();

  /**
   * @swagger
   * /api/reporte-clipper/clipper-tacna/contratos:
   *   get:
   *     summary: Obtener lista de contratos de Clipper Tacna
   *     tags: [Reporte Clipper]
   *     responses:
   *       200:
   *         description: Lista de contratos obtenida exitosamente
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
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       codigo:
   *                         type: string
   *                       nombre:
   *                         type: string
   *                       fecha:
   *                         type: string
   *                       estado:
   *                         type: string
   *                 message:
   *                   type: string
   */
  router.get('/clipper-tacna/contratos', controller.getContratos.bind(controller));

  /**
   * @swagger
   * /api/reporte-clipper/clipper-tacna/contratos/{id}/{codigo}:
   *   get:
   *     summary: Obtener contrato específico por ID y código
   *     tags: [Reporte Clipper]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID del contrato
   *       - in: path
   *         name: codigo
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del contrato
   *     responses:
   *       200:
   *         description: Contrato encontrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     codigo:
   *                       type: string
   *                     nombre:
   *                       type: string
   *                     fecha:
   *                       type: string
   *                     estado:
   *                       type: string
   *                 message:
   *                   type: string
   *       404:
   *         description: Contrato no encontrado
   */
  router.get('/clipper-tacna/contratos/:id/:codigo', controller.getContrato.bind(controller));

  return router;
}
