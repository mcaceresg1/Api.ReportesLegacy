import { Usuario, UsuarioCreate, UsuarioUpdate } from '../entities/Usuario';

export interface IUsuarioService {
  getAllUsuarios(): Promise<Usuario[]>;
  getUsuarioById(id: number): Promise<Usuario | null>;
  getUsuarioByEmail(email: string): Promise<Usuario | null>;
  createUsuario(usuario: UsuarioCreate): Promise<Usuario>;
  updateUsuario(id: number, usuario: UsuarioUpdate): Promise<Usuario | null>;
  deleteUsuario(id: number): Promise<boolean>;
  activateUsuario(id: number): Promise<boolean>;
  deactivateUsuario(id: number): Promise<boolean>;
  getUsuariosConEmpresa(): Promise<any[]>; // Nuevo método
  validatePassword(password: string): boolean;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  cambiarPassword(id: number, nuevaPassword: string): Promise<boolean>;
} 