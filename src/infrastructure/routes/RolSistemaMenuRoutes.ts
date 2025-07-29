import { Router } from 'express';
import { container } from '../container/container';
import { RolSistemaMenuController } from '../controllers/RolSistemaMenuController';

export class RolSistemaMenuRoutes {
  private router: Router;
  private rolSistemaMenuController: RolSistemaMenuController;

  constructor() {
    this.router = Router();
    this.rolSistemaMenuController = container.get<RolSistemaMenuController>('RolSistemaMenuController');
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Obtener menús por rol y sistema
    this.router.get('/:rolId/:sistemaId', this.rolSistemaMenuController.getMenusByRolAndSistema.bind(this.rolSistemaMenuController));
    
    // Asignar menús por rol y sistema (protegida)
    this.router.post('/asignar', this.rolSistemaMenuController.asignarMenusByRolAndSistema.bind(this.rolSistemaMenuController));
    
    // Actualizar asignación por ID (protegida)
    this.router.put('/:id', this.rolSistemaMenuController.updateAsignacionById.bind(this.rolSistemaMenuController));
  }

  public getRouter(): Router {
    return this.router;
  }
} 