import { Sistema, SistemaCreate, SistemaUpdate } from '../entities/Sistema';

export interface ISistemaService {
  getAllSistemas(): Promise<Sistema[]>;
  createSistema(sistemaData: SistemaCreate): Promise<Sistema>;
  updateSistema(sistemaData: SistemaUpdate): Promise<Sistema>;
  deleteSistema(id: number): Promise<boolean>;
  
  // Nuevas funcionalidades
  getUsuariosPorSistema(sistemaId: number): Promise<any[]>;
  getPermisosSistema(sistemaId: number): Promise<any[]>;
  getRolesPorSistema(sistemaId: number): Promise<any[]>;
  getMenusPorSistema(sistemaId: number): Promise<any[]>;
  getEstadisticasSistema(sistemaId: number): Promise<any>;
} 