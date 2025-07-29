import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../../domain/services/IAuthService';
import { Usuario } from '../../domain/entities/Usuario';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      usuario?: Usuario;
    }
  }
}

@injectable()
export class AuthMiddleware {
  constructor(
    @inject('IAuthService') private authService: IAuthService
  ) {}

  verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
        return;
      }

      const usuario = await this.authService.validateToken(token);
      if (!usuario) {
        res.status(401).json({
          success: false,
          message: 'Token inválido'
        });
        return;
      }

      req.usuario = usuario;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Error de autenticación',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  verifyRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requiredRole = req.params.role || req.body.role;
      
      if (!requiredRole) {
        res.status(400).json({
          success: false,
          message: 'Rol requerido no especificado'
        });
        return;
      }

      // Aquí implementarías la lógica para verificar el rol del usuario
      // Por ahora, solo verificamos que el usuario esté autenticado
      if (!req.usuario) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
        return;
      }

      // TODO: Implementar verificación de roles específicos
      next();
    } catch (error) {
      res.status(403).json({
        success: false,
        message: 'Acceso denegado',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
} 