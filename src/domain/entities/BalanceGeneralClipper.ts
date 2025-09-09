/**
 * Interfaz para el Balance General Clipper
 * Representa los datos del balance general con saldos acumulados, movimientos del mes y saldos actuales
 */
export interface ClipperBalanceGeneral {
  cuenta: string;
  nombre: string;
  saldoAcumuladoDebe: number;
  saldoAcumuladoHaber: number;
  movimientoMesDebe: number;
  movimientoMesHaber: number;
  saldoActualDebe: number;
  saldoActualHaber: number;
}
