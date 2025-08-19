import { injectable } from 'inversify';
import { exactusSequelize } from '../database/config/exactus-database';
import { IReporteMensualCuentaCentroRepository } from '../../domain/repositories/IReporteMensualCuentaCentroRepository';
import { ReporteMensualCuentaCentroItem } from '../../domain/entities/ReporteMensualCuentaCentro';
import * as XLSX from 'xlsx';

function endOfMonthISO(anio: number, mesIndex0: number): string {
  const d = new Date(Date.UTC(anio, mesIndex0 + 1, 0, 0, 0, 0));
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

@injectable()
export class ReporteMensualCuentaCentroRepository implements IReporteMensualCuentaCentroRepository {
  async obtenerPorAnio(
    conjunto: string,
    anio: number,
    contabilidad: 'F' | 'A' = 'F'
  ): Promise<ReporteMensualCuentaCentroItem[]> {
    // Calcular fin de mes para 12 meses del año
    const meses = Array.from({ length: 12 }, (_, i) => endOfMonthISO(anio, i));
    const [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12] = meses as [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string
    ];

    // Construimos SQL siguiendo la lógica del query legado, devolviendo columnas por mes
    const sql = `
      WITH Movs AS (
        SELECT
          cta.cuenta_contable AS cuenta_contable,
          cta.descripcion AS desc_cuenta_contable,
          ctr.centro_costo AS centro_costo,
          ctr.descripcion AS desc_centro_costo,
          d.debito_LOCAL AS debito_local,
          d.credito_LOCAL AS credito_local,
          m.fecha AS fecha
        FROM ${conjunto}.asiento_de_diario m WITH (NOLOCK)
        INNER JOIN ${conjunto}.diario d WITH (NOLOCK) ON m.asiento = d.asiento
        INNER JOIN ${conjunto}.cuenta_contable cta WITH (NOLOCK) ON d.cuenta_contable = cta.cuenta_contable
        INNER JOIN ${conjunto}.centro_costo ctr WITH (NOLOCK) ON ctr.centro_costo = SUBSTRING(d.centro_costo, 1, 2) + '.00.00.00.00'
        WHERE m.fecha > '${anio - 1}-12-31 00:00:00' AND m.fecha <= '${anio}-12-31 23:59:59' AND m.contabilidad IN ('F','A')
        AND NOT EXISTS (SELECT 1 FROM ${conjunto}.proceso_cierre_cg pc WITH (NOLOCK) WHERE pc.asiento_apertura = m.asiento)
        UNION ALL
        SELECT
          cta.cuenta_contable,
          cta.descripcion,
          ctr.centro_costo,
          ctr.descripcion,
          0 AS debito_local,
          (m.debito_FISC_LOCAL - m.credito_FISC_LOCAL) AS credito_local, -- saldo fiscal neto
          m.fecha
        FROM ${conjunto}.SALDO m WITH (NOLOCK)
        INNER JOIN ${conjunto}.cuenta_contable cta WITH (NOLOCK) ON m.cuenta_contable = cta.cuenta_contable
        INNER JOIN ${conjunto}.centro_costo ctr WITH (NOLOCK) ON ctr.centro_costo = SUBSTRING(m.centro_costo, 1, 2) + '.00.00.00.00'
        WHERE m.fecha > '${anio - 1}-12-31 00:00:00' AND m.fecha <= '${anio}-12-31 23:59:59'
        UNION ALL
        SELECT
          cta.cuenta_contable,
          cta.descripcion,
          ctr.centro_costo,
          ctr.descripcion,
          m.debito_LOCAL,
          m.credito_LOCAL,
          m.fecha
        FROM ${conjunto}.mayor m WITH (NOLOCK)
        INNER JOIN ${conjunto}.cuenta_contable cta WITH (NOLOCK) ON m.cuenta_contable = cta.cuenta_contable
        INNER JOIN ${conjunto}.centro_costo ctr WITH (NOLOCK) ON ctr.centro_costo = SUBSTRING(m.centro_costo, 1, 2) + '.00.00.00.00'
        WHERE m.fecha > '${anio - 1}-12-31 00:00:00' AND m.fecha <= '${anio}-12-31 23:59:59' AND m.contabilidad IN ('F','A')
        AND EXISTS (SELECT 1 FROM ${conjunto}.proceso_cierre_cg pc WITH (NOLOCK) WHERE pc.asiento_apertura = m.asiento)
      )
      SELECT
        cuenta_contable,
        MAX(desc_cuenta_contable) AS desc_cuenta_contable,
        centro_costo,
        MAX(desc_centro_costo) AS desc_centro_costo,
        SUM(CASE WHEN fecha <= '${m1}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS enero,
        SUM(CASE WHEN fecha > '${m1}' AND fecha <= '${m2}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS febrero,
        SUM(CASE WHEN fecha > '${m2}' AND fecha <= '${m3}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS marzo,
        SUM(CASE WHEN fecha > '${m3}' AND fecha <= '${m4}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS abril,
        SUM(CASE WHEN fecha > '${m4}' AND fecha <= '${m5}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS mayo,
        SUM(CASE WHEN fecha > '${m5}' AND fecha <= '${m6}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS junio,
        SUM(CASE WHEN fecha > '${m6}' AND fecha <= '${m7}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS julio,
        SUM(CASE WHEN fecha > '${m7}' AND fecha <= '${m8}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS agosto,
        SUM(CASE WHEN fecha > '${m8}' AND fecha <= '${m9}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS setiembre,
        SUM(CASE WHEN fecha > '${m9}' AND fecha <= '${m10}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS octubre,
        SUM(CASE WHEN fecha > '${m10}' AND fecha <= '${m11}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS noviembre,
        SUM(CASE WHEN fecha > '${m11}' AND fecha <= '${m12}' THEN ISNULL(debito_local,0) - ISNULL(credito_local,0) ELSE 0 END) AS diciembre
      FROM Movs
      GROUP BY cuenta_contable, centro_costo
      ORDER BY cuenta_contable, centro_costo
    `;

    const [rows] = await exactusSequelize.query(sql);

    const data = (rows as any[]).map((r) => ({
      cuentaContable: r['cuenta_contable'] || '',
      descCuentaContable: r['desc_cuenta_contable'] || '',
      centroCosto: r['centro_costo'] || '',
      descCentroCosto: r['desc_centro_costo'] || '',
      enero: Number(r['enero'] || 0),
      febrero: Number(r['febrero'] || 0),
      marzo: Number(r['marzo'] || 0),
      abril: Number(r['abril'] || 0),
      mayo: Number(r['mayo'] || 0),
      junio: Number(r['junio'] || 0),
      julio: Number(r['julio'] || 0),
      agosto: Number(r['agosto'] || 0),
      setiembre: Number(r['setiembre'] || 0),
      octubre: Number(r['octubre'] || 0),
      noviembre: Number(r['noviembre'] || 0),
      diciembre: Number(r['diciembre'] || 0),
      mes1: m1.slice(0, 10),
      mes2: m2.slice(0, 10),
      mes3: m3.slice(0, 10),
      mes4: m4.slice(0, 10),
      mes5: m5.slice(0, 10),
      mes6: m6.slice(0, 10),
      mes7: m7.slice(0, 10),
      mes8: m8.slice(0, 10),
      mes9: m9.slice(0, 10),
      mes10: m10.slice(0, 10),
      mes11: m11.slice(0, 10),
      mes12: m12.slice(0, 10)
    })) as ReporteMensualCuentaCentroItem[];

    return data;
  }

  async exportarExcel(conjunto: string, anio: number, contabilidad: 'F' | 'A' = 'F'): Promise<Buffer> {
    try {
      console.log(`Generando Excel de reporte mensual para conjunto ${conjunto}, año ${anio}`);
      
      // Obtener todos los datos para el Excel
      const datos = await this.obtenerPorAnio(conjunto, anio, contabilidad);
      
      // Preparar los datos para Excel
      const excelData = datos.map(item => ({
        'Cuenta Contable': item.cuentaContable || '',
        'Descripción Cuenta': item.descCuentaContable || '',
        'Centro Costo': item.centroCosto || '',
        'Descripción Centro Costo': item.descCentroCosto || '',
        'Enero': Number(item.enero || 0),
        'Febrero': Number(item.febrero || 0),
        'Marzo': Number(item.marzo || 0),
        'Abril': Number(item.abril || 0),
        'Mayo': Number(item.mayo || 0),
        'Junio': Number(item.junio || 0),
        'Julio': Number(item.julio || 0),
        'Agosto': Number(item.agosto || 0),
        'Setiembre': Number(item.setiembre || 0),
        'Octubre': Number(item.octubre || 0),
        'Noviembre': Number(item.noviembre || 0),
        'Diciembre': Number(item.diciembre || 0)
      }));

      // Calcular totales por mes
      const totalesMensuales = {
        enero: datos.reduce((sum, item) => sum + (item.enero || 0), 0),
        febrero: datos.reduce((sum, item) => sum + (item.febrero || 0), 0),
        marzo: datos.reduce((sum, item) => sum + (item.marzo || 0), 0),
        abril: datos.reduce((sum, item) => sum + (item.abril || 0), 0),
        mayo: datos.reduce((sum, item) => sum + (item.mayo || 0), 0),
        junio: datos.reduce((sum, item) => sum + (item.junio || 0), 0),
        julio: datos.reduce((sum, item) => sum + (item.julio || 0), 0),
        agosto: datos.reduce((sum, item) => sum + (item.agosto || 0), 0),
        setiembre: datos.reduce((sum, item) => sum + (item.setiembre || 0), 0),
        octubre: datos.reduce((sum, item) => sum + (item.octubre || 0), 0),
        noviembre: datos.reduce((sum, item) => sum + (item.noviembre || 0), 0),
        diciembre: datos.reduce((sum, item) => sum + (item.diciembre || 0), 0)
      };

      // Agregar fila de totales
      const totalRow = {
        'Cuenta Contable': '',
        'Descripción Cuenta': '',
        'Centro Costo': '',
        'Descripción Centro Costo': '',
        'Enero': totalesMensuales.enero,
        'Febrero': totalesMensuales.febrero,
        'Marzo': totalesMensuales.marzo,
        'Abril': totalesMensuales.abril,
        'Mayo': totalesMensuales.mayo,
        'Junio': totalesMensuales.junio,
        'Julio': totalesMensuales.julio,
        'Agosto': totalesMensuales.agosto,
        'Setiembre': totalesMensuales.setiembre,
        'Octubre': totalesMensuales.octubre,
        'Noviembre': totalesMensuales.noviembre,
        'Diciembre': totalesMensuales.diciembre
      };

      // Agregar fila vacía antes del total
      const emptyRow = {
        'Cuenta Contable': '',
        'Descripción Cuenta': '',
        'Centro Costo': '',
        'Descripción Centro Costo': '',
        'Enero': '',
        'Febrero': '',
        'Marzo': '',
        'Abril': '',
        'Mayo': '',
        'Junio': '',
        'Julio': '',
        'Agosto': '',
        'Setiembre': '',
        'Octubre': '',
        'Noviembre': '',
        'Diciembre': ''
      };

      // Combinar datos con totales
      const finalData = [...excelData, emptyRow, totalRow];

      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Crear la hoja principal con los datos
      const worksheet = XLSX.utils.json_to_sheet(finalData);
      
      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 20 }, // Cuenta Contable
        { wch: 40 }, // Descripción Cuenta
        { wch: 20 }, // Centro Costo
        { wch: 40 }, // Descripción Centro Costo
        { wch: 12 }, // Enero
        { wch: 12 }, // Febrero
        { wch: 12 }, // Marzo
        { wch: 12 }, // Abril
        { wch: 12 }, // Mayo
        { wch: 12 }, // Junio
        { wch: 12 }, // Julio
        { wch: 12 }, // Agosto
        { wch: 12 }, // Setiembre
        { wch: 12 }, // Octubre
        { wch: 12 }, // Noviembre
        { wch: 12 }  // Diciembre
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, `Reporte Mensual ${anio}`);
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log('Archivo Excel de reporte mensual generado exitosamente');
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel de reporte mensual:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
