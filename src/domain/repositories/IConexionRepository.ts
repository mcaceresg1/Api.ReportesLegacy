import { Conexion, ConexionCreate, ConexionUpdate } from '../entities/Conexion';

export interface IConexionRepository {
  findAll(): Promise<Conexion[]>;
  findById(id: number): Promise<Conexion | null>;
  create(conexion: ConexionCreate): Promise<Conexion>;
  update(id: number, conexion: ConexionUpdate): Promise<Conexion | null>;
  delete(id: number): Promise<boolean>;
  activate(id: number): Promise<boolean>;
  deactivate(id: number): Promise<boolean>;
  testConnection(conexion: ConexionCreate): Promise<boolean>;
} 