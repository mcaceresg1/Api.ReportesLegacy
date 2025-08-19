export interface IDatabaseService {
  obtenerConexion(): Promise<any>;
  ejecutarQuery(query: string, params?: any[]): Promise<any[]>;
  ejecutarNonQuery(query: string, params?: any[]): Promise<number>;
  cerrarConexion(): Promise<void>;
}
