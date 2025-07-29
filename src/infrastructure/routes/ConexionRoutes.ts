import { Router } from 'express';
import { container } from '../container/container';
import { ConexionController } from '../controllers/ConexionController';

export class ConexionRoutes {
  private router: Router;
  private conexionController: ConexionController;

  constructor() {
    this.router = Router();
    this.conexionController = container.get<ConexionController>('ConexionController');
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Obtener todas las conexiones
    this.router.get('/', this.conexionController.getAllConexiones.bind(this.conexionController));
    this.router.get('/:id', this.conexionController.getConexionById.bind(this.conexionController));
    
    // CRUD de conexiones (protegidas)
    this.router.post('/', this.conexionController.createConexion.bind(this.conexionController));
    this.router.put('/', this.conexionController.updateConexion.bind(this.conexionController));
    this.router.delete('/:id', this.conexionController.deleteConexion.bind(this.conexionController));
  }

  public getRouter(): Router {
    return this.router;
  }
} 