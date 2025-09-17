import { injectable, inject } from "inversify";
import { IBalanceComprobacionClipperService } from "../../domain/services/IBalanceComprobacionClipperService";
import { IBalanceComprobacionClipperRepository } from "../../domain/repositories/IBalanceComprobacionClipperRepository";
import { ClipperBalanceComprobacion } from "../../domain/entities/BalanceCmprobacionClipper";

@injectable()
export class BalanceComprobacionClipperService
  implements IBalanceComprobacionClipperService
{
  constructor(
    @inject("IBalanceComprobacionClipperRepository")
    private balanceComprobacionClipperRepository: IBalanceComprobacionClipperRepository
  ) {}

  /**
   * Obtiene los datos del Balance de Comprobación desde Clipper
   * @param baseDatos Nombre de la base de datos Clipper a utilizar (bdclipperGPC, bdclipperGPC2, etc.)
   * @returns Lista de registros del balance de comprobación
   */
  async obtenerBalanceComprobacionClipper(
    baseDatos: string
  ): Promise<ClipperBalanceComprobacion[]> {
    try {
      // Validaciones de negocio
      this.validarParametros(baseDatos);

      // Delegar al repositorio
      const resultado =
        await this.balanceComprobacionClipperRepository.obtenerBalanceComprobacionClipper(
          baseDatos
        );

      // Validar que se obtuvieron datos
      if (!resultado || resultado.length === 0) {
        console.warn(
          "No se encontraron registros de balance de comprobación clipper"
        );
        return [];
      }

      // Validar y limpiar los datos
      return this.validarYLimpiarDatos(resultado);
    } catch (error) {
      console.error(
        "Error en BalanceComprobacionClipperService.obtenerBalanceComprobacionClipper:",
        error
      );
      throw error;
    }
  }

  /**
   * Valida los parámetros de entrada
   * @param baseDatos Nombre de la base de datos Clipper
   */
  private validarParametros(baseDatos: string): void {
    if (!baseDatos || baseDatos.trim() === "") {
      throw new Error("El nombre de la base de datos Clipper es obligatorio");
    }
  }

  /**
   * Valida y limpia los datos obtenidos del repositorio
   * @param datos Datos obtenidos del repositorio
   * @returns Datos validados y limpios
   */
  private validarYLimpiarDatos(
    datos: ClipperBalanceComprobacion[]
  ): ClipperBalanceComprobacion[] {
    return datos.map((registro) => ({
      cuenta: registro.cuenta?.toString().trim() || "",
      nombre: registro.nombre?.toString().trim() || "",
      saldoAcumuladoDebe: this.validarNumero(registro.saldoAcumuladoDebe),
      saldoAcumuladoHaber: this.validarNumero(registro.saldoAcumuladoHaber),
      movimientoMesDebe: this.validarNumero(registro.movimientoMesDebe),
      movimientoMesHaber: this.validarNumero(registro.movimientoMesHaber),
      saldoActualDebe: this.validarNumero(registro.saldoActualDebe),
      saldoActualHaber: this.validarNumero(registro.saldoActualHaber),
    }));
  }

  /**
   * Valida que un valor sea un número válido
   * @param valor Valor a validar
   * @returns Número validado o 0 si no es válido
   */
  private validarNumero(valor: any): number {
    if (valor === null || valor === undefined || valor === "") {
      return 0;
    }

    const numero = parseFloat(valor);
    return isNaN(numero) ? 0 : numero;
  }
}
