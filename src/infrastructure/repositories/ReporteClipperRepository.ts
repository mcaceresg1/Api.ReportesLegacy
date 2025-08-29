// src/infrastructure/repositories/ReporteClipperRepository.ts
import { injectable } from 'inversify';
import { BeneficiarioContrato, CabeceraContrato, ClipperContrato, ClipperContratoDetalle, ClipperContratoLima, ClipperContratoTacna, Comision, ComprobantesEmitidos, CuentaCorriente, DetalleArticulo, DetalleAsistencia, DetalleEspacio, Factbol, Fallecido, NotaContable, Pago, PagosCaja, Sepelio, SubDetalleAsistencia } from '../../domain/entities/ClipperContrato';
import { QueryTypes } from 'sequelize';
import { IReporteClipperRepository } from '../../domain/repositories/IReporteClipperRepository';
import { clipperDatabases } from '../database/config/clipper-database';


export type ClipperContratoResultado =
  | ClipperContratoDetalle     // Lurin
  | ClipperContratoLima        // Lima
  | ClipperContratoTacna;      // Tacna

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
    contrato: string | null,
    control: string | null
  ): Promise<ClipperContratoResultado | null> {
    try {
      console.log(`🔍 [ReporteClipperRepository] Buscando contrato - Ruta: ${ruta}, Contrato: ${contrato}, Control: ${control}`);
      
      if (!['clipper-lurin', 'clipper-tacna', 'clipper-lima'].includes(ruta)) {
        throw new Error('Ruta no válida');
      }

      const rutaKey = ruta as keyof typeof clipperDatabases;
      const sequelizeInstance = clipperDatabases[rutaKey];

      if (!sequelizeInstance) {
        throw new Error(`No se encontró conexión para la ruta: ${ruta}`);
      }

      console.log(`🔍 [ReporteClipperRepository] Conexión encontrada para ruta: ${ruta}`);

      console.log(`🔍 [ReporteClipperRepository] Conexión encontrada para ruta: ${ruta}`);

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

        case 'clipper-lima':
          // ============================ CABECERA ============================
          const cabeceraQueryLima = `
             SELECT     
               T0.APPCLI + ' ' + T0.APMCLI + ' ' + T0.NOMCLI AS cliente,
               T0.DIRCLI AS direccion,
               '' AS nombreEmpresa,
               T0.DIROFI AS direccionOficina,
               T5.DESITM AS estadoCivil,
               T1.DESITM AS sexo,
               T0.ELECLI AS dni,
               T0.PASCLI AS pasaporteCliente,
               T0.RUCCLI AS rucCliente,
               T2.DESITM AS codigoPostal,
               T0.TE1CLI AS telfCliente,
               T0.TE3CLI AS telfOpcional,
               T0.TE2CLI AS telOficina,
               T0.FCHPRC AS fechaRecepcion,
               T3.DESITM AS sector,
               T0.CODSEC AS codigoSector,
               T4.DESITM AS tipoEspacioOrig,
               T0.EMAILP AS emailPersonal,
               T6.APPACE + ' ' + T6.APMACE + ' ' + T6.NOMACE AS aceptante,
               T6.DIRACE AS direccionAceptante,
               T7.DESITM AS distritoAceptante,
               T6.TELACE AS telAceptante,
               T8.APPGAR + ' ' + T8.APMGAR + ' ' + T8.NOMGAR AS garante,
               T8.DIRGAR AS direcGarante
             FROM PDRCO0 T0
             LEFT JOIN TPDR01 T1 ON T0.SEXCLI = T1.CODITM AND T1.CODTAB = '12'
             LEFT JOIN TPDR01 T2 ON T0.POSCLI = T2.CODITM AND T2.CODTAB = '11'
             LEFT JOIN TPDR01 T3 ON T0.CODPLA = T3.CODITM AND T3.CODTAB = '13'
             LEFT JOIN TPDR01 T4 ON T0.TIPLOT = T4.CODITM AND T4.CODTAB = '02'
             LEFT JOIN TPDR01 T5 ON T0.ESTCLI = T5.CODITM AND T5.CODTAB = '09'
             LEFT JOIN PDRLC0 T6 ON T0.CODCNT = T6.CODCNT
             LEFT JOIN TPDR01 T7 ON T6.POSACE = T7.CODITM AND T7.CODTAB = '11'
             LEFT JOIN PDRLC0 T8 ON T0.CODCNT = T8.CODCNT
             WHERE T0.CODCNT = :contrato AND T0.CODCTL = :control;
           `;
          const queryDetalleEspacios = `
                SELECT     
                  T1.DESITM AS tipoEspacio,     
                  T2.DESITM AS sector,     
                  T0.CODSEC AS codigoSector,     
                  T0.FCHESC AS fechaEspacio,     
                  T0.NUMNIV AS numroNivel
                FROM dbo.PDRCO9 T0
                LEFT JOIN TPDR01 T1 ON T0.TIPLOT = T1.CODITM AND T1.CODTAB = '89'
                LEFT JOIN TPDR01 T2 ON T0.CODPLA = T2.CODITM AND T2.CODTAB = '13'
                WHERE T0.CODCNT = :contrato;
              `;
          ///*****************************DETALLE ASISTENCIA */
          const queryDetalle = `
              SELECT
                  '' AS concepto,
                  T2.DESITM AS proced,
                  '' AS agenciaFuneraria,
                  CASE WHEN CODAGE <> '' THEN (SELECT TT.NOMFUN FROM PDRVE5 TT WHERE T0.CODVEN = TT.CODFU1)
                    ELSE  (SELECT TQ.NOMVEN FROM PDRVE0 TQ WHERE T0.CODVEN = TQ.CODVEN)
                  END AS consejero,
                  '' AS supervisor,
                  T0.FCHPAG AS fechaPago,
                  T4.DESITM AS formaPago,
                  T5.DESITM AS tipoAfect,
                  CAST(T0.MONPAG AS FLOAT) AS estipFunerario,
                  CAST(T0.MONINI AS FLOAT) AS aporteInicial,
                  CAST(T0.MONPAG AS FLOAT) - CAST(T0.MONINI AS FLOAT) AS estipMensual,
                  T6.DESITM AS estado
              FROM dbo.PDRCO1 T0
              LEFT JOIN TPDR01 T2 ON T0.PROPAG = T2.CODITM AND T2.CODTAB = '18'
              LEFT JOIN TPDR01 T4 ON T0.FORPAG = T4.CODITM AND T4.CODTAB = '08'
              LEFT JOIN TPDR01 T5 ON T0.TIPVTA = T5.CODITM AND T5.CODTAB = '03'
              LEFT JOIN TPDR01 T6 ON T0.ESTPAG = T6.CODITM AND T6.CODTAB = '01'
              WHERE T0.CODCNT = :contrato;
              `;

          const querySubDetalle = `
            SELECT
                '' AS aceptante,
                T0.CODLET AS codigoLetra,
                T0.CODBAN AS banco,
                T0.FCHVEN AS fechaVencimiento,
                T0.MONLET AS importePagado,
                T0.FCHCAN AS fechaCancelacion,
                T1.DESITM AS estadoLetra,
                T0.MONPAG AS montoPagado,
                CAST(T0.MONLET AS FLOAT) - CAST(T0.MONPAG AS FLOAT) AS saldo,
                T2.DESITM AS ubicacion,
                SUM(CAST(T0.MONLET AS FLOAT)) AS estipendoMensual,
                SUM(CAST(T0.MONPAG AS FLOAT)) AS totalAbonoEfectivo,
                0 AS totalAbonado,
                0 AS totalDescuento
            FROM dbo.PDRLC1 T0
            LEFT JOIN TPDR01 T1 ON T0.ESTLET = T1.CODITM AND T1.CODTAB = '25'
            LEFT JOIN TPDR01 T2 ON T0.SITLET = T2.CODITM AND T2.CODTAB = '94'
            WHERE T0.CODCNT = :contrato
            GROUP BY
                T0.CODLET,
                T0.CODBAN,
                T0.FCHVEN,
                T0.MONLET,
                T0.FCHCAN,
                T1.DESITM,
                T0.MONPAG,
                T2.DESITM
            ORDER BY T0.CODLET ASC;
            `;

          const queryComprobantes = `
          SELECT
              T1.DESITM AS documento,
              T0.CODCMP + '-' + T0.NROCMP AS numero,
              CONVERT(VARCHAR(10), T0.FCHCMP, 103) AS fecha,
              'US$.' AS moneda,
              CAST(T0.MONCMP AS FLOAT) AS monto,
              CAST(T0.CAMCMP AS FLOAT) AS tipoCambio,
              ROUND(CAST(T0.MONCMP AS FLOAT) * CAST(T0.CAMCMP AS FLOAT), 2) AS enSoles,
              T2.DESITM AS concepto,
              T3.DESITM AS estado
          FROM PDRLC5 T0
          LEFT JOIN TPDR01 T1 ON T0.TIPCMP = T1.CODITM AND T1.CODTAB = '34'
          LEFT JOIN TPDR01 T2 ON T0.DETCMP = T2.CODITM AND T2.CODTAB = '81'
          LEFT JOIN TPDR01 T3 ON T0.ESTCMP = T3.CODITM AND T3.CODTAB = '46'
          WHERE T0.CODCNT = :contrato;
          `;

          const queryPagosCaja = `
          SELECT
              T0.FCHREG AS fechaRegistro,
              T1.DESITM AS condicionVenta,
              T2.DESITM AS tipoPago,
              T0.IMPTOT AS importeTotal
          FROM dbo.PDRNC2 T0
          LEFT JOIN TPDR01 T1 ON T0.CONVTA = T1.CODITM AND T1.CODTAB = '07'
          LEFT JOIN TPDR01 T2 ON T0.TIPPAG = T2.CODITM AND T2.CODTAB = '52'
          WHERE T0.CODCNT = :contrato;
          `;
          const queryBeneficiarioContrato = `
            SELECT
                T0.APPBEN + ' ' + T0.APMBEN + ' ' + T0.NOMBEN AS beneficiario,
                T0.FCHNAC AS fechaNacimientoBeneficiario,
                T0.DOCIDE AS dniBeneficiario,
                T0.TELBEN AS telefBeneficiario,
                T1.DESITM AS estadoCivilBeneficiario,
                T2.DESITM AS sexoBeneficiario
            FROM dbo.PDRCO5 T0
            LEFT JOIN TPDR01 T1 ON T0.CIVBEN = T1.CODITM AND T1.CODTAB = '09'
            LEFT JOIN TPDR01 T2 ON T0.SEXBEN = T2.CODITM AND T2.CODTAB = '12'
            WHERE T0.CODCNT = :contrato;
            `;

          const queryFallecido = `
              SELECT
                  T0.APPFAL + ' ' + T0.APMFAL + ' ' + T0.NOMFAL AS nomFallecido,
                  T0.FCHENT AS fechaEntierro,
                  T5.DESITM AS estadoCivilFallecido,
                  T1.DESITM AS sexoFallecido,
                  T3.DESITM AS plataformaFallecido,
                  T0.CODSEC AS sectorFallecido,
                  T4.DESITM AS tipoEspacioFallecido,
                  T2.DESITM AS nivelFallecido,
                  T6.DESITM AS medidaFallecido,
                  T0.AGEENT AS agenciaFallecido
              FROM dbo.PDRPL1 T0
              LEFT JOIN TPDR01 T1 ON T0.SEXFAL = T1.CODITM AND T1.CODTAB = '12'
              LEFT JOIN TPDR01 T2 ON T0.NIVLOT = T2.CODITM AND T2.CODTAB = '30'
              LEFT JOIN TPDR01 T3 ON T0.TIPPLA = T3.CODITM AND T3.CODTAB = '13'
              LEFT JOIN TPDR01 T4 ON T0.TIPLOT = T4.CODITM AND T4.CODTAB = '02'
              LEFT JOIN TPDR01 T5 ON T0.ESTFAL = T5.CODITM AND T5.CODTAB = '09'
              LEFT JOIN TPDR01 T6 ON T0.TAMLOT = T6.CODITM AND T6.CODTAB = '32'
              WHERE T0.CODCNT = :contrato
              ORDER BY T0.FCHENT ASC;
              `;

          // ============================ EJECUCIÓN ============================
          const [cabeceraLima] = await sequelizeInstance.query(cabeceraQueryLima, { type: QueryTypes.SELECT, replacements: { contrato, control } });
          const detalleEspacio = await sequelizeInstance.query(queryDetalleEspacios, { type: QueryTypes.SELECT, replacements: { contrato, control } });
          const [detalle, subDetalle, comprobantes, pagosCaja] = await Promise.all([
            sequelizeInstance.query(queryDetalle, { type: QueryTypes.SELECT, replacements: { contrato } }),
            sequelizeInstance.query(querySubDetalle, { type: QueryTypes.SELECT, replacements: { contrato } }),
            sequelizeInstance.query(queryComprobantes, { type: QueryTypes.SELECT, replacements: { contrato } }),
            sequelizeInstance.query(queryPagosCaja, { type: QueryTypes.SELECT, replacements: { contrato } }),
          ]);
          const detalleAsistencia: DetalleAsistencia = {
            ...detalle[0],        // Datos principales del detalle
            subDetalle: subDetalle as SubDetalleAsistencia[],   // Array de subdetalle
            comprobantes: comprobantes as ComprobantesEmitidos[], // Array de comprobantes
            pagosCaja: pagosCaja as PagosCaja[],                // Array de pagosCaja
          };
          const beneficiarios = await sequelizeInstance.query(queryBeneficiarioContrato, { type: QueryTypes.SELECT, replacements: { contrato }, });

          // Ejecutar query de fallecidos
          const fallecidos = await sequelizeInstance.query(queryFallecido, { type: QueryTypes.SELECT, replacements: { contrato }, });
          return {
            cabecera: cabeceraLima as CabeceraContrato,
            detalleEspacio: detalleEspacio as DetalleEspacio[],
            detalleAsistencia,
            beneficiarios: beneficiarios as BeneficiarioContrato[],
            fallecidos: fallecidos as Fallecido[],
          };
          break;
        case 'clipper-tacna':
          // ============================ CABECERA ============================
          const cabeceraQueryTacna = `
            SELECT                   T0.APPCLI + ' ' + T0.APMCLI + ' ' + T0.NOMCLI AS cliente, 
                         T0.DIRCLI AS direccion,              '' AS nombreEmpresa,            

                           T0.DIROFI AS direccionOficina,              '' AS estadoCivil,        
                                 CASE WHEN T0.SEXCLI = '0' THEN  'Masculino'				   
                                 WHEN T0.SEXCLI = '1' THEN 'Femenino'				  
                                  ELSE null END AS sexo,              
                                  T0.ELECLI AS dni,             
                                   T0.PASCLI AS pasaporteCliente,          
                                   T0.RUCCLI AS rucCliente,       
                                   '' AS codigoPostal,          
                                    T0.TE1CLI AS telfCliente,       
                                   '' AS telfOpcional,  
                                     T0.TE2CLI AS telOficina,  
                                     T0.FCHPRC AS fechaRecepcion,     
                                     T0.CODSECORI AS sector,       
                                     T0.CODSEC AS codigoSector,      
                                     '' AS tipoEspacioOrig,        
                                       '' AS emailPersonal,     
                                       T6.APPACE + ' ' + T6.APMACE + ' ' + T6.NOMACE AS aceptante,  
                                       T6.DIRACE AS direccionAceptante,             
                                        '' AS distritoAceptante,              
                                        T6.TELACE AS telAceptante,              
                                        T8.APPGAR + ' ' + T8.APMGAR + ' ' + T8.NOMGAR AS garante,              
                                        T8.DIRGAR AS direcGarante           
                                       FROM PDRCO0 T0            
                                       LEFT JOIN PDRLC0 T6 ON T0.CODCNT = T6.CODCNT            
                                       LEFT JOIN PDRLC0 T8 ON T0.CODCNT = T8.CODCNT
            WHERE 
            (:contrato IS NULL OR T0.CODCNT = :contrato) AND
            (:control IS NULL OR T0.CODCTL = :control);
            ;
          `;
          const queryDetalleEspaciosTacna = `
              SELECT
               '' AS tipoEspacio,     
                 '' AS sector,     
                 T0.CODSEC AS codigoSector,     
                 T0.FCHESC AS fechaEspacio,     
                 T0.NUMNIV AS numroNivel
               FROM dbo.PDRCO9 T0    
                   WHERE 
            (:contrato IS NULL OR T0.CODCNT = :contrato);
             `;
          ///*****************************DETALLE ASISTENCIA */
          const queryDetalleTacna = `
             SELECT
                  '' AS concepto,
                  '' AS proced,
                  '' AS agenciaFuneraria,
                  CASE WHEN CODAGE <> '' THEN (SELECT TT.NOMFUN FROM PDRVE5 TT WHERE T0.CODVEN = TT.CODFU1)
                  ELSE  (SELECT TQ.NOMVEN FROM PDRVE0 TQ WHERE T0.CODVEN = TQ.CODVEN)
                  END AS consejero,
                  '' AS supervisor,
                  T0.FCHPAG AS fechaPago,
                  '' AS formaPago,
                  '' AS tipoAfect,
                  CAST(T0.MONPAG AS FLOAT) AS estipFunerario,
                  CAST(T0.MONINI AS FLOAT) AS aporteInicial,
                  CAST(T0.MONPAG AS FLOAT) - CAST(T0.MONINI AS FLOAT) AS estipMensual,
                  '' AS estado
                  FROM dbo.PDRCO1 T0
                 WHERE 
            (:contrato IS NULL OR T0.CODCNT = :contrato);
             `;

          const querySubDetalletacna = `
           SELECT
                '' AS aceptante,
                T0.CODLET AS codigoLetra,
                T0.CODBAN AS banco,
                T0.FCHVEN AS fechaVencimiento,
                T0.MONLET AS importePagado,
                T0.FCHCAN AS fechaCancelacion,
                '' AS estadoLetra,
                T0.MONPAG AS montoPagado,
                CAST(T0.MONLET AS FLOAT) - CAST(T0.MONPAG AS FLOAT) AS saldo,
                '' AS ubicacion,
                SUM(CAST(T0.MONLET AS FLOAT)) AS estipendoMensual,
                SUM(CAST(T0.MONPAG AS FLOAT)) AS totalAbonoEfectivo,
                0 AS totalAbonado,
                0 AS totalDescuento
            FROM dbo.PDRLC1 T0
                WHERE 
            (:contrato IS NULL OR T0.CODCNT = :contrato) 
            GROUP BY
                T0.CODLET,
                T0.CODBAN,
                T0.FCHVEN,
                T0.MONLET,
                T0.FCHCAN,
                T0.MONPAG
            ORDER BY T0.CODLET ASC;
           `;

          const queryComprobantesTacna = `
         SELECT
            '' AS documento,
            T0.CODCMP + '-' + T0.NROCMP AS numero,
            CONVERT(VARCHAR(10), T0.FCHCMP, 103) AS fecha,
            'US$.' AS moneda,
            CAST(T0.MONCMP AS FLOAT) AS monto,
            CAST(T0.CAMCMP AS FLOAT) AS tipoCambio,
            ROUND(CAST(T0.MONCMP AS FLOAT) * CAST(T0.CAMCMP AS FLOAT), 2) AS enSoles,
            '' AS concepto,
            '' AS estado
            FROM PDRLC5 T0
                WHERE 
            (:contrato IS NULL OR T0.CODCNT = :contrato) ;
         `;

          const queryPagosCajaTacna = `
                SELECT
                    T0.FCHREG AS fechaRegistro,
                    '' AS condicionVenta,
                    '' AS tipoPago,
                    T0.IMPTOT AS importeTotal
                FROM dbo.PDRNC2 T0
                    WHERE 
            (:contrato IS NULL OR T0.CODCNT = :contrato) ;
         `;
          const queryBeneficiarioContratoTacna = `
              SELECT
                  T0.APPBEN + ' ' + T0.APMBEN + ' ' + T0.NOMBEN AS beneficiario,
                  T0.FCHNAC AS fechaNacimientoBeneficiario,
                  T0.DOCIDE AS dniBeneficiario,
                  T0.TELBEN AS telefBeneficiario,
                  '' AS estadoCivilBeneficiario,
                  '' AS sexoBeneficiario
              FROM dbo.PDRCO5 T0
                  WHERE 
            (:contrato IS NULL OR T0.CODCNT = :contrato) ;
           `;

          const queryFallecidoTacna = `
                      SELECT                 T0.APPFAL + ' ' + T0.APMFAL + ' ' + T0.NOMFAL AS nomFallecido,               
                      T0.FCHENT AS fechaEntierro,                
                      '' AS estadoCivilFallecido,                 
                      '' AS sexoFallecido,                
                      '' AS plataformaFallecido,                 
                      T0.CODSEC AS sectorFallecido,                 
                      '' AS tipoEspacioFallecido,                
                      '' AS nivelFallecido,                 
                      '' AS medidaFallecido,                
                      T0.AGEENT AS agenciaFallecido            
                      FROM dbo.PDRPL1 T0                     
                          WHERE 
                      (:contrato IS NULL OR T0.CODCNT = :contrato)       
                      ORDER BY T0.FCHENT ASC;
             `;

          // ============================ EJECUCIÓN ============================
          const [cabeceraTacna] = await sequelizeInstance.query(cabeceraQueryTacna, { type: QueryTypes.SELECT, replacements: { contrato, control } });
          const detalleEspacioTacna = await sequelizeInstance.query(queryDetalleEspaciosTacna, { type: QueryTypes.SELECT, replacements: { contrato, control } });
          const [detalleTacna, subDetalleTacna, comprobantesTacna, pagosCajaTacna] = await Promise.all([
            sequelizeInstance.query(queryDetalleTacna, { type: QueryTypes.SELECT, replacements: { contrato } }),
            sequelizeInstance.query(querySubDetalletacna, { type: QueryTypes.SELECT, replacements: { contrato } }),
            sequelizeInstance.query(queryComprobantesTacna, { type: QueryTypes.SELECT, replacements: { contrato } }),
            sequelizeInstance.query(queryPagosCajaTacna, { type: QueryTypes.SELECT, replacements: { contrato } }),
          ]);
          const detalleAsistenciaTacna: DetalleAsistencia = {
            ...detalleTacna[0],        // Datos principales del detalle
            subDetalle: subDetalleTacna as SubDetalleAsistencia[],   // Array de subdetalle
            comprobantes: comprobantesTacna as ComprobantesEmitidos[], // Array de comprobantes
            pagosCaja: pagosCajaTacna as PagosCaja[],                // Array de pagosCaja
          };
          const beneficiariosTacna = await sequelizeInstance.query(queryBeneficiarioContratoTacna, { type: QueryTypes.SELECT, replacements: { contrato }, });

          // Ejecutar query de fallecidos
          const fallecidosTacna = await sequelizeInstance.query(queryFallecidoTacna, { type: QueryTypes.SELECT, replacements: { contrato }, });
          
          console.log(`🔍 [ReporteClipperRepository] Resultados obtenidos para Tacna:`);
          console.log(`   - Cabecera:`, cabeceraTacna);
          console.log(`   - Detalle Espacio:`, detalleEspacioTacna?.length || 0, 'registros');
          console.log(`   - Detalle:`, detalleTacna?.length || 0, 'registros');
          console.log(`   - SubDetalle:`, subDetalleTacna?.length || 0, 'registros');
          console.log(`   - Comprobantes:`, comprobantesTacna?.length || 0, 'registros');
          console.log(`   - Pagos Caja:`, pagosCajaTacna?.length || 0, 'registros');
          console.log(`   - Beneficiarios:`, beneficiariosTacna?.length || 0, 'registros');
          console.log(`   - Fallecidos:`, fallecidosTacna?.length || 0, 'registros');
          
          // Verificar si tenemos datos válidos
          if (!cabeceraTacna) {
            console.log(`❌ [ReporteClipperRepository] No se encontró cabecera para contrato ${contrato}/${control}`);
            return null;
          }
          
          console.log(`✅ [ReporteClipperRepository] Contrato encontrado exitosamente`);
          return {
            cabecera: cabeceraTacna as CabeceraContrato,
            detalleEspacio: detalleEspacioTacna as DetalleEspacio[],
            detalleAsistencia: detalleAsistenciaTacna,
            beneficiarios: beneficiariosTacna as BeneficiarioContrato[],
            fallecidos: fallecidosTacna as Fallecido[],
          };
          break;

      }

      const results = await sequelizeInstance.query(query, {
        type: QueryTypes.SELECT,
        replacements: { contrato, control },
      });

      return results.length ? (results[0] as ClipperContratoResultado) : null;
    } catch (error) {
      console.error('Error al obtener contrato por control:', error);
      throw new Error(`Error al obtener contrato por control: ${error}`);
    }
  }
}
