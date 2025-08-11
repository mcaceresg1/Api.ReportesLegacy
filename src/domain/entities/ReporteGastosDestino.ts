export interface ReporteGastosDestinoItem {
  CUENTADESTINO: string;
  CUENTADESTINODES: string;
  CENTRODESTINO: string;
  CENTRODESTINODES: string;
  FECHA: Date;
  ASIENTO: string;
  CUENTAGASTO: string;
  CUENTAGASTODES: string;
  CENTROGASTO: string;
  CENTROGASTODES: string;
  TIPOASIENTO: string;
  TIPOASIENTODES: string;
  FUENTE: string;
  REFERENCIA: string;
  NIT: string;
  RAZONSOCIAL: string;
  DEBITOLOCAL: number;
  CREDITOLOCAL: number;
  DEBITODOLAR: number;
  CREDITODOLAR: number;
}

export interface ReporteGastosDestinoResult {
  data: ReporteGastosDestinoItem[];
  pagination: {
    limit: number;
    offset: number;
    totalRecords: number;
    hasNextPage: boolean;
  };
}


