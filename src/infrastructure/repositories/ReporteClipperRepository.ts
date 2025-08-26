// src/infrastructure/repositories/ReporteClipperRepository.ts
import { injectable } from 'inversify';
import { CabeceraContrato, ClipperContrato, ClipperContratoDetalle, Comision, CuentaCorriente, DetalleArticulo, Factbol, NotaContable, Pago, Sepelio } from '../../domain/entities/ClipperContrato';
import { QueryTypes } from 'sequelize';
import { IReporteClipperRepository } from '../../domain/repositories/IReporteClipperRepository';
import { clipperDatabases } from '../database/config/clipper-database';

@injectable()
export class ReporteClipperRepository implements IReporteClipperRepository {
  async obtenerContratos(ruta: string): Promise<ClipperContrato[]> {
    try {
      // Validar que la ruta sea válida y exista conexión
      if (!['clipper-lurin', 'clipper-tacna', 'clipper-lima'].includes(ruta)) {
        throw new Error('Ruta no válida');
      }

      // Obtener la instancia Sequelize según la ruta
      const rutaKey = ruta as keyof typeof clipperDatabases;
      const sequelizeInstance = clipperDatabases[rutaKey];
      if (!sequelizeInstance) {
        throw new Error(`No se encontró conexión para la ruta: ${ruta}`);
      }

      // Define los queries según la ruta
      let query = '';
      switch (ruta) {
        case 'clipper-lurin':
          query = `
            SELECT
              T0.NO_CONT + '/' + T0.CONTROL AS contratoControl,
              T0.SECTOR + ' ' + T0.ESPACIO AS sectorEspacio,
              '' AS codigoTumba,
              T1.APELLIDOS + ' ' + T1.NOMBRE AS cliente,
              T0.NO_CONT as contrato,
              T0.CONTROL as control
            FROM Ventas T0
            LEFT JOIN CLIENTES T1 ON T0.CLIENTE = T1.CODIGO
            WHERE T0.NO_CONT <> 0;
          `;
          break;

          case 'clipper-tacna':
            query = `   
                SELECT T0.CODCNT + '/' + T0.CODCTL AS contratoControl,		
                DESPLA AS sectorEspacio,        
                T0.CODSEC AS codigoTumba,       
                 T0.APPCLI + ' ' + T0.APMCLI + ' ' + T0.NOMCLI AS cliente,
                 T0.CODCNT AS contrato,
                 T0.CODCTL AS control   
                 FROM PDRCO0 T0        
                 LEFT JOIN  mplt01 T1 ON T1.TIPPLA = T0.CODPLA;
            `;
            break;
          

        case 'clipper-lima':
          // Reemplaza con el query para Lima cuando lo tengas
          query = `
          SELECT 
              T0.CODCNT + '/' + T0.CODCTL AS contratoControl,
              T1.DESITM AS sectorEspacio,
              T0.CODSEC AS codigoTumba,
              T0.APPCLI + ' ' + T0.APMCLI + ' ' + T0.NOMCLI AS cliente,
              T0.CODCNT AS contrato,
              T0.CODCTL AS control
          FROM PDRCO0 T0
          LEFT JOIN TPDR01 T1 
              ON T1.CODITM = T0.TIPLOT 
              AND T1.CODTAB = '13';
      `;
      break;
      }

      // Ejecutar el query en la conexión correcta
      const results = await sequelizeInstance.query(query, {
        type: QueryTypes.SELECT,
      });

      return results as ClipperContrato[];
    } catch (error) {
      console.error('Error obteniendo contratos:', error);
      throw new Error(`Error al obtener contratos: ${error}`);
    }
  }
  async obtenerContratoPorId(
    ruta: string,
    contrato: string,
    control: string
  ): Promise<ClipperContratoDetalle | null> {
    try {
      if (!['clipper-lurin', 'clipper-tacna', 'clipper-lima'].includes(ruta)) {
        throw new Error('Ruta no válida');
      }

      const rutaKey = ruta as keyof typeof clipperDatabases;
      const sequelizeInstance = clipperDatabases[rutaKey];

      if (!sequelizeInstance) {
        throw new Error(`No se encontró conexión para la ruta: ${ruta}`);
      }

      let query = '';

      switch (ruta) {
        case 'clipper-lurin':
          // ============================ CABECERA ============================
          const cabeceraQuery = `
            SELECT DISTINCT
              T0.NO_CONT + '/' + T0.CONTROL AS contratoControl,
              T3.TT00_DESC AS tipo,
              T0.SECTOR + ' ' + T0.ESPACIO AS sector,
              T1.CODIGO + ' ' + T1.APELLIDOS + ' ' + T1.NOMBRE AS cliente,
              T2.CODIGO + ' ' + T2.APELLIDOS + ' ' + T2.NOMBRE AS consejero,
              FECHA_V AS venta,
              PRECIO AS precio,
              GASTOS AS gasto,
              CAST(PRECIO AS FLOAT) + CAST(GASTOS AS FLOAT) AS total,
              T0.ESCOGIDO AS escogido,
              T0.LETRAS AS letras,
              T0.FORMA AS producto,
              FECHA_ANU AS anulado
            FROM Ventas T0
            INNER JOIN CLIENTES T1 ON T0.CLIENTE = T1.CODIGO
            INNER JOIN VENDEDOR T2 ON T0.VENDEDOR = T2.CODIGO
            INNER JOIN Tt000000 T3 ON T0.TIPO = T3.TT00_CODI AND T3.TT00_TIPO = '001'
            WHERE T0.NO_CONT = :contrato AND T0.CONTROL = :control;
          `;
        
          // ============================ DETALLE ARTÍCULO ============================
          const detalleArticuloQuery = `
            SELECT DISTINCT
              T3.ARTICULO AS articulo,
              T3.DESCRIPC AS desArticulo,
              T3.VAL_VTA AS valorVenta,
              '' AS fondo,
              T3.CANON AS canon,
              ROUND(CAST(T3.VAL_VTA AS FLOAT) * (CAST(T3.IGV AS FLOAT) / 100.0), 2) AS igv,
              T3.PRE_NET AS precNeto
            FROM Ventas T0
            INNER JOIN CLIENTES T1 ON T0.CLIENTE = T1.CODIGO
            INNER JOIN VENDEDOR T2 ON T0.VENDEDOR = T2.CODIGO
            INNER JOIN DETALLE T3 ON T0.NO_CONT = T3.CONTRATO
            WHERE T0.NO_CONT = :contrato AND T0.CONTROL = :control;
          `;
        
          // ============================ CUENTA CORRIENTE ============================
          const cuentaCorrienteQuery = `
            SELECT
              TT00_DESC AS tipoDescripcion,
              T4.NO_LETRA AS numLetra,
              T4.NO_SEC AS numSec,
              T4.FECHA AS fecha,
              CAST(MONTO AS FLOAT) AS monto,
              CAST(SALDO AS FLOAT) AS saldo,
              CASE 
                WHEN ESTADO = 'C' THEN 'CANCELADO'
                WHEN ESTADO = 'A' THEN 'ANULADO'
                ELSE NULL
              END AS estado
            FROM CTA_CTE T4
            INNER JOIN Tt000000 T5 ON T4.TIPO_DOC = T5.TT00_CODI AND T5.TT00_TIPO = '019'
            WHERE T4.NO_CONT = :contrato AND T4.CONTROL = :control
            ORDER BY T4.ESTADO DESC;
          `;
        
          // ============================ NOTAS CONTABLES ============================
          const notasContablesQuery = `
            SELECT
              T6.TT00_DESC AS tipo,
              T5.NUMERO AS numero,
              T5.FECHA AS fecha,
              T5.DESCRIPCIO AS descripcion,
              CAST(T5.IMPORTE AS FLOAT) AS importe,
              CAST(T5.IGV AS FLOAT) AS igv,
              T5.CANON AS canon
            FROM Not_cont T5
            INNER JOIN Tt000000 T6 ON T6.TT00_CODI = T5.TIPO AND T6.TT00_TIPO = '009'
            WHERE T5.CONTRATO = :contrato AND T5.CONTROL = :control;
          `;
        
          // ============================ PAGOS ============================
          const pagosQuery = `
            SELECT
              T11.TT00_DESC AS tipoDescrip,
              T10.NO_LETRA AS numeroLetra,
              T10.NO_SEC AS secuencia,
              T10.VENCE + ' => ' + T10.FECHA_P AS vencePago,
              CAST(T10.MONTO AS FLOAT) AS monto,
              CAST(T10.CANON AS FLOAT) AS canon,
              T10.RECIBO AS recibo
            FROM PAGOS T10
            INNER JOIN Tt000000 T11 ON T11.TT00_CODI = T10.TIPO_DOC AND T11.TT00_TIPO = '019'
            WHERE T10.NO_CONT = :contrato AND T10.CONTROL = :control;
          `;
        
          // ============================ COMISIONES ============================
          const comisionesQuery = `
            SELECT
              T6.VENDEDOR AS codVendedor,
              T7.APELLIDOS + ' ' + T7.NOMBRE AS nomVendedor,
              COALESCE(NULLIF(CAST(ISNULL(T6.NRO_PARTE, 0) AS VARCHAR), ''), '0') + '/' +
              COALESCE(NULLIF(CAST(ISNULL(T6.NRO_PARTES, 0) AS VARCHAR), ''), '0') AS parte,
              T6.FECHA AS fechaComision,
              T6.COMISION AS comision,
              T8.TT00_DESC AS estadoComision
            FROM Com_vend T6
            INNER JOIN VENDEDOR T7 ON T6.VENDEDOR = T7.CODIGO
            INNER JOIN Tt000000 T8 ON T6.ESTADO = T8.TT00_CODI AND T8.TT00_TIPO = '003'
            WHERE T6.NO_CONT = :contrato AND T6.CONTROL = :control;
          `;
        
          // ============================ FACTURA / BOLETAS ============================
          const factbolQuery = `
            SELECT
              TIPO AS tipoFacBol,
              NRO_DOC AS numFacBol,
              FECHA_DOC AS fechaDoc,
              MONEDA AS monedaFacBol,
              SERVICIO AS servicioFacBol,
              ESPACIO AS espacioFacBol,
              FONDO AS fondoFacBol,
              IGV AS igvFacBol,
              CANON AS canonFacBol,
              TIPOCA AS tipocamFacBol
            FROM Factbol T8
            INNER JOIN Tt000000 T9 ON T8.TIPO = T9.TT00_CODI AND T9.TT00_TIPO = '022'
            WHERE T8.CONTROL = :control;
          `;
        
          // ============================ SEPELIOS ============================
          const sepeliosQuery = `
            SELECT
              T9.NUMERO AS ordenSepelio,
              T9.NIVEL AS nivelSepelio,
              T9.APELLIDOS + ' ' + T9.NOMBRE AS nomSepelio,
              T9.FECHA_N AS fallecidoSepelio,
              T9.FECHA_E AS entierroSepelio,
              T9.DOCUME AS documentoSepelio
            FROM Occisos T9
            WHERE T9.CONTRATO = :contrato AND T9.CONTROL = :control;
          `;
        
          // ============================ EJECUCIÓN ============================
          const [cabecera] = await sequelizeInstance.query(cabeceraQuery, { type: QueryTypes.SELECT, replacements: { contrato, control } });
          const detalleArticulo = await sequelizeInstance.query(detalleArticuloQuery, { type: QueryTypes.SELECT, replacements: { contrato, control } });
          const cuentaCorriente = await sequelizeInstance.query(cuentaCorrienteQuery, { type: QueryTypes.SELECT, replacements: { contrato, control } });
          const notasContables = await sequelizeInstance.query(notasContablesQuery, { type: QueryTypes.SELECT, replacements: { contrato, control } });
          const pagos = await sequelizeInstance.query(pagosQuery, { type: QueryTypes.SELECT, replacements: { contrato, control } });
          const comisiones = await sequelizeInstance.query(comisionesQuery, { type: QueryTypes.SELECT, replacements: { contrato, control } });
          const factbol = await sequelizeInstance.query(factbolQuery, { type: QueryTypes.SELECT, replacements: { contrato, control } });
          const sepelios = await sequelizeInstance.query(sepeliosQuery, { type: QueryTypes.SELECT, replacements: { contrato, control } });
        
          return {
            cabecera: cabecera as CabeceraContrato,
            detalleArticulo: detalleArticulo as DetalleArticulo[],
            cuentaCorriente: cuentaCorriente as CuentaCorriente[],
            notasContables: notasContables as NotaContable[],
            pagos: pagos as Pago[],
            comisiones: comisiones as Comision[],
            factbol: factbol as Factbol[],
            sepelios: sepelios as Sepelio[],
          };

        case 'clipper-tacna':
          query = `
            SELECT
              T0.CODCNT + '/' + T0.CODCTL AS contratoControl,
              DESPLA AS sectorEspacio,
              T0.CODSEC AS codigoTumba,
              T0.APPCLI + ' ' + T0.APMCLI + ' ' + T0.NOMCLI AS cliente,
              T0.CODCNT AS contrato,
              T0.CODCTL AS control
            FROM PDRCO0 T0
            LEFT JOIN mplt01 T1 ON T1.TIPPLA = T0.CODPLA
            WHERE T0.CODCNT = :contrato AND T0.CODCTL = :control;
          `;
          break;

        case 'clipper-lima':
          query = `
            SELECT
              T0.CODCNT + '/' + T0.CODCTL AS contratoControl,
              T1.DESITM AS sectorEspacio,
              T0.CODSEC AS codigoTumba,
              T0.APPCLI + ' ' + T0.APMCLI + ' ' + T0.NOMCLI AS cliente,
              T0.CODCNT AS contrato,
              T0.CODCTL AS control
            FROM PDRCO0 T0
            LEFT JOIN TPDR01 T1 ON T1.CODITM = T0.TIPLOT AND T1.CODTAB = '13'
            WHERE T0.CODCNT = :contrato AND T0.CODCTL = :control;
          `;
          break;
      }

      const results = await sequelizeInstance.query(query, {
        type: QueryTypes.SELECT,
        replacements: { contrato, control },
      });

      return results.length ? (results[0] as ClipperContratoDetalle) : null;
    } catch (error) {
      console.error('Error al obtener contrato por control:', error);
      throw new Error(`Error al obtener contrato por control: ${error}`);
    }
  }
}
