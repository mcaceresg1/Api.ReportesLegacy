import { Router } from 'express';
import { container } from '../container/container';
import { MenuController } from '../controllers/MenuController';

export class MenuRoutes {
  private router: Router;
  private menuController: MenuController;

  constructor() {
    this.router = Router();
    this.menuController = container.get<MenuController>('MenuController');
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // ===== RUTAS PÚBLICAS (sin autenticación requerida) =====
    // Obtener menús (lectura)
    this.router.get('/', this.menuController.getAllMenus.bind(this.menuController));
    this.router.get('/rol/:rolId/sistema/:sistemaId', this.menuController.getMenusByRolAndSistema.bind(this.menuController));
    this.router.get('/area/:area', this.menuController.getMenusByArea.bind(this.menuController));
    this.router.get('/sistema/:sistemaCode', this.menuController.getMenusBySistema.bind(this.menuController));

    // Poblar menús (solo para desarrollo/admin inicial)
    this.router.post('/poblar', this.menuController.poblarMenusDesdeTabla.bind(this.menuController));

    // ===== RUTAS PROTEGIDAS (requieren autenticación) =====
    // CRUD básico de menús
    this.router.post('/', this.menuController.createMenu.bind(this.menuController));
    this.router.put('/', this.menuController.updateMenu.bind(this.menuController));
    this.router.delete('/:id', this.menuController.deleteMenu.bind(this.menuController));
  }

  public getRouter(): Router {
    return this.router;
  }
} 