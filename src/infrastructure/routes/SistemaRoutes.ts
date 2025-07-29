import { Router } from 'express';
import { container } from '../container/container';
import { SistemaController } from '../controllers/SistemaController';

export class SistemaRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Obtener todos los sistemas
    this.router.get('/', this.sistemaController.getAllSistemas.bind(this.sistemaController));

    // CRUD de sistemas (protegidas)
    this.router.post('/', this.sistemaController.createSistema.bind(this.sistemaController));
    this.router.put('/:id', this.sistemaController.updateSistema.bind(this.sistemaController));
    this.router.delete('/:id', this.sistemaController.deleteSistema.bind(this.sistemaController));

    // Nuevas funcionalidades de sistemas
    this.router.get('/:sistemaId/usuarios', this.sistemaController.getUsuariosPorSistema.bind(this.sistemaController));
    this.router.get('/:sistemaId/permisos', this.sistemaController.getPermisosSistema.bind(this.sistemaController));
    this.router.get('/:sistemaId/roles', this.sistemaController.getRolesPorSistema.bind(this.sistemaController));
    this.router.get('/:sistemaId/menus', this.sistemaController.getMenusPorSistema.bind(this.sistemaController));
    this.router.get('/:sistemaId/estadisticas', this.sistemaController.getEstadisticasSistema.bind(this.sistemaController));
  }

  public getRouter(): Router {
    return this.router;
  }

  private get sistemaController(): SistemaController {
    return container.get<SistemaController>('SistemaController');
  }
} 