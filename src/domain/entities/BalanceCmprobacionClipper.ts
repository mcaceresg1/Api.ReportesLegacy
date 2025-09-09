export interface ClipperBalanceComprobacion {
    cuenta: string;               // Ej. "101010001"
    nombre: string;               // Ej. "EFECTIVO SOLES LIMA"
    saldoAcumuladoDebe: number;   // Ej. 1077484.66
    saldoAcumuladoHaber: number;  // Ej. 757125.30
    movimientoMesDebe: number;    // Ej. 4294156.76
    movimientoMesHaber: number;   // Ej. 4614516.12
    saldoActualDebe: number;      // Ej. 5371641.42
    saldoActualHaber: number;     // Ej. 5371641.42
  }
  