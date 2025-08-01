export interface Usuario {
  id?: number;
  username: string;
  email: string;
  password: string;
  estado: boolean;
  rolId?: number;
  empresa?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UsuarioCreate {
  username: string;
  email: string;
  password: string;
  estado?: boolean;
  rolId: number;
  empresa?: string;
}

export interface UsuarioUpdate {
  username?: string;
  email?: string;
  password?: string;
  estado?: boolean;
  rolId?: number;
  empresa?: string;
} 