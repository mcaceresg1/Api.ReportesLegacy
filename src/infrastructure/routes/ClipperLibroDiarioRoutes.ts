import { Router } from 'express';
import { container } from '../container/container';
import { ClipperLibroDiarioController } from '../controllers/ClipperLibroDiarioController';

export function createClipperLibroDiarioRoutes(): Router {
  const router = Router();

  // Obtener instancia del controlador desde el contenedor de Inversify
  const controller = container.get<ClipperLibroDiarioController>('ClipperLibroDiarioController');

  // Rutas del libro diario (agregando el parámetro bdClipperGPC)
  router.get('/:bdClipperGPC/:libro/:mes/comprobantes', (req, res) =>
    controller.listarComprobantes(req, res)
  );

  router.get('/:bdClipperGPC/:libro/:mes/comprobantes-agrupados', (req, res) =>
    controller.listarComprobantesAgrupados(req, res)
  );

  router.get('/:bdClipperGPC/:libro/:mes/totales', (req, res) =>
    controller.obtenerTotalesGenerales(req, res)
  );

  router.get('/:bdClipperGPC/comprobante/:numeroComprobante', (req, res) =>
    controller.obtenerDetalleComprobante(req, res)
  );

  return router;
}
