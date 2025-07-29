import { Router } from 'express';
import { container } from '../container/container';
import { RolMenuController } from '../controllers/RolMenuController';

export class RolMenuRoutes {
  private router: Router;
  private rolMenuController: RolMenuController;

  constructor() {
    this.router = Router();
    this.rolMenuController = container.get<RolMenuController>('RolMenuController');
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Obtener todas las relaciones rol-menu
    this.router.get('/', this.rolMenuController.getAllRolMenu.bind(this.rolMenuController));
    
    // CRUD de relaciones rol-menu (protegidas)
    this.router.post('/', this.rolMenuController.createRolMenu.bind(this.rolMenuController));
    this.router.put('/', this.rolMenuController.updateRolMenu.bind(this.rolMenuController));
    this.router.patch('/estado', this.rolMenuController.changeRolMenuEstado.bind(this.rolMenuController));
    
    // Obtener menús por rol
    this.router.get('/rol/:id', this.rolMenuController.getMenusByRolId.bind(this.rolMenuController));
    
    // Gestión de permisos
    this.router.delete('/rol/:id/permisos', this.rolMenuController.deleteRolPermisos.bind(this.rolMenuController));
    this.router.post('/rol/:id/permisos', this.rolMenuController.addRolPermisos.bind(this.rolMenuController));
  }

  public getRouter(): Router {
    return this.router;
  }
} 