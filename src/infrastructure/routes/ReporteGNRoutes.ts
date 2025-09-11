import { Router } from 'express';
import { ReporteGNController } from '../controllers/ReporteGNController';
import { container } from '../container/container';

export function createReporteGNRoutes(): Router {
  const router = Router();

  const controller = container.get<ReporteGNController>('ReporteGNController');

  router.get('/acciones-de-personal/:conjunto', (req, res) =>
    controller.getAccionesDePersonal(req, res),
  );

  router.get('/contratos/:conjunto', (req, res) =>
    controller.getContratos(req, res),
  );

  router.get('/rol-de-vacaciones/:conjunto', (req, res) =>
    controller.getRolDeVacaciones(req, res),
  );

  router.get('/anualizado/:conjunto', (req, res) =>
    controller.getAnualizado(req, res),
  );

  router.get('/prestamo-cta-cte/:conjunto', (req, res) =>
    controller.getPrestamoCtaCte(req, res),
  );

  // faltantes
  router.get('/prestamos/:conjunto', (req, res) =>
    controller.getPrestamos(req, res),
  );

  router.get('/boleta-pago/:conjunto', (req, res) =>
    controller.getBoletaDePago(req, res),
  );

  // 📑 Exportaciones a Excel
  router.get('/acciones-de-personal/excel/:conjunto', (req, res) =>
    controller.exportarAccionesDePersonalExcel(req, res),
  );

  router.get('/contratos/excel/:conjunto', (req, res) =>
    controller.exportarContratosExcel(req, res),
  );

  router.get('/rol-de-vacaciones/excel/:conjunto', (req, res) =>
    controller.exportarRolDeVacacionesExcel(req, res),
  );

  router.get('/anualizado/excel/:conjunto', (req, res) =>
    controller.exportarAnualizadoExcel(req, res),
  );

  router.get('/prestamos/excel/:conjunto', (req, res) =>
    controller.exportarPrestamosExcel(req, res),
  );

  router.get('/boleta-pago/excel/:conjunto', (req, res) =>
    controller.exportarBoletaDePagoExcel(req, res),
  );

  router.get('/prestamo-cta-cte/excel/:conjunto', (req, res) =>
    controller.exportarPrestamoCtaCteExcel(req, res),
  );

  return router;
}
