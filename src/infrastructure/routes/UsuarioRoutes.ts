import { Router } from 'express';
import { container } from '../container/container';
import { UsuarioController } from '../controllers/UsuarioController';

export class UsuarioRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Obtener todos los usuarios
    this.router.get('/', (req, res) => {
      const controller = container.get<UsuarioController>('UsuarioController');
      controller.getAllUsuarios(req, res);
    });

    // Obtener usuarios con empresa
    this.router.get('/con-empresa', (req, res) => {
      const controller = container.get<UsuarioController>('UsuarioController');
      controller.getUsuariosConEmpresa(req, res);
    });

    // Obtener usuario por ID
    this.router.get('/:id', (req, res) => {
      const controller = container.get<UsuarioController>('UsuarioController');
      controller.getUsuarioById(req, res);
    });

    // Crear nuevo usuario
    this.router.post('/', (req, res) => {
      const controller = container.get<UsuarioController>('UsuarioController');
      controller.createUsuario(req, res);
    });

    // Actualizar usuario
    this.router.put('/:id', (req, res) => {
      const controller = container.get<UsuarioController>('UsuarioController');
      controller.updateUsuario(req, res);
    });

    // Eliminar usuario
    this.router.delete('/:id', (req, res) => {
      const controller = container.get<UsuarioController>('UsuarioController');
      controller.deleteUsuario(req, res);
    });

    // Activar usuario
    this.router.patch('/:id/activate', (req, res) => {
      const controller = container.get<UsuarioController>('UsuarioController');
      controller.activateUsuario(req, res);
    });

    // Desactivar usuario
    this.router.patch('/:id/deactivate', (req, res) => {
      const controller = container.get<UsuarioController>('UsuarioController');
      controller.deactivateUsuario(req, res);
    });
  }

  public getRouter(): Router {
    return this.router;
  }
} 