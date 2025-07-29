import { injectable, inject } from 'inversify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAuthService, LoginRequest, LoginResponse } from '../../domain/services/IAuthService';
import { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import { Usuario } from '../../domain/entities/Usuario';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject('IUsuarioRepository') private usuarioRepository: IUsuarioRepository
  ) {}

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { username, password } = credentials;
    const usuario = await this.usuarioRepository.findByUsernameWithPassword(username);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      throw new Error('Contraseña incorrecta');
    }
    const token = this.generateToken(usuario);
    return {
      usuario: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        rolId: usuario.rolId || 0,
        estado: usuario.estado
      },
      token
    };
  }

  generateToken(user: any): string {
    return jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        rolId: user.rolId || 0
      },
      process.env['JWT_SECRET'] || 'defaultSecret',
      { expiresIn: '1h' }
    );
  }

  async validateToken(token: string): Promise<Usuario | null> {
    try {
      const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'defaultSecret') as any;
      
      if (!decoded || !decoded.userId) {
        return null;
      }

      const usuario = await this.usuarioRepository.findById(decoded.userId);
      if (!usuario || !usuario.estado) {
        return null;
      }

      return usuario;
    } catch (error) {
      return null;
    }
  }
} 