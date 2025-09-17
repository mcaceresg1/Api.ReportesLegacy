import { injectable } from "inversify";
import { ILibroDiarioOficonRepository } from "../../domain/repositories/ILibroDiarioOficonRepository";
import {
  LibroDiarioOficon,
  LibroDiarioOficonRequest,
} from "../../domain/entities/LibroDiarioOficon";
import { oficonSequelize } from "../database/config/oficon-database";
import { QueryTypes } from "sequelize";

@injectable()
export class LibroDiarioOficonRepository
  implements ILibroDiarioOficonRepository
{
  async generarReporteLibroDiarioOficon(
    request: LibroDiarioOficonRequest
  ): Promise<LibroDiarioOficon[]> {
    try {
      const query = `
        Select TXMVTO_CNTB.NU_ANNO 'AÑO', 
           TXMVTO_CNTB.NU_MESE 'MES', 
           TXMVTO_CNTB.CO_UNID_CNTB 'CODIGO_UNIDAD_CONTABLE',  
           TMUNID_CNTB.NO_UNID_CNTB 'NOMBRE_UNIDAD_CONTABLE', 
           TXMVTO_CNTB.CO_OPRC_CNTB 'CODIGO_OPERACION_CONTABLE',  
           TXMVTO_CNTB.NU_ASTO 'NUMERO_ASIENTO', 
           TXMVTO_CNTB.NU_SECU 'NUMERO_SECUENCIAL',  
           Convert(Varchar(10),TXMVTO_CNTB.FE_ASTO_CNTB,103)  'FECHA_ASIENTO_CONTABLE',  
           TXMVTO_CNTB.CO_CNTA_EMPR 'CUENTA_EMPRESA', 
           TXMVTO_CNTB.TI_AUXI_EMPR 'TIPO_AUXILIAR',  
           TXMVTO_CNTB.CO_AUXI_EMPR 'CODIGO_AUXILIAR', 
           TXMVTO_CNTB.TI_DOCU 'TIPO_DOCUMENTO', 
            TXMVTO_CNTB.NU_DOCU 'NUMERO_DOCUMENTO', 
            Convert(Varchar(10),TXMVTO_CNTB.FE_DOCU, 103)  'FECHA_DOCUMENTO',  
            TXMVTO_CNTB.CO_ORDE_SERV  'ORDEN_SERVICIO',
            TXMVTO_CNTB.DE_GLOS 'GLOSA',  
            PATINDEX(TXMVTO_CNTB.TI_OPER, 'CAR') * ROUND(TXMVTO_CNTB.IM_MVTO_CNTB,2) 'IMPORTE_DEBE', 
             PATINDEX(TXMVTO_CNTB.TI_OPER, 'ABO') * ROUND(TXMVTO_CNTB.IM_MVTO_CNTB,2) 'IMPORTE_HABER',
               ROUND(TXMVTO_CNTB.IM_MVTO_ORIG,2) 'IMPORTE_MOVIMIENTO_ORIGINAL',  
                TMOPRC_CNTB.DE_OPRC 'DESC_OPERACION_CONTABLE' 
                From   TXMVTO_CNTB, TMUNID_CNTB, TMOPRC_CNTB  
         Where TXMVTO_CNTB.CO_EMPR = :IDEMPRESA       
           AND  TXMVTO_CNTB.NU_CNTB_EMPR = 1  
              And TXMVTO_CNTB.CO_OPRC_CNTB in ( '007') 
              And TXMVTO_CNTB.SI_MVTO_CNTB In ( 'APR', 'ANU')
                  And TXMVTO_CNTB.FE_ASTO_CNTB between :FECHAINICIAL and :FECHAFINAL              
             And      TMUNID_CNTB.CO_EMPR =  TXMVTO_CNTB.CO_EMPR 
             And      TMUNID_CNTB.CO_UNID_CNTB = TXMVTO_CNTB.CO_UNID_CNTB
              And      TMOPRC_CNTB.CO_EMPR = TXMVTO_CNTB.CO_EMPR 
               And      TMOPRC_CNTB.CO_OPRC_CNTB = TXMVTO_CNTB.CO_OPRC_CNTB 
                Order by TXMVTO_CNTB.NU_ANNO, TXMVTO_CNTB.NU_MESE, TXMVTO_CNTB.CO_UNID_CNTB,
                 TXMVTO_CNTB.CO_OPRC_CNTB, TXMVTO_CNTB.NU_ASTO, TXMVTO_CNTB.NU_SECU
      `;

      const results = await oficonSequelize.query(query, {
        replacements: {
          IDEMPRESA: request.IDEMPRESA,
          FECHAINICIAL: request.FECHAINI,
          FECHAFINAL: request.FECHAFINAL,
        },
        type: QueryTypes.SELECT,
      });

      return results as LibroDiarioOficon[];
    } catch (error) {
      console.error(
        "Error en LibroDiarioOficonRepository.generarReporteLibroDiarioOficon:",
        error
      );
      throw new Error(
        `Error al generar reporte de libro diario OFICON: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}
