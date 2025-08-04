import { injectable, inject } from 'inversify';
import { ISistemaService } from '../../domain/services/ISistemaService';
import { ISistemaRepository } from '../../domain/repositories/ISistemaRepository';
import { Sistema, SistemaCreate, SistemaUpdate } from '../../domain/entities/Sistema';
import { IUsuarioService } from '../../domain/services/IUsuarioService';
import { IRolSistemaMenuService } from '../../domain/services/IRolSistemaMenuService';
import { IMenuService } from '../../domain/services/IMenuService';

@injectable()
export class SistemaService implements ISistemaService {
  constructor(
    @inject('ISistemaRepository') private sistemaRepository: ISistemaRepository,
    @inject('IUsuarioService') private usuarioService: IUsuarioService,
    @inject('IRolSistemaMenuService') private rolSistemaMenuService: IRolSistemaMenuService,
    @inject('IMenuService') private menuService: IMenuService
  ) {}

  async getAllSistemas(): Promise<Sistema[]> {
    return await this.sistemaRepository.findAll();
  }

  async createSistema(sistemaData: SistemaCreate): Promise<Sistema> {
    return await this.sistemaRepository.create(sistemaData);
  }

  async updateSistema(sistemaData: SistemaUpdate): Promise<Sistema> {
    if (!sistemaData.id) {
      throw new Error('ID del sistema es requerido');
    }
    const sistema = await this.sistemaRepository.update(sistemaData.id, sistemaData);
    if (!sistema) {
      throw new Error('Sistema no encontrado');
    }
    return sistema;
  }

  async deleteSistema(id: number): Promise<boolean> {
    return await this.sistemaRepository.delete(id);
  }

  // Nuevas funcionalidades
  async getUsuariosPorSistema(sistemaId: number): Promise<any[]> {
    try {
      console.log(`🔍 Obteniendo usuarios para sistema ${sistemaId}`);
      
      // Obtener todos los usuarios con información de empresa
      const usuarios = await this.usuarioService.getUsuariosConEmpresa();
      
      // Filtrar usuarios que tienen permisos en este sistema
      const usuariosConPermisos = usuarios.filter((usuario: any) => {
        // Aquí podrías implementar lógica más específica para filtrar por sistema
        // Por ahora, retornamos todos los usuarios
        return true;
      });

      console.log(`✅ Usuarios obtenidos para sistema ${sistemaId}: ${usuariosConPermisos.length}`);
      return usuariosConPermisos;
    } catch (error) {
      console.error(`❌ Error al obtener usuarios para sistema ${sistemaId}:`, error);
      throw new Error(`Error al obtener usuarios del sistema: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getPermisosSistema(sistemaId: number): Promise<any[]> {
    try {
      console.log(`🔍 Obteniendo permisos para sistema ${sistemaId}`);
      
      // Obtener todos los permisos del sistema
      const permisos = await this.rolSistemaMenuService.getPermisosBySistema(sistemaId);
      
      console.log(`✅ Permisos obtenidos para sistema ${sistemaId}: ${permisos.length}`);
      return permisos;
    } catch (error) {
      console.error(`❌ Error al obtener permisos para sistema ${sistemaId}:`, error);
      throw new Error(`Error al obtener permisos del sistema: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getRolesPorSistema(sistemaId: number): Promise<any[]> {
    try {
      console.log(`🔍 Obteniendo roles para sistema ${sistemaId}`);
      
      // Obtener roles que tienen permisos en este sistema
      const roles = await this.sistemaRepository.getRolesBySistema(sistemaId);
      
      console.log(`✅ Roles obtenidos para sistema ${sistemaId}: ${roles.length}`);
      return roles;
    } catch (error) {
      console.error(`❌ Error al obtener roles para sistema ${sistemaId}:`, error);
      throw new Error(`Error al obtener roles del sistema: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getMenusPorSistema(sistemaId: number): Promise<any[]> {
    try {
      console.log(`🔍 Obteniendo menús para sistema ${sistemaId}`);
      
      // Primero obtener el sistema para obtener su descripción
      const sistema = await this.sistemaRepository.findById(sistemaId);
      if (!sistema) {
        console.log(`❌ Sistema con ID ${sistemaId} no encontrado`);
        return [];
      }
      
      console.log(`🔍 Sistema encontrado: ${sistema.descripcion}`);
      
      // Mapear la descripción del sistema a su sistemaCode
      const sistemaCodeMapping: { [key: string]: string } = {
        'Excel': 'EXCEL',
        'Exactus': 'EXACTUS',
        'Clipper': 'CLIPPER-TNEW0000',
        'Oficon': 'OFICON',
        'Hmis': 'HMIS'
      };
      
      const sistemaCode = sistemaCodeMapping[sistema.descripcion];
      if (!sistemaCode) {
        console.log(`❌ No se encontró mapeo para sistema: ${sistema.descripcion}`);
        return [];
      }
      
      console.log(`🔍 Buscando menús con sistemaCode: ${sistemaCode}`);
      
      // Obtener menús del sistema usando el sistemaCode
      const menus = await this.menuService.getMenusBySistema(sistemaCode);
      
      console.log(`✅ Menús obtenidos para sistema ${sistemaId} (${sistema.descripcion}): ${menus.length}`);
      return menus;
    } catch (error) {
      console.error(`❌ Error al obtener menús para sistema ${sistemaId}:`, error);
      throw new Error(`Error al obtener menús del sistema: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getEstadisticasSistema(sistemaId: number): Promise<any> {
    try {
      console.log(`🔍 Obteniendo estadísticas para sistema ${sistemaId}`);
      
      // Obtener estadísticas del sistema
      const usuarios = await this.getUsuariosPorSistema(sistemaId);
      const permisos = await this.getPermisosSistema(sistemaId);
      const roles = await this.getRolesPorSistema(sistemaId);
      const menus = await this.getMenusPorSistema(sistemaId);
      
      const estadisticas = {
        totalUsuarios: usuarios.length,
        totalPermisos: permisos.length,
        totalRoles: roles.length,
        totalMenus: menus.length,
        sistemaId: sistemaId,
        fechaConsulta: new Date().toISOString()
      };
      
      console.log(`✅ Estadísticas obtenidas para sistema ${sistemaId}`);
      return estadisticas;
    } catch (error) {
      console.error(`❌ Error al obtener estadísticas para sistema ${sistemaId}:`, error);
      throw new Error(`Error al obtener estadísticas del sistema: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
} 