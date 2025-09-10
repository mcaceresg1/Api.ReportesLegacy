import { injectable } from "inversify";
import { QueryTypes } from "sequelize";
import { IGananciasPerdidasClipperRepository } from "../../domain/repositories/IGananciasPerdidasClipperRepository";
import {
  ClipperEstadoGananciasYResultados,
  FiltrosGananciasPerdidasClipper,
  CONCEPTOS_GANANCIAS_PERDIDAS,
} from "../../domain/entities/GananciasPerdidasClipper";
import { clipperGPCDatabases } from "../database/config/clipper-gpc-database";

@injectable()
export class GananciasPerdidasClipperRepository
  implements IGananciasPerdidasClipperRepository
{
  /**
   * Obtiene los datos del Estado de Ganancias y Pérdidas desde Clipper
   * @param bdClipperGPC Nombre de la base de datos Clipper GPC a utilizar
   * @param filtros Filtros de período para el reporte
   * @returns Lista de registros del estado de ganancias y pérdidas
   */
  async obtenerGananciasPerdidasClipper(
    bdClipperGPC: string,
    filtros: FiltrosGananciasPerdidasClipper
  ): Promise<ClipperEstadoGananciasYResultados[]> {
    try {
      const sequelize = clipperGPCDatabases[bdClipperGPC];
      if (!sequelize)
        throw new Error(`Base de datos "${bdClipperGPC}" no configurada.`);

      // Construir dinámicamente las columnas de DEBE y HABER basadas en el período
      const { columnasDebe, columnasHaber } = this.construirColumnasPeriodo(
        filtros.periodoDesde,
        filtros.periodoHasta
      );

      // Query SQL dinámica basada en el período
      const query = `
        WITH MOVIMIENTOS AS (
          SELECT 
            T0.CUENTA,
            T0.NOMBRE,
            ${columnasDebe} AS TOTAL_DEBE,
            ${columnasHaber} AS TOTAL_HABER
          FROM PCGR T0
          INNER JOIN ESTGAN T1 ON T0.CUENTA = T1.CUENTA
          WHERE T0.CUENTA IN ('70', '69', '77', '94', '75', '76', '65', '66')
          GROUP BY T0.CUENTA, T0.NOMBRE
        ),
        REPORTE_BASE AS (
          SELECT 
            CUENTA,
            NOMBRE,
            TOTAL_HABER - TOTAL_DEBE AS IMPORTE,
            CASE CUENTA
              WHEN '70' THEN 'VENTAS'
              WHEN '69' THEN 'COSTO DE VENTAS'
              WHEN '77' THEN 'GASTOS FINANCIEROS'
              WHEN '94' THEN 'GASTOS ADMINISTRATIVOS'
              WHEN '75' THEN 'INGRESOS DIVERSOS'
              WHEN '76' THEN 'INGRESOS EXCEPCIONALES'
              WHEN '65' THEN 'INGRESOS FINANCIEROS'
              WHEN '66' THEN 'CARGAS EXCEPCIONALES'
              ELSE 'OTROS'
            END AS CONCEPTO
          FROM MOVIMIENTOS
        ),
        REPORTE_FINAL AS (
          SELECT
            CONCEPTO,
            SUM(IMPORTE) AS IMPORTE
          FROM REPORTE_BASE
          GROUP BY CONCEPTO
        )
        SELECT 'VENTAS' AS CONCEPTO, FORMAT(IMPORTE, 'N2') AS MONTO
        FROM REPORTE_FINAL WHERE CONCEPTO = 'VENTAS'
        UNION ALL
        SELECT 'COSTO DE VENTAS', FORMAT(IMPORTE, 'N2')
        FROM REPORTE_FINAL WHERE CONCEPTO = 'COSTO DE VENTAS'
        UNION ALL
        SELECT 'UTILIDAD BRUTA', FORMAT(
          (SELECT IMPORTE FROM REPORTE_FINAL WHERE CONCEPTO = 'VENTAS') +
          (SELECT IMPORTE FROM REPORTE_FINAL WHERE CONCEPTO = 'COSTO DE VENTAS'), 'N2')
        UNION ALL
        SELECT 'GASTOS FINANCIEROS', FORMAT(IMPORTE, 'N2')
        FROM REPORTE_FINAL WHERE CONCEPTO = 'GASTOS FINANCIEROS'
        UNION ALL
        SELECT 'GASTOS ADMINISTRATIVOS', FORMAT(IMPORTE, 'N2')
        FROM REPORTE_FINAL WHERE CONCEPTO = 'GASTOS ADMINISTRATIVOS'
        UNION ALL
        SELECT 'UTILIDAD DE OPERACION', FORMAT(
          (SELECT IMPORTE FROM REPORTE_FINAL WHERE CONCEPTO = 'VENTAS') +
          (SELECT IMPORTE FROM REPORTE_FINAL WHERE CONCEPTO = 'COSTO DE VENTAS') +
          (SELECT IMPORTE FROM REPORTE_FINAL WHERE CONCEPTO = 'GASTOS FINANCIEROS') +
          (SELECT IMPORTE FROM REPORTE_FINAL WHERE CONCEPTO = 'GASTOS ADMINISTRATIVOS'), 'N2')
        UNION ALL
        SELECT 'INGRESOS DIVERSOS', FORMAT(IMPORTE, 'N2')
        FROM REPORTE_FINAL WHERE CONCEPTO = 'INGRESOS DIVERSOS'
        UNION ALL
        SELECT 'INGRESOS EXCEPCIONALES', FORMAT(IMPORTE, 'N2')
        FROM REPORTE_FINAL WHERE CONCEPTO = 'INGRESOS EXCEPCIONALES'
        UNION ALL
        SELECT 'INGRESOS FINANCIEROS', FORMAT(IMPORTE, 'N2')
        FROM REPORTE_FINAL WHERE CONCEPTO = 'INGRESOS FINANCIEROS'
        UNION ALL
        SELECT 'CARGAS EXCEPCIONALES', FORMAT(IMPORTE, 'N2')
        FROM REPORTE_FINAL WHERE CONCEPTO = 'CARGAS EXCEPCIONALES'
        UNION ALL
        SELECT 'UTILIDAD ANTES DE REI', FORMAT((
          SELECT SUM(IMPORTE)
          FROM REPORTE_FINAL
          WHERE CONCEPTO IN (
            'VENTAS', 'COSTO DE VENTAS', 'GASTOS FINANCIEROS', 'GASTOS ADMINISTRATIVOS',
            'INGRESOS DIVERSOS', 'INGRESOS EXCEPCIONALES', 'INGRESOS FINANCIEROS', 'CARGAS EXCEPCIONALES'
          )), 'N2')
        UNION ALL
        SELECT 'REI.', FORMAT(0, 'N2')
        UNION ALL
        SELECT 'UTILIDAD ANTES PART.E IMP.', FORMAT((
          SELECT SUM(IMPORTE)
          FROM REPORTE_FINAL
          WHERE CONCEPTO IN (
            'VENTAS', 'COSTO DE VENTAS', 'GASTOS FINANCIEROS', 'GASTOS ADMINISTRATIVOS',
            'INGRESOS DIVERSOS', 'INGRESOS EXCEPCIONALES', 'INGRESOS FINANCIEROS', 'CARGAS EXCEPCIONALES'
          )), 'N2')
      `;

      const result = await sequelize.query<ClipperEstadoGananciasYResultados>(
        query,
        {
          type: QueryTypes.SELECT,
        }
      );

      return result
        .map((row: any) => ({
          concepto: row.CONCEPTO || "",
          monto: row.MONTO || "0.00",
          orden: this.obtenerOrdenConcepto(row.CONCEPTO),
        }))
        .sort((a, b) => a.orden - b.orden);
    } catch (error) {
      console.error(
        "Error en GananciasPerdidasClipperRepository.obtenerGananciasPerdidasClipper:",
        error
      );
      throw new Error(
        `Error al obtener ganancias y pérdidas clipper: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  // Método auxiliar para obtener el orden de un concepto
  private obtenerOrdenConcepto(concepto: string): number {
    const conceptoConfig = CONCEPTOS_GANANCIAS_PERDIDAS.find(
      (c) => c.concepto === concepto
    );
    return conceptoConfig ? conceptoConfig.orden : 999;
  }

  /**
   * Construye dinámicamente las columnas de DEBE y HABER basadas en el período
   * @param periodoDesde Mes de inicio (1-12)
   * @param periodoHasta Mes de fin (1-12)
   * @returns Objeto con las columnas de DEBE y HABER construidas
   */
  private construirColumnasPeriodo(
    periodoDesde: number,
    periodoHasta: number
  ): {
    columnasDebe: string;
    columnasHaber: string;
  } {
    const columnasDebe: string[] = [];
    const columnasHaber: string[] = [];

    for (let mes = periodoDesde; mes <= periodoHasta; mes++) {
      const mesFormateado = mes.toString().padStart(2, "0");

      // Columnas DEBE (DEBE_01, DEBE_02, etc.)
      columnasDebe.push(
        `SUM(TRY_CONVERT(FLOAT, ISNULL(DEBE_${mesFormateado}, 0)))`
      );

      // Columnas HABER (HABER01, HABER02, etc.)
      columnasHaber.push(
        `SUM(TRY_CONVERT(FLOAT, ISNULL(HABER${mesFormateado}, 0)))`
      );
    }

    return {
      columnasDebe: columnasDebe.join(" + "),
      columnasHaber: columnasHaber.join(" + "),
    };
  }
}
