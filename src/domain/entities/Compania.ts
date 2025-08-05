export interface Compania {
  id: number;
  codigo: string;
  nombre: string;
  titReporte1: string;
  nomCompania: string;
  dirCompania1: string;
  dirCompania2: string;
  telCompania: string;
  titReporte2: string;
  titReporte3: string;
  titReporte4: string;
  titDescrip: string;
  linTotales: string;
  logoCompania: string;
  estado: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CompaniaCreate {
  codigo: string;
  nombre: string;
  titReporte1?: string;
  nomCompania?: string;
  dirCompania1?: string;
  dirCompania2?: string;
  telCompania?: string;
  titReporte2?: string;
  titReporte3?: string;
  titReporte4?: string;
  titDescrip?: string;
  linTotales?: string;
  logoCompania?: string;
  estado?: boolean;
}

export interface CompaniaUpdate {
  id: number;
  codigo?: string;
  nombre?: string;
  titReporte1?: string;
  nomCompania?: string;
  dirCompania1?: string;
  dirCompania2?: string;
  telCompania?: string;
  titReporte2?: string;
  titReporte3?: string;
  titReporte4?: string;
  titDescrip?: string;
  linTotales?: string;
  logoCompania?: string;
  estado?: boolean;
}

export interface CompaniaFilter {
  codigo?: string;
  nombre?: string;
  estado?: boolean;
} 