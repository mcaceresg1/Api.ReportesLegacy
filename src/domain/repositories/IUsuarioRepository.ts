import { Usuario, UsuarioCreate, UsuarioUpdate } from '../entities/Usuario';

export interface IUsuarioRepository {
  findAll(): Promise<Usuario[]>;
  findById(id: number): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  findByUsernameWithPassword(username: string): Promise<Usuario | null>;
  create(usuario: UsuarioCreate): Promise<Usuario>;
  update(id: number, usuario: UsuarioUpdate): Promise<Usuario | null>;
  updatePassword(id: number, hashedPassword: string): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  activate(id: number): Promise<boolean>;
  deactivate(id: number): Promise<boolean>;
  findAllWithRoles(): Promise<any[]>; // Nuevo método
} 