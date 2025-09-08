// src/infrastructure/repositories/ReporteClipperLibroDiarioRepository.ts

import { injectable } from 'inversify';
import { QueryTypes } from 'sequelize';
import { exactusSequelize } from '../../infrastructure/database/config/exactus-database';
import { ClipperLibroDiario } from '../../domain/entities/LibroDiarioClipper';
import { IClipperLibroDiarioRepository } from '../../domain/repositories/IClipperLibroDiarioRepository';

@injectable()
export class ReporteClipperLibroDiarioRepository implements IClipperLibroDiarioRepository {
  
  /**
   * Obtiene los comprobantes contables según libro y mes.
   */
  async getComprobantes(libro: string, mes: string): Promise<ClipperLibroDiario[]> {
    try {
      const query = `
        SELECT 
          T1.NOMBRE AS CLASE,
          T1.LIBRO + '' + T1.CODIGO + '/' + T0.NUMERO AS NUMERO_COMPROBANTE,
          T2.NOMBRE,
          CASE 
            WHEN T0.TDOC <> '' THEN T0.TDOC + '/' + T0.NDOC
            ELSE ''
          END AS DOCUMENTO,
          T0.GLOSA,
          T0.MONTOD AS montoDebe,
          T0.MONTOH AS montoHaber
        FROM VOUCHER T0
        INNER JOIN LIBROS T1 ON T0.TIPOVOU = T1.CODIGO
        INNER JOIN PCGR T2 ON T0.CUENTA = T2.CUENTA
        WHERE T0.MES = :mes
          AND T1.LIBRO = :libro
        ORDER BY T0.NUMERO DESC
      `;

      const result = await exactusSequelize.query<ClipperLibroDiario>(query, {
        replacements: { mes, libro },
        type: QueryTypes.SELECT,
      });

      return result;
    } catch (error) {
      console.error('❌ Error al obtener comprobantes por libro y mes:', error);
      return [];
    }
  }

  /**
   * Agrupa comprobantes por número y calcula totales.
   */
  async getComprobantesAgrupados(libro: string, mes: string): Promise<{
    numeroComprobante: string;
    clase: string;
    totalDebe: number;
    totalHaber: number;
    detalles: ClipperLibroDiario[];
  }[]> {
    const comprobantes = await this.getComprobantes(libro, mes);

    const agrupado = comprobantes.reduce((acc, item) => {
      const key = item.numeroComprobante;

      if (!acc[key]) {
        acc[key] = {
          numeroComprobante: key,
          clase: item.clase,
          totalDebe: 0,
          totalHaber: 0,
          detalles: [],
        };
      }

      acc[key].totalDebe += item.montod ?? 0;
      acc[key].totalHaber += item.montoh ?? 0;
      acc[key].detalles.push(item);

      return acc;
    }, {} as Record<string, {
      numeroComprobante: string;
      clase: string;
      totalDebe: number;
      totalHaber: number;
      detalles: ClipperLibroDiario[];
    }>);

    return Object.values(agrupado);
  }

  /**
   * Obtiene el detalle de un comprobante específico por su número.
   */
  async getComprobantePorNumero(numeroComprobante: string): Promise<ClipperLibroDiario | null> {
    try {
      const partes = numeroComprobante.split('/');
      if (partes.length !== 2) {
        throw new Error(`Formato inválido de número de comprobante: "${numeroComprobante}". Debe ser 'D00/00001'.`);
      }
  
      const libroCodigo = partes[0] ?? '';
      const numero = partes[1];
  
      if (!libroCodigo) {
        throw new Error('Código de libro inválido o vacío.');
      }
  
      const codigo = libroCodigo.substring(1);
      const libro = libroCodigo[0];
  
      const query = `
        SELECT
          T1.NOMBRE AS CLASE,
          T1.LIBRO + '' + T1.CODIGO + '/' + T0.NUMERO AS NUMERO_COMPROBANTE,
          T2.NOMBRE,
          CASE
            WHEN T0.TDOC <> '' THEN T0.TDOC + '/' + T0.NDOC
            ELSE ''
          END AS DOCUMENTO,
          T0.GLOSA,
          T0.MONTOD AS montoDebe,
          T0.MONTOH AS montoHaber
        FROM VOUCHER T0
        INNER JOIN LIBROS T1 ON T0.TIPOVOU = T1.CODIGO
        INNER JOIN PCGR T2 ON T0.CUENTA = T2.CUENTA
        WHERE T1.LIBRO = :libro
          AND T1.CODIGO = :codigo
          AND T0.NUMERO = :numero
        ORDER BY T0.NUMERO DESC
      `;
  
      const result = await exactusSequelize.query<ClipperLibroDiario>(query, {
        replacements: { libro, codigo, numero },
        type: QueryTypes.SELECT,
      });
  
      return result[0] ?? null; // Aquí convertimos undefined a null
    } catch (error) {
      console.error('❌ Error al obtener detalle de comprobante:', error);
      return null;
    }
  }
  
  
  
}
