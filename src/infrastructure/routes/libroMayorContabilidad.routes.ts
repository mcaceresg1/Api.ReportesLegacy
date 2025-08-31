import { Router } from 'express';
import { LibroMayorContabilidadController } from '../controllers/LibroMayorContabilidadController';
import { container } from '../container/container';

export class LibroMayorContabilidadRoutes {
  private router: Router;
  private controller: LibroMayorContabilidadController;

  constructor() {
    this.router = Router();
    this.controller = container.get<LibroMayorContabilidadController>(LibroMayorContabilidadController);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Rutas básicas CRUD
    this.router.get('/', this.controller.getAll.bind(this.controller));
    this.router.get('/:id', this.controller.getById.bind(this.controller));
    this.router.post('/', this.controller.create.bind(this.controller));
    this.router.put('/:id', this.controller.update.bind(this.controller));
    this.router.delete('/:id', this.controller.delete.bind(this.controller));

    // Rutas específicas del negocio
    this.router.post('/generar-reporte', this.controller.generarReporte.bind(this.controller));
    this.router.post('/limpiar-reporte', this.controller.limpiarReporte.bind(this.controller));
    this.router.get('/reporte-generado', this.controller.obtenerReporteGenerado.bind(this.controller));

    // Rutas de consulta con filtros
    this.router.post('/filtros', this.controller.getByFiltros.bind(this.controller));

    // Rutas de consulta específicas
    this.router.get('/cuenta-contable/:cuentaContable', this.controller.getByCuentaContable.bind(this.controller));
    this.router.get('/centro-costo/:centroCosto', this.controller.getByCentroCosto.bind(this.controller));
    this.router.get('/fecha-range', this.controller.getByFechaRange.bind(this.controller));
    this.router.get('/asiento/:asiento', this.controller.getByAsiento.bind(this.controller));
    this.router.get('/nit/:nit', this.controller.getByNIT.bind(this.controller));

    // Rutas de agregación
    this.router.get('/saldos/cuenta', this.controller.getSaldosPorCuenta.bind(this.controller));
    this.router.get('/saldos/centro-costo', this.controller.getSaldosPorCentroCosto.bind(this.controller));
    this.router.get('/resumen/periodo', this.controller.getResumenPorPeriodo.bind(this.controller));

    // Rutas de exportación
    this.router.post('/exportar', this.controller.exportarReporte.bind(this.controller));
  }

  getRouter(): Router {
    return this.router;
  }
}
