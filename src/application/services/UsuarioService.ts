import { injectable, inject } from 'inversify';
import { IUsuarioService } from '../../domain/services/IUsuarioService';
import { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import { Usuario, UsuarioCreate, UsuarioUpdate } from '../../domain/entities/Usuario';
import bcrypt from 'bcryptjs';

@injectable()
export class UsuarioService implements IUsuarioService {
  constructor(
    @inject('IUsuarioRepository') private usuarioRepository: IUsuarioRepository
  ) {}

  async getAllUsuarios(): Promise<Usuario[]> {
    return await this.usuarioRepository.findAll();
  }

  async getUsuarioById(id: number): Promise<Usuario | null> {
    return await this.usuarioRepository.findById(id);
  }

  async getUsuarioByEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findByEmail(email);
  }

  async createUsuario(usuario: UsuarioCreate): Promise<Usuario> {
    // Validaciones de negocio
    if (!this.validatePassword(usuario.password)) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    const existingUsuario = await this.usuarioRepository.findByEmail(usuario.email);
    if (existingUsuario) {
      throw new Error('Ya existe un usuario con este email');
    }

    return await this.usuarioRepository.create(usuario);
  }

  async updateUsuario(id: number, usuario: UsuarioUpdate): Promise<Usuario | null> {
    const existingUsuario = await this.usuarioRepository.findById(id);
    if (!existingUsuario) {
      throw new Error('Usuario no encontrado');
    }

    if (usuario.email) {
      const emailExists = await this.usuarioRepository.findByEmail(usuario.email);
      if (emailExists && emailExists.id !== id) {
        throw new Error('Ya existe un usuario con este email');
      }
    }

    if (usuario.password && !this.validatePassword(usuario.password)) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    return await this.usuarioRepository.update(id, usuario);
  }

  async deleteUsuario(id: number): Promise<boolean> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return await this.usuarioRepository.delete(id);
  }

  async activateUsuario(id: number): Promise<boolean> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return await this.usuarioRepository.activate(id);
  }

  async deactivateUsuario(id: number): Promise<boolean> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return await this.usuarioRepository.deactivate(id);
  }

  async getUsuariosConEmpresa(): Promise<any[]> {
    try {
      console.log("🔍 INICIANDO getUsuariosConEmpresa");
      
      // Obtener usuarios con información de roles
      const usuarios = await this.usuarioRepository.findAllWithRoles();
      
      if (!usuarios || usuarios.length === 0) {
        console.log("📭 No hay usuarios, retornando array vacío");
        return [];
      }

      // Mapear empresas por rol
      const empresasPorRol: { [key: number]: string } = {
        1: "Globalis S.A.",
        2: "Globalis S.A.",
        3: "Globalis S.A.",
        4: "Globalis S.A.",
        5: "Globalis S.A.",
      };

      // Procesar datos agregando información de empresa
      const usuariosConEmpresa = usuarios.map(usuario => {
        const usuarioData = usuario as any;
        usuarioData.empresa = empresasPorRol[usuarioData.rolId] || "Sin empresa asignada";
        return usuarioData;
      });

      console.log("🎉 getUsuariosConEmpresa completado exitosamente");
      return usuariosConEmpresa;
      
    } catch (error) {
      console.error("💥 ERROR en getUsuariosConEmpresa:", error);
      throw new Error(`Error al obtener usuarios con empresa: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  validatePassword(password: string): boolean {
    return password.length >= 8;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
} 