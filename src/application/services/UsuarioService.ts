import { injectable, inject } from "inversify";
import { IUsuarioService } from "../../domain/services/IUsuarioService";
import { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository";
import {
  Usuario,
  UsuarioCreate,
  UsuarioUpdate,
} from "../../domain/entities/Usuario";
import bcrypt from "bcryptjs";

@injectable()
export class UsuarioService implements IUsuarioService {
  constructor(
    @inject("IUsuarioRepository") private usuarioRepository: IUsuarioRepository
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
    if (!this.validatePassword(usuario.password).isValid) {
      throw new Error(
        "La contraseña debe tener al menos 8 caracteres, incluir letras, números y no ser común"
      );
    }

    const existingUsuario = await this.usuarioRepository.findByEmail(
      usuario.email
    );
    if (existingUsuario) {
      throw new Error("Ya existe un usuario con este email");
    }

    // Hashear la contraseña antes de guardar
    const hashedPassword = await this.hashPassword(usuario.password);
    const usuarioWithHashedPassword = {
      ...usuario,
      password: hashedPassword,
    };

    return await this.usuarioRepository.create(usuarioWithHashedPassword);
  }

  async updateUsuario(
    id: number,
    usuario: UsuarioUpdate
  ): Promise<Usuario | null> {
    console.log("🔧 INICIANDO updateUsuario");
    console.log("📦 Datos recibidos:", usuario);
    console.log("🏢 Campo empresa en servicio:", usuario.empresa);

    const existingUsuario = await this.usuarioRepository.findById(id);
    if (!existingUsuario) {
      throw new Error("Usuario no encontrado");
    }

    if (usuario.email) {
      const emailExists = await this.usuarioRepository.findByEmail(
        usuario.email
      );
      if (emailExists && emailExists.id !== id) {
        throw new Error("Ya existe un usuario con este email");
      }
    }

    if (usuario.password && !this.validatePassword(usuario.password).isValid) {
      throw new Error(
        "La contraseña debe tener al menos 8 caracteres, incluir letras, números y no ser común"
      );
    }

    const result = await this.usuarioRepository.update(id, usuario);
    console.log("✅ Usuario actualizado en servicio:", result);
    return result;
  }

  async deleteUsuario(id: number): Promise<boolean> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    return await this.usuarioRepository.delete(id);
  }

  async activateUsuario(id: number): Promise<boolean> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    return await this.usuarioRepository.activate(id);
  }

  async deactivateUsuario(id: number): Promise<boolean> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
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

      // Procesar datos manteniendo la empresa real de la base de datos
      const usuariosConEmpresa = usuarios.map((usuario) => {
        const usuarioData = usuario as any;
        // Usar la empresa real de la base de datos, no sobrescribir
        console.log(
          `👤 Usuario ${usuarioData.username}: empresa = ${usuarioData.empresa}`
        );
        return usuarioData;
      });

      console.log("🎉 getUsuariosConEmpresa completado exitosamente");
      return usuariosConEmpresa;
    } catch (error) {
      console.error("💥 ERROR en getUsuariosConEmpresa:", error);
      throw new Error(
        `Error al obtener usuarios con empresa: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Mínimo 8 caracteres
    if (password.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres");
    }

    // Incluir mayúsculas y minúsculas
    if (!/[a-z]/.test(password)) {
      errors.push("La contraseña debe incluir al menos una letra minúscula");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("La contraseña debe incluir al menos una letra mayúscula");
    }

    // Incluir números
    if (!/\d/.test(password)) {
      errors.push("La contraseña debe incluir al menos un número");
    }

    // No usar contraseñas comunes
    const commonPasswords = [
      "password",
      "123456",
      "12345678",
      "qwerty",
      "abc123",
      "password123",
      "admin",
      "root",
      "user",
      "letmein",
      "welcome",
      "monkey",
      "dragon",
      "master",
      "hello",
      "freedom",
      "whatever",
      "qazwsx",
      "trustno1",
      "jordan",
      "joshua",
      "michael",
      "michelle",
      "charlie",
      "andrew",
      "matthew",
      "jennifer",
      "jessica",
      "joshua",
      "amanda",
      "jessica",
      "joshua",
      "amanda",
      "jessica",
      "joshua",
      "amanda",
      "jessica",
      "123456789",
      "1234567890",
      "password1",
      "password123",
      "admin123",
      "root123",
      "user123",
      "test123",
      "demo123",
      "guest123",
      "temp123",
      "changeme",
      "secret",
      "private",
      "mypass",
      "mypassword",
      "letmein123",
      "welcome123",
      "monkey123",
      "dragon123",
      "master123",
      "hello123",
      "freedom123",
      "whatever123",
      "qazwsx123",
      "trustno1123",
      "jordan123",
      "joshua123",
      "michael123",
      "michelle123",
      "charlie123",
      "andrew123",
      "matthew123",
      "jennifer123",
      "jessica123",
      "joshua123",
      "amanda123",
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("No se permiten contraseñas comunes");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async cambiarPassword(id: number, nuevaPassword: string): Promise<boolean> {
    console.log("🔧 INICIANDO cambiarPassword");
    console.log("🆔 ID del usuario:", id);
    console.log("🔐 Nueva contraseña recibida");

    const existingUsuario = await this.usuarioRepository.findById(id);
    if (!existingUsuario) {
      console.error("❌ Usuario no encontrado con ID:", id);
      return false;
    }

    const validation = this.validatePassword(nuevaPassword);
    if (!validation.isValid) {
      console.error(
        "❌ Contraseña no cumple con los requisitos:",
        validation.errors
      );
      throw new Error(
        `Validación de contraseña fallida: ${validation.errors.join(", ")}`
      );
    }

    // Hashear la nueva contraseña
    const hashedPassword = await this.hashPassword(nuevaPassword);
    console.log("🔐 Contraseña hasheada correctamente");

    // Actualizar solo la contraseña
    const result = await this.usuarioRepository.updatePassword(
      id,
      hashedPassword
    );
    console.log("✅ Contraseña actualizada en repositorio:", result);

    return result;
  }
}
