// Entidades para el reporte de Ganancias y Pérdidas de Clipper

export interface ClipperEstadoGananciasYResultados {
  concepto: string; // Ej. "VENTAS", "GASTOS ADMINISTRATIVOS"
  monto: string; // Ej. "6,110,267.20" (formateado como string para mantener formato N2)
  orden: number; // Para ordenar según jerarquía en reporte
}

export interface FiltrosGananciasPerdidasClipper {
  periodoDesde: number; // Mes de inicio (1-12)
  periodoHasta: number; // Mes de fin (1-12)
}

export interface GananciasPerdidasClipperResponse {
  success: boolean;
  message: string;
  data?: ClipperEstadoGananciasYResultados[];
  error?: string;
}

// Enum para las bases de datos disponibles
export enum BaseDatosClipperGPC {
  BDCLIPPER_GPC = "bdclipperGPC",
  BDCLIPPER_GPC1 = "bdclipperGPC1",
}

// Configuración de conceptos con su orden de presentación
export const CONCEPTOS_GANANCIAS_PERDIDAS = [
  { concepto: "VENTAS", orden: 1 },
  { concepto: "COSTO DE VENTAS", orden: 2 },
  { concepto: "UTILIDAD BRUTA", orden: 3 },
  { concepto: "GASTOS FINANCIEROS", orden: 4 },
  { concepto: "GASTOS ADMINISTRATIVOS", orden: 5 },
  { concepto: "UTILIDAD DE OPERACION", orden: 6 },
  { concepto: "INGRESOS DIVERSOS", orden: 7 },
  { concepto: "INGRESOS EXCEPCIONALES", orden: 8 },
  { concepto: "INGRESOS FINANCIEROS", orden: 9 },
  { concepto: "CARGAS EXCEPCIONALES", orden: 10 },
  { concepto: "UTILIDAD ANTES DE REI", orden: 11 },
  { concepto: "REI.", orden: 12 },
  { concepto: "UTILIDAD ANTES PART.E IMP.", orden: 13 },
] as const;
