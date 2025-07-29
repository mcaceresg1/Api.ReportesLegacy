export interface Conexion {
  id: number;
  usernameDB: string;
  passwordDB: string;
  nameDB: string;
  nameServer: string;
  nameTable: string;
  codEmpresa: string;
  desEmpresa: string;
  sistema: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ConexionCreate {
  usernameDB: string;
  passwordDB: string;
  nameDB: string;
  nameServer: string;
  nameTable: string;
  codEmpresa: string;
  desEmpresa: string;
  sistema: string;
}

export interface ConexionUpdate {
  id: number;
  usernameDB?: string;
  passwordDB?: string;
  nameDB?: string;
  nameServer?: string;
  nameTable?: string;
  codEmpresa?: string;
  desEmpresa?: string;
  sistema?: string;
} 