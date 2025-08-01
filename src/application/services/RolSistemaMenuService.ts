import { injectable, inject } from 'inversify';
import { IRolSistemaMenuService } from '../../domain/services/IRolSistemaMenuService';
import { IRolSistemaMenuRepository } from '../../domain/repositories/IRolSistemaMenuRepository';
import { IMenuRepository } from '../../domain/repositories/IMenuRepository';
import { Menu } from '../../domain/entities/Menu';
import RolSistemaMenuModel from '../../infrastructure/database/models/RolSistemaMenuModel';
import MenuModel from '../../infrastructure/database/models/MenuModel';

@injectable()
export class RolSistemaMenuService implements IRolSistemaMenuService {
  constructor(
    @inject('IRolSistemaMenuRepository') private rolSistemaMenuRepository: IRolSistemaMenuRepository,
    @inject('IMenuRepository') private menuRepository: IMenuRepository
  ) {}

  async getMenusByRolAndSistema(rolId: number, sistemaId: number): Promise<Menu[]> {
    // Obtener los IDs de menús asignados al rol y sistema
    const rolSistemaMenus = await RolSistemaMenuModel.findAll({
      where: { 
        rolId,
        sistemaId,
        estado: true 
      },
      include: [
        {
          model: MenuModel,
          as: 'menu',
          where: { estado: true }
        }
      ]
    });

    // Extraer los menús de las asignaciones
    const menus = rolSistemaMenus.map((rsm: any) => rsm.menu.toJSON() as Menu);
    return menus;
  }

  async asignarMenusByRolAndSistema(rolId: number, sistemaId: number, menuIds: number[]): Promise<void> {
    // Primero eliminar asignaciones existentes
    await RolSistemaMenuModel.update(
      { estado: false },
      { 
        where: { 
          rolId,
          sistemaId,
          estado: true 
        } 
      }
    );

    // Crear nuevas asignaciones
    for (const menuId of menuIds) {
      await this.rolSistemaMenuRepository.create({
        rolId,
        sistemaId,
        menuId,
        estado: true
      });
    }
  }

  async updateAsignacionById(id: number, asignacionData: any): Promise<any> {
    const asignacion = await this.rolSistemaMenuRepository.update(id, asignacionData);
    if (!asignacion) {
      throw new Error('Asignación no encontrada');
    }
    return asignacion;
  }

  async getPermisosBySistema(sistemaId: number): Promise<any[]> {
    try {
      console.log(`🔍 Obteniendo permisos para sistema ${sistemaId}`);
      
      // Obtener todas las asignaciones del sistema
      const permisos = await RolSistemaMenuModel.findAll({
        where: { 
          sistemaId,
          estado: true 
        },
        include: [
          {
            model: MenuModel,
            as: 'menu',
            where: { estado: true }
          }
        ]
      });

      // Procesar los permisos para incluir información adicional
      const permisosProcesados = permisos.map((permiso: any) => {
        const permisoData = permiso.toJSON();
        return {
          id: permisoData.id,
          rolId: permisoData.rolId,
          sistemaId: permisoData.sistemaId,
          menuId: permisoData.menuId,
          estado: permisoData.estado,
          menu: permisoData.menu,
          createdAt: permisoData.createdAt,
          updatedAt: permisoData.updatedAt
        };
      });

      console.log(`✅ Permisos obtenidos para sistema ${sistemaId}: ${permisosProcesados.length}`);
      return permisosProcesados;
    } catch (error) {
      console.error(`❌ Error al obtener permisos para sistema ${sistemaId}:`, error);
      throw new Error(`Error al obtener permisos del sistema: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getPermisosByRol(rolId: number): Promise<any[]> {
    try {
      console.log(`🔍 Obteniendo permisos para rol ${rolId}`);
      
      // Obtener todas las asignaciones del rol
      const permisos = await RolSistemaMenuModel.findAll({
        where: { 
          rolId,
          estado: true 
        },
        include: [
          {
            model: MenuModel,
            as: 'menu',
            where: { estado: true }
          }
        ]
      });

      // Procesar los permisos para incluir información adicional
      const permisosProcesados = permisos.map((permiso: any) => {
        const permisoData = permiso.toJSON();
        return {
          id: permisoData.id,
          rolId: permisoData.rolId,
          sistemaId: permisoData.sistemaId,
          menuId: permisoData.menuId,
          estado: permisoData.estado,
          menu: permisoData.menu,
          createdAt: permisoData.createdAt,
          updatedAt: permisoData.updatedAt
        };
      });

      console.log(`✅ Permisos obtenidos para rol ${rolId}: ${permisosProcesados.length}`);
      return permisosProcesados;
    } catch (error) {
      console.error(`❌ Error al obtener permisos para rol ${rolId}:`, error);
      throw new Error(`Error al obtener permisos del rol: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

    async getPermisosDisponiblesConMarcado(rolId: number): Promise<any[]> {
    try {
      console.log(`🔍 Obteniendo permisos disponibles con marcado para rol ${rolId}`);

      // Obtener todos los menús disponibles
      const todosLosMenus = await MenuModel.findAll({
        where: { estado: true },
        order: [['descripcion', 'ASC']]
      });

      // Obtener los permisos activos del rol
      const permisosActivos = await RolSistemaMenuModel.findAll({
        where: {
          rolId,
          estado: true
        },
        include: [
          {
            model: MenuModel,
            as: 'menu',
            where: { estado: true }
          }
        ]
      });

      // Crear un Set con los IDs de menús activos para el rol
      const menuIdsActivos = new Set(permisosActivos.map((permiso: any) => permiso.menuId));

      // Procesar todos los menús y marcar los que están activos
      const permisosDisponibles = todosLosMenus.map((menu: any) => {
        const menuData = menu.toJSON();
        const estaActivo = menuIdsActivos.has(menuData.id);
        
        return {
          id: menuData.id,
          descripcion: menuData.descripcion,
          routePath: menuData.routePath,
          sistemaId: menuData.sistemaId,
          activo: estaActivo,
          // Agregar información adicional para el frontend
          seleccionado: estaActivo, // Para el checkbox
          puedeSeleccionar: true // Todos los permisos se pueden seleccionar
        };
      });

      console.log(`✅ Permisos disponibles con marcado obtenidos para rol ${rolId}: ${permisosDisponibles.length}`);
      console.log(`📊 Permisos activos: ${permisosDisponibles.filter(p => p.activo).length}`);
      console.log(`📊 Permisos inactivos: ${permisosDisponibles.filter(p => !p.activo).length}`);
      
      return permisosDisponibles;
    } catch (error) {
      console.error(`❌ Error al obtener permisos disponibles con marcado para rol ${rolId}:`, error);
      throw new Error(`Error al obtener permisos disponibles con marcado del rol: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
} 