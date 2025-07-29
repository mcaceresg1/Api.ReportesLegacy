import { Conexion, ConexionCreate, ConexionUpdate } from '../entities/Conexion';

export interface IConexionService {
  getAllConexiones(): Promise<Conexion[]>;
  getConexionById(id: number): Promise<Conexion | null>;
  createConexion(conexionData: ConexionCreate): Promise<Conexion>;
  updateConexion(conexionData: ConexionUpdate): Promise<Conexion>;
  deleteConexion(id: number): Promise<boolean>;
} 