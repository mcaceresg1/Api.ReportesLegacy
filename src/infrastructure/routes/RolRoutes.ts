import { Router } from 'express';
import { container } from '../container/container';
import { RolController } from '../controllers/RolController';

export class RolRoutes {
  private router: Router;
  private rolController: RolController;

  constructor() {
    this.router = Router();
    this.rolController = container.get<RolController>('RolController');
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Obtener todos los roles
    this.router.get('/', this.rolController.getAllRoles.bind(this.rolController));
    
    // CRUD de roles (protegidas)
    this.router.post('/', this.rolController.createRol.bind(this.rolController));
    this.router.put('/', this.rolController.updateRol.bind(this.rolController));
    this.router.patch('/estado', this.rolController.changeRolEstado.bind(this.rolController));
  }

  public getRouter(): Router {
    return this.router;
  }
} 