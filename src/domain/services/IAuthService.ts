import { Usuario } from '../entities/Usuario';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  usuario: {
    id: number;
    username: string;
    email: string;
    rolId: number;
    estado: boolean;
  };
  token: string;
}

export interface IAuthService {
  login(credentials: LoginRequest): Promise<LoginResponse>;
  generateToken(user: any): string;
  validateToken(token: string): Promise<Usuario | null>;
} 