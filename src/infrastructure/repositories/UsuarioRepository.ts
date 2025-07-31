import { injectable } from 'inversify';
import { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import { Usuario, UsuarioCreate, UsuarioUpdate } from '../../domain/entities/Usuario';
import UsuarioModel from '../database/models/UsuarioModel';
import RolModel from '../database/models/RolModel';

@injectable()
export class UsuarioRepository implements IUsuarioRepository {
  async findAll(): Promise<Usuario[]> {
    const usuarios = await UsuarioModel.findAll({
      where: { estado: true }
    });
    return usuarios.map((usuario: any) => usuario.toJSON() as Usuario);
  }

  async findById(id: number): Promise<Usuario | null> {
    const usuario = await UsuarioModel.findByPk(id);
    return usuario ? usuario.toJSON() as Usuario : null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await UsuarioModel.findOne({
      where: { email, estado: true }
    });
    return usuario ? usuario.toJSON() as Usuario : null;
  }

  async findByUsernameWithPassword(username: string): Promise<Usuario | null> {
    const usuario = await UsuarioModel.findOne({
      where: { username }
    });
    return usuario ? usuario.toJSON() as Usuario : null;
  }

  async create(usuarioData: UsuarioCreate): Promise<Usuario> {
    const usuario = await UsuarioModel.create({
      ...usuarioData,
      estado: usuarioData.estado !== undefined ? usuarioData.estado : true
    });
    return usuario.toJSON() as Usuario;
  }

  async update(id: number, usuarioData: UsuarioUpdate): Promise<Usuario | null> {
    const usuario = await UsuarioModel.findByPk(id);
    if (!usuario) return null;

    await usuario.update(usuarioData);
    return usuario.toJSON() as Usuario;
  }

  async delete(id: number): Promise<boolean> {
    const usuario = await UsuarioModel.findByPk(id);
    if (!usuario) return false;

    await usuario.update({ estado: false });
    return true;
  }

  async activate(id: number): Promise<boolean> {
    const usuario = await UsuarioModel.findByPk(id);
    if (!usuario) return false;

    await usuario.update({ estado: true });
    return true;
  }

  async deactivate(id: number): Promise<boolean> {
    const usuario = await UsuarioModel.findByPk(id);
    if (!usuario) return false;

    await usuario.update({ estado: false });
    return true;
  }

  async findAllWithRoles(): Promise<any[]> {
    try {
      console.log("🔍 INICIANDO findAllWithRoles");
      
      // Verificar modelos
      console.log("📋 Verificando modelos...");
      if (!UsuarioModel || !RolModel) {
        throw new Error("Modelos no disponibles");
      }
      console.log("✅ Modelos disponibles");

      // Contar usuarios
      console.log("🔢 Contando usuarios...");
      const totalUsuarios = await UsuarioModel.count();
      console.log(`📊 Total usuarios: ${totalUsuarios}`);

      if (totalUsuarios === 0) {
        console.log("📭 No hay usuarios, retornando array vacío");
        return [];
      }

      // Consulta con include
      console.log("🔗 Ejecutando consulta con include...");
      const datos = await UsuarioModel.findAll({
        include: {
          model: RolModel,
          as: "rol",
          attributes: ["id", "descripcion", "descripcion_completa", "estado"],
        },
        where: { estado: true },
        attributes: ["id", "username", "email", "estado", "rolId"],
        limit: 5
      });
      console.log(`✅ Consulta con include exitosa: ${datos.length} usuarios`);

      // Procesar datos
      console.log("🔄 Procesando datos...");
      const usuariosConRoles = datos.map((usuario: any) => {
        return usuario.toJSON();
      });

      console.log("🎉 findAllWithRoles completado exitosamente");
      return usuariosConRoles;
      
    } catch (error) {
      console.error("💥 ERROR en findAllWithRoles:", error);
      throw new Error(`Error al obtener usuarios con roles: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
} 