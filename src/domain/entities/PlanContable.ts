/**
 * Entidad para el Plan Contable
 * Basado en los queries SQL para REPORTE ESTANDAR-LIBRO OFICIAL-DIARIO DE CONTABILIDAD-PLAN CONTABLE
 */

export interface PlanContableItem {
  /** Código de la cuenta contable */
  CuentaContable: string;
  
  /** Descripción de la cuenta contable */
  CuentaContableDesc: string;
  
  /** Estado de la cuenta contable */
  Estado: string;
  
  /** Cuenta contable consolidada */
  CuentaContableCons?: string;
  
  /** Descripción de la cuenta contable consolidada */
  CuentaContableConsDesc?: string;
}

export interface PlanContableFiltros {
  /** Código del conjunto contable */
  conjunto: string;
  
  /** Usuario que solicita el reporte */
  usuario?: string;
  
  /** Filtro por código de cuenta contable (búsqueda parcial) */
  cuentaContable?: string;
  
  /** Filtro por descripción (búsqueda parcial) */
  descripcion?: string;
  
  /** Filtro por estado */
  estado?: string;
  
  /** Página para paginación */
  page?: number;
  
  /** Límite de registros por página */
  limit?: number;
}

export interface PlanContableResponse {
  /** Lista de cuentas contables */
  data: PlanContableItem[];
  
  /** Total de registros */
  total: number;
  
  /** Página actual */
  pagina: number;
  
  /** Registros por página */
  porPagina: number;
  
  /** Total de páginas */
  totalPaginas: number;
}

export interface GlobalConfig {
  /** Módulo */
  modulo: string;
  
  /** Nombre de la configuración */
  nombre: string;
  
  /** Tipo de configuración */
  tipo: string;
  
  /** Valor de la configuración */
  valor: string;
}

export interface PlanContableCreate {
  /** Código de la cuenta contable */
  CuentaContable: string;
  
  /** Descripción de la cuenta contable */
  CuentaContableDesc: string;
  
  /** Estado de la cuenta contable */
  Estado: string;
  
  /** Cuenta contable consolidada (opcional) */
  CuentaContableCons?: string;
  
  /** Descripción de la cuenta contable consolidada (opcional) */
  CuentaContableConsDesc?: string;
}
