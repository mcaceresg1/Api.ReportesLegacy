import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Reportes Legacy - TypeScript",
      version: "1.0.0",
      description: "API con arquitectura hexagonal en TypeScript",
      contact: {
        name: "Equipo de Desarrollo",
        email: "desarrollo@empresa.com",
      },
    },
    servers: [
      {
        url:
          process.env["SWAGGER_SERVER_URL"] ||
          (process.env["NODE_ENV"] === "production"
            ? "http://192.168.90.73:3000"
            : "http://192.168.90.73:3000"),
        description:
          process.env["SWAGGER_SERVER_DESCRIPTION"] ||
          (process.env["NODE_ENV"] === "production"
            ? "Servidor de producción"
            : "Servidor de desarrollo"),
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ReporteResumenAsientos: {
          type: "object",
          properties: {
            cuentaContableDesc: {
              type: "string",
              description: "Descripción de la cuenta contable",
            },
            sDescTipoAsiento: {
              type: "string",
              description: "Descripción del tipo de asiento",
            },
            cuentaContable: {
              type: "string",
              description: "Código de la cuenta contable",
            },
            sNombreQuiebre: {
              type: "string",
              description: "Nombre del quiebre",
            },
            creditoLocal: {
              type: "number",
              format: "double",
              description: "Monto de crédito en moneda local",
            },
            creditoDolar: {
              type: "number",
              format: "double",
              description: "Monto de crédito en dólares",
            },
            centroCosto: {
              type: "string",
              description: "Código del centro de costo",
            },
            debitoLocal: {
              type: "number",
              format: "double",
              description: "Monto de débito en moneda local",
            },
            debitoDolar: {
              type: "number",
              format: "double",
              description: "Monto de débito en dólares",
            },
            tipoAsiento: {
              type: "string",
              description: "Tipo de asiento",
            },
            tipoReporte: {
              type: "string",
              description: "Tipo de reporte",
            },
            nomUsuario: {
              type: "string",
              description: "Nombre del usuario",
            },
            finicio: {
              type: "string",
              format: "date-time",
              description: "Fecha de inicio del período",
            },
            quiebre: {
              type: "string",
              description: "Código del quiebre",
            },
            ffinal: {
              type: "string",
              format: "date-time",
              description: "Fecha final del período",
            },
            rowOrderBy: {
              type: "integer",
              description: "Orden de la fila",
            },
          },
          required: [
            "cuentaContableDesc",
            "sDescTipoAsiento",
            "cuentaContable",
            "sNombreQuiebre",
            "creditoLocal",
            "creditoDolar",
            "centroCosto",
            "debitoLocal",
            "debitoDolar",
            "tipoAsiento",
            "tipoReporte",
            "nomUsuario",
            "finicio",
            "quiebre",
            "ffinal",
            "rowOrderBy",
          ],
        },
        TipoAsiento: {
          type: "object",
          properties: {
            tipoAsiento: {
              type: "string",
              description: "Código del tipo de asiento",
            },
            descripcion: {
              type: "string",
              description: "Descripción del tipo de asiento",
            },
            noteExistsFlag: {
              type: "integer",
              description: "Flag de existencia de nota",
            },
            recordDate: {
              type: "string",
              format: "date-time",
              description: "Fecha de registro",
            },
            rowPointer: {
              type: "string",
              description: "Puntero de fila",
            },
            createdBy: {
              type: "string",
              description: "Usuario que creó el registro",
            },
            updatedBy: {
              type: "string",
              description: "Usuario que actualizó el registro",
            },
            createDate: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación",
            },
          },
          required: [
            "tipoAsiento",
            "descripcion",
            "noteExistsFlag",
            "recordDate",
            "rowPointer",
            "createdBy",
            "updatedBy",
            "createDate",
          ],
        },
        ClipperLibroDiario: {
          type: "object",
          properties: {
            clase: {
              type: "string",
              description: "Clase del comprobante (ej. COMPRAS)",
              example: "COMPRAS",
            },
            numeroComprobante: {
              type: "string",
              description: "Número del comprobante",
              example: "D06/00066",
            },
            cuenta: {
              type: "string",
              description: "Código de la cuenta contable",
              example: "40111101",
            },
            nombre: {
              type: "string",
              description: "Nombre del concepto",
              example: "I.G.V.",
            },
            documento: {
              type: "string",
              description: "Número de documento",
              example: "TK/40614",
            },
            glosa: {
              type: "string",
              description: "Descripción o glosa del movimiento",
              example: "GASTOS VARIOS",
            },
            montod: {
              type: "number",
              format: "double",
              description: "Monto débito",
              example: 0,
            },
            montoh: {
              type: "number",
              format: "double",
              description: "Monto haber",
              example: 79.48,
            },
          },
          required: [
            "clase",
            "numeroComprobante",
            "cuenta",
            "nombre",
            "documento",
            "glosa",
            "montod",
            "montoh",
          ],
        },
        ClipperBalanceComprobacion: {
          type: "object",
          properties: {
            cuenta: {
              type: "string",
              description: "Código de la cuenta contable",
              example: "101010001",
            },
            nombre: {
              type: "string",
              description: "Nombre de la cuenta contable",
              example: "EFECTIVO SOLES LIMA",
            },
            saldoAcumuladoDebe: {
              type: "number",
              format: "double",
              description: "Saldo acumulado en debe (enero a noviembre)",
              example: 1077484.66,
            },
            saldoAcumuladoHaber: {
              type: "number",
              format: "double",
              description: "Saldo acumulado en haber (enero a noviembre)",
              example: 757125.3,
            },
            movimientoMesDebe: {
              type: "number",
              format: "double",
              description: "Movimiento del mes en debe (diciembre)",
              example: 4294156.76,
            },
            movimientoMesHaber: {
              type: "number",
              format: "double",
              description: "Movimiento del mes en haber (diciembre)",
              example: 4614516.12,
            },
            saldoActualDebe: {
              type: "number",
              format: "double",
              description: "Saldo actual en debe (enero a diciembre)",
              example: 5371641.42,
            },
            saldoActualHaber: {
              type: "number",
              format: "double",
              description: "Saldo actual en haber (enero a diciembre)",
              example: 5371641.42,
            },
          },
          required: [
            "cuenta",
            "nombre",
            "saldoAcumuladoDebe",
            "saldoAcumuladoHaber",
            "movimientoMesDebe",
            "movimientoMesHaber",
            "saldoActualDebe",
            "saldoActualHaber",
          ],
        },
        ClipperBalanceGeneral: {
          type: "object",
          properties: {
            cuenta: {
              type: "string",
              description: "Código de la cuenta contable",
              example: "101010001",
            },
            nombre: {
              type: "string",
              description: "Nombre de la cuenta contable",
              example: "EFECTIVO SOLES LIMA",
            },
            saldoAcumuladoDebe: {
              type: "number",
              format: "double",
              description:
                "Saldo acumulado en debe (enero a noviembre o hasta mes anterior)",
              example: 1077484.66,
            },
            saldoAcumuladoHaber: {
              type: "number",
              format: "double",
              description:
                "Saldo acumulado en haber (enero a noviembre o hasta mes anterior)",
              example: 757125.3,
            },
            movimientoMesDebe: {
              type: "number",
              format: "double",
              description:
                "Movimiento del mes en debe (diciembre o mes especificado)",
              example: 4294156.76,
            },
            movimientoMesHaber: {
              type: "number",
              format: "double",
              description:
                "Movimiento del mes en haber (diciembre o mes especificado)",
              example: 4614516.12,
            },
            saldoActualDebe: {
              type: "number",
              format: "double",
              description:
                "Saldo actual en debe (enero a diciembre o hasta mes especificado)",
              example: 5371641.42,
            },
            saldoActualHaber: {
              type: "number",
              format: "double",
              description:
                "Saldo actual en haber (enero a diciembre o hasta mes especificado)",
              example: 5371641.42,
            },
          },
          required: [
            "cuenta",
            "nombre",
            "saldoAcumuladoDebe",
            "saldoAcumuladoHaber",
            "movimientoMesDebe",
            "movimientoMesHaber",
            "saldoActualDebe",
            "saldoActualHaber",
          ],
        },
        ClipperEstadoGananciasYResultados: {
          type: "object",
          properties: {
            concepto: {
              type: "string",
              description:
                "Concepto del estado de ganancias y pérdidas (ej. VENTAS, GASTOS ADMINISTRATIVOS)",
              example: "VENTAS",
            },
            monto: {
              type: "string",
              description:
                "Monto formateado como string para mantener formato N2",
              example: "6,110,267.20",
            },
            orden: {
              type: "integer",
              description: "Orden de presentación en el reporte",
              example: 1,
            },
          },
          required: ["concepto", "monto", "orden"],
        },
        ClipperLibroCaja: {
          type: "object",
          properties: {
            clase: {
              type: "string",
              description: "Clase del comprobante (ej. COMPRAS)",
              example: "COMPRAS",
            },
            numeroComprobante: {
              type: "string",
              description: "Número del comprobante",
              example: "C06/00066",
            },
            cuenta: {
              type: "string",
              description: "Código de la cuenta contable",
              example: "40111101",
            },
            nombre: {
              type: "string",
              description: "Nombre del concepto",
              example: "I.G.V.",
            },
            documento: {
              type: "string",
              description: "Número de documento",
              example: "TK/40614",
            },
            glosa: {
              type: "string",
              description: "Descripción o glosa del movimiento",
              example: "GASTOS VARIOS",
            },
            montod: {
              type: "number",
              format: "double",
              description: "Monto débito",
              example: 0,
            },
            montoh: {
              type: "number",
              format: "double",
              description: "Monto haber",
              example: 79.48,
            },
          },
          required: [
            "clase",
            "numeroComprobante",
            "cuenta",
            "nombre",
            "documento",
            "glosa",
            "montod",
            "montoh",
          ],
        },
        FiltrosGananciasPerdidasClipper: {
          type: "object",
          properties: {
            periodoDesde: {
              type: "integer",
              minimum: 1,
              maximum: 12,
              description: "Mes de inicio del período (1-12)",
              example: 1,
            },
            periodoHasta: {
              type: "integer",
              minimum: 1,
              maximum: 12,
              description: "Mes de fin del período (1-12)",
              example: 12,
            },
          },
          required: ["periodoDesde", "periodoHasta"],
        },
        RegistroComprasOficonRequest: {
          type: "object",
          required: [
            "ISCO_EMPR",
            "INNU_ANNO",
            "INNU_MESE_INIC",
            "INNU_MESE_FINA",
          ],
          properties: {
            ISCO_EMPR: {
              type: "string",
              description: "Código de empresa (REQUERIDO)",
              example: "01",
            },
            INNU_ANNO: {
              type: "integer",
              description: "Año (REQUERIDO)",
              example: 1998,
            },
            INNU_MESE_INIC: {
              type: "integer",
              description: "Mes inicial (REQUERIDO)",
              example: 9,
            },
            INNU_MESE_FINA: {
              type: "integer",
              description: "Mes final (REQUERIDO)",
              example: 10,
            },
            ISTI_REPO: {
              type: "string",
              description:
                "Tipo de impresión (OPCIONAL) - Parámetro de dos tipos: ANA - Analítico, RES - Resumen",
              enum: ["ANA", "RES"],
              example: "ANA",
            },
            ISTI_ORDE_REPO: {
              type: "string",
              description:
                "Ordenado por (OPCIONAL) - Parámetro de dos tipos: VOU - Voucher, FEC - Fecha",
              enum: ["VOU", "FEC"],
              example: "FEC",
            },
            ISTI_INFO: {
              type: "string",
              description:
                "Tipo de reporte (OPCIONAL) - Parámetro de dos tipos: ORI - Origen/Contable, OFI - Oficial",
              enum: ["ORI", "OFI"],
              example: "ORI",
            },
          },
        },
        RegistroComprasOficonResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/RegistroComprasOficon",
              },
            },
            totalRecords: {
              type: "integer",
              example: 150,
            },
            tipoReporte: {
              type: "string",
              enum: ["ANALITICO", "RESUMEN", "OFICIAL"],
              example: "ANALITICO",
            },
            tipoOrden: {
              type: "string",
              enum: ["VOUCHER", "FECHA"],
              example: "FECHA",
            },
            tipoInfo: {
              type: "string",
              enum: ["ORIGEN", "OFICIAL"],
              example: "ORIGEN",
            },
            message: {
              type: "string",
              example:
                "Reporte de registro compras OFICON generado exitosamente. Total de registros: 150",
            },
          },
        },
        RegistroComprasOficon: {
          type: "object",
          properties: {
            ISCO_EMPR: {
              type: "string",
              description: "Código de empresa",
            },
            FE_DOCU: {
              type: "string",
              description: "Fecha del documento",
            },
            TI_DOCU_SUNA: {
              type: "string",
              description: "Tipo de documento SUNAT",
            },
            TI_DOCU_CNTB: {
              type: "string",
              description: "Tipo de documento contable",
            },
            NO_DOCU: {
              type: "string",
              description: "Número de documento",
            },
            NU_DOCU: {
              type: "string",
              description: "Número de documento",
            },
            CO_UNID_CNTB: {
              type: "string",
              description: "Código unidad contable",
            },
            CO_OPRC: {
              type: "string",
              description: "Código operación",
            },
            NU_ASTO: {
              type: "string",
              description: "Número de asiento",
            },
            CO_PROV: {
              type: "string",
              description: "Código de proveedor",
            },
            NO_CORT_PROV: {
              type: "string",
              description: "Nombre corto del proveedor",
            },
            NU_RUCS_PROV: {
              type: "string",
              description: "RUC del proveedor",
            },
            CO_MONE: {
              type: "string",
              description: "Código de moneda",
            },
            IM_INAF_ORIG: {
              type: "number",
              format: "double",
              description: "Importe inafecto origen",
            },
            IM_AFEC_ORIG: {
              type: "number",
              format: "double",
              description: "Importe afecto origen",
            },
            IM_IIGV_ORIG: {
              type: "number",
              format: "double",
              description: "IGV origen",
            },
            IM_TOTA_ORIG: {
              type: "number",
              format: "double",
              description: "Total origen",
            },
            IM_INAF_CNTB: {
              type: "number",
              format: "double",
              description: "Importe inafecto contable",
            },
            IM_AFEC_CNTB: {
              type: "number",
              format: "double",
              description: "Importe afecto contable",
            },
            IM_IIGV_CNTB: {
              type: "number",
              format: "double",
              description: "IGV contable",
            },
            IM_TOTA_CNTB: {
              type: "number",
              format: "double",
              description: "Total contable",
            },
            FA_CAMB: {
              type: "number",
              format: "double",
              description: "Factor de cambio",
            },
            ST_RETE_AUXI: {
              type: "string",
              description: "Estado retención auxiliar",
            },
            ST_RETE_DOCU: {
              type: "string",
              description: "Estado retención documento",
            },
            VNIM_MAXI_NRET: {
              type: "number",
              format: "double",
              description: "Valor máximo no retenido",
            },
            ST_RETE_BCON: {
              type: "string",
              description: "Estado retención banco",
            },
            ST_STAT: {
              type: "string",
              description: "Estado estadístico",
            },
            ST_NDEB: {
              type: "string",
              description: "Estado no débito",
            },
            PO_IMPT: {
              type: "number",
              format: "double",
              description: "Porcentaje importe",
            },
          },
        },
        BalanceComprobacionOficonRequest: {
          type: "object",
          required: ["ISCO_EMPR", "INNU_ANNO", "INNU_MESE"],
          properties: {
            ISCO_EMPR: {
              type: "string",
              description: "Código de empresa (REQUERIDO)",
              example: "01",
            },
            INNU_ANNO: {
              type: "integer",
              description: "Año (REQUERIDO)",
              example: 1998,
            },
            INNU_MESE: {
              type: "integer",
              description: "Mes (REQUERIDO)",
              example: 10,
            },
            ISTI_BALA: {
              type: "string",
              description: "Tipo balance (OPCIONAL) - M: mensual, A: acumulado",
              enum: ["M", "A"],
              example: "M",
            },
            ISST_QUIE: {
              type: "string",
              description:
                "Selección quiebre (OPCIONAL) - N: sin quiebre, S: con quiebre",
              enum: ["N", "S"],
              example: "N",
            },
            INNV_PRES: {
              type: "integer",
              description: "Presentación (OPCIONAL)",
              example: 1,
            },
            INNU_DGTO: {
              type: "integer",
              description: "Balance dígito (OPCIONAL)",
              example: 2,
            },
            ISTI_PRES: {
              type: "string",
              description:
                "Tipo presentación (OPCIONAL) - REP: reporte, TAB: tabla",
              enum: ["REP", "TAB"],
              example: "REP",
            },
            ISTI_MONT: {
              type: "string",
              description:
                "Filtro de filas (OPCIONAL) - M: con Monto, T: Todas las Filas",
              enum: ["M", "T"],
              example: "M",
            },
          },
        },
        BalanceComprobacionOficonResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/BalanceComprobacionOficon",
              },
            },
            totalRecords: {
              type: "integer",
              example: 150,
            },
            tipoBalance: {
              type: "string",
              enum: ["MENSUAL", "ACUMULADO"],
              example: "MENSUAL",
            },
            tipoQuiebre: {
              type: "string",
              enum: ["SIN_QUIEBRE", "CON_QUIEBRE"],
              example: "SIN_QUIEBRE",
            },
            tipoPresentacion: {
              type: "string",
              enum: ["REPORTE", "TABLA"],
              example: "REPORTE",
            },
            tipoMonto: {
              type: "string",
              enum: ["CON_MONTO", "TODAS_FILAS"],
              example: "CON_MONTO",
            },
            message: {
              type: "string",
              example:
                "Reporte de balance comprobación OFICON generado exitosamente. Total de registros: 150",
            },
          },
        },
        BalanceComprobacionOficon: {
          type: "object",
          properties: {
            CO_CNTA_EMPR: {
              type: "string",
              description: "Código cuenta empresa",
            },
            DE_CNTA_EMPR: {
              type: "string",
              description: "Descripción cuenta empresa",
            },
            IM_SALD_ANTE: {
              type: "number",
              format: "double",
              description: "Saldo anterior",
            },
            IM_CARG_MESE: {
              type: "number",
              format: "double",
              description: "Cargo mes",
            },
            IM_ABON_MESE: {
              type: "number",
              format: "double",
              description: "Abono mes",
            },
            IM_SALD_CARG: {
              type: "number",
              format: "double",
              description: "Saldo cargo",
            },
            IM_SALD_ABON: {
              type: "number",
              format: "double",
              description: "Saldo abono",
            },
            IM_ACTI_INVE: {
              type: "number",
              format: "double",
              description: "Activo inventario",
            },
            IM_PASI_INVE: {
              type: "number",
              format: "double",
              description: "Pasivo inventario",
            },
            IM_PERD_NATU: {
              type: "number",
              format: "double",
              description: "Pérdida natural",
            },
            IM_GANA_NATU: {
              type: "number",
              format: "double",
              description: "Ganancia natural",
            },
            IM_PERD_FUNC: {
              type: "number",
              format: "double",
              description: "Pérdida funcional",
            },
            IM_GANA_FUNC: {
              type: "number",
              format: "double",
              description: "Ganancia funcional",
            },
            COL_EXTRA_1: {
              type: "number",
              format: "double",
              description: "Columna extra 1 (solo cuando ISTI_PRES = 'REP')",
            },
            COL_EXTRA_2: {
              type: "number",
              format: "double",
              description: "Columna extra 2 (solo cuando ISTI_PRES = 'REP')",
            },
            COL_EXTRA_3: {
              type: "number",
              format: "double",
              description: "Columna extra 3 (solo cuando ISTI_PRES = 'REP')",
            },
            COL_EXTRA_4: {
              type: "number",
              format: "double",
              description: "Columna extra 4 (solo cuando ISTI_PRES = 'REP')",
            },
            COL_EXTRA_5: {
              type: "number",
              format: "double",
              description: "Columna extra 5 (solo cuando ISTI_PRES = 'REP')",
            },
            COL_EXTRA_6: {
              type: "number",
              format: "double",
              description: "Columna extra 6 (solo cuando ISTI_PRES = 'REP')",
            },
            COL_EXTRA_7: {
              type: "number",
              format: "double",
              description: "Columna extra 7 (solo cuando ISTI_PRES = 'REP')",
            },
            COL_EXTRA_8: {
              type: "number",
              format: "double",
              description: "Columna extra 8 (solo cuando ISTI_PRES = 'REP')",
            },
            COL_EXTRA_9: {
              type: "number",
              format: "double",
              description: "Columna extra 9 (solo cuando ISTI_PRES = 'REP')",
            },
            COL_EXTRA_10: {
              type: "number",
              format: "double",
              description: "Columna extra 10 (solo cuando ISTI_PRES = 'REP')",
            },
            COL_EXTRA_11: {
              type: "number",
              format: "double",
              description: "Columna extra 11 (solo cuando ISTI_PRES = 'REP')",
            },
            COL_EXTRA_12: {
              type: "number",
              format: "double",
              description: "Columna extra 12 (solo cuando ISTI_PRES = 'REP')",
            },
            COL_EXTRA_13: {
              type: "number",
              format: "double",
              description: "Columna extra 13 (solo cuando ISTI_PRES = 'REP')",
            },
          },
        },
        // Schemas de Libro Mayor eliminados
        // ReporteLibroMayorItem, FiltrosReporteLibroMayor, ResumenLibroMayor, ReporteLibroMayorResponse
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis:
    process.env["NODE_ENV"] === "production"
      ? [
          "./dist/app.js",
          "./dist/infrastructure/controllers/*.js",
          "./dist/infrastructure/routes/*.js",
        ]
      : [
          "./src/app.ts",
          "./src/infrastructure/controllers/*.ts",
          "./src/infrastructure/routes/*.ts",
        ],
};

export const specs = swaggerJsdoc(swaggerOptions);
